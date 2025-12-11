
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, Play, Pause, Sparkles, Book, Globe2, Map as MapIcon, FileDown,
  ChevronLeft, ChevronRight, Image as ImageIcon, Mic2, Download, MousePointerClick
} from 'lucide-react';
import { INITIAL_STORIES, VOICES, INSTANT_VOICES_PRESETS } from './constants';
import { Story, VoiceOption, InstantVoice } from './types';
import * as GeminiService from './services/geminiService';
import ApiKeyModal from './components/ApiKeyModal';
import AudioVisualizer from './components/AudioVisualizer';

export default function App() {
  // --- State ---
  const [apiKey, setApiKey] = useState<string>('');
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Category State
  const [selectedCategory, setSelectedCategory] = useState<Story['category'] | 'All'>('Vietnam');
  
  const [selectedStory, setSelectedStory] = useState<Story | null>(INITIAL_STORIES[0]);
  
  // Gallery State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  
  const [isExpandingContent, setIsExpandingContent] = useState(false);

  // Gemini Voice (For High Quality Download)
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  
  // Audio State (AI Generated)
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAI, setIsPlayingAI] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [duration, setDuration] = useState(0);

  // Instant Read State
  const [isReadingInstant, setIsReadingInstant] = useState(false);
  const [storySentences, setStorySentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const [isLoadingSentence, setIsLoadingSentence] = useState(false);
  
  // Instant Voice Selection
  const [availableInstantVoices, setAvailableInstantVoices] = useState<InstantVoice[]>(INSTANT_VOICES_PRESETS);
  // SET DEFAULT TO 'google-normal' (Chị Google Chuẩn)
  const [selectedInstantVoiceId, setSelectedInstantVoiceId] = useState<string>('google-normal');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentenceAudioRef = useRef<HTMLAudioElement | null>(null); 
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Audio Context & Visualizer Logic
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      GeminiService.initializeGemini(storedKey);
    }
    
    // Load saved instant voice preference
    const savedVoicePref = localStorage.getItem('preferred_instant_voice');
    if (savedVoicePref) {
      setSelectedInstantVoiceId(savedVoicePref);
    }

    // Initialize Audio Context for Visualizer
    const initAudioContext = () => {
        if (audioContextRef.current) return;
        
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            const anal = ctx.createAnalyser();
            anal.fftSize = 256;
            anal.connect(ctx.destination);
            
            audioContextRef.current = ctx;
            analyserRef.current = anal;
            setAnalyser(anal);
            
            // Note: MediaElementSource can only be created once per element. 
            // We do this connection lazily or safely.
        } catch (e) {
            console.error("Audio Context Init Failed", e);
        }
    };
    
    // Initialize on interaction to unlock audio context
    const handleInteraction = () => {
        initAudioContext();
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);

    return () => {
        if(audioContextRef.current) audioContextRef.current.close();
        window.removeEventListener('click', handleInteraction);
    };
  }, []);

  // Connect Audio Elements to Visualizer safely
  useEffect(() => {
      if (!analyserRef.current || !audioContextRef.current) return;
      
      const connect = (el: HTMLAudioElement) => {
          try {
              // This throws if already connected, so we wrap in try/catch
              const source = audioContextRef.current!.createMediaElementSource(el);
              source.connect(analyserRef.current!);
          } catch (e) {
              // Already connected
          }
      };

      if (audioRef.current) connect(audioRef.current);
      if (sentenceAudioRef.current) connect(sentenceAudioRef.current);
  }, [analyser]); // Run once analyser is ready

  // --- Scan for Browser Native Voices ---
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Filter for Vietnamese voices
      const vietnameseVoices = voices.filter(v => v.lang.includes('vi') || v.lang === 'vi-VN');
      
      const nativePresets: InstantVoice[] = vietnameseVoices.map(v => {
        // Format nicer names based on known voices
        let displayName = v.name;
        const nameLower = v.name.toLowerCase();
        
        // Windows Voices (Microsoft)
        if (nameLower.includes("hoai my")) displayName = "Máy: Microsoft Hoài My (Windows - Nữ)";
        else if (nameLower.includes("nam minh")) displayName = "Máy: Microsoft Nam Minh (Windows - Nam)";
        // iOS/macOS Voices (Apple)
        else if (nameLower.includes("linh")) displayName = "Máy: Linh (Apple - Nữ)"; 
        // Samsung/Android Voices
        else if (nameLower.includes("dung")) displayName = "Máy: Dung (Samsung - Nữ)";
        // Google Voices
        else if (nameLower.includes("google") && nameLower.includes("vietnam")) displayName = "Máy: Google Tiếng Việt (Offline)";
        // Fallback formatting
        else displayName = `Máy: ${v.name.replace(/Desktop|Microsoft|Google|Apple/g, '').trim()}`;

        return {
          id: v.voiceURI, // Use voiceURI directly as ID to avoid conflicts
          name: displayName,
          type: 'browser-native',
          lang: v.lang,
          speed: 1.0,
          voiceURI: v.voiceURI
        };
      });

      // Update state, merging with Google presets
      setAvailableInstantVoices(prev => {
         // Create a map to avoid duplicates by ID
         const voiceMap = new Map();
         
         // Add Google presets first (Always keep these at top)
         INSTANT_VOICES_PRESETS.forEach(p => voiceMap.set(p.id, p));
         
         // Add scanned native voices
         nativePresets.forEach(p => voiceMap.set(p.id, p));
         
         return Array.from(voiceMap.values());
      });
    };

    // Try to load immediately
    loadVoices();
    
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Periodic retry for Chrome garbage collection issues and late loading
    const interval = setInterval(loadVoices, 1000);
    setTimeout(() => clearInterval(interval), 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Logic: Reset Audio when Story or Voice changes (Removed Caching Logic) ---
  useEffect(() => {
    // Revoke old URL to avoid memory leaks
    if (audioUrl) {
       URL.revokeObjectURL(audioUrl); 
    }
    setAudioUrl(null);
    setIsPlayingAI(false);
  }, [selectedStory, selectedVoice]);


  // --- Logic: Filter Stories ---
  const filteredStories = stories.filter(story => {
    const categoryMatch = selectedCategory === 'All' ? true : story.category === selectedCategory;
    const searchMatch = !searchQuery ? true : story.title.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleSaveApiKey = (geminiKey: string, elevenKey: string) => {
    setApiKey(geminiKey);
    localStorage.setItem('gemini_api_key', geminiKey);
    GeminiService.initializeGemini(geminiKey);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await GeminiService.searchStories(searchQuery);
      if (results.length > 0) {
        const taggedResults = results.map(s => ({...s, category: 'World' as const}));
        setStories(prev => [...prev, ...taggedResults]);
        setSelectedCategory('All'); 
      } else {
        alert("Không tìm thấy truyện nào trên internet với từ khóa này.");
      }
    } catch (error) {
      alert("Lỗi khi tìm kiếm. Vui lòng kiểm tra API Key.");
    } finally {
      setIsSearching(false);
    }
  };

  const parseContentToSentences = (content: string) => {
    if (!content) return [];
    // Split by punctuation but keep the punctuation. Limit max length to avoid TTS issues.
    const rawSentences = content.match(/[^.!?\n]+[.!?\n]+["']?|[^.!?\n]+$/g);
    if (!rawSentences) return [content];

    // Further split very long sentences if needed (optional but good for TTS)
    return rawSentences.map(s => s.trim()).filter(s => s.length > 0);
  };

  const handleSelectStory = async (story: Story) => {
    stopAllAudio();
    setSelectedStory(story);
    const initialImages = story.imageUrls || (story.imageUrl ? [story.imageUrl] : []);
    setGalleryImages(initialImages);
    setCurrentImageIndex(0);
    const sentences = parseContentToSentences(story.content);
    setStorySentences(sentences);
    
    if (initialImages.length === 0 && apiKey) {
      setIsGeneratingImages(true);
      GeminiService.generateStoryScenes(story.title, story.content).then(imgs => {
        if (imgs.length > 0) {
          setGalleryImages(imgs);
          setStories(prev => prev.map(s => s.id === story.id ? { ...s, imageUrls: imgs } : s));
        }
        setIsGeneratingImages(false);
      });
    }

    const isPlaceholder = story.content.includes("Bấm chọn để AI kể chi tiết") || story.content.length < 300;
    if (isPlaceholder && apiKey) {
       setIsExpandingContent(true);
       GeminiService.expandStory(story.title, story.content).then(fullContent => {
         const newSentences = parseContentToSentences(fullContent);
         setStorySentences(newSentences);
         setSelectedStory(prev => prev && prev.id === story.id ? { ...prev, content: fullContent } : prev);
         setStories(prev => prev.map(s => s.id === story.id ? { ...s, content: fullContent } : s));
         setIsExpandingContent(false);
       });
    }
  };

  const handleNextImage = () => {
    if (galleryImages.length > 0) setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
  };
  const handlePrevImage = () => {
    if (galleryImages.length > 0) setCurrentImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleDownloadPDF = () => {
    if (!selectedStory) return;
    const pdfContainer = document.createElement('div');
    pdfContainer.style.fontFamily = '"Times New Roman", Times, serif';
    pdfContainer.style.background = '#fff';
    pdfContainer.style.color = '#000';
    pdfContainer.style.width = '170mm'; 
    pdfContainer.style.boxSizing = 'border-box';

    const page1 = document.createElement('div');
    page1.innerHTML = `
      <div style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold; font-size: 14pt;">ĐỌC TRUYỆN CỔ THIẾU NHI</span>
        <span style="font-size: 11pt;">Create by Hoà Hiệp AI – 0983.676.470</span>
      </div>
      <h1 style="font-size: 26pt; font-weight: bold; margin-bottom: 15px; text-align: center; color: #1e3a8a;">${selectedStory.title}</h1>
    `;
    if (selectedStory.moral) page1.innerHTML += `<p style="font-style: italic; font-size: 13pt; margin-bottom: 25px; text-align: center; color: #444;">✨ ${selectedStory.moral}</p>`;
    page1.innerHTML += `<div style="line-height: 1.6; text-align: justify; font-size: 13pt; white-space: pre-wrap;">${selectedStory.content}</div>`;
    page1.innerHTML += `
      <div style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 40px; text-align: center; font-size: 11pt; font-style: italic;">
        Bản quyền thuộc về Hoà Hiệp AI – Liên hệ: 0983.676.470
      </div>
    `;
    pdfContainer.appendChild(page1);

    if (galleryImages.length > 0) {
      galleryImages.forEach((imgSrc, index) => {
          const imgPage = document.createElement('div');
          imgPage.style.pageBreakBefore = 'always';
          imgPage.style.display = 'flex';
          imgPage.style.flexDirection = 'column';
          imgPage.style.justifyContent = 'center';
          imgPage.style.alignItems = 'center';
          imgPage.style.height = '240mm'; 
          imgPage.innerHTML = `
            <h3 style="margin-bottom: 20px; font-size: 16pt; font-family: 'Times New Roman';">Minh họa ${index + 1}: ${selectedStory.title}</h3>
            <img src="${imgSrc}" style="max-width: 100%; max-height: 200mm; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            <div style="margin-top: 20px; font-size: 11pt; font-style: italic;">Hoà Hiệp AI Collection</div>
          `;
          pdfContainer.appendChild(imgPage);
      });
    }

    const opt = {
      margin: 20,
      filename: `${selectedStory.title}_HoaHiepAI.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    if (window.html2pdf) window.html2pdf().set(opt).from(pdfContainer).save();
    else alert("Đang tải thư viện tạo PDF, vui lòng thử lại sau giây lát.");
  };

  const stopAllAudio = () => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
        audioRef.current.pause(); 
        audioRef.current.currentTime = 0;
    }
    setIsPlayingAI(false);
    
    if (sentenceAudioRef.current) {
        sentenceAudioRef.current.pause();
        sentenceAudioRef.current.currentTime = 0;
        sentenceAudioRef.current.removeAttribute('src');
    }
    setIsReadingInstant(false);
    setCurrentSentenceIndex(-1);
    setIsLoadingSentence(false);
  };

  const handleGenerateHighQualityAudio = async (story: Story) => {
    if (!apiKey) {
      alert("Vui lòng nhập API Key để sử dụng tính năng tải file giọng đọc AI.");
      return;
    }
    setIsLoadingAudio(true);
    try {
      const textToRead = `Truyện: ${story.title}. ${story.content}`;
      const wavBlob = await GeminiService.generateSpeech(textToRead, selectedVoice.geminiVoiceName);
      
      if (wavBlob) {
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        setIsLoadingAudio(false);
        // Instant play, no delay
        requestAnimationFrame(() => {
             if(audioRef.current) {
                 audioRef.current.play()
                    .then(() => setIsPlayingAI(true))
                    .catch(e => console.warn("Autoplay blocked", e));
             }
        });
      } else {
         setIsLoadingAudio(false);
      }
    } catch (e) {
      alert("Không thể tạo giọng đọc.");
      setIsLoadingAudio(false);
    }
  };

  const handleInstantRead = async () => {
    if (isReadingInstant) {
        // Pause
        window.speechSynthesis.cancel();
        if (sentenceAudioRef.current && !sentenceAudioRef.current.paused) {
             sentenceAudioRef.current.pause();
        } 
        setIsReadingInstant(false);
        return;
    }

    if (isPlayingAI && audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAI(false);
    }

    if (storySentences.length === 0) return;
    if (currentSentenceIndex < 0) setCurrentSentenceIndex(0);
    setIsReadingInstant(true);
    
    // Resume audio context if needed
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
  };

  const handleInstantVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedInstantVoiceId(newId);
    localStorage.setItem('preferred_instant_voice', newId);
    
    // Reset current reading to apply new voice immediately
    if (isReadingInstant) {
        window.speechSynthesis.cancel();
        if(sentenceAudioRef.current) sentenceAudioRef.current.pause();
    }
  };

  // --- HYBRID TTS LOGIC: GOOGLE ONLINE OR BROWSER NATIVE ---
  useEffect(() => {
    if (!isReadingInstant || currentSentenceIndex < 0 || currentSentenceIndex >= storySentences.length) return;

    const text = storySentences[currentSentenceIndex];
    if (!text || !text.trim()) {
        setCurrentSentenceIndex(prev => prev + 1);
        return;
    }

    if (sentenceRefs.current[currentSentenceIndex]) {
        sentenceRefs.current[currentSentenceIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const currentVoiceSettings = availableInstantVoices.find(v => v.id === selectedInstantVoiceId) || availableInstantVoices[0];
    
    // Check text length. If > 200, force browser native because Google TTS URL has limits
    const useNativeFallback = text.length > 200;
    const isGoogle = currentVoiceSettings.type === 'google-online' && !useNativeFallback;

    // Method 1: Google Online TTS
    if (isGoogle) {
        if (sentenceAudioRef.current) {
           // Use client=tw-ob for better compatibility (direct file access)
           const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(text)}`;
           
           sentenceAudioRef.current.src = url;
           sentenceAudioRef.current.playbackRate = currentVoiceSettings.speed;
           
           sentenceAudioRef.current.onended = () => {
                if (isReadingInstant) {
                    if (currentSentenceIndex < storySentences.length - 1) {
                        setCurrentSentenceIndex(prev => prev + 1);
                    } else {
                        handleEndOfStory();
                    }
                }
           };
           
           sentenceAudioRef.current.onerror = (e) => {
               console.warn("Google TTS URL Failed (Network/CORS), switching to fallback", e);
               speakNativeFallback(text);
           };

           const playPromise = sentenceAudioRef.current.play();
           if (playPromise !== undefined) {
               playPromise.catch(e => {
                   console.error("Play error (Likely Blocked):", e);
                   // If blocked or empty src, fallback immediately
                   speakNativeFallback(text);
               });
           }
       }
    } 
    // Method 2: Browser Native (SpeechSynthesis)
    else {
        speakNativeFallback(text, currentVoiceSettings);
    }

  }, [currentSentenceIndex, isReadingInstant, selectedInstantVoiceId]);

  const speakNativeFallback = (text: string, settings?: InstantVoice) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Ensure we try to find a vietnamese voice if possible
        if (settings && settings.type === 'browser-native') {
             utterance.lang = settings.lang;
             utterance.rate = settings.speed;
             const voices = window.speechSynthesis.getVoices();
             // Match by voiceURI which is unique and safer
             const nativeVoice = voices.find(v => v.voiceURI === settings.voiceURI);
             if (nativeVoice) utterance.voice = nativeVoice;
        } else {
             // Generic Vietnamese fallback if Google fails and no settings provided
             const voices = window.speechSynthesis.getVoices();
             // Prioritize "Google Tiếng Việt" strictly if falling back from Google Online URL
             const googleViVoice = voices.find(v => v.name === "Google Tiếng Việt" || v.name === "Google Vietnamese");
             const anyViVoice = voices.find(v => v.lang === "vi-VN" || v.lang.includes("vi"));
             
             utterance.lang = 'vi-VN';
             if (googleViVoice) {
                 utterance.voice = googleViVoice;
             } else if (anyViVoice) {
                 utterance.voice = anyViVoice;
             }
             utterance.rate = 1.0;
        }

        utterance.onend = () => {
            if (isReadingInstant) {
                if (currentSentenceIndex < storySentences.length - 1) {
                    setCurrentSentenceIndex(prev => prev + 1);
                } else {
                    handleEndOfStory();
                }
            }
        };

        utterance.onerror = (e) => {
            // Fix: Ignore interrupted/canceled events that occur during sentence switching
            if (e.error === 'interrupted' || e.error === 'canceled') return;

            console.error("Browser TTS Error", e);
            // Skip to next if error to prevent getting stuck
            if (isReadingInstant && currentSentenceIndex < storySentences.length - 1) {
                setCurrentSentenceIndex(prev => prev + 1);
            }
        };
        
        synthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
  };

  const handleEndOfStory = () => {
      setIsReadingInstant(false);
      setCurrentSentenceIndex(-1);
  };

  const safePlayAudio = async () => {
    if (!audioRef.current) return;
    try {
      if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
      }
      await audioRef.current.play();
      setIsPlayingAI(true);
    } catch (error) { setIsPlayingAI(false); }
  };

  const togglePlayAI = async () => {
    if (!audioRef.current) return;
    if (isPlayingAI) {
      audioRef.current.pause();
      setIsPlayingAI(false);
    } else {
      if (isReadingInstant) stopAllAudio();
      await safePlayAudio();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const categories: {id: Story['category'] | 'All', label: string, icon: any}[] = [
    { id: 'Vietnam', label: 'Việt Nam', icon: MapIcon },
    { id: 'Greek', label: 'Hy Lạp', icon: Sparkles },
    { id: 'Denmark', label: 'Đan Mạch', icon: Globe2 },
    { id: 'Germany', label: 'Đức', icon: Globe2 },
    { id: 'Norway', label: 'Na Uy', icon: Globe2 },
    { id: 'Russia', label: 'Nga', icon: Globe2 },
    { id: 'France', label: 'Pháp', icon: Globe2 },
    { id: 'Romania', label: 'Romania', icon: Globe2 },
    { id: 'Czech', label: 'Séc', icon: Globe2 },
    { id: 'China', label: 'Trung Quốc', icon: Globe2 },
    { id: 'All', label: 'Tất cả', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col font-quicksand text-slate-800">
      <ApiKeyModal onSave={handleSaveApiKey} hasKey={!!apiKey} />
      
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={32} className="text-yellow-300" />
            <div>
              <h1 className="text-xl font-bold leading-tight uppercase tracking-wide">Đọc Truyện Cổ Thiếu Nhi</h1>
              <p className="text-xs text-blue-100 opacity-90">Kho tàng truyện cổ tích Việt Nam & Thế giới</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
             <span>Copyright © Huy Phát & Hoàng Phúc</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-4 h-[calc(100vh-8rem)]">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-100 overflow-x-auto">
             <div className="flex gap-2 min-w-max">
               {categories.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.id)}
                   className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                 >
                   <cat.icon size={16} /> {cat.label}
                 </button>
               ))}
             </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm tên truyện..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <button onClick={handleSearch} disabled={isSearching} className="absolute right-2 top-2 p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                {isSearching ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"/> : "Tìm"}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <BookOpen size={18} /> Danh Sách Truyện
              </h3>
              <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md border text-gray-500">
                {filteredStories.length} truyện
              </span>
            </div>
            <div className="overflow-y-auto p-2 space-y-2 flex-1">
              {filteredStories.length > 0 ? (
                filteredStories.map(story => (
                  <div 
                    key={story.id}
                    onClick={() => handleSelectStory(story)}
                    onDoubleClick={() => handleSelectStory(story)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border group relative ${selectedStory?.id === story.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50 border-transparent hover:border-gray-100'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold ${selectedStory?.id === story.id ? 'text-blue-700' : 'text-gray-700'}`}>
                        {story.title}
                      </h4>
                      {story.category === 'World' && <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Internet</span>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{story.content}</p>
                    
                    {/* Select Button */}
                    <div className="mt-2 flex justify-end">
                       <button
                          onClick={(e) => {
                              e.stopPropagation();
                              handleSelectStory(story);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-bold transition-all shadow-sm
                             ${selectedStory?.id === story.id 
                               ? 'bg-blue-600 text-white' 
                               : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'
                             }`}
                       >
                          <BookOpen size={12}/> {selectedStory?.id === story.id ? 'Đang đọc' : 'Đọc truyện này'}
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-gray-400 text-sm">
                  Không tìm thấy truyện.<br/>
                  <button onClick={handleSearch} className="text-blue-600 font-bold hover:underline mt-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    🔍 Tìm trên Internet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden min-h-[500px] flex flex-col relative group/reader">
            {selectedStory ? (
              <div id="story-content-to-export" className="flex flex-col h-full">
                <div className="h-96 md:h-[500px] bg-slate-900 relative flex items-center justify-center overflow-hidden group transition-all duration-300">
                  {galleryImages.length > 0 ? (
                    <img src={galleryImages[currentImageIndex]} alt={selectedStory.title} className="w-full h-full object-contain transition-transform duration-700" />
                  ) : (
                    <div className="text-center p-6">
                      <Sparkles className="mx-auto text-blue-400 mb-2 opacity-50" size={48} />
                      <p className="text-gray-400 text-sm">Chưa có hình ảnh minh họa</p>
                      {apiKey && !isGeneratingImages && (
                        <button 
                          onClick={() => {
                            setIsGeneratingImages(true);
                            GeminiService.generateStoryScenes(selectedStory.title, selectedStory.content).then(imgs => {
                              if (imgs.length > 0) setGalleryImages(imgs);
                              setIsGeneratingImages(false);
                            });
                          }}
                          className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Tạo tranh AI
                        </button>
                      )}
                    </div>
                  )}
                  {isGeneratingImages && (
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                       <div className="flex flex-col items-center animate-pulse">
                         <ImageIcon className="text-yellow-400 mb-2" size={32} />
                         <span className="text-white text-sm font-medium">Đang vẽ bộ tranh...</span>
                       </div>
                     </div>
                  )}
                  {galleryImages.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} className="absolute left-2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className="absolute right-2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 pointer-events-none">
                    <h2 className="text-3xl font-bold text-white mb-2 shadow-sm">{selectedStory.title}</h2>
                    {selectedStory.moral && (
                      <div className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs text-white font-medium border border-white/30">
                        ✨ {selectedStory.moral}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto max-h-[500px] bg-white relative text-lg leading-relaxed text-gray-800 font-medium scroll-smooth">
                   {isExpandingContent ? (
                     <div className="flex flex-col items-center justify-center h-40 gap-3 text-blue-600">
                       <span className="font-medium text-sm animate-pulse">AI đang viết chi tiết câu chuyện...</span>
                     </div>
                   ) : (
                     <div className="whitespace-pre-wrap">
                       {storySentences.map((sentence, index) => (
                         <span 
                            key={index} 
                            ref={el => sentenceRefs.current[index] = el}
                            className={`inline-block mr-1 transition-all duration-300 rounded px-1 py-0.5
                                ${currentSentenceIndex === index && isReadingInstant 
                                    ? 'bg-yellow-200 scale-105 text-blue-900 shadow-sm border border-yellow-300' 
                                    : 'hover:bg-gray-50'
                                }`}
                         >
                            {sentence}{" "}
                         </span>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Book size={64} className="mb-4 opacity-20" />
                <p>Chọn một truyện để bắt đầu đọc</p>
              </div>
            )}
            
            <div className="absolute top-4 right-4 flex gap-2">
              {selectedStory && !isExpandingContent && (
                <button
                  onClick={handleDownloadPDF}
                  className="bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:bg-white text-rose-600 transition-all z-20"
                  title="Tải PDF (Truyện + Ảnh)"
                >
                  <FileDown size={20} />
                </button>
              )}
            </div>
          </div>

          {/* UNIVERSAL AUDIO VISUALIZER */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg relative h-28">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Visualizer Background */}
             </div>
             <AudioVisualizer analyser={analyser} isPlaying={isPlayingAI || isReadingInstant} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 space-y-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
               {/* 1. INSTANT READ - HYBRID MODE */}
               <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100 flex flex-col gap-3 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-100 rounded-full opacity-50 pointer-events-none"/>
                  
                  {/* Controls Row */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <button 
                          onClick={handleInstantRead}
                          disabled={!selectedStory || isExpandingContent || isLoadingSentence}
                          className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105
                            ${isReadingInstant ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}
                            ${isLoadingSentence ? 'opacity-70 cursor-wait' : ''}`}
                      >
                          {isLoadingSentence ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : 
                             isReadingInstant ? <Pause fill="currentColor"/> : <Play fill="currentColor" className="ml-1"/>
                          }
                      </button>
                      <div>
                          <h4 className="font-bold text-blue-900 text-sm uppercase flex items-center gap-1">
                             GIỌNG ĐỌC GOOGLE
                          </h4>
                          <div className="flex gap-2">
                             <select 
                               value={selectedInstantVoiceId} 
                               onChange={handleInstantVoiceChange}
                               className="text-xs mt-1 p-1 rounded border border-blue-200 bg-white max-w-[200px] font-medium text-gray-700"
                             >
                               {availableInstantVoices.map(v => (
                                 <option key={v.id} value={v.id}>{v.name}</option>
                               ))}
                             </select>
                          </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Box */}
                  <div className="bg-white/60 p-2 rounded border border-blue-50 text-xs text-gray-500 italic z-10">
                    {availableInstantVoices.find(v => v.id === selectedInstantVoiceId)?.type === 'google-online' 
                      ? "Giọng Google Online: Truyền cảm, cần Internet." 
                      : "Giọng Máy (Native): Đọc nhanh, Offline."}
                  </div>

                  {isReadingInstant && (
                     <div className="text-xs font-mono text-blue-500 bg-white px-2 py-1 rounded border border-blue-100 text-center z-10">
                        Đang đọc: Câu {currentSentenceIndex + 1}/{storySentences.length}
                     </div>
                  )}
               </div>

               {/* 2. Download HQ (AI) */}
               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between">
                   <div className="flex items-start justify-between mb-3">
                        <div>
                            <h4 className="font-bold text-indigo-900 text-sm uppercase flex items-center gap-1">
                                <Sparkles size={14}/> TẠO GIỌNG ĐỌC TRUYỀN CẢM
                            </h4>
                            <p className="text-xs text-indigo-600">AI Voice Chất Lượng Cao</p>
                        </div>
                        <select 
                        className="text-xs p-1 rounded border border-indigo-200 bg-white max-w-[120px]"
                        value={selectedVoice.id}
                        onChange={(e) => setSelectedVoice(VOICES.find(v => v.id === e.target.value) || VOICES[0])}
                        >
                            {VOICES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                   </div>

                  <div className="flex gap-2 items-center justify-center flex-1">
                     {audioUrl ? (
                         <div className="flex gap-3 items-center w-full">
                            <button 
                                onClick={togglePlayAI} 
                                className="w-12 h-12 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            >
                               {isPlayingAI ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-1"/>}
                            </button>
                            
                            <div className="flex-1 h-12 bg-indigo-100 rounded-lg flex items-center justify-center border border-indigo-200 text-indigo-400 text-xs font-medium">
                                Sẵn sàng phát
                            </div>

                            <a href={audioUrl} download={`${selectedStory?.title}.wav`} className="p-2 bg-white text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 shadow-sm" title="Tải về máy">
                               <Download size={20}/>
                            </a>
                         </div>
                     ) : (
                        <button 
                           onClick={() => selectedStory && handleGenerateHighQualityAudio(selectedStory)}
                           disabled={isLoadingAudio || !selectedStory}
                           className="w-full py-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 font-medium"
                        >
                           {isLoadingAudio ? <div className="animate-spin h-5 w-5 border-2 border-indigo-600 rounded-full border-t-transparent"/> : <><Mic2 size={18}/> Tạo Giọng Đọc AI</>}
                        </button>
                     )}
                  </div>
               </div>

            </div>
          </div>
        </div>
      </main>

      <audio ref={audioRef} src={audioUrl || undefined} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlayingAI(false)} className="hidden" />
      {/* Removed crossOrigin to prevent CORS errors with Google TTS */}
      <audio ref={sentenceAudioRef} className="hidden" />

      <footer className="bg-white border-t border-gray-100 py-6 mt-6 text-center">
        <p className="text-gray-600 font-medium">Ứng Dụng Đọc Truyện Cổ Thiếu Nhi</p>
        <p className="text-sm text-gray-400">© Huy Phát & Hoàng Phúc - 0983.676.470</p>
      </footer>
    </div>
  );
}
