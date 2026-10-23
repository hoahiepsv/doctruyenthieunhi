export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  moral?: string; // Bài học đạo đức
  category?: 'Vietnam' | 'Greek' | 'Denmark' | 'Germany' | 'Norway' | 'Russia' | 'France' | 'Romania' | 'Czech' | 'China' | 'World' | 'Fables' | 'Grimm' | 'Andersen' | 'Asia' | 'Custom' | 'Other';
  author?: string;
  readingTimeMinutes?: number;
  difficulty?: 'Dễ hiểu' | 'Ý nghĩa' | 'Phiêu lưu' | 'Ngụ ngôn';
  ageRange?: 'Mọi lứa tuổi' | 'Mầm non (3-6)' | 'Tiểu học (6-11)';
  iconEmoji?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  ageGroup: 'Trẻ em' | 'Thanh niên' | 'Trung niên' | 'Người già';
  lang?: string;
  rate?: number;
  pitch?: number;
}

export interface PlaylistItem extends Story {
  audioUrl?: string;
  duration?: number;
}

export type PaperTheme = 'parchment' | 'cream' | 'sage' | 'night';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type LineHeight = 'normal' | 'relaxed' | 'loose';
export type ReaderFont = 'sans' | 'serif';