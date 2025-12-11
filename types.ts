export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  moral?: string; // Bài học đạo đức
  category?: 'Vietnam' | 'Greek' | 'Denmark' | 'Germany' | 'Norway' | 'Russia' | 'France' | 'Romania' | 'Czech' | 'China' | 'World' | 'Other';
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  ageGroup: 'Trẻ em' | 'Thanh niên' | 'Trung niên' | 'Người già';
  geminiVoiceName: string;
}

export interface PlaylistItem extends Story {
  audioUrl?: string;
  duration?: number;
}