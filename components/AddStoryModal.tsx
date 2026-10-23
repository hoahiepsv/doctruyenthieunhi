import React, { useState } from 'react';
import { X, Plus, BookOpen, Sparkles, Feather } from 'lucide-react';
import { Story } from '../types';

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (story: Story) => void;
}

export const AddStoryModal: React.FC<AddStoryModalProps> = ({
  isOpen,
  onClose,
  onAddStory
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moral, setMoral] = useState('');
  const [category, setCategory] = useState<Story['category']>('Custom');
  const [author, setAuthor] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập tên truyện và nội dung câu chuyện!');
      return;
    }

    const words = content.trim().split(/\s+/).length;
    const estReadingTime = Math.max(1, Math.round(words / 150));

    const newStory: Story = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      moral: moral.trim() || 'Bài học ý nghĩa về tình yêu thương và lẽ phải.',
      category: category,
      author: author.trim() || 'Sưu tầm',
      readingTimeMinutes: estReadingTime,
      iconEmoji: emoji || '📖',
      isCustom: true,
      difficulty: 'Ý nghĩa',
      ageRange: 'Mọi lứa tuổi',
      createdAt: new Date().toISOString()
    };

    onAddStory(newStory);
    onClose();
    // Reset form
    setTitle('');
    setContent('');
    setMoral('');
    setAuthor('');
    setError('');
  };

  const sampleEmojis = ['✨', '🌟', '🦄', '🐲', '🧚‍♀️', '🦁', '🦉', '🎋', '🌺', '🍎', '🌈', '👑'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#faf6ee] rounded-3xl shadow-2xl max-w-xl w-full border-4 border-amber-300 p-6 relative max-h-[90vh] overflow-y-auto font-quicksand">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 text-stone-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-4 text-amber-900 border-b border-amber-200 pb-3">
          <Feather size={24} className="text-amber-700" />
          <div>
            <h3 className="text-xl font-bold">Thêm Câu Chuyện Mới</h3>
            <p className="text-xs text-amber-800">Lưu trữ offline trực tiếp vào kho truyện của bạn</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Emoji */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tên câu chuyện: *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Chuyện Chú Thỏ Thông Minh..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Biểu tượng:
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-12 text-center text-xl py-1.5 rounded-xl border border-amber-300 bg-white"
                  maxLength={2}
                />
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                  {sampleEmojis.slice(0, 4).map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className="text-sm hover:scale-125 transition-transform"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Thể loại:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Story['category'])}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-300 bg-white text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Custom">Truyện Tự Thêm (Offline)</option>
                <option value="Vietnam">Cổ Tích Việt Nam</option>
                <option value="World">Truyện Cổ Tích Thế Giới</option>
                <option value="Fables">Truyện Ngụ Ngôn</option>
                <option value="Asia">Cổ Tích Á Đông</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tác giả / Kể bởi:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ví dụ: Mẹ kể cho bé, Sưu tầm..."
                className="w-full px-3 py-2.5 rounded-xl border border-amber-300 bg-white text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Story Content */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nội dung câu chuyện (chia thành các đoạn văn để bé tiện theo dõi): *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ngày xửa ngày xưa, tại một khu rừng nọ..."
              rows={8}
              className="w-full p-3.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed text-stone-800 resize-y"
              required
            />
          </div>

          {/* Moral Lesson */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Bài học ý nghĩa cho bé:
            </label>
            <input
              type="text"
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              placeholder="Ví dụ: Giúp đỡ bạn bè khi hoạn nạn, luôn trung thực..."
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 font-bold text-sm transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Lưu Truyện Offline</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddStoryModal;
