
import React, { useState, useEffect } from 'react';
import { Key, Save, Edit2, Lock, Unlock, Mic2 } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (geminiKey: string, elevenKey: string) => void;
  hasKey: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, hasKey }) => {
  const [isOpen, setIsOpen] = useState(!hasKey);
  const [mode, setMode] = useState<'password' | 'manual'>('password'); // 'password' or 'manual'
  const [passwordInput, setPasswordInput] = useState('');
  
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [elevenKeyInput, setElevenKeyInput] = useState('');
  
  const [error, setError] = useState('');

  const VIP_KEY_GEMINI = "AIzaSyDsYJl1FT3aE73HcfNqWxXu8pI4FgqiVdo";
  const VIP_KEY_ELEVEN = ""; // Leave blank or fill if you have a shared key
  const VIP_PASS = "0983676470";

  useEffect(() => {
    // Check local storage for existing secondary keys
    const storedEleven = localStorage.getItem('eleven_api_key');
    if (storedEleven) setElevenKeyInput(storedEleven);
    
    if (!hasKey) setIsOpen(true);
  }, [hasKey]);

  const handlePasswordSubmit = () => {
    if (passwordInput === VIP_PASS) {
      // For VIP, we can optionally provide an ElevenLabs key if you have one shared
      onSave(VIP_KEY_GEMINI, VIP_KEY_ELEVEN);
      setIsOpen(false);
      setPasswordInput('');
      setError('');
      alert("Kích hoạt bản quyền thành công!");
    } else {
      setError("Mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  const handleManualSave = () => {
    if (geminiKeyInput.trim()) {
      onSave(geminiKeyInput.trim(), elevenKeyInput.trim());
      setIsOpen(false);
    }
  };

  if (!isOpen && hasKey) {
    return (
      <button
        onClick={() => { setIsOpen(true); setMode('password'); }}
        className="fixed bottom-4 left-4 z-50 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
        title="Cấu hình bản quyền"
      >
        <Edit2 size={20} />
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border-t-4 border-blue-600 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 text-blue-700">
          {mode === 'password' ? <Lock size={28} /> : <Key size={28} />}
          <h2 className="text-2xl font-bold font-quicksand">
            {mode === 'password' ? "Kích Hoạt Bản Quyền" : "Cấu Hình API Key"}
          </h2>
        </div>
        
        {/* Password Mode */}
        {mode === 'password' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-gray-600">
              Vui lòng nhập mật khẩu để kích hoạt ứng dụng tự động.
            </p>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu kích hoạt</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg tracking-widest"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <button
              onClick={handlePasswordSubmit}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Unlock size={18} />
              Kích Hoạt Ngay
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              onClick={() => setMode('manual')}
              className="w-full text-sm text-gray-500 hover:text-blue-600 font-medium underline decoration-dotted underline-offset-4"
            >
              Tôi muốn nhập API Key riêng của mình
            </button>
          </div>
        )}

        {/* Manual API Mode */}
        {mode === 'manual' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-gray-600 text-sm mb-4">
              Nhập khóa API để sử dụng các tính năng nâng cao.
            </p>
            
            {/* Gemini Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Google Gemini API Key (Bắt buộc)</label>
              <input
                type="password"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* ElevenLabs Input */}
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
               <label className="block text-sm font-bold text-indigo-800 mb-1 flex items-center gap-2">
                 <Mic2 size={14}/> ElevenLabs API Key (Tùy chọn)
               </label>
               <p className="text-xs text-indigo-600 mb-2">Nhập key này để có giọng đọc "Đọc Ngay" cảm xúc như người thật.</p>
               <input
                type="password"
                value={elevenKeyInput}
                onChange={(e) => setElevenKeyInput(e.target.value)}
                placeholder="xi-api-key..."
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleManualSave}
                disabled={!geminiKeyInput.trim()}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Save size={18} />
                Lưu Cấu Hình
              </button>
              
              <button 
                onClick={() => setMode('password')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Quay lại nhập mật khẩu
              </button>
            </div>
          </div>
        )}

        {/* Close Button if already has key */}
        {hasKey && (
           <button 
             onClick={() => setIsOpen(false)}
             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
           >
             ✕
           </button>
        )}
      </div>
    </div>
  );
};

export default ApiKeyModal;
