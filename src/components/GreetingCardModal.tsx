import React, { useState } from 'react';
import { GiftItem } from '../types';
import { MessageSquareHeart, Copy, Check, Heart, Sparkles, X } from 'lucide-react';

interface GreetingCardModalProps {
  gift: GiftItem | null;
  onClose: () => void;
}

export const GreetingCardModal: React.FC<GreetingCardModalProps> = ({ gift, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!gift || !gift.greetingMessage) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(gift.greetingMessage || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Thiệp Chúc Mừng Viết Sẵn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dành tặng: {gift.recipientName || 'Người nhận'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas */}
        <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-orange-50/80 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border border-rose-100 dark:border-rose-900/50 shadow-inner text-center space-y-4">
          <Heart className="w-6 h-6 text-rose-500 mx-auto fill-rose-500/20" />
          
          <p className="text-base sm:text-lg font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
            "{gift.greetingMessage}"
          </p>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kèm quà: {gift.name}</span>
          </div>
        </div>

        {/* Unboxing Tip */}
        {gift.unboxingTip && (
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-xs text-orange-950 dark:text-orange-200">
            <strong>Mẹo trao quà:</strong> {gift.unboxingTip}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Đóng
          </button>

          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã sao chép vào bộ nhớ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép lời chúc</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
