import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Heart, Sparkles, Feather, Printer, 
  HelpCircle, Info, Bookmark, Moon, Sun, Volume2, Plus
} from 'lucide-react';
import { Story, PaperTheme, FontSize, LineHeight, ReaderFont, VoiceOption } from './types';
import { INITIAL_STORIES, VOICES } from './constants';
import { StoryReaderFrame } from './components/StoryReaderFrame';
import { BedtimeAudioBar } from './components/BedtimeAudioBar';
import { StoryListSidebar } from './components/StoryListSidebar';
import { AddStoryModal } from './components/AddStoryModal';
import { offlineSpeech, bedtimeSound } from './utils/offlineSpeech';

export default function App() {
  // --- Story State ---
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const savedCustom = localStorage.getItem('custom_stories_offline');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        return [...INITIAL_STORIES, ...parsed];
      }
    } catch (e) {
      console.warn("Error reading local stories:", e);
    }
    return INITIAL_STORIES;
  });

  const [selectedStory, setSelectedStory] = useState<Story>(INITIAL_STORIES[0]);
  const [selectedCategory, setSelectedCategory] = useState<Story['category'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const savedFavs = localStorage.getItem('favorite_stories_offline');
      return savedFavs ? JSON.parse(savedFavs) : ['vn-tam-cam', 'vn-thach-sanh', 'wd-co-be-ban-diem'];
    } catch {
      return ['vn-tam-cam'];
    }
  });

  // --- Reading Experience & "Khung văn bản nền" State ---
  const [paperTheme, setPaperTheme] = useState<PaperTheme>(() => {
    const saved = localStorage.getItem('reader_paper_theme');
    return (saved as PaperTheme) || 'parchment';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('reader_font_size');
    return (saved as FontSize) || 'medium';
  });
  const [lineHeight, setLineHeight] = useState<LineHeight>('relaxed');
  const [readerFont, setReaderFont] = useState<ReaderFont>('serif');

  // --- Offline Speech State ---
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isPausedSpeech, setIsPausedSpeech] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [totalParagraphs, setTotalParagraphs] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [speechMode, setSpeechMode] = useState<'natural' | 'device'>('natural');

  // Sleep Timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0);
  const [sleepTimerRemainingSeconds, setSleepTimerRemainingSeconds] = useState<number | null>(null);
  const sleepTimerRef = useRef<any>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('reader_paper_theme', paperTheme);
  }, [paperTheme]);

  useEffect(() => {
    localStorage.setItem('reader_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('favorite_stories_offline', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Setup Offline Speech Callbacks
  useEffect(() => {
    offlineSpeech.setCallbacks(
      (state) => {
        setIsPlayingSpeech(state.isPlaying);
        setIsPausedSpeech(state.isPaused);
        setCurrentParagraphIndex(state.paragraphIndex);
        setTotalParagraphs(state.totalParagraphs || 1);
        if (state.mode) {
          setSpeechMode(state.mode);
        }
      },
      () => {
        // Story completed callback
        if (sleepTimerMinutes === -1) {
          // If timer is "Stop at end of story"
          offlineSpeech.stop();
          bedtimeSound.stop();
          setSleepTimerMinutes(0);
          setSleepTimerRemainingSeconds(null);
          return;
        }

        if (autoPlayNext) {
          handleNextStory();
        }
      }
    );

    return () => {
      offlineSpeech.stop();
      bedtimeSound.stop();
    };
  }, [autoPlayNext, sleepTimerMinutes, stories, selectedStory]);

  // Sleep Timer Countdown
  useEffect(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (sleepTimerMinutes > 0) {
      const totalSecs = sleepTimerMinutes * 60;
      setSleepTimerRemainingSeconds(totalSecs);

      sleepTimerRef.current = setInterval(() => {
        setSleepTimerRemainingSeconds((prev) => {
          if (prev === null || prev <= 1) {
            // Timer expired!
            clearInterval(sleepTimerRef.current);
            sleepTimerRef.current = null;
            offlineSpeech.stop();
            bedtimeSound.stop();
            setSleepTimerMinutes(0);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSleepTimerRemainingSeconds(null);
    }

    return () => {
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
  }, [sleepTimerMinutes]);

  // --- Filter stories ---
  const filteredStories = stories.filter((story) => {
    // 1. Favorites Filter
    if (showFavoritesOnly && !favoriteIds.includes(story.id)) {
      return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'All' && story.category !== selectedCategory) {
      return false;
    }

    // 3. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchContent = story.content.toLowerCase().includes(q);
      const matchMoral = story.moral?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchMoral;
    }

    return true;
  });

  // Select Story
  const handleSelectStory = (story: Story) => {
    if (selectedStory.id !== story.id) {
      offlineSpeech.stop();
      setSelectedStory(story);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Next Story in current list
  const handleNextStory = () => {
    const currentIndex = filteredStories.findIndex((s) => s.id === selectedStory.id);
    if (currentIndex !== -1 && currentIndex < filteredStories.length - 1) {
      const nextStory = filteredStories[currentIndex + 1];
      setSelectedStory(nextStory);
      setTimeout(() => {
        offlineSpeech.startReadingStory(nextStory.content, 0);
      }, 400);
    } else if (filteredStories.length > 0) {
      // Loop back to first story
      const firstStory = filteredStories[0];
      setSelectedStory(firstStory);
      setTimeout(() => {
        offlineSpeech.startReadingStory(firstStory.content, 0);
      }, 400);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add Custom Story (stored offline)
  const handleAddCustomStory = (newStory: Story) => {
    const updated = [newStory, ...stories];
    setStories(updated);
    setSelectedStory(newStory);

    // Save custom stories to localStorage
    const customList = updated.filter((s) => s.isCustom);
    localStorage.setItem('custom_stories_offline', JSON.stringify(customList));
  };

  // Delete Custom Story
  const handleDeleteCustomStory = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa câu chuyện này khỏi danh sách offline?')) {
      const updated = stories.filter((s) => s.id !== id);
      setStories(updated);
      if (selectedStory.id === id) {
        setSelectedStory(updated[0] || INITIAL_STORIES[0]);
      }
      const customList = updated.filter((s) => s.isCustom);
      localStorage.setItem('custom_stories_offline', JSON.stringify(customList));
    }
  };

  // Print/Download Framed Story
  const handlePrintPdf = () => {
    const printElem = document.getElementById('story-printable-container');
    if (!printElem) return;

    // Check if html2pdf is available
    if (typeof (window as any).html2pdf === 'function') {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${selectedStory.title} - Doc Truyen Co Thieu Nhi.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      (window as any).html2pdf().from(printElem).set(opt).save();
    } else {
      window.print();
    }
  };

  // Calculate paragraph count of selected story
  useEffect(() => {
    if (selectedStory) {
      const pCount = selectedStory.content
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0).length;
      setTotalParagraphs(pCount || 1);
    }
  }, [selectedStory]);

  return (
    <div className="min-h-screen flex flex-col font-quicksand bg-[#f4ece1] text-stone-800 transition-colors duration-300">
      
      {/* --- APP HEADER --- */}
      <header className="bg-gradient-to-r from-[#6d4323] via-[#854d27] to-[#6d4323] text-amber-50 shadow-lg sticky top-0 z-40 border-b-2 border-amber-500/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-wide uppercase font-serif-story text-amber-100 flex items-center gap-2">
                <span>ĐỌC TRUYỆN CỔ THIẾU NHI</span>
                <span className="text-[10px] bg-emerald-600/90 text-white px-2 py-0.5 rounded-full font-sans tracking-normal hidden md:inline">
                  Offline 100%
                </span>
              </h1>
              <p className="text-xs text-amber-200/80 font-medium">
                Kho tàng truyện cổ tích thiếu nhi • Giọng đọc truyền cảm • Khung nền giấy ấm áp
              </p>
              <p className="text-[11px] text-amber-300 sm:hidden mt-0.5 font-semibold">
                Tác giả phần mềm: Lê Hòa Hiệp - 0983.676.470
              </p>
            </div>
          </div>

          {/* Author Badge in Header (Desktop / Tablet) */}
          <div className="hidden sm:flex items-center gap-2 text-xs bg-amber-950/50 border border-amber-400/40 px-3.5 py-1.5 rounded-xl text-amber-200 shadow-inner">
            <span className="text-[11px] text-amber-300/90">Tác giả phần mềm:</span>
            <span className="font-bold text-amber-100 tracking-wide">Lê Hòa Hiệp - 0983.676.470</span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              title="Thêm truyện mới của bạn (Lưu offline)"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Thêm Truyện</span>
            </button>

            <button
              onClick={() => setShowAppInfo(true)}
              className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 transition-colors"
              title="Thông tin ứng dụng"
            >
              <Info size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col">
          <StoryListSidebar
            stories={filteredStories}
            selectedStoryId={selectedStory.id}
            onSelectStory={handleSelectStory}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* RIGHT COLUMN: Master Reader Frame (8 cols on lg) */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-4">
          <StoryReaderFrame
            story={selectedStory}
            paperTheme={paperTheme}
            setPaperTheme={setPaperTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            readerFont={readerFont}
            setReaderFont={setReaderFont}
            isFavorite={favoriteIds.includes(selectedStory.id)}
            onToggleFavorite={handleToggleFavorite}
            onPrintPdf={handlePrintPdf}
            isPlayingSpeech={isPlayingSpeech}
            isPausedSpeech={isPausedSpeech}
            currentParagraphIndex={currentParagraphIndex}
            onStartReading={() => offlineSpeech.startReadingStory(selectedStory.content, currentParagraphIndex)}
            onPauseReading={() => offlineSpeech.pause()}
            onResumeReading={() => offlineSpeech.resume()}
            onJumpToParagraph={(idx) => {
              if (!isPlayingSpeech) {
                offlineSpeech.startReadingStory(selectedStory.content, idx);
              } else {
                offlineSpeech.skipToParagraph(idx);
              }
            }}
            onDeleteCustomStory={selectedStory.isCustom ? handleDeleteCustomStory : undefined}
          />
        </div>

      </main>

      {/* --- BEDTIME AUDIO BAR (100% OFFLINE SPEECH CONTROLS) --- */}
      <BedtimeAudioBar
        currentStoryTitle={selectedStory.title}
        totalParagraphs={totalParagraphs}
        currentParagraphIndex={currentParagraphIndex}
        isPlaying={isPlayingSpeech}
        isPaused={isPausedSpeech}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        onPlay={() => offlineSpeech.startReadingStory(selectedStory.content, currentParagraphIndex)}
        onPause={() => offlineSpeech.pause()}
        onResume={() => offlineSpeech.resume()}
        onStop={() => offlineSpeech.stop()}
        onNextStory={handleNextStory}
        hasMultipleStories={filteredStories.length > 1}
        autoPlayNext={autoPlayNext}
        onToggleAutoPlayNext={() => setAutoPlayNext(!autoPlayNext)}
        sleepTimerMinutes={sleepTimerMinutes}
        onSetSleepTimer={setSleepTimerMinutes}
        sleepTimerRemainingSeconds={sleepTimerRemainingSeconds}
        speechMode={speechMode}
        onSetSpeechMode={setSpeechMode}
      />

      {/* --- MODAL: ADD CUSTOM STORY --- */}
      <AddStoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStory={handleAddCustomStory}
      />

      {/* --- MODAL: APP INFO & ABOUT --- */}
      {showAppInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#faf6ee] rounded-3xl shadow-2xl max-w-md w-full border-4 border-amber-300 p-6 relative">
            <button
              onClick={() => setShowAppInfo(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 p-1"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3 text-amber-900">
              <Sparkles className="text-amber-600" />
              <h3 className="text-lg font-bold">Giới Thiệu Ứng Dụng</h3>
            </div>
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong>ĐỌC TRUYỆN CỔ THIẾU NHI</strong> là ứng dụng đọc và kể truyện cổ tích hoàn toàn
                <strong> offline</strong>, không cần kết nối mạng hay khóa API.
              </p>
              <div className="bg-amber-100/80 p-3 rounded-xl border border-amber-200 space-y-1">
                <p>🌿 <strong>Màu chủ đạo khung văn bản nền:</strong> Khung viền sách cổ tích hoa văn tinh xảo, màu giấy ngà hoàng gia, kem ấm áp và lá trúc bảo vệ mắt bé và ba mẹ khi đọc đêm.</p>
                <p>🗣️ <strong>Giọng đọc Offline:</strong> Sử dụng công nghệ tổng hợp giọng nói trực tiếp trên thiết bị (Web Speech API) và đèn soi từng đoạn văn sinh động.</p>
                <p>🎶 <strong>Âm thanh ru bé ngủ:</strong> Tích hợp tiếng đàn hạc và tiếng mưa ru ngủ nhẹ nhàng không cần tải nhạc.</p>
                <p>✏️ <strong>Tự thêm truyện:</strong> Ba mẹ có thể thêm câu chuyện của riêng mình và lưu trữ vĩnh viễn trên máy.</p>
                <p className="pt-1.5 text-amber-900 font-bold border-t border-amber-300/60">
                  👨‍💻 <strong>Tác giả phần mềm:</strong> Lê Hòa Hiệp - 0983.676.470
                </p>
              </div>
              <p className="text-[11px] text-stone-500 text-center pt-2 border-t border-amber-200">
                Chúc các bé và gia đình có những giờ phút đọc truyện cổ tích thật êm đềm và bổ ích!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#3e271a] text-amber-200/90 py-6 mt-6 border-t-2 border-amber-700/50 text-center text-xs">
        <div className="container mx-auto px-4 space-y-2">
          <p className="font-bold text-amber-100 font-serif-story text-sm sm:text-base">
            ĐỌC TRUYỆN CỔ THIẾU NHI • Kho Tàng Truyện Cổ Tích Offline
          </p>
          <div className="inline-block bg-amber-950/70 border border-amber-400/40 rounded-xl px-4 py-1.5 shadow-sm">
            <p className="text-amber-200 font-bold text-xs sm:text-sm">
              Tác giả phần mềm: Lê Hòa Hiệp - 0983.676.470
            </p>
          </div>
          <p className="text-[11px] text-amber-300/70">
            Khung văn bản nền giấy ấm áp • Đọc truyện không cần API • Bảo vệ mắt trẻ thơ
          </p>
        </div>
      </footer>

    </div>
  );
}