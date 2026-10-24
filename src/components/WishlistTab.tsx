import React, { useState } from 'react';
import { BookmarkCheck, ShoppingBag, ExternalLink, Trash2, CheckCircle2, Clock, MessageSquareHeart, User, DollarSign, Filter, Gift } from 'lucide-react';
import { GiftItem } from '../types';
import { formatVND } from '../utils/storage';

interface WishlistTabProps {
  wishlist: GiftItem[];
  onRemoveFromWishlist: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onOpenCardModal: (gift: GiftItem) => void;
  onSwitchToGenerator: () => void;
}

export const WishlistTab: React.FC<WishlistTabProps> = ({
  wishlist,
  onRemoveFromWishlist,
  onToggleStatus,
  onOpenCardModal,
  onSwitchToGenerator
}) => {
  const [filterRecipient, setFilterRecipient] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'considering' | 'bought'>('all');

  // Calculate statistics
  const totalItems = wishlist.length;
  const boughtItems = wishlist.filter(g => g.status === 'bought').length;
  const totalBudget = wishlist.reduce((acc, curr) => acc + (curr.priceValue || 0), 0);
  const spentBudget = wishlist
    .filter(g => g.status === 'bought')
    .reduce((acc, curr) => acc + (curr.priceValue || 0), 0);

  // Get distinct recipients in wishlist
  const distinctRecipients = Array.from(
    new Set(wishlist.map(g => g.recipientName).filter(Boolean))
  ) as string[];

  // Filtered list
  const filteredList = wishlist.filter(item => {
    if (filterRecipient !== 'all' && item.recipientName !== filterRecipient) return false;
    if (filterStatus === 'considering' && item.status === 'bought') return false;
    if (filterStatus === 'bought' && item.status !== 'bought') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookmarkCheck className="w-7 h-7 text-amber-500" />
            <span>Danh Sách Quà Tặng Yêu Thích (Wishlist)</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Lưu giữ những món quà Shopee đã chọn lọc, theo dõi ngân sách và tiến độ chuẩn bị quà cho từng người thân.
          </p>
        </div>

        <button
          onClick={onSwitchToGenerator}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm shrink-0"
        >
          <Gift className="w-4 h-4" />
          <span>Tìm thêm quà tặng bằng AI</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng món đã lưu</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalItems}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Đã chốt mua</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {boughtItems} / {totalItems}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dự toán ngân sách</p>
          <p className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {formatVND(totalBudget)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Đã chi trả</p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatVND(spentBudget)}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Filter by Recipient */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Người nhận:</span>
          <select
            value={filterRecipient}
            onChange={(e) => setFilterRecipient(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả người thân</option>
            {distinctRecipients.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus('considering')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'considering'
                ? 'bg-amber-500 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Đang cân nhắc
          </button>
          <button
            onClick={() => setFilterStatus('bought')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'bought'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Đã mua quà
          </button>
        </div>

      </div>

      {/* Empty State */}
      {filteredList.length === 0 && (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 mx-auto">
            <BookmarkCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Chưa có món quà nào trong mục này
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Hãy dùng tính năng AI Gợi ý quà hoặc khám phá Shopee Hot để lưu những món quà ý nghĩa nhất vào Wishlist của bạn!
            </p>
          </div>
          <button
            onClick={onSwitchToGenerator}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 shadow-sm"
          >
            Khám phá quà tặng ngay
          </button>
        </div>
      )}

      {/* Gift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((item) => {
          const isBought = item.status === 'bought';

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm transition-all space-y-4 flex flex-col justify-between ${
                isBought
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60'
              }`}
            >
              
              <div>
                
                {/* Top Badges & Recipient */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.recipientName && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{item.recipientName}</span>
                      </span>
                    )}
                    {item.isShopeeMall && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white">
                        Shopee Mall
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Xóa khỏi Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Name & Price */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`font-bold text-base text-slate-900 dark:text-white leading-snug ${
                    isBought ? 'line-through text-slate-500 dark:text-slate-400' : ''
                  }`}>
                    {item.name}
                  </h3>
                  <span className="font-extrabold text-sm text-orange-600 dark:text-orange-400 shrink-0">
                    {item.priceEstimate}
                  </span>
                </div>

                {/* Match reason */}
                {item.matchReason && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {item.matchReason}
                  </p>
                )}

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                
                {/* Status Toggle Button */}
                <button
                  onClick={() => onToggleStatus(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isBought
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {isBought ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã mua xong</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Đang cân nhắc</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  {/* Card Message Modal Button */}
                  {item.greetingMessage && (
                    <button
                      onClick={() => onOpenCardModal(item)}
                      className="p-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60"
                      title="Xem thiệp chúc mừng"
                    >
                      <MessageSquareHeart className="w-4 h-4" />
                    </button>
                  )}

                  {/* Buy on Shopee */}
                  <a
                    href={item.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Mua trên Shopee</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
