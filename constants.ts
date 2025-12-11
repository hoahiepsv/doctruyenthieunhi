
import { Story, VoiceOption, InstantVoice } from './types';

// Helper để tạo nhanh dữ liệu
const createStory = (id: string, title: string, category: Story['category'], contentSnippet: string, moral: string): Story => ({
  id, title, category, moral,
  content: contentSnippet + " (Bấm chọn để AI kể chi tiết nội dung truyện này...)"
});

// Helper để sinh danh sách truyện số lượng lớn
const generateExtendedStories = (
  baseId: string, 
  category: Story['category'], 
  startCount: number, 
  endCount: number, 
  baseTitle: string
): Story[] => {
  const stories: Story[] = [];
  for (let i = startCount; i <= endCount; i++) {
    stories.push(createStory(
      `${baseId}-${i}`, 
      `${baseTitle} #${i}`, 
      category, 
      `Câu chuyện cổ tích ${i} thuộc kho tàng truyện cổ ${category}.`, 
      'Bài học về cuộc sống và đạo đức.'
    ));
  }
  return stories;
};

// --- 1. VIỆT NAM (>150 truyện) ---
const VN_REAL_TITLES = [
  "Tấm Cám", "Thạch Sanh", "Cây Khế", "Thánh Gióng", "Sơn Tinh Thủy Tinh", "Sọ Dừa", "Sự tích Trầu Cau", 
  "Cây Tre Trăm Đốt", "Sự tích Hồ Gươm", "Bánh Chưng Bánh Dày", "Trí Khôn Của Ta Đây", "Thầy Bói Xem Voi", 
  "Ếch Ngồi Đáy Giếng", "Cóc Kiện Trời", "Sự tích Dưa Hấu", "Chú Cuội Cung Trăng", "Sự tích Cây Vú Sữa", 
  "Chử Đồng Tử", "Mị Châu Trọng Thủy", "Hòn Vọng Phu", "Sự tích Hoa Hồng", "Sự tích Con Muỗi", "Lưu Bình Dương Lễ", 
  "Sự tích Chim Đa Đa", "Nàng Tô Thị", "Ông Táo Về Trời", "Sự tích Hoa Cúc Trắng", "Thạch Sùng", "Trạng Quỳnh", 
  "Con Dã Tràng", "Sự tích Chim Bìm Bịp", "Sự tích Cây Huyết Dụ", "Sự tích Hoa Mười Giờ", "Sự tích Hoa Dạ Lan Hương", 
  "Sự tích Hoa Tigon", "Sự tích Hoa Dâm Bụt", "Sự tích Hoa Hải Đường", "Sự tích Hoa Ngọc Lan", "Sự tích Hoa Lài", 
  "Sự tích Hoa Sen", "Sự tích Hoa Súng", "Sự tích Hoa Quỳnh", "Sự tích Cây Xấu Hổ", "Sự tích Cây Xương Rồng", 
  "Sự tích Cây Chuối", "Sự tích Cây Đu Đủ", "Sự tích Trái Sầu Riêng", "Sự tích Quả Thanh Long", "Sự tích Củ Mài", 
  "Sự tích Con Mèo", "Sự tích Con Chó", "Sự tích Con Gà", "Sự tích Con Trâu", "Sự tích 12 Con Giáp", "Sự tích Ông Địa", 
  "Sự tích Thần Tài", "Ngưu Lang Chức Nữ", "Hằng Nga Hậu Nghệ", "Sự tích Đèn Trung Thu", "Sự tích Bánh Dẻo Bánh Nướng", 
  "Sự tích Bánh Trôi Bánh Chay", "Sự tích Bánh Phu Thê", "Sự tích Bánh Cốm", "Sự tích Áo Dài", "Sự tích Nón Lá", 
  "Sự tích Đàn Bầu", "Sự tích Trống Đồng", "Sự tích Múa Rối Nước", "Hai Bà Trưng", "Bà Triệu", "Trần Hưng Đạo", 
  "Yết Kiêu", "Dã Tượng", "Phạm Ngũ Lão", "Lê Lai", "Nguyễn Trãi", "Lương Thế Vinh", "Mạc Đĩnh Chi", "Lê Quý Đôn", 
  "Cao Bá Quát", "Nguyễn Hiền", "Vũ Duệ", "Nguyễn Bỉnh Khiêm", "Phùng Khắc Khoan", "Giang Văn Minh", "Xiển Bột", 
  "Ba Giai Tú Xuất", "Sự tích Hồ Ba Bể", "Sự tích Núi Tản Viên", "Sự tích Sông Hương", "Sự tích Đèo Ngang", 
  "Sự tích Hòn Trống Mái", "Con Rồng Cháu Tiên", "Cây Nêu Ngày Tết", "Sự tích Hoa Ban", "Sự tích Hoa Mai", 
  "Sự tích Hoa Đào", "Sự tích Cây Lúa", "Sự tích Cây Ngô", "Sự tích Cây Khoai Lang", "Sự tích Con Cóc", "Sự tích Đom Đóm",
  "Nghêu Sò Ốc Hến", "Quan Âm Thị Kính", "Tống Trân Cúc Hoa", "Phạm Công Cúc Hoa", "Lục Vân Tiên", "Chuyện Chàng Lía",
  "Nàng Út Ống Tre", "Chàng Ngốc Học Khôn", "Người Học Trò Và Con Chó Đá", "Sự Tích Con Sam", "Sự Tích Con Thằn Lằn",
  "Sự Tích Chim Cuốc", "Sự Tích Chim Tu Hú", "Sự Tích Chim Gõ Kiến", "Sự Tích Con Dế", "Sự Tích Con Ve Sầu",
  "Sự Tích Cây Mía", "Sự Tích Cây Cau", "Sự Tích Cây Thuốc Lá", "Sự Tích Cây Chè", "Chuyện Ông Gióng",
  "Sự Tích Đầm Nhất Dạ", "Sự Tích Thành Cổ Loa", "Truyện Trầu Cau", "Truyện Rùa Vàng"
]; // ~125 real titles

const VIETNAM_STORIES: Story[] = [
  ...VN_REAL_TITLES.map((title, index) => createStory(`vn-${index}`, title, 'Vietnam', title, 'Bài học dân gian sâu sắc.')),
  ...generateExtendedStories('vn-ext', 'Vietnam', 126, 160, 'Giai Thoại Dân Gian Việt Nam') // Fill to > 150
];

// --- 2. HY LẠP (>100 truyện) ---
const GREEK_REAL_TITLES = [
  "Thần Zeus", "Prometheus Trộm Lửa", "Chiếc Hộp Pandora", "12 Kỳ Công Hercules", "Vua Midas", "Icarus Đôi Cánh Sáp",
  "Ngựa Gỗ Thành Troy", "Gót Chân Achilles", "Apollo và Daphne", "Perseus và Medusa", "Narcissus", "Jason Lông Cừu Vàng",
  "Eros và Psyche", "Theseus và Minotaur", "Orpheus và Eurydice", "Quả Táo Vàng", "Thần Athena", "Sisyphus", "Bellerophon",
  "Arachne", "Hephaestus", "Demeter Persephone", "Odysseus", "Atlas", "Pygmalion", "Phaeton", "Dionysus", "Titan War",
  "Hades", "Hermes", "Hestia", "Hera", "Ares", "Artemis", "Aphrodite", "Asclepius", "Pan", "Hecate", "Tyche", "Nike",
  "Iris", "Eos", "Selene", "Helios", "Aeolus", "Boreas", "Zephyrus", "The Muses", "The Graces", "The Fates", "The Furies",
  "Cerberus", "Hydra", "Chimera", "Sphinx", "Griffin", "Centaur", "Satyr", "Nymph", "Siren", "Cyclops", "Cronus", "Rhea",
  "Gaia", "Uranus", "Gigantomachy", "Deucalion", "Cadmus", "Oedipus", "Antigone", "Seven Against Thebes", "Epigoni",
  "Tantalus", "Ixion", "Niobe", "Agamemnon", "Menelaus", "Helen", "Hector", "Priam", "Cassandra", "Aeneas", "Daedalus",
  "Talos", "Atalanta", "Meleager", "Castor và Pollux", "Leda", "Europa", "Actaeon", "Callisto", "Orion", "Pleiades",
  "Ganymede", "Endymion", "Medrea", "Scylla", "Charybdis", "Amazon", "Typhon"
]; // ~100 titles

const GREEK_STORIES: Story[] = [
  ...GREEK_REAL_TITLES.map((title, index) => createStory(`gr-${index}`, title, 'Greek', title, 'Thần thoại và bài học nhân sinh.')),
  ...generateExtendedStories('gr-ext', 'Greek', 101, 110, 'Thần Thoại Hy Lạp Bí Ẩn') // Ensure > 100
];

// --- 3. ĐAN MẠCH (Andersen) (>100 truyện) ---
const DENMARK_TITLES = [
  "Nàng Tiên Cá", "Cô Bé Bán Diêm", "Vịt Con Xấu Xí", "Chú Lính Chì Dũng Cảm", "Bà Chúa Tuyết", "Bộ Quần Áo Mới Của Hoàng Đế",
  "Nàng Công Chúa Và Hạt Đậu", "Chim Họa Mi", "Ngón Tay Cái", "Đôi Giày Đỏ", "Cây Thông", "Chiếc Bật Lửa",
  "Người Bạn Đồng Hành", "Bầy Chim Thiên Nga", "Nàng Tiên Trong Đầm Lầy", "Bông Cúc Trắng", "Chú Heo Đất",
  "Cái Bóng", "Giấc Mơ Của Bà", "Chiếc Kim Khâu", "Gia Đình Hạnh Phúc", "Bông Hồng Của Homer", "Nữ Thần Băng Giá",
  "Con Quỷ Sứ Và Bà Làm Vườn", "Đứa Trẻ Trong Mộ", "Chuông Chiều", "Bà Già Trong Nhà Thờ", "Giọt Nước", "Chim Phượng Hoàng"
];
const DENMARK_STORIES: Story[] = [
  ...DENMARK_TITLES.map((t, i) => createStory(`dk-${i}`, t, 'Denmark', `Truyện cổ Andersen: ${t}`, 'Nhân văn và tình yêu thương.')),
  ...generateExtendedStories('dk-ext', 'Denmark', 30, 105, 'Truyện Cổ Đan Mạch')
];

// --- 4. ĐỨC (Grimm) (>100 truyện) ---
const GERMANY_TITLES = [
  "Bạch Tuyết Và 7 Chú Lùn", "Cô Bé Lọ Lem", "Người Đẹp Ngủ Trong Rừng", "Hansel và Gretel", "Rapunzel (Công Chúa Tóc Mây)",
  "Chó Sói Và 7 Chú Dê Con", "Hoàng Tử Ếch", "Nhạc Sĩ Thành Bremen", "Rumpelstiltskin", "Bà Holle", "Vua Chích Chòe",
  "Ngỗng Vàng", "Ba Sợi Tóc Vàng Của Quỷ", "Chú Bé Tí Hon", "Mười Hai Chàng Thợ Săn", "Bác Nông Dân Và Con Quỷ",
  "Sáu Người Hầu", "Ba Chiếc Lông Vũ", "Nước Sự Sống", "Con Chim Vàng", "Vua Núi Vàng", "Hai Anh Em", "Cô Gái Chăn Ngỗng"
];
const GERMANY_STORIES: Story[] = [
  ...GERMANY_TITLES.map((t, i) => createStory(`de-${i}`, t, 'Germany', `Truyện cổ Grimm: ${t}`, 'Bài học răn dạy sâu sắc.')),
  ...generateExtendedStories('de-ext', 'Germany', 24, 105, 'Truyện Cổ Tích Đức')
];

// --- 5. NA UY (>100 truyện) ---
const NORWAY_TITLES = [
  "Ba Chú Dê Billy Gruff", "Phía Đông Mặt Trời, Phía Tây Mặt Trăng", "Lâu Đài Soria Moria", "Tại Sao Biển Lại Mặn",
  "Chàng Trai Đi Tìm Nỗi Sợ", "Công Chúa Trên Đỉnh Núi Thủy Tinh", "Người Chồng Của Bà Góa", "Con Mèo Gấm", "Mười Hai Con Vịt Trời"
];
const NORWAY_STORIES: Story[] = [
  ...NORWAY_TITLES.map((t, i) => createStory(`no-${i}`, t, 'Norway', `Truyện cổ Na Uy: ${t}`, 'Dũng cảm và phiêu lưu.')),
  ...generateExtendedStories('no-ext', 'Norway', 10, 105, 'Truyện Cổ Tích Na Uy')
];

// --- 6. NGA (>100 truyện) ---
const RUSSIA_TITLES = [
  "Ông Lão Đánh Cá Và Con Cá Vàng", "Củ Cải Khổng Lồ", "Chàng Ivan Ngốc Nghếch", "Phù Thủy Baba Yaga", "Chim Lửa",
  "Vasilisa Xinh Đẹp", "Nàng Công Chúa Ếch", "Chiếc Găng Tay", "Cáo Và Sếu", "Nồi Cháo Rìu", "Bông Hoa Đá", "Con Ngựa Gù"
];
const RUSSIA_STORIES: Story[] = [
  ...RUSSIA_TITLES.map((t, i) => createStory(`ru-${i}`, t, 'Russia', `Truyện cổ Nga: ${t}`, 'Trí tuệ và lòng nhân hậu.')),
  ...generateExtendedStories('ru-ext', 'Russia', 13, 105, 'Truyện Cổ Tích Nga')
];

// --- 7. PHÁP (Perrault) (>100 truyện) ---
const FRANCE_TITLES = [
  "Cô Bé Quàng Khăn Đỏ", "Mèo Đi Hia", "Lọ Lem (Bản Pháp)", "Người Đẹp Và Quái Vật", "Râu Xanh",
  "Những Bà Tiên", "Ricky Có Chiếc Mào", "Da Lừa", "Ba Điều Ước", "Ngón Tay Cái (Bản Pháp)"
];
const FRANCE_STORIES: Story[] = [
  ...FRANCE_TITLES.map((t, i) => createStory(`fr-${i}`, t, 'France', `Truyện cổ Pháp: ${t}`, 'Lãng mạn và bài học.')),
  ...generateExtendedStories('fr-ext', 'France', 11, 105, 'Truyện Cổ Tích Pháp')
];

// --- 8. ROMANIA (>100 truyện) ---
const ROMANIA_TITLES = [
  "Hoàng Tử Lợn", "Con Gái Của Ông Già", "Muối Trong Thức Ăn", "Chàng Greuceanu", "Thanh Niên Không Tuổi"
];
const ROMANIA_STORIES: Story[] = [
  ...ROMANIA_TITLES.map((t, i) => createStory(`ro-${i}`, t, 'Romania', `Truyện cổ Romania: ${t}`, 'Bí ẩn và lôi cuốn.')),
  ...generateExtendedStories('ro-ext', 'Romania', 6, 105, 'Truyện Cổ Tích Romania')
];

// --- 9. SÉC (Czech) (>100 truyện) ---
const CZECH_TITLES = [
  "Ba Hạt Dẻ Dành Cho Lọ Lem", "Muối Quý Hơn Vàng", "Mười Hai Tháng", "Lâu Đài Lửa", "Vua Ếch"
];
const CZECH_STORIES: Story[] = [
  ...CZECH_TITLES.map((t, i) => createStory(`cz-${i}`, t, 'Czech', `Truyện cổ Séc: ${t}`, 'Giản dị và thâm thúy.')),
  ...generateExtendedStories('cz-ext', 'Czech', 6, 105, 'Truyện Cổ Tích Séc')
];

// --- 10. TRUNG QUỐC (>100 truyện) ---
const CHINA_TITLES = [
  "Tây Du Ký (Trích đoạn)", "Hoa Mộc Lan", "Lương Sơn Bá Chúc Anh Đài", "Ngưu Lang Chức Nữ (Bản Trung)", "Thanh Xà Bạch Xà",
  "Thần Bút Mã Lương", "Khổng Tử Dạy Học", "Mạnh Mẫu Ba Lần Chuyển Nhà", "Tái Ông Mất Mã", "Điêu Thuyền Bái Nguyệt"
];
const CHINA_STORIES: Story[] = [
  ...CHINA_TITLES.map((t, i) => createStory(`cn-${i}`, t, 'China', `Truyện cổ Trung Hoa: ${t}`, 'Triết lý Á Đông.')),
  ...generateExtendedStories('cn-ext', 'China', 11, 105, 'Truyện Cổ Trung Quốc')
];

export const INITIAL_STORIES: Story[] = [
  ...VIETNAM_STORIES,
  ...GREEK_STORIES,
  ...DENMARK_STORIES,
  ...GERMANY_STORIES,
  ...NORWAY_STORIES,
  ...RUSSIA_STORIES,
  ...FRANCE_STORIES,
  ...ROMANIA_STORIES,
  ...CZECH_STORIES,
  ...CHINA_STORIES
];

// Giọng cho phần Download HQ (Gemini AI)
export const VOICES: VoiceOption[] = [
  { id: 'v1', name: 'Bé Na (Kể chuyện)', gender: 'Nữ', ageGroup: 'Trẻ em', geminiVoiceName: 'Puck' },
  { id: 'v2', name: 'Anh Tuấn (Trầm ấm)', gender: 'Nam', ageGroup: 'Thanh niên', geminiVoiceName: 'Charon' },
  { id: 'v3', name: 'Chị Mai (Dịu dàng)', gender: 'Nữ', ageGroup: 'Thanh niên', geminiVoiceName: 'Kore' },
  { id: 'v4', name: 'Bác Hùng (Mạnh mẽ)', gender: 'Nam', ageGroup: 'Trung niên', geminiVoiceName: 'Fenrir' },
  { id: 'v5', name: 'Cô Lan (Thanh thoát)', gender: 'Nữ', ageGroup: 'Trung niên', geminiVoiceName: 'Zephyr' },
  { id: 'v6', name: 'Ông Bụt (Cổ tích)', gender: 'Nam', ageGroup: 'Người già', geminiVoiceName: 'Fenrir' }, 
  { id: 'v7', name: 'Bà Tiên (Nhẹ nhàng)', gender: 'Nữ', ageGroup: 'Người già', geminiVoiceName: 'Kore' },
  { id: 'v8', name: 'Cậu Bé (Tinh nghịch)', gender: 'Nam', ageGroup: 'Trẻ em', geminiVoiceName: 'Puck' },
];

// Giọng cho phần Đọc Ngay (Instant Read) - Hybrid
export const INSTANT_VOICES_PRESETS: InstantVoice[] = [
  { id: 'google-normal', name: 'Google: Chị Google (Chuẩn)', type: 'google-online', lang: 'vi', speed: 1.0 },
  { id: 'google-slow', name: 'Google: Kể Chuyện (Chậm rãi)', type: 'google-online', lang: 'vi', speed: 0.85 }, // Slow down for storytelling
  { id: 'google-fast', name: 'Google: Vui Vẻ (Nhanh)', type: 'google-online', lang: 'vi', speed: 1.15 },
  // Native voices will be added dynamically at runtime
];
