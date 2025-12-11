
export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string; // Giữ lại để tương thích ngược (thumbnail)
  imageUrls?: string[]; // Mới: Danh sách nhiều ảnh
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

// Cấu hình giọng đọc Đọc Ngay (Instant Read)
export interface InstantVoice {
  id: string;
  name: string;
  type: 'google-online' | 'browser-native';
  lang: string; // 'vi-VN'
  speed: number; // 1.0 = bình thường
  voiceURI?: string; // Dành cho browser native voice
}

export interface PlaylistItem extends Story {
  audioUrl?: string;
  duration?: number;
}
