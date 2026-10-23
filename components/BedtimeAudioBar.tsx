import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Square, SkipForward, Volume2, Clock, 
  Music, Sparkles, Moon, Sun, Settings2, ShieldCheck, ChevronUp, ChevronDown,
  VolumeX, Check, AlertCircle, Headphones, HardDriveDownload
} from 'lucide-react';
import { VoiceOption } from '../types';
import { SLEEP_TIMER_OPTIONS } from '../constants';
import { universalSpeech, bedtimeSound, VoiceInfo } from '../utils/offlineSpeech';

interface BedtimeAudioBarProps {
  currentStoryTitle: string;
  totalParagraphs: number;
  currentParagraphIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  selectedVoice: VoiceOption;
  onSelectVoice: (voice: VoiceOption) => void;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onNextStory: () => void;
  hasMultipleStories: boolean;
  autoPlayNext: boolean;
  onToggleAutoPlayNext: () => void;
  sleepTimerMinutes: number;
  onSetSleepTimer: (minutes: number) => void;
  sleepTimerRemainingSeconds: number | null;
  speechMode: 'bundled' | 'device' | 'natural';
  onSetSpeechMode: (mode: 'bundled' | 'device' | 'natural') => void;
  onOpenVoiceSettings: () => void;
  selectedDeviceVoiceURI: string;
  onSelectDeviceVoiceURI: (uri: string) => void;
}

export const BedtimeAudioBar: React.FC<BedtimeAudioBarProps> = ({
  currentStoryTitle,
  totalParagraphs,
  currentParagraphIndex,
  isPlaying,
  isPaused,
  selectedVoice,
  onSelectVoice,
  onPlay,
  onPause,
  onResume,
  onStop,
  onNextStory,
  hasMultipleStories,
  autoPlayNext,
  onToggleAutoPlayNext,
  sleepTimerMinutes,
  onSetSleepTimer,
  sleepTimerRemainingSeconds,
  speechMode,
  onSetSpeechMode,
  onOpenVoiceSettings,
  selectedDeviceVoiceURI,
  onSelectDeviceVoiceURI,
}) => {
  const [readingSpeed, setReadingSpeed] = useState<number>(1.0);
  const [ambientSound, setAmbientSound] = useState<'harp' | 'rain' | 'off'>('off');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [deviceVoices, setDeviceVoices] = useState<VoiceInfo[]>([]);

  useEffect(() => {
    universalSpeech.loadDeviceVoices();
    const voices = universalSpeech.getDeviceVoices();
    setDeviceVoices(voices);

    const vn = voices.filter(v => v.isVietnamese);
    if (vn.length > 0 && !selectedDeviceVoiceURI) {
      onSelectDeviceVoiceURI(vn[0].voiceURI || vn[0].name);
    }
  }, [selectedDeviceVoiceURI, onSelectDeviceVoiceURI]);

  const handleSpeedChange = (speed: number) => {
    setReadingSpeed(speed);
    universalSpeech.updateSettings({ rate: speed });
  };

  const handleModeChange = (mode: 'bundled' | 'device' | 'natural') => {
    onSetSpeechMode(mode);
    universalSpeech.updateSettings({ mode });
    localStorage.setItem('preferred_speech_mode', mode);
  };

  const handleDeviceVoiceSelect = (voiceURI: string) => {
    onSelectDeviceVoiceURI(voiceURI);
    universalSpeech.updateSettings({ deviceVoiceURI: voiceURI });
  };

  const handleToggleAmbient = (type: 'harp' | 'rain') => {
    const next = bedtimeSound.toggleMusic(type);
    setAmbientSound(next);
  };

  const handleTestVoice = () => {
    universalSpeech.testVoiceSample(speechMode, selectedDeviceVoiceURI);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = totalParagraphs > 0 
    ? Math.min(100, Math.round(((currentParagraphIndex + 1) / totalParagraphs) * 100))
    : 0;

  const vnDeviceVoices = deviceVoices.filter(v => v.isVietnamese);

  const modeBadge = () => {
    if (speechMode === 'bundled') {
      return (
        <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1 font-semibold">
          <HardDriveDownload size={11} className="text-emerald-400" />
          <span>Giọng Sẵn Trong Nguồn (100% Offline)</span>
        </span>
      );
    }
    if (speechMode === 'device') {
      return (
        <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1 font-semibold">
          <Headphones size={11} className="text-amber-400" />
          <span>Giọng Thiết Bị (Web Speech)</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] bg-sky-950/80 text-sky-300 px-2 py-0.5 rounded-md border border-sky-500/30 flex items-center gap-1 font-semibold">
        <Headphones size={11} className="text-sky-400" />
        <span>Giọng Trực Tuyến</span>
      </span>
    );
  };

  return (
    <div className="sticky bottom-3 z-30 max-w-4xl mx-auto w-full px-2 sm:px-4 transition-all duration-300 font-quicksand">
      <div className="bg-[#2a170e]/95 backdrop-blur-md text-amber-50 rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-amber-500/50">
        
        {/* Main Controls Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Play/Pause & Title info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                if (isPlaying) {
                  if (isPaused) onResume();
                  else onPause();
                } else {
                  onPlay();
                }
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-900 flex items-center justify-center shadow-lg hover:brightness-110 active:scale-95 transition-all flex-shrink-0"
              title={isPlaying && !isPaused ? "Tạm dừng" : "Đọc truyện Tiếng Việt"}
            >
              {isPlaying && !isPaused ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {isPlaying && (
              <button
                onClick={onStop}
                className="w-8 h-8 rounded-full bg-stone-800 text-amber-200 hover:bg-stone-700 flex items-center justify-center transition-all flex-shrink-0"
                title="Dừng đọc"
              >
                <Square size={14} fill="currentColor" />
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {isPlaying ? (isPaused ? "Đang tạm dừng" : "Đang kể Tiếng Việt") : "Sẵn sàng đọc"}
                </span>

                {modeBadge()}

                {sleepTimerRemainingSeconds !== null && sleepTimerRemainingSeconds > 0 && (
                  <span className="text-[10px] text-amber-300 flex items-center gap-1 bg-amber-900/40 px-1.5 py-0.5 rounded">
                    <Clock size={10} /> {formatTimer(sleepTimerRemainingSeconds)}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-amber-100 truncate mt-1">
                {currentStoryTitle || "Chọn truyện để đọc"}
              </h4>
            </div>
          </div>

          {/* Quick Voice & Ambient Toggles */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto">
            {/* Ambient sound */}
            <div className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-2xl border border-amber-500/20">
              <button
                onClick={() => handleToggleAmbient('harp')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  ambientSound === 'harp' 
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm' 
                    : 'text-amber-200 hover:text-white'
                }`}
                title="Tiếng đàn hạc ru bé ngủ"
              >
                <Music size={13} />
                <span className="hidden md:inline">Đàn hạc</span>
              </button>
              <button
                onClick={() => handleToggleAmbient('rain')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  ambientSound === 'rain' 
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm' 
                    : 'text-amber-200 hover:text-white'
                }`}
                title="Tiếng mưa êm dịu"
              >
                <span>🌧️</span>
                <span className="hidden md:inline">Tiếng mưa</span>
              </button>
            </div>

            {/* Offline Voice Settings Button */}
            <button
              onClick={onOpenVoiceSettings}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                speechMode === 'bundled'
                  ? 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-500/40'
                  : 'bg-amber-800/80 hover:bg-amber-700 text-amber-200 border-amber-500/40'
              }`}
              title="Cài đặt nguồn giọng nói & kiểm tra giọng offline"
            >
              <Volume2 size={14} className={speechMode === 'bundled' ? "text-emerald-400" : "text-amber-400"} />
              <span className="hidden sm:inline">
                {speechMode === 'bundled' ? 'Giọng Sẵn Offline' : 'Cài Đặt Giọng'}
              </span>
              <span className="sm:hidden">Giọng</span>
            </button>

            {/* Test Voice Quick Button */}
            <button
              onClick={handleTestVoice}
              className="px-2.5 py-1.5 rounded-xl bg-amber-700/60 hover:bg-amber-600 text-amber-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-amber-500/30"
              title="Nghe thử một câu mẫu bằng Tiếng Việt"
            >
              <span>Thử giọng</span>
            </button>

            {/* Next Story */}
            {hasMultipleStories && (
              <button
                onClick={onNextStory}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 transition-all flex items-center gap-1 text-xs font-medium"
                title="Chuyển sang truyện tiếp theo"
              >
                <SkipForward size={16} />
              </button>
            )}

            {/* Settings Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                isExpanded ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
              }`}
              title="Tùy chọn chế độ giọng đọc & hẹn giờ ngủ"
            >
              <Settings2 size={16} />
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Scrubber / Progress Bar */}
        <div className="mt-2.5 pt-2 border-t border-amber-500/20">
          <div className="flex items-center justify-between text-[11px] text-amber-300/80 mb-1">
            <span>Tiến độ đọc: Đoạn {Math.min(currentParagraphIndex + 1, totalParagraphs)} / {totalParagraphs}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-600 to-amber-300 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Expanded Controls Drawer */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-amber-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fadeIn">
            
            {/* Speech Mode Toggle (Crucial Fix for Vietnamese reading) */}
            <div className="space-y-2">
              <span className="font-bold text-amber-300 block flex items-center gap-1">
                🗣️ Chọn Nguồn Giọng Tiếng Việt:
              </span>

              <div className="space-y-1.5">
                {/* Mode 1: Bundled (DEFAULT) */}
                <button
                  onClick={() => handleModeChange('bundled')}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all flex flex-col ${
                    speechMode === 'bundled'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md'
                      : 'bg-stone-900/60 text-amber-200 border-amber-500/20 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>🌟 Giọng Thu Sẵn Trong Source (100% Offline)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-100 font-normal">
                      Mặc định
                    </span>
                  </div>
                  <span className={`text-[10px] mt-0.5 ${speechMode === 'bundled' ? 'text-stone-900' : 'text-amber-300/70'}`}>
                    Có sẵn trong mã nguồn. 100% không cần mạng, không bao giờ treo, phát âm chuẩn truyền cảm.
                  </span>
                </button>

                {/* Mode 2: Device Synth */}
                <button
                  onClick={() => handleModeChange('device')}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all flex flex-col ${
                    speechMode === 'device'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md'
                      : 'bg-stone-900/60 text-amber-200 border-amber-500/20 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>📱 Giọng Máy Thiết Bị (Web Speech)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700 text-amber-100 font-normal">
                      {vnDeviceVoices.length > 0 ? `${vnDeviceVoices.length} giọng VN` : 'Cần gói giọng'}
                    </span>
                  </div>
                  <span className={`text-[10px] mt-0.5 ${speechMode === 'device' ? 'text-stone-900' : 'text-amber-300/70'}`}>
                    Sử dụng công nghệ tổng hợp giọng nói của máy (Windows/Android/iOS).
                  </span>
                </button>

                {/* Mode 3: Natural Online */}
                <button
                  onClick={() => handleModeChange('natural')}
                  className={`w-full p-2 rounded-xl text-left border transition-all flex flex-col ${
                    speechMode === 'natural'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md'
                      : 'bg-stone-900/60 text-amber-200 border-amber-500/20 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>🌐 Giọng Trực Tuyến</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700 text-amber-100 font-normal">
                      Cần mạng
                    </span>
                  </div>
                  <span className={`text-[10px] mt-0.5 ${speechMode === 'natural' ? 'text-stone-900' : 'text-amber-300/70'}`}>
                    Tự động chuyển sang giọng sẵn nếu mất mạng.
                  </span>
                </button>
              </div>

              {/* If device mode chosen, show device voices dropdown */}
              {speechMode === 'device' && (
                <div className="mt-2 pt-2 border-t border-amber-500/20">
                  <label className="text-[10px] text-amber-300 font-semibold mb-1 block">
                    Chọn giọng máy cụ thể:
                  </label>
                  {deviceVoices.length > 0 ? (
                    <select
                      value={selectedDeviceVoiceURI}
                      onChange={(e) => handleDeviceVoiceSelect(e.target.value)}
                      className="w-full bg-stone-900 text-amber-100 border border-amber-500/40 rounded-xl p-1.5 text-xs focus:outline-none"
                    >
                      {vnDeviceVoices.length > 0 && (
                        <optgroup label="Giọng Tiếng Việt Có Sẵn">
                          {vnDeviceVoices.map(v => (
                            <option key={v.id} value={v.voiceURI || v.name}>
                              🇻🇳 {v.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label="Tất Cả Giọng Trên Máy">
                        {deviceVoices.map(v => (
                          <option key={v.id} value={v.voiceURI || v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  ) : (
                    <p className="text-[10px] text-amber-400 italic">
                      Đang tìm giọng máy...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Reading Speed & Auto Play */}
            <div>
              <span className="font-bold text-amber-300 block mb-1.5 flex items-center gap-1">
                ⚡ Tốc Độ Kể Chuyện:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '0.8x Chậm', val: 0.8 },
                  { label: '1.0x Chuẩn', val: 1.0 },
                  { label: '1.2x Vui', val: 1.2 },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => handleSpeedChange(s.val)}
                    className={`py-2 rounded-xl font-bold text-center transition-all ${
                      readingSpeed === s.val
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-stone-900/60 text-amber-200 hover:bg-stone-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Continuous Auto Read */}
              <div className="mt-3 pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-amber-200">Đọc liên tục toàn bộ:</span>
                <button
                  onClick={onToggleAutoPlayNext}
                  className={`px-3 py-1 rounded-full font-bold transition-all text-[11px] ${
                    autoPlayNext ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {autoPlayNext ? 'Bật (Tự chuyển)' : 'Tắt'}
                </button>
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  onClick={handleTestVoice}
                  className="w-full py-1.5 bg-amber-800/60 hover:bg-amber-700 text-amber-200 hover:text-white rounded-xl font-bold text-center border border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Volume2 size={14} />
                  <span>Nghe Thử Giọng Tiếng Việt</span>
                </button>
              </div>
            </div>

            {/* Sleep Timer */}
            <div>
              <span className="font-bold text-amber-300 block mb-1.5 flex items-center gap-1">
                <Moon size={14} className="text-amber-300" /> Hẹn Giờ Ru Bé Ngủ:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SLEEP_TIMER_OPTIONS.map((opt) => (
                  <button
                    key={opt.minutes}
                    onClick={() => onSetSleepTimer(opt.minutes)}
                    className={`py-1.5 px-2 rounded-xl font-bold transition-all text-center ${
                      sleepTimerMinutes === opt.minutes
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-stone-900/60 text-amber-200 hover:bg-stone-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300/80 bg-stone-900/40 p-2 rounded-xl">
                <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
                <span>Hoạt động hoàn toàn Offline. Giọng đọc Tiếng Việt ấm áp sẵn trong nguồn.</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default BedtimeAudioBar;
