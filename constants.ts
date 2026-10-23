import { Story, VoiceOption } from './types';
import { OFFLINE_STORIES } from './data/offlineStories';

export const INITIAL_STORIES: Story[] = OFFLINE_STORIES;

export const VOICES: VoiceOption[] = [
  { id: 'v1', name: 'Cô Mai (Dịu dàng truyền cảm)', gender: 'Nữ', ageGroup: 'Thanh niên', rate: 0.95, pitch: 1.05 },
  { id: 'v2', name: 'Bé Na (Trong trẻo vui tươi)', gender: 'Nữ', ageGroup: 'Trẻ em', rate: 1.05, pitch: 1.25 },
  { id: 'v3', name: 'Bà Tiên (Hiền từ ru bé)', gender: 'Nữ', ageGroup: 'Người già', rate: 0.82, pitch: 0.95 },
  { id: 'v4', name: 'Ông Bụt (Trầm ấm cổ kính)', gender: 'Nam', ageGroup: 'Người già', rate: 0.85, pitch: 0.8 },
  { id: 'v5', name: 'Anh Tuấn (Rõ ràng đĩnh đạc)', gender: 'Nam', ageGroup: 'Thanh niên', rate: 1.0, pitch: 0.95 },
];

export const SLEEP_TIMER_OPTIONS = [
  { label: 'Tắt hẹn giờ', minutes: 0 },
  { label: '15 phút', minutes: 15 },
  { label: '30 phút', minutes: 30 },
  { label: '45 phút', minutes: 45 },
  { label: 'Hết truyện', minutes: -1 },
];