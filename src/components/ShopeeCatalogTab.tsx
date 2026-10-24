import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ExternalLink, BookmarkPlus, Check, Star, Tag, SlidersHorizontal, User } from 'lucide-react';
import { GiftItem, Recipient } from '../types';

interface ShopeeCatalogTabProps {
  onSaveToWishlist: (gift: GiftItem) => void;
  savedGifts: GiftItem[];
  recipients: Recipient[];
}

const CATEGORIES = [
  'Tất cả',
  'Decor & Hương thơm',
  'Làm đẹp & Mỹ phẩm',
  'Công nghệ & Âm thanh',
  'Gia dụng & Tiện ích',
  'Ẩm thực & Quà tặng sức khỏe',
  'Văn phòng phẩm & Kỷ niệm'
];

export const ShopeeCatalogTab: React.FC<ShopeeCatalogTabProps> = ({
  onSaveToWishlist,
  savedGifts,
  recipients
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Tất cả') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (maxPrice) params.append('maxPrice', String(maxPrice));

      const res = await fetch(`/api/shopee/catalog?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (e) {
      console.error('Error fetching Shopee catalog', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleSaveItem = (item: any) => {
    const matchedRecipient = recipients.find(r => r.id === selectedRecipientId);

    const gift: GiftItem = {
      id: `shopee-${item.id}-${Date.now()}`,
      name: item.name,
      category: item.category,
      priceEstimate: item.priceDisplay,
      priceValue: item.price,
      matchReason: `Món quà thịnh hành Shopee, điểm đánh giá cao (${item.rating}⭐, ${item.salesCount} đã bán).`,
      matchScore: 95,
      shopeeKeyword: item.shopeeKeyword,
      shopeeUrl: item.shopeeUrl,
      greetingMessage: `Chúc bạn có một ngày thật trọn vẹn và hạnh phúc với món quà ngọt ngào này!`,
      image: item.image,
      isShopeeMall: item.isShopeeMall,
      recipientId: matchedRecipient?.id,
      recipientName: matchedRecipient?.name,
      status: 'considering'
    };

    onSaveToWishlist(gift);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-500" />
            <span>Shopee Hot - Quà Tặng Thịnh Hành</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tổng hợp các sản phẩm quà tặng bán chạy nhất trên Shopee Việt Nam, có lượt mua khủng và đánh giá từ 4.8 sao.
          </p>
        </div>

        {/* Quick Assign to Recipient */}
        {recipients.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Dành tặng cho:
            </span>
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="px-2 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
            >
              <option value="">-- Chọn người nhận khi lưu --</option>
              {recipients.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
        
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm quà tặng Shopee (nến thơm, son môi, tai nghe, bình giữ nhiệt...)"
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 rounded-lg font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price quick filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Lọc giá:</span>
          {[
            { label: 'Tất cả giá', val: null },
            { label: '< 200k', val: 200000 },
            { label: '< 500k', val: 500000 },
            { label: '< 1 triệu', val: 1000000 },
          ].map(p => (
            <button
              key={p.label}
              onClick={() => setMaxPrice(p.val)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                maxPrice === p.val
                  ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isSaved = savedGifts.some(s => s.name === item.name);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isShopeeMall && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white tracking-wider shadow">
                      Shopee Mall
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{item.rating} ({item.salesCount})</span>
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    {item.category}
                  </span>
                  
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-extrabold text-base text-red-600 dark:text-red-400">
                      {item.priceDisplay}
                    </span>
                    {item.originalPriceDisplay && (
                      <span className="text-xs text-slate-400 line-through">
                        {item.originalPriceDisplay}
                      </span>
                    )}
                  </div>

                  {/* Suitable For */}
                  {item.suitableFor && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.suitableFor.slice(0, 2).map((s: string, idx: number) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-600 dark:text-slate-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 space-y-2">
                <a
                  href={item.shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Mua trên Shopee</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <button
                  onClick={() => handleSaveItem(item)}
                  className={`w-full py-2 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                    isSaved
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isSaved ? (
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

    </div>
  );
};
