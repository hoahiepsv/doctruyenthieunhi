import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, Play, Pause, SkipForward, Volume2, 
  Download, ListMusic, User, Sparkles, Book, Globe2, Map, FileDown
} from 'lucide-react';
import { INITIAL_STORIES, VOICES } from './constants';
import { Story, VoiceOption, PlaylistItem } from './types';
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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isExpandingContent, setIsExpandingContent] = useState(false);

  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      GeminiService.initializeGemini(storedKey);
    }
  }, []);

  // --- Logic: Filter Stories ---
  const filteredStories = stories.filter(story => {
    // 1. Filter by Category
    const categoryMatch = selectedCategory === 'All' 
      ? true 
      : story.category === selectedCategory;
    
    // 2. Filter by Search Query
    const searchMatch = !searchQuery 
      ? true 
      : story.title.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // --- Logic: API Key ---
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    GeminiService.initializeGemini(key);
  };

  // --- Logic: Search (External/AI) ---
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      // Only search externally if we select 'All' or specifically want more
      const results = await GeminiService.searchStories(searchQuery);
      if (results.length > 0) {
        // Tag external results as 'World' or 'Other'
        const taggedResults = results.map(s => ({...s, category: 'World' as const}));
        setStories(prev => [...prev, ...taggedResults]);
        setSelectedCategory('All'); // Switch to All to see results
      } else {
        alert("Không tìm thấy truyện nào trên internet với từ khóa này.");
      }
    } catch (error) {
      alert("Lỗi khi tìm kiếm. Vui lòng kiểm tra API Key.");
    } finally {
      setIsSearching(false);
    }
  };

  // --- Logic: Select Story ---
  const handleSelectStory = async (story: Story) => {
    setSelectedStory(story);
    setGeneratedImage(story.imageUrl || null);
    
    // Auto generate image if missing
    if (!story.imageUrl && apiKey) {
      setIsGeneratingImage(true);
      GeminiService.generateStoryImage(story.title, story.content).then(img => {
        if (img) setGeneratedImage(img);
        setIsGeneratingImage(false);
      });
    }

    // Expand content if it is a short placeholder
    // We assume placeholders are short or contain the trigger phrase
    const isPlaceholder = story.content.includes("Bấm chọn để AI kể chi tiết") || story.content.length < 300;
    
    if (isPlaceholder && apiKey) {
       setIsExpandingContent(true);
       GeminiService.expandStory(story.title, story.content).then(fullContent => {
         setSelectedStory(prev => prev && prev.id === story.id ? { ...prev, content: fullContent } : prev);
         // Update in main list too so we don't re-fetch next time
         setStories(prev => prev.map(s => s.id === story.id ? { ...s, content: fullContent } : s));
         setIsExpandingContent(false);
       });
    }
  };

  // --- Logic: Download PDF with Copyright ---
  const handleDownloadPDF = () => {
    if (!selectedStory) return;
    const element = document.getElementById('story-content-to-export');
    if (!element) return;

    // --- Create a temporary container for PDF generation ---
    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '40px';
    pdfContainer.style.fontFamily = 'Quicksand, sans-serif';
    pdfContainer.style.color = '#333';
    pdfContainer.style.background = '#fff';

    // 1. HEADER
    const header = document.createElement('div');
    header.innerHTML = `
      <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold; color: #3b82f6; font-size: 16px;">ĐỌC TRUYỆN CỔ THIẾU NHI</span>
        <span style="font-size: 10px; color: #888;">Create by Hoà Hiệp AI – 0983.676.470</span>
      </div>
    `;
    pdfContainer.appendChild(header);

    // 2. CONTENT (CLONED)
    // We clone the element but need to reset some styles that might break PDF (like scrollbars or fixed heights)
    const contentClone = element.cloneNode(true) as HTMLElement;
    
    // Reset layout styles for print
    contentClone.style.height = 'auto';
    contentClone.style.maxHeight = 'none';
    contentClone.style.overflow = 'visible';
    contentClone.style.display = 'block';

    // Handle image styling in PDF
    const images = contentClone.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        images[i].style.maxWidth = '100%';
        images[i].style.height = 'auto';
        images[i].style.borderRadius = '8px';
        images[i].style.marginBottom = '20px';
        images[i].style.boxShadow = 'none';
    }
    
    // Handle text container styling
    const textContainer = contentClone.querySelector('div.p-8') as HTMLElement;
    if(textContainer) {
       textContainer.style.overflow = 'visible';
       textContainer.style.maxHeight = 'none';
       textContainer.style.padding = '0';
       textContainer.style.marginTop = '20px';
    }
    // Remove absolute positioning wrapper effects if any
    const imageWrapper = contentClone.querySelector('.relative.group') as HTMLElement;
    if(imageWrapper) {
      imageWrapper.style.height = 'auto';
      imageWrapper.style.overflow = 'visible';
    }
    const titleOverlay = contentClone.querySelector('.absolute.bottom-0') as HTMLElement;
    if (titleOverlay) {
       // Convert absolute title to relative block for PDF
       titleOverlay.style.position = 'relative';
       titleOverlay.style.background = 'white';
       titleOverlay.style.padding = '10px 0';
       titleOverlay.style.marginTop = '10px';
       const titleText = titleOverlay.querySelector('h2') as HTMLElement;
       if(titleText) titleText.style.color = '#1e3a8a'; // Dark blue text
    }

    pdfContainer.appendChild(contentClone);

    // 3. FOOTER
    const footer = document.createElement('div');
    footer.innerHTML = `
      <div style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 40px; text-align: center; font-size: 10px; color: #666; font-style: italic;">
        Bản quyền thuộc về Hoà Hiệp AI – Liên hệ: 0983.676.470 <br/>
        Tài liệu được tạo tự động từ ứng dụng Đọc Truyện Cổ Thiếu Nhi
      </div>
    `;
    pdfContainer.appendChild(footer);

    // Execute Download
    const opt = {
      margin: 10,
      filename: `${selectedStory.title}_HoaHiepAI.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(pdfContainer).save();
    } else {
      alert("Đang tải thư viện tạo PDF, vui lòng thử lại sau giây lát.");
    }
  };

  // --- Logic: Audio & Playlist ---
  const addToPlaylist = (story: Story) => {
    if (playlist.find(p => p.id === story.id)) return;
    setPlaylist([...playlist, { ...story }]);
  };

  const handleGenerateAudio = async (story: Story, playImmediately: boolean = true) => {
    if (!apiKey) {
      alert("Vui lòng nhập API Key để sử dụng tính năng đọc.");
      return;
    }
    
    setIsLoadingAudio(true);
    try {
      // Short intro with title
      const textToRead = `Truyện: ${story.title}. ${story.content}`;
      const wavBlob = await GeminiService.generateSpeech(textToRead, selectedVoice.geminiVoiceName);
      
      if (wavBlob) {
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        setPlaylist(prev => prev.map(p => p.id === story.id ? { ...p, audioUrl: url } : p));
        
        if (playImmediately) {
          if (audioRef.current) {
             audioRef.current.src = url;
             audioRef.current.play();
             setIsPlaying(true);
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert("Không thể tạo giọng đọc. Vui lòng thử lại.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const playAll = () => {
    if (playlist.length === 0) {
      if (selectedStory) {
        setPlaylist([selectedStory]);
        setCurrentTrackIndex(0);
      }
    } else {
      setCurrentTrackIndex(0);
    }
  };

  useEffect(() => {
    if (currentTrackIndex >= 0 && currentTrackIndex < playlist.length) {
      const track = playlist[currentTrackIndex];
      setSelectedStory(track);
      
      const playTrack = async () => {
        if (track.audioUrl) {
          setAudioUrl(track.audioUrl);
          if (audioRef.current) {
            audioRef.current.src = track.audioUrl;
            audioRef.current.play();
            setIsPlaying(true);
          }
        } else {
          await handleGenerateAudio(track, true);
        }
      };
      playTrack();
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (currentTrackIndex !== -1 && currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const categories: {id: Story['category'] | 'All', label: string, icon: any}[] = [
    { id: 'Vietnam', label: 'Việt Nam', icon: Map },
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
      
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Categories, List & Search (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[calc(100vh-8rem)]">
          
          {/* Category Tabs - Scrollable */}
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

          {/* Search Box */}
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
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-2 top-2 p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Tìm trên internet nếu không có trong danh sách"
              >
                {isSearching ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"/> : "Tìm"}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">Nhập tên truyện và nhấn Tìm để tra cứu thêm từ Internet</p>
          </div>

          {/* Story List */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <ListMusic size={18} /> 
                Danh Sách Truyện
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
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedStory?.id === story.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50 border-transparent hover:border-gray-100'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold ${selectedStory?.id === story.id ? 'text-blue-700' : 'text-gray-700'}`}>
                        {story.title}
                      </h4>
                      {story.category === 'World' && <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Internet</span>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{story.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-gray-400 text-sm">
                  Không tìm thấy truyện trong danh sách.<br/>
                  <button onClick={handleSearch} className="text-blue-600 font-bold hover:underline mt-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    🔍 Tìm "{searchQuery}" trên Internet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Reader & Controls (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Reader Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden min-h-[500px] flex flex-col relative group/reader">
            {selectedStory ? (
              <div id="story-content-to-export" className="flex flex-col h-full">
                 {/* Visuals - Split Top */}
                <div className="h-64 bg-slate-900 relative flex items-center justify-center overflow-hidden group">
                  {generatedImage ? (
                    <img src={generatedImage} alt={selectedStory.title} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="text-center p-6">
                      <Sparkles className="mx-auto text-blue-400 mb-2 opacity-50" size={48} />
                      <p className="text-gray-400 text-sm">Chưa có hình ảnh minh họa</p>
                      {apiKey && !isGeneratingImage && (
                        <button 
                          onClick={() => {
                            setIsGeneratingImage(true);
                            GeminiService.generateStoryImage(selectedStory.title, selectedStory.content).then(img => {
                              if (img) setGeneratedImage(img);
                              setIsGeneratingImage(false);
                            });
                          }}
                          className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Tạo ảnh AI
                        </button>
                      )}
                    </div>
                  )}
                  
                  {isGeneratingImage && (
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                       <div className="flex flex-col items-center animate-pulse">
                         <Sparkles className="text-yellow-400 mb-2" size={32} />
                         <span className="text-white text-sm font-medium">Đang vẽ tranh...</span>
                       </div>
                     </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                    <h2 className="text-3xl font-bold text-white mb-2 shadow-sm">{selectedStory.title}</h2>
                    {selectedStory.moral && (
                      <div className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs text-white font-medium border border-white/30">
                        ✨ {selectedStory.moral}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content - Bottom */}
                <div className="p-8 flex-1 overflow-y-auto max-h-[500px] bg-white relative">
                   {isExpandingContent ? (
                     <div className="flex items-center justify-center h-20 gap-2 text-blue-600">
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"/>
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"/>
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"/>
                       <span className="ml-2 font-medium">AI đang viết chi tiết câu chuyện...</span>
                     </div>
                   ) : (
                     <p className="text-lg leading-relaxed text-gray-800 font-medium whitespace-pre-wrap">
                       {selectedStory.content}
                     </p>
                   )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Book size={64} className="mb-4 opacity-20" />
                <p>Chọn một truyện để bắt đầu đọc</p>
              </div>
            )}
            
            {/* Quick Actions Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              {selectedStory && (
                <button
                  onClick={handleDownloadPDF}
                  className="bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:bg-white text-rose-600 transition-all"
                  title="Tải nội dung và hình ảnh PDF (có bản quyền)"
                >
                  <FileDown size={20} />
                </button>
              )}
              <button 
                onClick={() => selectedStory && addToPlaylist(selectedStory)}
                className="bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:bg-white text-blue-600 transition-all"
                title="Thêm vào danh sách phát"
              >
                <ListMusic size={20} />
              </button>
            </div>
          </div>

          {/* Control Panel (Sticky Bottom in Mobile, Block in Desktop) */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 space-y-4">
            {/* Voice Selection */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 whitespace-nowrap">
                <User size={18} /> Giọng đọc:
              </div>
              <div className="flex gap-2">
                {VOICES.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all whitespace-nowrap flex flex-col items-center min-w-[100px]
                      ${selectedVoice.id === voice.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span className="font-bold">{voice.name}</span>
                    <span className="text-[10px] opacity-80">{voice.gender} • {voice.ageGroup}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 p-4 rounded-xl">
              
              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => selectedStory && handleGenerateAudio(selectedStory, true)}
                    disabled={isLoadingAudio || !selectedStory}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                 >
                    {isLoadingAudio ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                       <Pause onClick={(e) => { e.stopPropagation(); togglePlay(); }} fill="currentColor" />
                    ) : (
                       <Volume2 fill="currentColor" />
                    )}
                 </button>
                 
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-500 font-bold uppercase">Đang phát</span>
                   <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                     {selectedStory?.title || "..."}
                   </span>
                 </div>
              </div>

              {/* Waveform & Scrubber */}
              <div className="flex-1 w-full flex flex-col gap-2">
                 <div className="relative h-16 bg-white border border-blue-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <AudioVisualizer audioElement={audioRef.current} isPlaying={isPlaying} />
                    {!audioUrl && !isLoadingAudio && <span className="absolute text-xs text-gray-400">Sóng âm thanh sẽ hiện khi đọc</span>}
                 </div>
                 
                 <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 0} 
                      value={currentTime} 
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                    <span>{formatTime(duration)}</span>
                 </div>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                 {audioUrl && (
                   <a 
                     href={audioUrl} 
                     download={`${selectedStory?.title}.wav`}
                     className="p-2 text-gray-600 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                     title="Tải giọng đọc về máy"
                   >
                     <Download size={20} />
                   </a>
                 )}
                 <button 
                   onClick={playAll}
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-bold text-sm transition-colors"
                 >
                   <ListMusic size={16} />
                   Đọc toàn bộ
                   {playlist.length > 0 && <span className="bg-indigo-600 text-white text-[10px] px-1.5 rounded-full">{playlist.length}</span>}
                 </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        className="hidden" 
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium mb-1">Ứng Dụng Đọc Truyện Cổ Thiếu Nhi</p>
          <p className="text-sm text-gray-400">© Huy Phát & Hoàng Phúc - 0983.676.470</p>
        </div>
      </footer>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}