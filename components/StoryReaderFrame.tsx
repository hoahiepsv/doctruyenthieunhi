import React, { useState, useRef } from 'react';
import { 
  Sparkles, BookOpen, Star, BookmarkCheck, Printer, Copy, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, Type, Sun, Moon,
  Volume2, Pause, Play, Check, Heart, Feather, Compass
} from 'lucide-react';
import { Story, PaperTheme, FontSize, LineHeight, ReaderFont } from '../types';

interface StoryReaderFrameProps {
  story: Story;
  paperTheme: PaperTheme;
  setPaperTheme: (theme: PaperTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  lineHeight: LineHeight;
  setLineHeight: (lh: LineHeight) => void;
  readerFont: ReaderFont;
  setReaderFont: (f: ReaderFont) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPrintPdf: () => void;
  // Speech status
  isPlayingSpeech: boolean;
  isPausedSpeech: boolean;
  currentParagraphIndex: number;
  onStartReading: () => void;
  onPauseReading: () => void;
  onResumeReading: () => void;
  onJumpToParagraph: (idx: number) => void;
  onDeleteCustomStory?: (id: string) => void;
}

export const StoryReaderFrame: React.FC<StoryReaderFrameProps> = ({
  story,
  paperTheme,
  setPaperTheme,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  readerFont,
  setReaderFont,
  isFavorite,
  onToggleFavorite,
  onPrintPdf,
  isPlayingSpeech,
  isPausedSpeech,
  currentParagraphIndex,
  onStartReading,
  onPauseReading,
  onResumeReading,
  onJumpToParagraph,
  onDeleteCustomStory,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Split into paragraphs for reading tracking
  const paragraphs = story.content
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Font size classes
  const fontSizeClasses: Record<FontSize, string> = {
    small: 'text-base sm:text-lg',
    medium: 'text-lg sm:text-xl',
    large: 'text-xl sm:text-2xl',
    xlarge: 'text-2xl sm:text-3xl'
  };

  // Line height classes
  const lineHeightClasses: Record<LineHeight, string> = {
    normal: 'leading-normal space-y-4',
    relaxed: 'leading-relaxed space-y-6',
    loose: 'leading-loose space-y-8'
  };

  // Theme styling
  const themeStyles: Record<PaperTheme, {
    outerBg: string;
    frameBg: string;
    borderOuter: string;
    borderInner: string;
    textColor: string;
    titleColor: string;
    metaColor: string;
    highlightBg: string;
    cornerColor: string;
    badgeBg: string;
  }> = {
    parchment: {
      outerBg: 'bg-[#f7f2e7]',
      frameBg: 'paper-parchment',
      borderOuter: 'border-[#c9b48f]',
      borderInner: 'border-[#d8c5a2]',
      textColor: 'text-[#2b2118]',
      titleColor: 'text-[#5c2e0b]',
      metaColor: 'text-[#7a6249]',
      highlightBg: 'bg-amber-100/70 border-l-4 border-amber-600 shadow-sm',
      cornerColor: '#966838',
      badgeBg: 'bg-[#ebd9bd] text-[#59391a]',
    },
    cream: {
      outerBg: 'bg-[#faf7f2]',
      frameBg: 'paper-cream',
      borderOuter: 'border-[#e4d7c5]',
      borderInner: 'border-[#ede2d2]',
      textColor: 'text-[#332a22]',
      titleColor: 'text-[#78350f]',
      metaColor: 'text-[#856b54]',
      highlightBg: 'bg-amber-50 border-l-4 border-amber-500 shadow-sm',
      cornerColor: '#a78256',
      badgeBg: 'bg-[#f1e6d4] text-[#634527]',
    },
    sage: {
      outerBg: 'bg-[#eef5ee]',
      frameBg: 'paper-sage',
      borderOuter: 'border-[#b6cfb7]',
      borderInner: 'border-[#cce0cc]',
      textColor: 'text-[#1e2f20]',
      titleColor: 'text-[#1b4324]',
      metaColor: 'text-[#4e6b52]',
      highlightBg: 'bg-emerald-50 border-l-4 border-emerald-600 shadow-sm',
      cornerColor: '#436d47',
      badgeBg: 'bg-[#d7e9d8] text-[#1c4823]',
    },
    night: {
      outerBg: 'bg-[#111620]',
      frameBg: 'paper-night',
      borderOuter: 'border-[#2d3a4f]',
      borderInner: 'border-[#394a63]',
      textColor: 'text-[#e2e8f0]',
      titleColor: 'text-[#fef08a]',
      metaColor: 'text-[#94a3b8]',
      highlightBg: 'bg-slate-800/80 border-l-4 border-amber-400 shadow-md',
      cornerColor: '#eab308',
      badgeBg: 'bg-[#222f42] text-[#fcd34d]',
    }
  };

  const currentTheme = themeStyles[paperTheme];

  const toggleFullscreen = () => {
    if (!readerContainerRef.current) return;
    if (!isFullscreen) {
      if (readerContainerRef.current.requestFullscreen) {
        readerContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleCopyStory = () => {
    const fullText = `${story.title}\n${story.moral ? `Bài học: ${story.moral}\n\n` : '\n'}${story.content}`;
    navigator.clipboard.writeText(fullText);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  return (
    <div 
      ref={readerContainerRef}
      className={`relative flex flex-col rounded-3xl transition-all duration-300 ${currentTheme.outerBg} ${isFullscreen ? 'p-4 md:p-8 min-h-screen z-50 overflow-y-auto' : 'p-3 sm:p-5 shadow-xl'}`}
    >
      {/* --- TOP CONTROL BAR: KHUNG VĂN BẢN NỀN & TYPOGRAPHY --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-amber-200/50">
        
        {/* Paper Theme Selectors */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 p-1 rounded-2xl">
          <span className="text-xs font-bold px-2 text-stone-600 dark:text-stone-300 hidden sm:inline">
            Khung nền:
          </span>
          <button
            onClick={() => setPaperTheme('parchment')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              paperTheme === 'parchment'
                ? 'bg-[#eddcb9] text-[#503417] shadow-sm font-bold ring-2 ring-[#9e7a4d]'
                : 'text-stone-700 hover:bg-stone-200/60'
            }`}
            title="Nền giấy ngà cổ tích (bảo vệ mắt)"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-[#f3e7ce] border border-[#a18155] inline-block" />
            <span>Giấy ngà</span>
          </button>

          <button
            onClick={() => setPaperTheme('cream')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              paperTheme === 'cream'
                ? 'bg-[#f5e9d9] text-[#553b1b] shadow-sm font-bold ring-2 ring-[#a8865c]'
                : 'text-stone-700 hover:bg-stone-200/60'
            }`}
            title="Nền kem ấm áp"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-[#fdfbf7] border border-[#d6c4ad] inline-block" />
            <span>Kem ấm</span>
          </button>

          <button
            onClick={() => setPaperTheme('sage')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              paperTheme === 'sage'
                ? 'bg-[#d8ebd9] text-[#1e4a25] shadow-sm font-bold ring-2 ring-[#4d8656]'
                : 'text-stone-700 hover:bg-stone-200/60'
            }`}
            title="Nền lá trúc dịu mắt"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-[#e3efe3] border border-[#85b589] inline-block" />
            <span>Lá trúc</span>
          </button>

          <button
            onClick={() => setPaperTheme('night')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              paperTheme === 'night'
                ? 'bg-[#293649] text-amber-200 shadow-sm font-bold ring-2 ring-amber-400'
                : 'text-stone-700 hover:bg-stone-200/60'
            }`}
            title="Nền trời đêm ru ngủ"
          >
            <Moon size={14} className="text-amber-300" />
            <span>Đêm sao</span>
          </button>
        </div>

        {/* Font controls & Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Family Toggle */}
          <div className="flex bg-black/5 p-1 rounded-xl">
            <button
              onClick={() => setReaderFont('serif')}
              className={`px-2 py-1 text-xs rounded-lg font-serif-story font-bold transition-all ${
                readerFont === 'serif' ? 'bg-white shadow text-amber-900' : 'text-stone-600 hover:text-black'
              }`}
              title="Chữ cổ tích (Serif)"
            >
              Chữ Sách
            </button>
            <button
              onClick={() => setReaderFont('sans')}
              className={`px-2 py-1 text-xs rounded-lg font-sans-story font-bold transition-all ${
                readerFont === 'sans' ? 'bg-white shadow text-amber-900' : 'text-stone-600 hover:text-black'
              }`}
              title="Chữ hiện đại (Quicksand)"
            >
              Chữ Tròn
            </button>
          </div>

          {/* Font Size controls */}
          <div className="flex items-center bg-black/5 p-1 rounded-xl gap-1">
            <button
              onClick={() => {
                if (fontSize === 'xlarge') setFontSize('large');
                else if (fontSize === 'large') setFontSize('medium');
                else if (fontSize === 'medium') setFontSize('small');
              }}
              className="p-1 rounded-lg text-stone-600 hover:bg-white/70 transition-colors"
              title="Giảm kích thước chữ"
              disabled={fontSize === 'small'}
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-bold text-stone-700 px-1 uppercase tracking-tight">
              {fontSize === 'small' ? 'A-' : fontSize === 'medium' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
            </span>
            <button
              onClick={() => {
                if (fontSize === 'small') setFontSize('medium');
                else if (fontSize === 'medium') setFontSize('large');
                else if (fontSize === 'large') setFontSize('xlarge');
              }}
              className="p-1 rounded-lg text-stone-600 hover:bg-white/70 transition-colors"
              title="Tăng kích thước chữ (dễ đọc cho bé)"
              disabled={fontSize === 'xlarge'}
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(story.id)}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              isFavorite 
                ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-500' 
                : 'bg-white/80 text-stone-700 hover:bg-white shadow-sm'
            }`}
            title={isFavorite ? "Đã lưu vào danh sách yêu thích" : "Thêm vào truyện yêu thích của bé"}
          >
            <Star size={16} className={isFavorite ? "fill-amber-950" : ""} />
            <span className="hidden sm:inline">{isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
          </button>

          {/* Copy Story */}
          <button
            onClick={handleCopyStory}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-all"
            title="Sao chép nội dung truyện"
          >
            {showCopiedToast ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          </button>

          {/* Print/Download formatted PDF */}
          <button
            onClick={onPrintPdf}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-rose-700 shadow-sm transition-all"
            title="In / Tải trang sách PDF (có khung viền nghệ thuật)"
          >
            <Printer size={16} />
          </button>

          {/* Fullscreen / Zen Reading Mode */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-all"
            title={isFullscreen ? "Thu nhỏ cửa sổ" : "Mở rộng toàn màn hình (chế độ đọc sách)"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* --- THE MASTER STORY FRAME ("KHUNG VĂN BẢN NỀN") --- */}
      <div 
        id="story-printable-container"
        className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 border-4 ${currentTheme.borderOuter} ${currentTheme.frameBg} storybook-frame transition-colors duration-300`}
      >
        {/* Inner Ornamental Double Border */}
        <div className={`absolute inset-2 sm:inset-3 border-2 ${currentTheme.borderInner} rounded-xl sm:rounded-2xl pointer-events-none opacity-80`} />

        {/* Vintage Corner Flourishes (SVG Ornaments) */}
        {/* Top-Left */}
        <svg className="absolute top-4 left-4 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none opacity-60" viewBox="0 0 100 100">
          <path d="M5,5 L45,5 C25,15 15,25 5,45 Z" fill={currentTheme.cornerColor} />
          <circle cx="18" cy="18" r="4" fill={currentTheme.cornerColor} />
          <path d="M8,8 L32,8 M8,8 L8,32" stroke={currentTheme.cornerColor} strokeWidth="3" fill="none" />
        </svg>

        {/* Top-Right */}
        <svg className="absolute top-4 right-4 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none opacity-60" viewBox="0 0 100 100">
          <path d="M95,5 L55,5 C75,15 85,25 95,45 Z" fill={currentTheme.cornerColor} />
          <circle cx="82" cy="18" r="4" fill={currentTheme.cornerColor} />
          <path d="M92,8 L68,8 M92,8 L92,32" stroke={currentTheme.cornerColor} strokeWidth="3" fill="none" />
        </svg>

        {/* Bottom-Left */}
        <svg className="absolute bottom-4 left-4 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none opacity-60" viewBox="0 0 100 100">
          <path d="M5,95 L45,95 C25,85 15,75 5,55 Z" fill={currentTheme.cornerColor} />
          <circle cx="18" cy="82" r="4" fill={currentTheme.cornerColor} />
          <path d="M8,92 L32,92 M8,92 L8,68" stroke={currentTheme.cornerColor} strokeWidth="3" fill="none" />
        </svg>

        {/* Bottom-Right */}
        <svg className="absolute bottom-4 right-4 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none opacity-60" viewBox="0 0 100 100">
          <path d="M95,95 L55,95 C75,85 85,75 95,55 Z" fill={currentTheme.cornerColor} />
          <circle cx="82" cy="82" r="4" fill={currentTheme.cornerColor} />
          <path d="M92,92 L68,92 M92,92 L92,68" stroke={currentTheme.cornerColor} strokeWidth="3" fill="none" />
        </svg>

        {/* --- STORY HEADER BANNER --- */}
        <div className="relative text-center mb-8 pb-6 border-b border-amber-300/40">
          
          {/* Category & Attributes Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm ${currentTheme.badgeBg}`}>
              <span>{story.iconEmoji || '📖'}</span>
              <span>
                {story.category === 'Vietnam' ? 'Cổ Tích Việt Nam' :
                 story.category === 'Andersen' ? 'Cổ Tích Andersen' :
                 story.category === 'Grimm' ? 'Cổ Tích Grimm' :
                 story.category === 'Fables' ? 'Truyện Ngụ Ngôn' :
                 story.category === 'Asia' ? 'Cổ Tích Á Đông' :
                 story.category === 'Custom' ? 'Truyện Của Bạn (Offline)' : 'Truyện Cổ Tích Thế Giới'}
              </span>
            </span>

            {story.readingTimeMinutes && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 font-medium text-amber-800 dark:text-amber-300">
                ⏱️ ~{story.readingTimeMinutes} phút đọc
              </span>
            )}

            {story.difficulty && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 font-medium text-emerald-800 dark:text-emerald-300">
                🌱 {story.difficulty}
              </span>
            )}

            {story.isCustom && onDeleteCustomStory && (
              <button
                onClick={() => onDeleteCustomStory(story.id)}
                className="text-xs px-2.5 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all"
                title="Xóa truyện tự thêm này"
              >
                🗑️ Xóa truyện
              </button>
            )}
          </div>

          {/* Story Title */}
          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${currentTheme.titleColor} ${readerFont === 'serif' ? 'font-serif-story' : 'font-sans-story'}`}>
            {story.title}
          </h1>

          {/* Author/Origin subtitle if available */}
          {story.author && (
            <p className={`text-xs sm:text-sm italic mb-2 ${currentTheme.metaColor}`}>
              Tác giả / Nguồn: {story.author}
            </p>
          )}

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 mt-3 text-amber-600/70 dark:text-amber-400">
            <span className="h-px w-12 sm:w-20 bg-current opacity-40"></span>
            <span className="text-base select-none">❦ ✦ ❦</span>
            <span className="h-px w-12 sm:w-20 bg-current opacity-40"></span>
          </div>

          {/* Quick Voice Play Callout Button in Header */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                if (isPlayingSpeech) {
                  if (isPausedSpeech) onResumeReading();
                  else onPauseReading();
                } else {
                  onStartReading();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm"
              title="Đọc truyện offline bằng giọng đọc truyền cảm"
            >
              {isPlayingSpeech && !isPausedSpeech ? (
                <>
                  <Pause size={18} fill="currentColor" />
                  <span>Tạm dừng đọc</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>{isPlayingSpeech && isPausedSpeech ? "Tiếp tục đọc" : "Nghe đọc truyện (Tiếng Việt)"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* --- STORY MAIN CONTENT: PARAGRAPHS WITH SPEECH TRACKING --- */}
        <div 
          className={`story-content-body max-w-3xl mx-auto ${fontSizeClasses[fontSize]} ${lineHeightClasses[lineHeight]} ${currentTheme.textColor} ${readerFont === 'serif' ? 'font-serif-story font-normal' : 'font-sans-story font-medium'}`}
        >
          {paragraphs.map((p, idx) => {
            const isCurrentParagraph = isPlayingSpeech && currentParagraphIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => onJumpToParagraph(idx)}
                className={`relative p-3 rounded-2xl transition-all duration-300 cursor-pointer group ${
                  isCurrentParagraph 
                    ? `${currentTheme.highlightBg} ring-2 ring-amber-400/50 scale-[1.01]` 
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title="Bấm để giọng đọc chuyển đến đoạn này"
              >
                {/* Active Reading Pin Indicator */}
                {isCurrentParagraph && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 mb-1 select-none">
                    <span className="animate-bounce">✨</span>
                    <span className="uppercase tracking-wider">Đang đọc đoạn này</span>
                  </div>
                )}

                <p className="indent-6 sm:indent-8 text-justify">
                  {p}
                </p>

                {/* Subtle Hover Jump Cue */}
                <span className="absolute right-2 top-2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline select-none">
                  ▶ Đọc từ đây
                </span>
              </div>
            );
          })}
        </div>

        {/* --- DECORATIVE FOOTER DIVIDER --- */}
        <div className="flex items-center justify-center gap-3 my-10 text-amber-600/70 dark:text-amber-400">
          <span className="h-px w-16 sm:w-28 bg-current opacity-40"></span>
          <span className="text-lg select-none">❦ ✦ ❦</span>
          <span className="h-px w-16 sm:w-28 bg-current opacity-40"></span>
        </div>

        {/* --- MORAL LESSON SCROLL (BÀI HỌC Ý NGHĨA CHO BÉ) --- */}
        {story.moral && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-100/90 via-amber-50/95 to-amber-100/90 dark:from-slate-800/90 dark:to-slate-800/90 rounded-2xl p-5 sm:p-6 border-2 border-amber-300 dark:border-amber-500/50 shadow-md">
            <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-bold text-sm sm:text-base">
              <Sparkles size={20} className="text-amber-500" />
              <span className="uppercase tracking-wide">Bài Học Ý Nghĩa Cho Bé:</span>
            </div>
            <p className={`text-base sm:text-lg italic font-semibold text-stone-800 dark:text-stone-200 pl-4 border-l-2 border-amber-400 ${readerFont === 'serif' ? 'font-serif-story' : 'font-sans-story'}`}>
              "{story.moral}"
            </p>
          </div>
        )}

        {/* Watermark in printed storybook */}
        <div className="mt-8 pt-4 border-t border-amber-200/40 text-center text-xs text-stone-400 dark:text-stone-500">
          <span>ĐỌC TRUYỆN CỔ THIẾU NHI • Tác giả phần mềm: Lê Hòa Hiệp - 0983.676.470</span>
        </div>
      </div>
    </div>
  );
};

export default StoryReaderFrame;
