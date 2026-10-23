/**
 * Universal Vietnamese Speech Engine
 * - Mode 1 (Default): Natural Vietnamese Voice via same-origin /api/tts proxy (100% Free, NO API Key, perfect Vietnamese pronunciation)
 * - Mode 2: Device System Voice via Web Speech API (offline fallback)
 */

export interface SpeechSettings {
  rate: number;         // 0.8 to 1.3
  pitch: number;        // 0.8 to 1.4
  mode: 'natural' | 'device';
  deviceVoiceURI?: string;
}

export interface VoiceInfo {
  id: string;
  name: string;
  lang: string;
  isVietnamese: boolean;
  voiceURI?: string;
}

// Keep utterance reference on window to prevent Chrome GC bug
declare global {
  interface Window {
    _activeUtterance?: SpeechSynthesisUtterance | null;
  }
}

class UniversalVietnameseSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private naturalAudio: HTMLAudioElement | null = null;

  private paragraphs: string[] = [];
  private currentParagraphIndex: number = 0;
  private isPaused: boolean = false;
  private isPlaying: boolean = false;

  private settings: SpeechSettings = {
    rate: 1.0,
    pitch: 1.0,
    mode: 'natural'
  };

  private deviceVoices: SpeechSynthesisVoice[] = [];
  private naturalAudioQueue: string[] = [];
  private currentSubSentenceIndex: number = 0;

  private onStateChangeCallback?: (state: {
    isPlaying: boolean;
    isPaused: boolean;
    paragraphIndex: number;
    totalParagraphs: number;
    mode: 'natural' | 'device';
    activeVoiceName: string;
    hasVietnameseDeviceVoice: boolean;
  }) => void;

  private onStoryCompleteCallback?: () => void;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadDeviceVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            this.loadDeviceVoices();
          };
        }
      }

      this.initNaturalAudio();
    }
  }

  private initNaturalAudio() {
    if (this.naturalAudio) {
      try {
        this.naturalAudio.pause();
        this.naturalAudio.src = '';
      } catch (_) {}
    }

    this.naturalAudio = new Audio();
    this.naturalAudio.preload = 'auto';

    this.naturalAudio.onended = () => {
      this.handleNaturalAudioEnded();
    };

    this.naturalAudio.onerror = (e) => {
      console.warn("Natural audio proxy error, falling back to device voice:", e);
      if (this.isPlaying && this.settings.mode === 'natural') {
        // Fallback to device speech if network fails
        this.settings.mode = 'device';
        this.notifyState();
        this.speakViaDeviceSynth(this.paragraphs[this.currentParagraphIndex]);
      }
    };
  }

  private loadDeviceVoices() {
    if (!this.synth) return;
    try {
      this.deviceVoices = this.synth.getVoices();
      this.notifyState();
    } catch (e) {
      console.warn("Error loading device voices:", e);
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
      isVietnamese: v.lang.toLowerCase().startsWith('vi') || v.name.toLowerCase().includes('vietnam'),
      voiceURI: v.voiceURI
    }));
  }

  public getVietnameseDeviceVoices(): SpeechSynthesisVoice[] {
    return this.deviceVoices.filter(v => 
      v.lang.toLowerCase().startsWith('vi') || 
      v.name.toLowerCase().includes('vietnam')
    );
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
      mode: 'natural' | 'device';
      activeVoiceName: string;
      hasVietnameseDeviceVoice: boolean;
    }) => void,
    onStoryComplete?: () => void
  ) {
    this.onStateChangeCallback = onStateChange;
    this.onStoryCompleteCallback = onStoryComplete;
  }

  public updateSettings(settings: Partial<SpeechSettings>) {
    this.settings = { ...this.settings, ...settings };
    if (this.naturalAudio) {
      this.naturalAudio.playbackRate = this.settings.rate;
    }
    this.notifyState();
  }

  public getSettings(): SpeechSettings {
    return this.settings;
  }

  private notifyState() {
    if (this.onStateChangeCallback) {
      let activeVoice = this.settings.mode === 'natural' 
        ? 'Giọng Tiếng Việt Tự Nhiên' 
        : 'Giọng Máy Thiết Bị';

      if (this.settings.mode === 'device') {
        const vnVoices = this.getVietnameseDeviceVoices();
        if (vnVoices.length > 0) {
          activeVoice = vnVoices[0].name;
        } else {
          activeVoice = 'Giọng Máy (Chưa có tiếng Việt)';
        }
      }

      this.onStateChangeCallback({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        paragraphIndex: this.currentParagraphIndex,
        totalParagraphs: this.paragraphs.length,
        mode: this.settings.mode,
        activeVoiceName: activeVoice,
        hasVietnameseDeviceVoice: this.hasVietnameseDeviceVoice()
      });
    }
  }

  public startReadingStory(text: string, startIndex: number = 0) {
    this.stop();

    // Split text into meaningful paragraphs
    this.paragraphs = text
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (this.paragraphs.length === 0) return;

    this.currentParagraphIndex = Math.max(0, Math.min(startIndex, this.paragraphs.length - 1));
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();

    this.speakCurrentParagraph();
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

    if (this.settings.mode === 'natural') {
      this.speakViaNaturalAudio(paragraphText);
    } else {
      this.speakViaDeviceSynth(paragraphText);
    }
  }

  /**
   * Mode 1: Natural Vietnamese Audio (Same-origin proxy /api/tts - No API Key, perfect accents)
   */
  private speakViaNaturalAudio(text: string) {
    this.naturalAudioQueue = this.splitIntoPhrases(text);
    this.currentSubSentenceIndex = 0;
    this.playNextNaturalSubSentence();
  }

  private splitIntoPhrases(text: string): string[] {
    // Split text by punctuation (. ! ? ; :) while preserving sentence flow
    const rawSentences = text.split(/(?<=[.?!;:\n])\s+/);
    const phrases: string[] = [];

    for (const raw of rawSentences) {
      const clean = raw.trim();
      if (!clean) continue;

      // Keep chunks around 120-150 chars max for optimal audio playback
      if (clean.length > 140) {
        const commaSplits = clean.split(/(?<=[,])\s+/);
        let acc = '';
        for (const part of commaSplits) {
          if ((acc + ' ' + part).length > 140) {
            if (acc.trim()) phrases.push(acc.trim());
            acc = part;
          } else {
            acc = acc ? acc + ' ' + part : part;
          }
        }
        if (acc.trim()) phrases.push(acc.trim());
      } else {
        phrases.push(clean);
      }
    }

    return phrases.length > 0 ? phrases : [text];
  }

  private playNextNaturalSubSentence() {
    if (!this.isPlaying || this.isPaused) return;

    if (this.currentSubSentenceIndex >= this.naturalAudioQueue.length) {
      // Completed current paragraph, move to next!
      this.currentParagraphIndex++;
      this.notifyState();
      setTimeout(() => {
        this.speakCurrentParagraph();
      }, 350);
      return;
    }

    const phrase = this.naturalAudioQueue[this.currentSubSentenceIndex];
    if (!phrase || phrase.trim().length === 0) {
      this.currentSubSentenceIndex++;
      this.playNextNaturalSubSentence();
      return;
    }

    if (!this.naturalAudio) {
      this.initNaturalAudio();
    }

    if (!this.naturalAudio) return;

    // Call local same-origin proxy endpoint
    const url = `/api/tts?text=${encodeURIComponent(phrase)}`;
    this.naturalAudio.src = url;
    this.naturalAudio.playbackRate = this.settings.rate;

    const playPromise = this.naturalAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio play issue, attempting fallback:", err);
        // If autoplay blocked or fetch failed, fallback to device speech
        this.speakViaDeviceSynth(this.paragraphs[this.currentParagraphIndex]);
      });
    }
  }

  private handleNaturalAudioEnded() {
    if (this.isPlaying && !this.isPaused) {
      this.currentSubSentenceIndex++;
      setTimeout(() => {
        this.playNextNaturalSubSentence();
      }, 150);
    }
  }

  /**
   * Mode 2: Device Speech Synthesis (Web Speech API)
   */
  private speakViaDeviceSynth(text: string) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported on this device");
      return;
    }

    try {
      this.synth.cancel();
    } catch (_) {}

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;

    // Prevent GC in Chrome
    if (typeof window !== 'undefined') {
      window._activeUtterance = utterance;
    }

    if (this.deviceVoices.length === 0) {
      this.deviceVoices = this.synth.getVoices();
    }

    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (this.settings.deviceVoiceURI) {
      selectedVoice = this.deviceVoices.find(v => 
        v.voiceURI === this.settings.deviceVoiceURI || v.name === this.settings.deviceVoiceURI
      );
    }

    if (!selectedVoice) {
      selectedVoice = this.deviceVoices.find(v => 
        v.lang.toLowerCase().startsWith('vi') || 
        v.name.toLowerCase().includes('vietnam')
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'vi-VN';
    }

    utterance.onend = () => {
      window._activeUtterance = null;
      if (this.isPlaying && !this.isPaused) {
        this.currentParagraphIndex++;
        this.notifyState();
        setTimeout(() => {
          this.speakCurrentParagraph();
        }, 300);
      }
    };

    utterance.onerror = (e: any) => {
      console.warn("SpeechSynthesis utterance error:", e);
      window._activeUtterance = null;

      if (this.isPlaying && !this.isPaused) {
        // Advance to next paragraph rather than hanging
        this.currentParagraphIndex++;
        this.notifyState();
        setTimeout(() => {
          this.speakCurrentParagraph();
        }, 300);
      }
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn("synth.speak error:", err);
    }

    this.notifyState();
  }

  public pause() {
    if (!this.isPlaying) return;

    if (this.settings.mode === 'natural') {
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
      if (this.settings.mode === 'natural') {
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
    this.currentSubSentenceIndex = 0;
    this.naturalAudioQueue = [];
    this.notifyState();
  }

  public skipToParagraph(index: number) {
    this.stop();
    this.currentParagraphIndex = Math.max(0, Math.min(index, this.paragraphs.length - 1));
    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();
    this.speakCurrentParagraph();
  }

  public testVoiceSample(mode: 'natural' | 'device', deviceVoiceURI?: string) {
    const sample = "Xin chào các bé! Chúc các bé nghe đọc truyện cổ tích thật vui và ngủ thật ngoan!";
    this.stop();

    this.settings.mode = mode;
    if (deviceVoiceURI) {
      this.settings.deviceVoiceURI = deviceVoiceURI;
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
 * Bedtime Soundscape Manager (Web Audio API Synthesizer)
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
