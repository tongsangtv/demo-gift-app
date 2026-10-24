import { Recipient, GiftItem, NotificationSettings, UserProfile, UpcomingEvent } from '../types';

const STORAGE_KEYS = {
  RECIPIENTS: 'shopeegift_recipients_v1',
  WISHLIST: 'shopeegift_wishlist_v1',
  SETTINGS: 'shopeegift_settings_v1',
  USER_PROFILE: 'shopeegift_user_v1',
  THEME: 'shopeegift_theme_v1',
  NOTIFICATION_HISTORY: 'shopeegift_notif_hist_v1',
};

// Initial Seed Recipients with realistic Vietnamese occasions
export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'rec-1',
    name: 'Mai Anh (Người yêu)',
    relationship: 'Người yêu (Bạn gái)',
    gender: 'Nữ',
    birthday: '1998-11-04', // upcoming in ~10 days from late October
    anniversaryName: 'Kỷ niệm 2 năm yêu nhau',
    anniversaryDate: '2024-12-15',
    interests: ['Mỹ phẩm & Skincare', 'Decor phòng & Nến thơm', 'Chụp ảnh du lịch'],
    personality: 'Tinh tế, lãng mạn, thích sự bất ngờ ngọt ngào',
    budgetPreference: '500.000₫ - 1.000.000₫',
    notes: 'Thích tông màu hồng pastel, dị ứng hải sản, thích mùi hương hoa cỏ nhẹ nhàng.',
    giftStatus: 'considering',
    selectedGiftName: 'Set son dưỡng Dior Addict Lip Glow',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec-2',
    name: 'Mẹ Yêu',
    relationship: 'Mẹ',
    gender: 'Nữ',
    birthday: '1970-10-29', // upcoming in 5 days!
    anniversaryName: 'Ngày Phụ nữ Việt Nam 20/10',
    anniversaryDate: '2026-10-20',
    interests: ['Chăm sóc sức khỏe', 'Nấu ăn', 'Trà thảo mộc & Yến sào'],
    personality: 'Thực tế, tiết kiệm, yêu thương gia đình, thích quà sức khỏe',
    budgetPreference: '300.000₫ - 800.000₫',
    notes: 'Hay bị đau mỏi vai gáy và mất ngủ, rất thích uống trà hoa cúc.',
    giftStatus: 'none',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec-3',
    name: 'Minh Tuấn (Bạn thân cạ cứng)',
    relationship: 'Bạn thân',
    gender: 'Nam',
    birthday: '1997-11-18',
    anniversaryName: 'Sinh nhật bạn thân',
    interests: ['Công nghệ & Gadgets', 'Bàn phím cơ & Setup', 'Cà phê đặc sản'],
    personality: 'Hài hước, công nghệ, thực tế, thích đồ decor góc làm việc',
    budgetPreference: '300.000₫ - 600.000₫',
    notes: 'Đang muốn nâng cấp góc bàn làm việc tối giản (minimalist desk).',
    giftStatus: 'bought',
    selectedGiftName: 'Bình giữ nhiệt Lock&Lock thông minh',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec-4',
    name: 'Anh Dũng (Trưởng nhóm / Đồng nghiệp)',
    relationship: 'Đồng nghiệp',
    gender: 'Nam',
    birthday: '1992-12-02',
    anniversaryName: 'Kỷ niệm hoàn thành dự án lớn',
    interests: ['Đọc sách & Phát triển bản thân', 'Văn phòng phẩm cao cấp', 'Thể thao chạy bộ'],
    personality: 'Chuyên nghiệp, chỉn chu, thích sự lịch thiệp',
    budgetPreference: '200.000₫ - 500.000₫',
    notes: 'Thích phong cách tối giản, hay ghi chép sổ tay công việc.',
    giftStatus: 'none',
    createdAt: new Date().toISOString(),
  }
];

// Initial Seed Wishlist
export const INITIAL_WISHLIST: GiftItem[] = [
  {
    id: 'wish-1',
    name: 'Set son dưỡng Dior Addict Lip Glow Mini chính hãng',
    category: 'Làm đẹp & Mỹ phẩm',
    priceEstimate: '490.000₫',
    priceValue: 490000,
    matchReason: 'Phù hợp làm quà tặng Mai Anh nhân dịp sinh nhật, màu tự nhiên tinh tế.',
    matchScore: 98,
    shopeeKeyword: 'son duong dior lip glow mini chinh hang',
    shopeeUrl: 'https://shopee.vn/search?keyword=son%20duong%20dior%20lip%20glow%20mini%20chinh%20hang',
    greetingMessage: 'Chúc em tuổi mới luôn rạng ngời, ngọt ngào và hạnh phúc bên anh!',
    unboxingTip: 'Gói hộp quà kèm thiệp viết tay và kẹo marshmallow.',
    isShopeeMall: true,
    badge: 'Ưu tiên số 1',
    recipientId: 'rec-1',
    recipientName: 'Mai Anh (Người yêu)',
    savedAt: new Date().toISOString(),
    status: 'considering'
  },
  {
    id: 'wish-2',
    name: 'Bình giữ nhiệt Lock&Lock hiển thị nhiệt độ thông minh 500ml',
    category: 'Gia dụng & Tiện ích',
    priceEstimate: '289.000₫',
    priceValue: 289000,
    matchReason: 'Món quà thiết thực cho Minh Tuấn dùng mang đi làm mỗi ngày.',
    matchScore: 95,
    shopeeKeyword: 'bình giữ nhiệt lock lock chính hãng thông minh',
    shopeeUrl: 'https://shopee.vn/search?keyword=b%C3%ACnh%20gi%E1%BB%AF%20nhi%E1%BB%87t%20lock%20lock%20ch%C3%ADnh%20h%C3%A3ng%20th%C3%B4ng%20minh',
    greetingMessage: 'Chúc người anh em sinh nhật vui vẻ, code ít bug nhiều tiền!',
    isShopeeMall: true,
    badge: 'Đã mua',
    recipientId: 'rec-3',
    recipientName: 'Minh Tuấn (Bạn thân cạ cứng)',
    savedAt: new Date().toISOString(),
    status: 'bought'
  }
];

export const DEFAULT_SETTINGS: NotificationSettings = {
  unifiedPushEnabled: true,
  unifiedPushEndpoint: 'https://unifiedpush.org/distributor/shopeegift-fcm-mock',
  unifiedPushDistributor: 'UnifiedPush (Tự động chuyển tiếp Web Push)',
  emailEnabled: true,
  userEmail: 'thps1411@gmail.com',
  zaloEnabled: true,
  zaloPhone: '0988686868',
  remindDaysBefore: [7, 3, 1, 0],
  soundEnabled: true,
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr_thps1411',
  name: 'Hải Phong',
  email: 'thps1411@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isLoggedIn: true,
  lastSyncedAt: new Date().toISOString()
};

// Local Storage Handlers
export function getLocalRecipients(): Recipient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECIPIENTS);
    if (!raw) {
      saveLocalRecipients(INITIAL_RECIPIENTS);
      return INITIAL_RECIPIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RECIPIENTS;
  }
}

export function saveLocalRecipients(data: Recipient[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(data));
  } catch (e) {
    console.error('Save recipients error', e);
  }
}

export function getLocalWishlist(): GiftItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (!raw) {
      saveLocalWishlist(INITIAL_WISHLIST);
      return INITIAL_WISHLIST;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_WISHLIST;
  }
}

export function saveLocalWishlist(data: GiftItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(data));
  } catch (e) {
    console.error('Save wishlist error', e);
  }
}

export function getLocalSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveLocalSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLocalSettings(data: NotificationSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
  } catch (e) {
    console.error('Save settings error', e);
  }
}

export function getLocalUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      saveLocalUserProfile(DEFAULT_USER);
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveLocalUserProfile(data: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(data));
  } catch (e) {
    console.error('Save user profile error', e);
  }
}

// List of prominent Annual Special Holidays in Vietnam
export const ANNUAL_HOLIDAYS = [
  {
    id: 'holiday-14-2',
    name: '14/2 - Lễ Tình Nhân (Valentine Đỏ)',
    shortName: '14/2 Valentine',
    dateStr: '02-14',
    fullDisplayDate: '14 tháng 02',
    description: 'Ngày lễ tôn vinh tình yêu đôi lứa, dịp bày tỏ tình cảm chân thành với người thương.',
    targetRelationships: ['Người yêu (Bạn gái)', 'Người yêu (Bạn trai)', 'Vợ', 'Chồng'],
    suggestedGifts: ['Set son dưỡng cao cấp', 'Socola nhập khẩu', 'Nước hoa chính hãng', 'Trang sức bạc/vàng', 'Hoa tươi & thiệp lãng mạn'],
    iconType: 'valentine' as const,
    themeColor: 'from-rose-500 to-pink-500',
  },
  {
    id: 'holiday-8-3',
    name: '8/3 - Quốc tế Phụ nữ',
    shortName: '8/3 Quốc tế Phụ nữ',
    dateStr: '03-08',
    fullDisplayDate: '08 tháng 03',
    description: 'Dịp tri ân và gửi lời yêu thương đến người phụ nữ tuyệt vời: Mẹ, Vợ, Người yêu, Chị em gái & Đồng nghiệp nữ.',
    targetRelationships: ['Mẹ', 'Người yêu (Bạn gái)', 'Vợ', 'Chị gái / Anh trai', 'Em gái', 'Đồng nghiệp'],
    suggestedGifts: ['Mỹ phẩm Skincare Shopee Mall', 'Set hoa lụa cao cấp', 'Khăn lụa tơ tằm', 'Máy massage cổ vai gáy', 'Thiết bị gia dụng thông minh'],
    iconType: 'women' as const,
    themeColor: 'from-pink-500 to-rose-400',
  },
  {
    id: 'holiday-20-11',
    name: '20/11 - Ngày Nhà giáo Việt Nam',
    shortName: '20/11 Nhà giáo VN',
    dateStr: '11-20',
    fullDisplayDate: '20 tháng 11',
    description: 'Ngày tri ân công lao dạy dỗ của Thầy Cô giáo, người dẫn dắt (mentor) và các cấp quản lý lãnh đạo.',
    targetRelationships: ['Thầy cô', 'Sếp / Quản lý', 'Đồng nghiệp', 'Khác'],
    suggestedGifts: ['Bút ký cao cấp khắc tên', 'Sổ tay da bìa còng', 'Hộp quà trà hoa thảo mộc', 'Bình giữ nhiệt Lock&Lock', 'Cà vạt & Kẹp cà vạt'],
    iconType: 'teacher' as const,
    themeColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'holiday-20-10',
    name: '20/10 - Ngày Phụ nữ Việt Nam',
    shortName: '20/10 Phụ nữ VN',
    dateStr: '10-20',
    fullDisplayDate: '20 tháng 10',
    description: 'Ngày tôn vinh vẻ đẹp, sự hy sinh và đức tính tuyệt vời của phụ nữ Việt Nam.',
    targetRelationships: ['Mẹ', 'Vợ', 'Người yêu (Bạn gái)', 'Chị gái / Anh trai', 'Em gái', 'Đồng nghiệp'],
    suggestedGifts: ['Hộp quà yến sào bồi bổ', 'Bộ son môi hàng hiệu', 'Nến thơm thư giãn', 'Túi xách thời trang', 'Trang sức tinh tế'],
    iconType: 'women' as const,
    themeColor: 'from-red-500 to-rose-500',
  },
  {
    id: 'holiday-24-12',
    name: '24/12 - Lễ Giáng Sinh (Noel)',
    shortName: '24/12 Giáng Sinh',
    dateStr: '12-24',
    fullDisplayDate: '24 & 25 tháng 12',
    description: 'Mùa lễ hội an lành, ấm áp trao nhau những món quà bất ngờ trong tiết trời se lạnh.',
    targetRelationships: ['Người yêu (Bạn gái)', 'Người yêu (Bạn trai)', 'Bạn thân', 'Trẻ em', 'Gia đình'],
    suggestedGifts: ['Hộp quà tất Giáng sinh', 'Quả cầu tuyết phát nhạc', 'Áo len họa tiết Noel', 'Đèn hoàng hôn decor phòng', 'Cốc sứ kèm thìa Giáng sinh'],
    iconType: 'christmas' as const,
    themeColor: 'from-emerald-600 to-red-600',
  },
  {
    id: 'holiday-1-1',
    name: '01/01 - Tết Dương Lịch',
    shortName: '01/01 Năm Mới',
    dateStr: '01-01',
    fullDisplayDate: '01 tháng 01',
    description: 'Chào đón năm mới với những điều tốt lành, lời chúc thịnh vượng và hy vọng khởi sắc.',
    targetRelationships: ['Gia đình', 'Đồng nghiệp', 'Bạn thân', 'Sếp / Quản lý', 'Khách hàng'],
    suggestedGifts: ['Lịch để bàn phong thủy', 'Sổ tay kế hoạch năm mới (Planner)', 'Rượu vang / Trà cao cấp', 'Bình tài lộc may mắn'],
    iconType: 'newyear' as const,
    themeColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'holiday-14-3',
    name: '14/3 - Valentine Trắng (White Day)',
    shortName: '14/3 Valentine Trắng',
    dateStr: '03-14',
    fullDisplayDate: '14 tháng 03',
    description: 'Ngày các chàng trai đáp lại tình cảm ngọt ngào đã nhận được trong ngày 14/2.',
    targetRelationships: ['Người yêu (Bạn gái)', 'Vợ', 'Bạn thân'],
    suggestedGifts: ['Kẹo marshmallow / Socola trắng', 'Búp bê gấu bông', 'Vòng tay đôi xinh xắn', 'Nước hoa mùi ngọt ngào'],
    iconType: 'valentine' as const,
    themeColor: 'from-sky-400 to-indigo-400',
  },
  {
    id: 'holiday-mother',
    name: 'Ngày của Mẹ (Mother’s Day)',
    shortName: 'Ngày của Mẹ',
    dateStr: '05-10', // early-mid May
    fullDisplayDate: 'Chủ nhật tuần thứ 2 tháng 5',
    description: 'Dành trọn vẹn tình cảm hiếu thảo và sự kính trọng sâu sắc nhất gửi tới Mẹ yêu.',
    targetRelationships: ['Mẹ', 'Mẹ chồng / Mẹ vợ'],
    suggestedGifts: ['Máy massage trị liệu', 'Hồng sâm & Tổ yến thiên nhiên', 'Nồi chiên không dầu', 'Áo dài truyền thống'],
    iconType: 'mother' as const,
    themeColor: 'from-rose-400 to-amber-500',
  },
  {
    id: 'holiday-father',
    name: 'Ngày của Cha (Father’s Day)',
    shortName: 'Ngày của Cha',
    dateStr: '06-21', // mid June
    fullDisplayDate: 'Chủ nhật tuần thứ 3 tháng 6',
    description: 'Bày tỏ lòng biết ơn đối với người Cha đã luôn là điểm tựa vững chãi của gia đình.',
    targetRelationships: ['Bố', 'Bố chồng / Bố vợ'],
    suggestedGifts: ['Máy cạo râu thông minh', 'Thắt lưng da bò thật', 'Đồng hồ đeo tay lịch lãm', 'Trà Shan Tuyết cổ thụ'],
    iconType: 'father' as const,
    themeColor: 'from-blue-700 to-cyan-600',
  },
  {
    id: 'holiday-1-6',
    name: '01/06 - Quốc tế Thiếu nhi',
    shortName: '01/06 Thiếu Nhi',
    dateStr: '06-01',
    fullDisplayDate: '01 tháng 06',
    description: 'Dành tặng nụ cười và niềm vui bất tận cho các bé yêu, con em hoặc cháu trong gia đình.',
    targetRelationships: ['Trẻ em', 'Em gái', 'Em trai', 'Con yêu'],
    suggestedGifts: ['Bộ đồ chơi Lego xếp hình', 'Gấu bông Capybara hot trend', 'Bộ bút màu nghệ thuật', 'Đồng hồ định vị trẻ em'],
    iconType: 'children' as const,
    themeColor: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'holiday-tet',
    name: 'Tết Nguyên Đán (Tết Cổ Truyền)',
    shortName: 'Tết Cổ Truyền',
    dateStr: '01-29', // approx lunar new year
    fullDisplayDate: 'Tết Nguyên Đán (Tháng Giêng Âm Lịch)',
    description: 'Sum vầy đoàn viên, gắn kết tình thân và trao gửi phong bao lì xì, giỏ quà tết may mắn.',
    targetRelationships: ['Bố', 'Mẹ', 'Gia đình', 'Sếp / Quản lý', 'Khách hàng', 'Đồng nghiệp'],
    suggestedGifts: ['Giỏ quà Tết hạt dinh dưỡng cao cấp', 'Hộp mứt sen & trà Tân Cương', 'Set bao lì xì mạ vàng phong thủy', 'Tranh treo tường tài lộc'],
    iconType: 'newyear' as const,
    themeColor: 'from-red-600 to-amber-500',
  }
];

// Days left calculator for upcoming events & holidays
export function calculateDaysLeft(dateStr?: string): { days: number; isToday: boolean; nextDate: Date | null } {
  if (!dateStr) return { days: 9999, isToday: false, nextDate: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateStr.split('-');
  if (parts.length < 2) return { days: 9999, isToday: false, nextDate: null };

  let month: number;
  let day: number;

  if (parts.length === 2) {
    // Format: MM-DD (e.g. "02-14" for 14/2, "11-20" for 20/11)
    month = parseInt(parts[0], 10) - 1;
    day = parseInt(parts[1], 10);
  } else {
    // Format: YYYY-MM-DD
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }

  if (isNaN(month) || isNaN(day)) return { days: 9999, isToday: false, nextDate: null };

  let targetDate = new Date(today.getFullYear(), month, day);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() < today.getTime()) {
    // If date passed this year, check next year
    targetDate = new Date(today.getFullYear() + 1, month, day);
  }

  const diffMs = targetDate.getTime() - today.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return {
    days,
    isToday: days === 0,
    nextDate: targetDate
  };
}

// Compute upcoming annual holidays sorted by days remaining
export function getUpcomingAnnualHolidays() {
  return ANNUAL_HOLIDAYS.map(holiday => {
    const calc = calculateDaysLeft(holiday.dateStr);
    return {
      ...holiday,
      daysLeft: calc.days,
      isToday: calc.isToday
    };
  }).sort((a, b) => a.daysLeft - b.daysLeft);
}

// Compute all upcoming events sorted by closeness
export function getUpcomingEvents(recipients: Recipient[]): UpcomingEvent[] {
  const list: UpcomingEvent[] = [];

  recipients.forEach(r => {
    if (r.birthday) {
      const calc = calculateDaysLeft(r.birthday);
      list.push({
        recipientId: r.id,
        recipientName: r.name,
        relationship: r.relationship,
        eventName: 'Sinh nhật',
        eventDate: r.birthday,
        daysLeft: calc.days,
        isToday: calc.isToday,
        avatar: r.avatar,
        giftStatus: r.giftStatus
      });
    }

    if (r.anniversaryDate && r.anniversaryName) {
      const calc = calculateDaysLeft(r.anniversaryDate);
      list.push({
        recipientId: r.id,
        recipientName: r.name,
        relationship: r.relationship,
        eventName: r.anniversaryName,
        eventDate: r.anniversaryDate,
        daysLeft: calc.days,
        isToday: calc.isToday,
        avatar: r.avatar,
        giftStatus: r.giftStatus
      });
    }
  });

  return list.sort((a, b) => a.daysLeft - b.daysLeft);
}

// Format currency VNĐ
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
