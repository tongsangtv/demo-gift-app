import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, ExternalLink, Heart, BookmarkPlus, Check, Copy, Gift, MessageSquareHeart, Lightbulb, User, ChevronRight, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Recipient, GiftItem } from '../types';

interface GiftGeneratorTabProps {
  recipients: Recipient[];
  initialRecipientId?: string | null;
  initialOccasion?: string | null;
  onSaveToWishlist: (gift: GiftItem) => void;
  savedGifts: GiftItem[];
  onOpenCardModal: (gift: GiftItem) => void;
}

const INTEREST_OPTIONS = [
  'Công nghệ & Gadgets',
  'Mỹ phẩm & Skincare',
  'Thời trang & Phụ kiện',
  'Nến thơm & Decor phòng',
  'Nấu ăn & Làm bánh',
  'Sách & Văn phòng phẩm',
  'Du lịch & Dã ngoại',
  'Thể thao & Fitness',
  'Boardgame & Trò chơi',
  'Trà & Cà phê thư giãn',
  'Chăm sóc cây cảnh',
  'Nuôi thú cưng (Chó/Mèo)'
];

const PERSONALITY_OPTIONS = [
  'Tinh tế & Lãng mạn',
  'Thực tế & Tiện dụng',
  'Năng động & Hài hước',
  'Tối giản & Hiện đại',
  'Sang trọng & Đẳng cấp',
  'Đáng yêu & Dễ thương',
  'Trầm tính & Sâu sắc'
];

const BUDGET_OPTIONS = [
  'Dưới 150.000₫',
  '150.000₫ - 300.000₫',
  '300.000₫ - 500.000₫',
  '500.000₫ - 1.000.000₫',
  '1.000.000₫ - 2.000.000₫',
  'Trên 2.000.000₫'
];

// Comprehensive list of Vietnamese Special Occasions & Holidays
const OCCASIONS = [
  '14/2 - Lễ Tình Nhân (Valentine Đỏ)',
  '8/3 - Quốc tế Phụ nữ',
  '20/11 - Ngày Nhà giáo Việt Nam',
  '20/10 - Ngày Phụ nữ Việt Nam',
  '24/12 - Lễ Giáng Sinh (Noel)',
  'Tết Nguyên Đán (Tết Cổ Truyền)',
  '01/01 - Tết Dương Lịch',
  '14/3 - Valentine Trắng (White Day)',
  '14/4 - Valentine Đen (Cho người độc thân)',
  'Ngày của Mẹ (Mother’s Day)',
  'Ngày của Cha (Father’s Day)',
  '01/06 - Quốc tế Thiếu nhi',
  '28/06 - Ngày Gia đình Việt Nam',
  'Tết Trung Thu (Rằm tháng 8)',
  '13/10 - Ngày Doanh nhân Việt Nam',
  '27/02 - Ngày Thầy thuốc Việt Nam',
  'Sinh nhật',
  'Kỷ niệm ngày yêu / ngày cưới',
  'Tân gia nhà mới',
  'Lễ tốt nghiệp / Khởi đầu mới',
  'Thăng chức / Mừng thành công',
  'Quà bất ngờ / Cảm ơn'
];

// Quick Access Chips for most popular special holidays
const FEATURED_HOLIDAY_CHIPS = [
  { label: '💖 14/2 Valentine', val: '14/2 - Lễ Tình Nhân (Valentine Đỏ)', defaultRel: 'Người yêu (Bạn gái)' },
  { label: '🌸 8/3 Phụ Nữ', val: '8/3 - Quốc tế Phụ nữ', defaultRel: 'Mẹ' },
  { label: '🎓 20/11 Nhà Giáo VN', val: '20/11 - Ngày Nhà giáo Việt Nam', defaultRel: 'Sếp / Quản lý' },
  { label: '🌹 20/10 Phụ Nữ VN', val: '20/10 - Ngày Phụ nữ Việt Nam', defaultRel: 'Người yêu (Bạn gái)' },
  { label: '🎄 24/12 Giáng Sinh', val: '24/12 - Lễ Giáng Sinh (Noel)', defaultRel: 'Người yêu (Bạn gái)' },
  { label: '🧧 Tết Cổ Truyền', val: 'Tết Nguyên Đán (Tết Cổ Truyền)', defaultRel: 'Bố' },
  { label: '🤍 14/3 Valentine Trắng', val: '14/3 - Valentine Trắng (White Day)', defaultRel: 'Người yêu (Bạn gái)' },
  { label: '💐 Ngày của Mẹ', val: 'Ngày của Mẹ (Mother’s Day)', defaultRel: 'Mẹ' },
  { label: '👔 Ngày của Cha', val: 'Ngày của Cha (Father’s Day)', defaultRel: 'Bố' },
  { label: '🎂 Sinh nhật', val: 'Sinh nhật', defaultRel: 'Bạn thân' }
];

const RELATIONSHIPS = [
  'Người yêu (Bạn gái)',
  'Người yêu (Bạn trai)',
  'Vợ',
  'Chồng',
  'Bạn thân',
  'Mẹ',
  'Bố',
  'Đồng nghiệp',
  'Sếp / Quản lý',
  'Em gái',
  'Em trai',
  'Chị gái / Anh trai',
  'Khác'
];

export const GiftGeneratorTab: React.FC<GiftGeneratorTabProps> = ({
  recipients,
  initialRecipientId,
  initialOccasion,
  onSaveToWishlist,
  savedGifts,
  onOpenCardModal
}) => {
  // Form State
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(initialRecipientId || '');
  const [recipientName, setRecipientName] = useState<string>('Người thương');
  const [relationship, setRelationship] = useState<string>('Người yêu (Bạn gái)');
  const [occasion, setOccasion] = useState<string>(initialOccasion || '14/2 - Lễ Tình Nhân (Valentine Đỏ)');
  const [budget, setBudget] = useState<string>('300.000₫ - 500.000₫');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Mỹ phẩm & Skincare', 'Nến thơm & Decor phòng']);
  const [personality, setPersonality] = useState<string>('Tinh tế & Lãng mạn');
  const [customNotes, setCustomNotes] = useState<string>('');
  
  // Results & Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<GiftItem[]>([]);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [copiedGreetingId, setCopiedGreetingId] = useState<string | null>(null);

  // Sync initial occasion prop if changed
  useEffect(() => {
    if (initialOccasion) {
      setOccasion(initialOccasion);
    }
  }, [initialOccasion]);

  // Sync recipient change
  useEffect(() => {
    if (selectedRecipientId) {
      const found = recipients.find(r => r.id === selectedRecipientId);
      if (found) {
        setRecipientName(found.name);
        setRelationship(found.relationship);
        if (found.budgetPreference) setBudget(found.budgetPreference);
        if (found.personality) setPersonality(found.personality);
        if (found.interests && found.interests.length > 0) setSelectedInterests(found.interests);
        if (found.notes) setCustomNotes(found.notes);
      }
    }
  }, [selectedRecipientId, recipients]);

  // Handle interest toggle
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Generate recommendations via AI
  const handleGenerate = async () => {
    setIsLoading(true);
    setLoadingStep('Đang phân tích tính cách và mối quan hệ...');

    const timer1 = setTimeout(() => {
      setLoadingStep('Đang tìm kiếm sản phẩm phù hợp trên Shopee Việt Nam...');
    }, 700);

    const timer2 = setTimeout(() => {
      setLoadingStep('Đang sáng tạo thông điệp thiệp chúc mừng ý nghĩa...');
    }, 1400);

    try {
      const response = await fetch('/api/ai/recommend-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship,
          occasion,
          interests: selectedInterests,
          personality,
          budget,
          recipientName,
          notes: customNotes
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.gifts)) {
        // Map gifts with recipient info
        const enriched = data.gifts.map((g: any) => ({
          ...g,
          recipientId: selectedRecipientId || undefined,
          recipientName: recipientName
        }));
        setResults(enriched);
      }
    } catch (err) {
      console.error('Error fetching recommendations', err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
    }
  };

  // Run initial recommendation if results empty
  useEffect(() => {
    if (results.length === 0) {
      handleGenerate();
    }
  }, []);

  const copyGreeting = (gift: GiftItem) => {
    if (gift.greetingMessage) {
      navigator.clipboard.writeText(gift.greetingMessage);
      setCopiedGreetingId(gift.id);
      setTimeout(() => setCopiedGreetingId(null), 2500);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Đề Xuất Quà Chuẩn Gu & Liên Kết Shopee</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Tặng quà đúng ý, người nhận mê ly!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-orange-50 font-medium leading-relaxed">
            Chọn tính cách, ngân sách và sở thích. Trợ lý AI sẽ thiết kế ngay 4 món quà tinh tế kèm đường link Shopee chuẩn xác và lời chúc thiệp mừng viết sẵn.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-6 -bottom-8 opacity-20 pointer-events-none">
          <Gift className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Parameters Configuration */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Tiêu chí chọn quà
              </h2>
            </div>
            {recipients.length > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {recipients.length} người thân đã lưu
              </span>
            )}
          </div>

          {/* Quick select from registered Recipients */}
          {recipients.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Chọn nhanh từ danh bạ người thân:
              </label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">-- Nhập thông tin tùy ý (không theo mẫu) --</option>
                {recipients.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.relationship})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Recipient Name & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên người nhận
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ví dụ: Mai Anh, Mẹ, Bạn Tuấn"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mối quan hệ
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {RELATIONSHIPS.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Occasion & Quick Holiday Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Dịp đặc biệt / Ngày lễ
              </label>
              <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
                Chọn nhanh bên dưới:
              </span>
            </div>

            {/* Quick Holiday Chips */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {FEATURED_HOLIDAY_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setOccasion(chip.val);
                    if (!selectedRecipientId && chip.defaultRel) {
                      setRelationship(chip.defaultRel);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    occasion === chip.val
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {OCCASIONS.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ngân sách dự kiến
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUDGET_OPTIONS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    budget === b
                      ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Personality / Vibe */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tính cách & Vibe của người nhận
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PERSONALITY_OPTIONS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPersonality(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    personality === p
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Interests multi-select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Sở thích của người ấy (Chọn 1 hoặc nhiều):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_OPTIONS.map(item => {
                const isSelected = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú thêm (Màu sắc, dị ứng, điều kiêng kỵ...)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="VD: Thích phong cách tối giản màu be, ghé xem đồ thiết thực..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-md shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI đang tìm kiếm & sáng tạo quà...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Khám phá gợi ý quà tặng Shopee ngay</span>
              </>
            )}
          </button>

        </div>

        {/* Right Area: Results Display */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange-500" />
              <span>Gợi ý quà cho: <span className="text-orange-500">{recipientName}</span> ({occasion})</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {results.length} món quà được đề xuất
            </span>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="rounded-2xl border border-dashed border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white mx-auto animate-bounce">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  {loadingStep}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Đang quét hàng triệu sản phẩm đánh giá cao trên Shopee...
                </p>
              </div>
            </div>
          )}

          {/* Cards List */}
          {!isLoading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((gift) => {
                const isAlreadySaved = savedGifts.some(s => s.name === gift.name || (s.shopeeKeyword && s.shopeeKeyword === gift.shopeeKeyword));

                return (
                  <div
                    key={gift.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-orange-300 dark:hover:border-orange-700/60 transition-all space-y-4"
                  >
                    
                    {/* Top row: Match Score & Shopee Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {gift.isShopeeMall && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white tracking-wider">
                              Shopee Mall
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            {gift.category}
                          </span>
                          {gift.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {gift.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                          {gift.name}
                        </h3>
                      </div>

                      {/* Match Score */}
                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{gift.matchScore || 95}% Phù hợp</span>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-1">
                          {gift.priceEstimate}
                        </span>
                      </div>
                    </div>

                    {/* AI Psychology Reason */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Tại sao nên chọn: </span>
                        <span>{gift.matchReason}</span>
                      </div>
                    </div>

                    {/* Greeting Message Snippet */}
                    {gift.greetingMessage && (
                      <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-xs text-rose-950 dark:text-rose-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300 text-[11px] uppercase tracking-wider">
                            <MessageSquareHeart className="w-3.5 h-3.5" />
                            <span>Gợi ý thiệp mừng viết sẵn:</span>
                          </div>
                          <button
                            onClick={() => copyGreeting(gift)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 transition-colors"
                          >
                            {copiedGreetingId === gift.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400">Đã sao chép!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy lời chúc</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="italic font-serif text-slate-700 dark:text-slate-200">
                          "{gift.greetingMessage}"
                        </p>
                      </div>
                    )}

                    {/* Unboxing Tip */}
                    {gift.unboxingTip && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span><strong>Mẹo tặng quà:</strong> {gift.unboxingTip}</span>
                      </p>
                    )}

                    {/* Actions: Shopee Button & Wishlist Save */}
                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      
                      {/* Direct Shopee Button */}
                      <a
                        href={gift.shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Xem & Mua ngay trên Shopee</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>

                      {/* Save to Wishlist Button */}
                      <button
                        onClick={() => onSaveToWishlist(gift)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isAlreadySaved
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isAlreadySaved ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-500" />
                            <span>Đã lưu vào Wishlist</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5 text-orange-500" />
                            <span>Lưu vào Wishlist</span>
                          </>
                        )}
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
