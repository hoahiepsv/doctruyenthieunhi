/**
 * Universal Vietnamese Speech Engine (100% Offline Capable - Zero Freezing)
 * 
 * - Mode 1: 'bundled' (DEFAULT): Pre-bundled Vietnamese audio files in `/audio/stories/[id].mp3`
 *   Instant offline playback, 0 network wait, authentic warm human voice narration.
 * - Mode 2: 'device': Offline Web Speech API (device speech synthesis) with sentence chunking & watchdog.
 * - Mode 3: 'natural': Online Vietnamese natural voice proxy with fast timeout & safe fallback.
 */

export interface SpeechSettings {
  rate: number; // 0.8 to 1.3
  pitch: number; // 0.8 to 1.4
  mode: 'bundled' | 'device' | 'natural';
  deviceVoiceURI?: string;
}

export interface VoiceInfo {
  id: string;
  name: string;
  lang: string;
  isVietnamese: boolean;
  voiceURI?: string;
}

declare global {
  interface Window {
    _activeUtterance?: SpeechSynthesisUtterance | null;
  }
}

class UniversalVietnameseSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private naturalAudio: HTMLAudioElement | null = null;
  private bundledAudio: HTMLAudioElement | null = null;

  private currentStoryId: string = '';
  private paragraphs: string[] = [];
  private currentParagraphIndex: number = 0;
  private isPaused: boolean = false;
  private isPlaying: boolean = false;

  private settings: SpeechSettings = {
    rate: 1.0,
    pitch: 1.0,
    mode: 'bundled' // Default to pre-bundled high-quality offline audio in source
  };

  private deviceVoices: SpeechSynthesisVoice[] = [];
  private currentQueue: string[] = [];
  private currentQueueIndex: number = 0;
  private keepAliveTimer: any = null;
  private utteranceWatchdog: any = null;

  private onStateChangeCallback?: (state: {
    isPlaying: boolean;
    isPaused: boolean;
    paragraphIndex: number;
    totalParagraphs: number;
    mode: 'bundled' | 'device' | 'natural';
    activeVoiceName: string;
    hasVietnameseDeviceVoice: boolean;
    vietnameseVoicesCount: number;
    currentTime?: number;
    duration?: number;
    errorMessage?: string;
  }) => void;

  private onStoryCompleteCallback?: () => void;
  private onNoVietnameseVoiceCallback?: () => void;

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Initialize Web Speech API safely
      if ('speechSynthesis' in window) {
        try {
          this.synth = window.speechSynthesis;
          this.loadDeviceVoices();
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
              this.loadDeviceVoices();
            };
          }
        } catch (e) {
          console.warn("SpeechSynthesis init warning:", e);
        }
      }

      // 2. Initialize Bundled Audio Player
      this.initBundledAudio();

      // 3. Initialize Natural Proxy Audio Player
      this.initNaturalAudio();

      // Load saved preferences if any
      try {
        const savedMode = localStorage.getItem('preferred_speech_mode') as 'bundled' | 'device' | 'natural' | null;
        if (savedMode && (savedMode === 'bundled' || savedMode === 'device' || savedMode === 'natural')) {
          this.settings.mode = savedMode;
        } else {
          this.settings.mode = 'bundled';
        }
      } catch (_) {}
    }
  }

  private initBundledAudio() {
    if (typeof window === 'undefined') return;
    try {
      if (this.bundledAudio) {
        this.bundledAudio.pause();
        this.bundledAudio.src = '';
      }
      this.bundledAudio = new Audio();
      this.bundledAudio.preload = 'metadata';

      this.bundledAudio.onended = () => {
        if (this.isPlaying && !this.isPaused) {
          this.isPlaying = false;
          this.isPaused = false;
          this.currentParagraphIndex = this.paragraphs.length > 0 ? this.paragraphs.length - 1 : 0;
          this.notifyState();
          if (this.onStoryCompleteCallback) {
            this.onStoryCompleteCallback();
          }
        }
      };

      this.bundledAudio.ontimeupdate = () => {
        if (this.isPlaying && !this.isPaused && this.bundledAudio && this.paragraphs.length > 0) {
          const cur = this.bundledAudio.currentTime;
          const dur = this.bundledAudio.duration;
          if (dur && dur > 0 && !isNaN(dur)) {
            const fraction = Math.min(0.999, Math.max(0, cur / dur));
            const calculatedIdx = Math.floor(fraction * this.paragraphs.length);
            if (calculatedIdx !== this.currentParagraphIndex) {
              this.currentParagraphIndex = calculatedIdx;
              this.notifyState();
            }
          }
        }
      };

      this.bundledAudio.onerror = (e) => {
        console.warn("Bundled audio missing or failed to load, falling back to device speech:", e);
        if (this.isPlaying && this.settings.mode === 'bundled') {
          // Graceful fallback: speak with device voice so custom stories still play
          this.speakViaDeviceSynth(this.paragraphs[this.currentParagraphIndex] || this.paragraphs[0] || '');
        }
      };
    } catch (e) {
      console.warn("Error initializing bundled audio:", e);
    }
  }

  private initNaturalAudio() {
    if (typeof window === 'undefined') return;
    try {
      if (this.naturalAudio) {
        this.naturalAudio.pause();
        this.naturalAudio.src = '';
      }

      this.naturalAudio = new Audio();
      this.naturalAudio.preload = 'none';

      this.naturalAudio.onended = () => {
        this.handleNaturalAudioEnded();
      };

      this.naturalAudio.onerror = (e) => {
        console.warn("Natural audio proxy error (likely offline):", e);
        if (this.isPlaying && this.settings.mode === 'natural') {
          // Immediately fall back to bundled or device speech without hanging
          if (this.currentStoryId) {
            this.settings.mode = 'bundled';
            this.notifyState("Chuyển sang Giọng Thu Sẵn Offline.");
            this.playBundledStoryAudio();
          } else {
            this.settings.mode = 'device';
            this.notifyState("Chuyển sang Giọng Thiết Bị Offline.");
            this.speakViaDeviceSynth(this.paragraphs[this.currentParagraphIndex] || '');
          }
        }
      };
    } catch (e) {
      console.warn("Error initializing natural audio:", e);
    }
  }

  public loadDeviceVoices() {
    if (!this.synth) return;
    try {
      this.deviceVoices = this.synth.getVoices();
      
      // Auto select best Vietnamese voice if none selected
      if (!this.settings.deviceVoiceURI) {
        const vnVoice = this.findBestVietnameseVoice();
        if (vnVoice) {
          this.settings.deviceVoiceURI = vnVoice.voiceURI || vnVoice.name;
        }
      }

      this.notifyState();
    } catch (e) {
      console.warn("Error loading voices:", e);
    }
  }

  public getDeviceVoices(): VoiceInfo[] {
    if (!this.deviceVoices || this.deviceVoices.length === 0) {
      if (this.synth) {
        this.deviceVoices = this.synth.getVoices();
      }
    }

    return this.deviceVoices.map(v => ({
      id: v.voiceURI || v.name,
      name: v.name,
      lang: v.lang,
      isVietnamese: this.isVietnameseVoice(v),
      voiceURI: v.voiceURI
    }));
  }

  public isVietnameseVoice(v: SpeechSynthesisVoice): boolean {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    const n = (v.name || '').toLowerCase();
    return l.startsWith('vi') || 
           n.includes('vietnam') || 
           n.includes('tiếng việt') || 
           n.includes('tieng viet') || 
           n.includes('hoaimy') || 
           n.includes('namminh') ||
           n.includes('an (vietnamese)') ||
           n.includes('linh') ||
           n.includes('mai');
  }

  public getVietnameseDeviceVoices(): SpeechSynthesisVoice[] {
    if (this.deviceVoices.length === 0 && this.synth) {
      this.deviceVoices = this.synth.getVoices();
    }
    return this.deviceVoices.filter(v => this.isVietnameseVoice(v));
  }

  public findBestVietnameseVoice(): SpeechSynthesisVoice | undefined {
    const vnVoices = this.getVietnameseDeviceVoices();
    if (vnVoices.length === 0) return undefined;

    const natural = vnVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('online') ||
      v.name.toLowerCase().includes('google')
    );
    return natural || vnVoices[0];
  }

  public hasVietnameseDeviceVoice(): boolean {
    return this.getVietnameseDeviceVoices().length > 0;
  }

  public setCallbacks(
    onStateChange: (state: {
      isPlaying: boolean;
      isPaused: boolean;
      paragraphIndex: number;
      totalParagraphs: number;
      mode: 'bundled' | 'device' | 'natural';
      activeVoiceName: string;
      hasVietnameseDeviceVoice: boolean;
      vietnameseVoicesCount: number;
      currentTime?: number;
      duration?: number;
      errorMessage?: string;
    }) => void,
    onStoryComplete?: () => void,
    onNoVietnameseVoice?: () => void
  ) {
    this.onStateChangeCallback = onStateChange;
    this.onStoryCompleteCallback = onStoryComplete;
    this.onNoVietnameseVoiceCallback = onNoVietnameseVoice;
  }

  public updateSettings(settings: Partial<SpeechSettings>) {
    this.settings = { ...this.settings, ...settings };
    if (this.bundledAudio) {
      this.bundledAudio.playbackRate = this.settings.rate;
    }
    if (this.naturalAudio) {
      this.naturalAudio.playbackRate = this.settings.rate;
    }
    this.notifyState();
  }

  public getSettings(): SpeechSettings {
    return this.settings;
  }

  private notifyState(errorMessage?: string) {
    if (this.onStateChangeCallback) {
      const vnVoices = this.getVietnameseDeviceVoices();
      let activeVoice = '';

      if (this.settings.mode === 'bundled') {
        activeVoice = 'Giọng Thu Sẵn Chuẩn Tiếng Việt Trong Nguồn (100% Offline)';
      } else if (this.settings.mode === 'device') {
        if (this.settings.deviceVoiceURI) {
          const selected = this.deviceVoices.find(v => (v.voiceURI || v.name) === this.settings.deviceVoiceURI);
          if (selected) activeVoice = selected.name;
        }
        if (!activeVoice) {
          const best = this.findBestVietnameseVoice();
          activeVoice = best ? best.name : (this.deviceVoices.length > 0 ? this.deviceVoices[0].name : 'Giọng Thiết Bị');
        }
      } else {
        activeVoice = 'Giọng Trực Tuyến (Online)';
      }

      this.onStateChangeCallback({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        paragraphIndex: this.currentParagraphIndex,
        totalParagraphs: this.paragraphs.length,
        mode: this.settings.mode,
        activeVoiceName: activeVoice,
        hasVietnameseDeviceVoice: vnVoices.length > 0,
        vietnameseVoicesCount: vnVoices.length,
        currentTime: this.bundledAudio?.currentTime || 0,
        duration: this.bundledAudio?.duration || 0,
        errorMessage
      });
    }
  }

  /**
   * Start reading a story.
   * Supports calling with either:
   * - (storyObject, startIndex)
   * - (textContent, startIndex, storyId)
   */
  public startReadingStory(target: any, startIndex: number = 0, optionalStoryId?: string) {
    this.stop();

    let text = '';
    let storyId = '';

    if (typeof target === 'object' && target !== null) {
      text = target.content || '';
      storyId = target.id || '';
    } else if (typeof target === 'string') {
      text = target;
      storyId = optionalStoryId || '';
    }

    this.currentStoryId = storyId;

    this.paragraphs = text
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (this.paragraphs.length === 0) return;

    this.currentParagraphIndex = Math.max(0, Math.min(startIndex, this.paragraphs.length - 1));
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();

    if (this.settings.mode === 'bundled') {
      this.playBundledStoryAudio();
    } else if (this.settings.mode === 'device') {
      this.speakCurrentParagraph();
    } else {
      this.speakCurrentParagraph();
    }
  }

  /**
   * Mode 1: Bundled Vietnamese Audio in /audio/stories/[storyId].mp3
   * 100% offline, crystal clear, zero latency, never hangs!
   */
  private playBundledStoryAudio() {
    if (!this.bundledAudio) {
      this.initBundledAudio();
    }
    if (!this.bundledAudio) return;

    if (!this.currentStoryId) {
      // Fallback if no story ID
      this.speakViaDeviceSynth(this.paragraphs[this.currentParagraphIndex] || '');
      return;
    }

    const audioUrl = `/audio/stories/${this.currentStoryId}.mp3`;

    // Only update src if different
    if (!this.bundledAudio.src.includes(audioUrl)) {
      this.bundledAudio.src = audioUrl;
      this.bundledAudio.load();
    }

    this.bundledAudio.playbackRate = this.settings.rate;

    // Fast jump to paragraph timestamp if duration known
    if (this.currentParagraphIndex > 0 && this.bundledAudio.duration && !isNaN(this.bundledAudio.duration)) {
      const targetTime = (this.currentParagraphIndex / this.paragraphs.length) * this.bundledAudio.duration;
      this.bundledAudio.currentTime = Math.max(0, targetTime);
    }

    const playPromise = this.bundledAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Could not play bundled audio file, falling back to device synth:", err);
        // Fallback to device speech synthesis
        this.speakViaDeviceSynth(this.paragraphs[this.currentParagraphIndex] || '');
      });
    }

    this.notifyState();
  }

  private speakCurrentParagraph() {
    if (!this.isPlaying || this.isPaused) return;

    if (this.currentParagraphIndex >= this.paragraphs.length) {
      this.isPlaying = false;
      this.isPaused = false;
      this.notifyState();
      if (this.onStoryCompleteCallback) {
        this.onStoryCompleteCallback();
      }
      return;
    }

    const paragraphText = this.paragraphs[this.currentParagraphIndex];

    if (this.settings.mode === 'device') {
      this.speakViaDeviceSynth(paragraphText);
    } else if (this.settings.mode === 'natural') {
      this.speakViaNaturalAudio(paragraphText);
    } else {
      this.playBundledStoryAudio();
    }
  }

  /**
   * Split text into short, natural sentence chunks (<120 chars) to prevent Chrome 15s TTS freezing.
   */
  private splitIntoSafeChunks(text: string): string[] {
    const rawTokens = text.split(/([.,!?;:\n]+)/);
    const chunks: string[] = [];
    let current = '';

    for (let i = 0; i < rawTokens.length; i++) {
      current += rawTokens[i];
      if (i % 2 === 1 || current.length > 100) {
        if (current.trim().length > 0) {
          chunks.push(current.trim());
        }
        current = '';
      }
    }

    if (current.trim().length > 0) {
      chunks.push(current.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Mode 2: Device Speech Synthesis (Web Speech API)
   * With sentence chunking, Chrome keepalive timer & watchdog protection against freezes!
   */
  private speakViaDeviceSynth(text: string) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported on this browser");
      return;
    }

    if (this.deviceVoices.length === 0) {
      this.deviceVoices = this.synth.getVoices();
    }

    const vnVoices = this.getVietnameseDeviceVoices();
    
    // Check if device has a Vietnamese voice
    if (vnVoices.length === 0) {
      console.warn("No Vietnamese voice installed on device.");
      if (this.onNoVietnameseVoiceCallback) {
        this.onNoVietnameseVoiceCallback();
      }
    }

    // Split paragraph into safe sentence chunks
    this.currentQueue = this.splitIntoSafeChunks(text);
    this.currentQueueIndex = 0;
    this.startChromeKeepAlive();
    this.speakNextDeviceChunk();
  }

  private speakNextDeviceChunk() {
    if (!this.isPlaying || this.isPaused || !this.synth) return;

    if (this.currentQueueIndex >= this.currentQueue.length) {
      // Finished paragraph!
      this.currentParagraphIndex++;
      this.notifyState();
      setTimeout(() => {
        this.speakCurrentParagraph();
      }, 300);
      return;
    }

    const chunk = this.currentQueue[this.currentQueueIndex];
    if (!chunk || chunk.trim().length === 0) {
      this.currentQueueIndex++;
      this.speakNextDeviceChunk();
      return;
    }

    try {
      this.synth.cancel();
    } catch (_) {}

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;

    // Pick best Vietnamese voice
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (this.settings.deviceVoiceURI) {
      selectedVoice = this.deviceVoices.find(v => (v.voiceURI || v.name) === this.settings.deviceVoiceURI);
    }
    if (!selectedVoice) {
      selectedVoice = this.findBestVietnameseVoice();
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || 'vi-VN';
    } else {
      utterance.lang = 'vi-VN';
    }

    // Prevent GC in Chrome
    if (typeof window !== 'undefined') {
      window._activeUtterance = utterance;
    }

    // Watchdog: If utterance doesn't advance within 15 seconds, auto skip to avoid freeze
    this.clearUtteranceWatchdog();
    this.utteranceWatchdog = setTimeout(() => {
      console.warn("Speech utterance watchdog triggered - advancing chunk to prevent freeze");
      if (this.isPlaying && !this.isPaused) {
        this.currentQueueIndex++;
        this.speakNextDeviceChunk();
      }
    }, 15000);

    utterance.onend = () => {
      this.clearUtteranceWatchdog();
      window._activeUtterance = null;
      if (this.isPlaying && !this.isPaused) {
        this.currentQueueIndex++;
        setTimeout(() => {
          this.speakNextDeviceChunk();
        }, 120);
      }
    };

    utterance.onerror = (e) => {
      this.clearUtteranceWatchdog();
      console.warn("Device utterance error:", e);
      window._activeUtterance = null;
      if (this.isPlaying && !this.isPaused) {
        this.currentQueueIndex++;
        setTimeout(() => {
          this.speakNextDeviceChunk();
        }, 120);
      }
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn("Error calling speak:", err);
      this.clearUtteranceWatchdog();
    }

    this.notifyState();
  }

  private clearUtteranceWatchdog() {
    if (this.utteranceWatchdog) {
      clearTimeout(this.utteranceWatchdog);
      this.utteranceWatchdog = null;
    }
  }

  /**
   * Chrome keepalive timer to prevent pause after 15s
   */
  private startChromeKeepAlive() {
    this.stopChromeKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.isPlaying && !this.isPaused && this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 9000);
  }

  private stopChromeKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  /**
   * Mode 3: Natural Vietnamese Audio (/api/tts proxy)
   */
  private speakViaNaturalAudio(text: string) {
    // Fast offline check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn("Offline detected, switching from natural online voice to bundled audio");
      this.settings.mode = 'bundled';
      this.notifyState("Đang ngoại tuyến, sử dụng Giọng Thu Sẵn Offline.");
      this.playBundledStoryAudio();
      return;
    }

    this.currentQueue = this.splitIntoSafeChunks(text);
    this.currentQueueIndex = 0;
    this.playNextNaturalSubSentence();
  }

  private playNextNaturalSubSentence() {
    if (!this.isPlaying || this.isPaused) return;

    if (this.currentQueueIndex >= this.currentQueue.length) {
      this.currentParagraphIndex++;
      this.notifyState();
      setTimeout(() => {
        this.speakCurrentParagraph();
      }, 350);
      return;
    }

    const phrase = this.currentQueue[this.currentQueueIndex];
    if (!phrase || phrase.trim().length === 0) {
      this.currentQueueIndex++;
      this.playNextNaturalSubSentence();
      return;
    }

    if (!this.naturalAudio) {
      this.initNaturalAudio();
    }
    if (!this.naturalAudio) return;

    const url = `/api/tts?text=${encodeURIComponent(phrase)}`;
    this.naturalAudio.src = url;
    this.naturalAudio.playbackRate = this.settings.rate;

    const playPromise = this.naturalAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Natural audio play failed, falling back to bundled audio:", err);
        this.settings.mode = 'bundled';
        this.notifyState("Chuyển sang Giọng Thu Sẵn Offline.");
        this.playBundledStoryAudio();
      });
    }
  }

  private handleNaturalAudioEnded() {
    if (this.isPlaying && !this.isPaused) {
      this.currentQueueIndex++;
      setTimeout(() => {
        this.playNextNaturalSubSentence();
      }, 150);
    }
  }

  public pause() {
    if (!this.isPlaying) return;

    if (this.settings.mode === 'bundled') {
      if (this.bundledAudio) {
        this.bundledAudio.pause();
      }
    } else if (this.settings.mode === 'natural') {
      if (this.naturalAudio) {
        this.naturalAudio.pause();
      }
    } else {
      if (this.synth) {
        this.synth.pause();
      }
    }

    this.isPaused = true;
    this.notifyState();
  }

  public resume() {
    if (!this.isPlaying) return;

    if (this.isPaused) {
      if (this.settings.mode === 'bundled') {
        if (this.bundledAudio) {
          this.bundledAudio.play().catch(() => {});
        }
      } else if (this.settings.mode === 'natural') {
        if (this.naturalAudio) {
          this.naturalAudio.play().catch(() => {});
        }
      } else {
        if (this.synth) {
          this.synth.resume();
        }
      }
      this.isPaused = false;
      this.notifyState();
    }
  }

  public stop() {
    this.stopChromeKeepAlive();
    this.clearUtteranceWatchdog();

    if (this.bundledAudio) {
      try {
        this.bundledAudio.pause();
        this.bundledAudio.currentTime = 0;
      } catch (_) {}
    }

    if (this.naturalAudio) {
      try {
        this.naturalAudio.pause();
        this.naturalAudio.currentTime = 0;
      } catch (_) {}
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }

    window._activeUtterance = null;

    this.isPlaying = false;
    this.isPaused = false;
    this.currentParagraphIndex = 0;
    this.currentQueueIndex = 0;
    this.currentQueue = [];
    this.notifyState();
  }

  public skipToParagraph(index: number) {
    this.currentParagraphIndex = Math.max(0, Math.min(index, this.paragraphs.length - 1));

    if (this.settings.mode === 'bundled' && this.bundledAudio && this.bundledAudio.duration) {
      const dur = this.bundledAudio.duration;
      if (!isNaN(dur) && dur > 0) {
        this.bundledAudio.currentTime = (this.currentParagraphIndex / this.paragraphs.length) * dur;
      }
      if (this.isPaused) {
        this.resume();
      } else if (!this.isPlaying) {
        this.playBundledStoryAudio();
      }
      this.notifyState();
      return;
    }

    this.stop();
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();
    this.speakCurrentParagraph();
  }

  public testVoiceSample(mode: 'bundled' | 'device' | 'natural', deviceVoiceURI?: string, customText?: string) {
    const sample = customText || "Xin chào các bé! Chúc các bé nghe đọc truyện cổ tích thật vui và ngủ thật ngoan!";
    this.stop();

    this.settings.mode = mode;
    if (deviceVoiceURI) {
      this.settings.deviceVoiceURI = deviceVoiceURI;
    }

    if (mode === 'bundled') {
      // Play a short sample
      if (this.bundledAudio) {
        this.bundledAudio.src = '/audio/stories/vn-tam-cam.mp3';
        this.bundledAudio.currentTime = 0;
        this.bundledAudio.play().catch(() => {});
        this.isPlaying = true;
        this.notifyState();
      }
      return;
    }

    this.paragraphs = [sample];
    this.currentParagraphIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();

    this.speakCurrentParagraph();
  }
}

export const universalSpeech = new UniversalVietnameseSpeechManager();
export const offlineSpeech = universalSpeech;

/**
 * Bedtime Soundscape Manager (Web Audio API Synthesizer - 100% Offline)
 */
class BedtimeSoundscapeManager {
  private audioCtx: AudioContext | null = null;
  private isPlayingMusic: boolean = false;
  private timerId: any = null;
  private soundType: 'harp' | 'rain' | 'off' = 'off';

  private notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playNote(freq: number, duration: number = 2.0, volume: number = 0.08) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  public toggleMusic(type: 'harp' | 'rain' | 'off'): 'harp' | 'rain' | 'off' {
    if (this.soundType === type || type === 'off') {
      this.stop();
      this.soundType = 'off';
      return 'off';
    }

    this.stop();
    this.soundType = type;
    this.isPlayingMusic = true;

    if (type === 'harp') {
      this.startHarpLoop();
    } else if (type === 'rain') {
      this.startRainLoop();
    }

    return this.soundType;
  }

  private startHarpLoop() {
    let noteIndex = 0;
    const melody = [0, 2, 4, 3, 2, 0, 4, 5, 4, 2, 3, 1];

    const playStep = () => {
      if (!this.isPlayingMusic) return;
      const noteFreq = this.notes[melody[noteIndex % melody.length]];
      this.playNote(noteFreq, 2.5, 0.05);

      if (Math.random() > 0.6) {
        setTimeout(() => {
          if (this.isPlayingMusic) {
            this.playNote(noteFreq * 2, 1.8, 0.02);
          }
        }, 400);
      }

      noteIndex++;
      this.timerId = setTimeout(playStep, 1400 + Math.random() * 600);
    };

    playStep();
  }

  private startRainLoop() {
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.15;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.value = 0.04;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      this.timerId = {
        stop: () => {
          try {
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
            setTimeout(() => {
              try { noise.stop(); } catch (_) {}
            }, 500);
          } catch (_) {}
        }
      };
    } catch (e) {
      console.warn("Rain loop error:", e);
    }
  }

  public stop() {
    this.isPlayingMusic = false;
    if (this.timerId) {
      if (typeof this.timerId === 'number' || typeof this.timerId === 'object' && 'stop' in this.timerId) {
        if (typeof this.timerId.stop === 'function') {
          this.timerId.stop();
        } else {
          clearTimeout(this.timerId);
        }
      }
      this.timerId = null;
    }
    this.soundType = 'off';
  }

  public getCurrentType(): 'harp' | 'rain' | 'off' {
    return this.soundType;
  }
}

export const bedtimeSound = new BedtimeSoundscapeManager();
