export interface Recipient {
  id: string;
  name: string;
  avatar?: string;
  relationship: string; // 'Người yêu (Bạn gái)', 'Người yêu (Bạn trai)', 'Bạn thân', 'Mẹ', 'Bố', 'Vợ', 'Chồng', 'Đồng nghiệp', 'Em gái', 'Anh trai', etc.
  gender: 'Nam' | 'Nữ' | 'Khác';
  birthday?: string; // YYYY-MM-DD
  anniversaryName?: string; // e.g. 'Kỷ niệm ngày cưới', 'Ngày kỷ niệm yêu nhau', 'Lễ tốt nghiệp'
  anniversaryDate?: string; // YYYY-MM-DD
  interests: string[];
  personality: string;
  budgetPreference: string;
  notes?: string;
  giftStatus: 'none' | 'considering' | 'bought';
  selectedGiftName?: string;
  createdAt: string;
}

export interface GiftItem {
  id: string;
  name: string;
  category: string;
  priceEstimate: string;
  priceValue: number;
  matchReason: string;
  matchScore: number;
  shopeeKeyword: string;
  shopeeUrl: string;
  greetingMessage?: string;
  unboxingTip?: string;
  image?: string;
  isShopeeMall?: boolean;
  badge?: string;
  recipientId?: string;
  recipientName?: string;
  savedAt?: string;
  status?: 'considering' | 'bought';
  notes?: string;
}

export interface NotificationSettings {
  unifiedPushEnabled: boolean;
  unifiedPushEndpoint: string;
  unifiedPushDistributor: string;
  emailEnabled: boolean;
  userEmail: string;
  zaloEnabled: boolean;
  zaloPhone: string;
  remindDaysBefore: number[]; // e.g. [7, 3, 1, 0]
  soundEnabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  lastSyncedAt?: string;
}

export interface UpcomingEvent {
  recipientId: string;
  recipientName: string;
  relationship: string;
  eventName: string;
  eventDate: string; // MM-DD or YYYY-MM-DD
  daysLeft: number;
  isToday: boolean;
  avatar?: string;
  giftStatus: 'none' | 'considering' | 'bought';
}

export interface AnnualHoliday {
  id: string;
  name: string;
  shortName: string;
  dateStr: string; // MM-DD
  fullDisplayDate: string;
  description: string;
  targetRelationships: string[];
  suggestedGifts: string[];
  iconType: 'valentine' | 'women' | 'teacher' | 'christmas' | 'newyear' | 'mother' | 'father' | 'children' | 'midautumn';
  themeColor: string;
}

