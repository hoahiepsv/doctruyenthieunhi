import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, Check, RefreshCw, AlertCircle, Headphones, 
  Monitor, Smartphone, Apple, Globe, Sparkles, Play, Square, ThumbsUp
} from 'lucide-react';
import { universalSpeech, VoiceInfo } from '../utils/offlineSpeech';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceURI: string;
  onSelectVoiceURI: (uri: string) => void;
  speechMode: 'device' | 'natural';
  onSetSpeechMode: (mode: 'device' | 'natural') => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceURI,
  onSelectVoiceURI,
  speechMode,
  onSetSpeechMode,
}) => {
  const [deviceVoices, setDeviceVoices] = useState<VoiceInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'windows' | 'android' | 'ios' | 'chrome'>('windows');
  const [sampleText, setSampleText] = useState('Xin chào các bé! Chúc các bé nghe đọc truyện cổ tích thật vui và ngủ thật ngoan!');
  const [isTesting, setIsTesting] = useState(false);
  const [testSpeed, setTestSpeed] = useState(1.0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const refreshVoices = () => {
    universalSpeech.loadDeviceVoices();
    const voices = universalSpeech.getDeviceVoices();
    setDeviceVoices(voices);

    const vn = voices.filter(v => v.isVietnamese);
    if (vn.length > 0 && !selectedVoiceURI) {
      onSelectVoiceURI(vn[0].voiceURI || vn[0].name);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshVoices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const vnVoices = deviceVoices.filter(v => v.isVietnamese);
  const hasVnVoice = vnVoices.length > 0;

  const handleTestVoice = () => {
    if (isTesting) {
      universalSpeech.stop();
      setIsTesting(false);
      return;
    }

    setIsTesting(true);
    universalSpeech.updateSettings({ rate: testSpeed });
    universalSpeech.testVoiceSample(speechMode, selectedVoiceURI, sampleText);

    // Auto reset testing state after a short duration
    setTimeout(() => {
      setIsTesting(false);
    }, 6000);
  };

  const handleSaveDefault = () => {
    if (selectedVoiceURI) {
      universalSpeech.updateSettings({
        deviceVoiceURI: selectedVoiceURI,
        mode: speechMode,
        rate: testSpeed
      });
      localStorage.setItem('preferred_voice_uri', selectedVoiceURI);
      localStorage.setItem('preferred_speech_mode', speechMode);
    }
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto font-quicksand">
      <div className="bg-[#faf6ee] rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-300 p-5 sm:p-7 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            universalSpeech.stop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-200 text-stone-600 transition-colors"
          title="Đóng"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-200 text-amber-950">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-700">
            <Volume2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif-story">Cài Đặt Giọng Nói Tiếng Việt Offline</h3>
            <p className="text-xs text-amber-800">Cấu hình giọng đọc trên thiết bị & hướng dẫn cài đặt gói giọng nói</p>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className="mb-5">
          {hasVnVoice ? (
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
              <Check size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-950">
                  Tuyệt vời! Đã phát hiện {vnVoices.length} giọng đọc Tiếng Việt offline trên máy bạn
                </p>
                <p className="mt-0.5 text-emerald-800">
                  Bạn có thể chọn giọng đọc mong muốn bên dưới và nghe thử trực tiếp.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-amber-900">
                  Chưa phát hiện gói giọng nói Tiếng Việt offline trên thiết bị này
                </p>
                <p className="mt-0.5 text-amber-800">
                  Đừng lo! Bạn có thể làm theo <strong>hướng dẫn cài đặt 1 phút bên dưới</strong> để tải giọng offline, hoặc chuyển sang chế độ <strong>Giọng Trực Tuyến</strong> để nghe đọc ngay mà không cần cài đặt.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Mode Switcher & Voice Selection */}
        <div className="bg-white/80 rounded-2xl p-4 border border-amber-200/80 mb-5 space-y-4 shadow-sm">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-600" />
            <span>1. Chọn Chế Độ & Giọng Đọc</span>
          </h4>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onSetSpeechMode('device')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                speechMode === 'device'
                  ? 'bg-amber-100/90 border-amber-500 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">📱 Giọng Thiết Bị (Offline 100%)</span>
                {speechMode === 'device' && <Check size={16} className="text-amber-700" />}
              </div>
              <p className="text-[11px] text-stone-600 mt-1">
                Đọc hoàn toàn không cần internet bằng gói giọng của máy.
              </p>
            </button>

            <button
              onClick={() => onSetSpeechMode('natural')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                speechMode === 'natural'
                  ? 'bg-amber-100/90 border-amber-500 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">🌟 Giọng Chuẩn Tự Nhiên (Trực Tuyến)</span>
                {speechMode === 'natural' && <Check size={16} className="text-amber-700" />}
              </div>
              <p className="text-[11px] text-stone-600 mt-1">
                Phát âm chuẩn ngữ điệu mọi thiết bị, không cần cài gói giọng.
              </p>
            </button>
          </div>

          {/* Voice Dropdown if device mode */}
          {speechMode === 'device' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Danh sách giọng nói trên máy:
                </label>
                <button
                  onClick={refreshVoices}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Quét lại giọng</span>
                </button>
              </div>

              {deviceVoices.length > 0 ? (
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => onSelectVoiceURI(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {vnVoices.length > 0 && (
                    <optgroup label="🇻🇳 Giọng Đọc Tiếng Việt Đã Cài Đặt">
                      {vnVoices.map((v) => (
                        <option key={v.id} value={v.voiceURI || v.name}>
                          🇻🇳 {v.name} ({v.lang})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Tất cả các giọng khác trên hệ thống">
                    {deviceVoices.map((v) => (
                      <option key={v.id} value={v.voiceURI || v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-xs">
                  Đang nạp giọng... Bấm nút "Quét lại giọng" hoặc thử lại sau vài giây.
                </div>
              )}
            </div>
          )}

          {/* Voice Tester Box */}
          <div className="pt-2 border-t border-amber-200/60">
            <label className="text-xs font-bold text-stone-700 mb-1 block">
              Câu thử nghiệm phát âm:
            </label>
            <input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 bg-white mb-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-stone-600">Tốc độ:</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={testSpeed}
                  onChange={(e) => setTestSpeed(parseFloat(e.target.value))}
                  className="w-24 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
                />
                <span className="font-bold text-amber-900 w-10">{testSpeed.toFixed(2)}x</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestVoice}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isTesting
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {isTesting ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  <span>{isTesting ? "Dừng thử" : "Nghe thử ngay"}</span>
                </button>

                <button
                  onClick={handleSaveDefault}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <ThumbsUp size={14} />
                  <span>Lưu mặc định</span>
                </button>
              </div>
            </div>

            {showSuccessToast && (
              <p className="mt-2 text-xs font-bold text-emerald-700 text-right animate-fadeIn">
                ✓ Đã lưu cài đặt giọng đọc thành công!
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Step-by-Step Installation Guides */}
        <div className="bg-white/80 rounded-2xl p-4 border border-amber-200/80 space-y-3 shadow-sm">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Monitor size={16} className="text-amber-600" />
            <span>2. Hướng Dẫn Cài Gói Giọng Tiếng Việt Offline (Chỉ cần làm 1 lần)</span>
          </h4>

          {/* OS Navigation Tabs */}
          <div className="flex border-b border-amber-200 gap-1 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('windows')}
              className={`px-3 py-1.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'windows'
                  ? 'bg-amber-200/90 text-amber-950 border-b-2 border-amber-600 font-extrabold'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              <Monitor size={14} />
              <span>Windows 10 / 11</span>
            </button>

            <button
              onClick={() => setActiveTab('android')}
              className={`px-3 py-1.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'android'
                  ? 'bg-amber-200/90 text-amber-950 border-b-2 border-amber-600 font-extrabold'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              <Smartphone size={14} />
              <span>Android (Samsung, Xiaomi, Oppo...)</span>
            </button>

            <button
              onClick={() => setActiveTab('ios')}
              className={`px-3 py-1.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ios'
                  ? 'bg-amber-200/90 text-amber-950 border-b-2 border-amber-600 font-extrabold'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              <Apple size={14} />
              <span>iPhone / iPad / Mac</span>
            </button>

            <button
              onClick={() => setActiveTab('chrome')}
              className={`px-3 py-1.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'chrome'
                  ? 'bg-amber-200/90 text-amber-950 border-b-2 border-amber-600 font-extrabold'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              <Globe size={14} />
              <span>Chrome / Cốc Cốc</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-xs text-stone-700 leading-relaxed pt-2">
            {activeTab === 'windows' && (
              <div className="space-y-2">
                <p className="font-bold text-amber-950">Cách cài giọng Microsoft Hoài My / An trên Windows 10 & 11:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Mở <strong>Cài đặt (Settings)</strong> trên máy tính (nhấn tổ hợp phím <code>Windows + I</code>).</li>
                  <li>Chọn mục <strong>Time & Language (Thời gian & Ngôn ngữ)</strong> ➔ chọn thẻ <strong>Speech (Giọng nói)</strong>.</li>
                  <li>Tại mục <em>Manage voices (Quản lý giọng nói)</em>, nhấn nút <strong>Add voices (Thêm giọng nói)</strong>.</li>
                  <li>Tìm kiếm và chọn <strong>Vietnamese (Tiếng Việt)</strong> ➔ bấm nút <strong>Add (Thêm)</strong>.</li>
                  <li>Chờ máy tính tải về khoảng 30 giây. Sau khi cài xong, quay lại đây bấm <strong>"Quét lại giọng"</strong>, giọng đọc Tiếng Việt offline sẽ xuất hiện ngay!</li>
                </ol>
              </div>
            )}

            {activeTab === 'android' && (
              <div className="space-y-2">
                <p className="font-bold text-amber-950">Cách tải giọng Tiếng Việt của Google trên điện thoại Android:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Mở <strong>Cài đặt (Settings)</strong> trên điện thoại ➔ vào <strong>Quản lý chung</strong> (hoặc <em>Hệ thống</em>).</li>
                  <li>Chọn <strong>Chuyển văn bản thành giọng nói (Text-to-Speech)</strong>.</li>
                  <li>Chọn <em>Công cụ ưu tiên</em> là <strong>Google Text-to-speech</strong> (Dịch vụ lời nói của Google).</li>
                  <li>Bấm vào biểu tượng <strong>Bánh răng cài đặt</strong> cạnh bên ➔ chọn <strong>Cài đặt dữ liệu giọng nói</strong>.</li>
                  <li>Tìm mục <strong>Tiếng Việt</strong> và tải về gói giọng nói miễn phí.</li>
                </ol>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-2">
                <p className="font-bold text-amber-950">Cách tải giọng Tiếng Việt (Linh / Mai) trên iPhone, iPad & Mac:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Vào <strong>Cài đặt (Settings)</strong> ➔ chọn <strong>Trợ năng (Accessibility)</strong>.</li>
                  <li>Chọn mục <strong>Đọc nội dung (Spoken Content)</strong> ➔ chọn <strong>Giọng nói (Voices)</strong>.</li>
                  <li>Tìm chọn <strong>Tiếng Việt (Vietnamese)</strong>.</li>
                  <li>Chọn giọng <strong>Linh</strong> (hoặc <em>Linh Nâng cao</em>) và bấm biểu tượng đám mây để tải về.</li>
                </ol>
              </div>
            )}

            {activeTab === 'chrome' && (
              <div className="space-y-2">
                <p className="font-bold text-amber-950">Đối với trình duyệt Google Chrome hoặc Cốc Cốc trên máy tính:</p>
                <p>
                  Chrome và Cốc Cốc đã tích hợp sẵn giọng đọc <strong>Google Tiếng Việt</strong>. Nếu chưa thấy hiển thị, bạn chỉ cần bấm nút <strong>"Quét lại giọng"</strong> ở trên hoặc đóng mở lại tab trình duyệt để Chrome kích hoạt giọng nói.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-amber-200">
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Tác giả: Lê Hòa Hiệp - 0983.676.470
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                universalSpeech.stop();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-all"
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceSettingsModal;
