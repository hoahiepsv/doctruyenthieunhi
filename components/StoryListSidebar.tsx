import React from 'react';
import { Search, Star, BookOpen, Plus, Sparkles, Filter, Heart } from 'lucide-react';
import { Story } from '../types';
import { CATEGORIES_LIST } from '../data/offlineStories';

interface StoryListSidebarProps {
  stories: Story[];
  selectedStoryId: string | null;
  onSelectStory: (story: Story) => void;
  selectedCategory: Story['category'] | 'All';
  onSelectCategory: (cat: Story['category'] | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onOpenAddModal: () => void;
}

export const StoryListSidebar: React.FC<StoryListSidebarProps> = ({
  stories,
  selectedStoryId,
  onSelectStory,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoriteIds,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  return (
    <aside className="w-full flex flex-col gap-3 h-full">
      
      {/* Category Pills - Scrollable */}
      <div className="bg-[#fbf8f2] p-2 rounded-2xl border border-amber-200/80 shadow-sm overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-1 sm:pb-0">
          {CATEGORIES_LIST.map(cat => {
            const isSelected = selectedCategory === cat.id && !showFavoritesOnly;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (showFavoritesOnly) onToggleFavoritesOnly();
                  onSelectCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-amber-100/70'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Favorites Bar */}
      <div className="bg-[#fbf8f2] p-3 rounded-2xl border border-amber-200/80 shadow-sm space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm truyện hoặc bài học..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-amber-700/60" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-1 justify-center ${
              showFavoritesOnly
                ? 'bg-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-600'
                : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Star size={14} className={showFavoritesOnly ? "fill-amber-950" : "text-amber-500"} />
            <span>Đã Yêu Thích ({favoriteIds.length})</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            title="Thêm truyện mới của bạn (Lưu offline)"
          >
            <Plus size={14} />
            <span>Thêm Truyện</span>
          </button>
        </div>
      </div>

      {/* Stories List Container */}
      <div className="flex-1 bg-[#fbf8f2] rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden flex flex-col min-h-[380px] lg:max-h-[calc(100vh-280px)]">
        
        {/* Header Count */}
        <div className="p-3 border-b border-amber-200/60 bg-amber-50/70 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <BookOpen size={16} className="text-amber-700" />
            <span>Danh Sách Truyện</span>
          </span>
          <span className="text-[11px] font-bold bg-white text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
            {stories.length} câu chuyện
          </span>
        </div>

        {/* Scrollable Story Cards */}
        <div className="overflow-y-auto p-2 space-y-2 flex-1">
          {stories.length > 0 ? (
            stories.map((story) => {
              const isSelected = selectedStoryId === story.id;
              const isFav = favoriteIds.includes(story.id);

              return (
                <div
                  key={story.id}
                  onClick={() => onSelectStory(story)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border relative group ${
                    isSelected
                      ? 'bg-[#f4ebd9] border-amber-400 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white/80 hover:bg-white border-amber-100/80 hover:border-amber-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0 mt-0.5">
                        {story.iconEmoji || '📖'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-sm font-bold truncate leading-snug ${
                          isSelected ? 'text-amber-950' : 'text-stone-800 group-hover:text-amber-800'
                        }`}>
                          {story.title}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            {story.category === 'Vietnam' ? 'Việt Nam' :
                             story.category === 'Andersen' ? 'Andersen' :
                             story.category === 'Grimm' ? 'Grimm' :
                             story.category === 'Fables' ? 'Ngụ ngôn' :
                             story.category === 'Asia' ? 'Á Đông' :
                             story.category === 'Custom' ? 'Tự thêm' : 'Thế giới'}
                          </span>

                          {story.readingTimeMinutes && (
                            <span className="text-[10px] text-stone-500 font-medium">
                              ⏱️ ~{story.readingTimeMinutes}p
                            </span>
                          )}
                        </div>

                        {story.moral && (
                          <p className="text-[11px] text-stone-500 line-clamp-1 italic mt-1 pl-1 border-l border-amber-300">
                            "{story.moral}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Star Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(story.id);
                      }}
                      className={`p-1.5 rounded-full transition-all ${
                        isFav 
                          ? 'text-amber-500 hover:text-amber-600' 
                          : 'text-stone-300 hover:text-amber-400 opacity-60 group-hover:opacity-100'
                      }`}
                      title={isFav ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    >
                      <Star size={16} className={isFav ? "fill-amber-400" : ""} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs flex flex-col items-center justify-center h-48 gap-2">
              <BookOpen size={36} className="text-amber-300 opacity-60" />
              <p className="font-semibold">Không tìm thấy câu chuyện phù hợp.</p>
              <button
                onClick={() => {
                  onSearchChange('');
                  if (showFavoritesOnly) onToggleFavoritesOnly();
                  onSelectCategory('All');
                }}
                className="text-amber-800 font-bold underline mt-1 text-xs"
              >
                Hiển thị tất cả truyện
              </button>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
};

export default StoryListSidebar;
