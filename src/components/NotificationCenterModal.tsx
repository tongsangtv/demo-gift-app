import React, { useState } from 'react';
import { UpcomingEvent, Recipient } from '../types';
import { Bell, Clock, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight, Flame } from 'lucide-react';
import { getUpcomingAnnualHolidays } from '../utils/storage';

interface NotificationCenterModalProps {
  events: UpcomingEvent[];
  recipients: Recipient[];
  isOpen: boolean;
  onClose: () => void;
  onSelectForAI: (recipient: Recipient) => void;
  onSelectHolidayForAI?: (holidayName: string) => void;
  onOpenSettings: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  events,
  recipients,
  isOpen,
  onClose,
  onSelectForAI,
  onSelectHolidayForAI,
  onOpenSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'recipients' | 'holidays'>('recipients');
  const annualHolidays = getUpcomingAnnualHolidays();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Trung Tâm Nhắc Lịch & Dịp Lễ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {events.length} sự kiện sắp tới được theo dõi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('recipients')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
              activeSubTab === 'recipients'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Dịp người thân ({events.length})
          </button>
          <button
            onClick={() => setActiveSubTab('holidays')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'holidays'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Lễ lớn (14/2, 8/3, 20/11...)</span>
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {activeSubTab === 'recipients' ? (
            events.length === 0 ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-xs">
                Hiện không có ngày sinh nhật hay dịp kỷ niệm nào sắp tới.
              </div>
            ) : (
              events.map((ev, idx) => {
                const r = recipients.find(rec => rec.id === ev.recipientId);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {ev.recipientName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {ev.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {ev.eventName} ({ev.eventDate})
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {ev.giftStatus === 'bought' ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã có quà
                          </span>
                        ) : (
                          <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Chưa mua quà
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                        ev.daysLeft === 0
                          ? 'bg-rose-600 text-white animate-pulse'
                          : ev.daysLeft <= 3
                          ? 'bg-orange-500 text-white'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {ev.daysLeft === 0 ? 'Hôm nay!' : `Còn ${ev.daysLeft} ngày`}
                      </span>

                      {r && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectForAI(r);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950 transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Gợi ý quà</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            annualHolidays.map((holiday) => (
              <div
                key={holiday.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {holiday.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {holiday.fullDisplayDate} • Dành cho: {holiday.targetRelationships.slice(0, 2).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                    Gợi ý: {holiday.suggestedGifts.slice(0, 2).join(', ')}...
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                    holiday.daysLeft === 0
                      ? 'bg-rose-600 text-white animate-pulse'
                      : holiday.daysLeft <= 14
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {holiday.daysLeft === 0 ? 'Hôm nay!' : `Còn ${holiday.daysLeft} ngày`}
                  </span>

                  <button
                    onClick={() => {
                      onClose();
                      if (onSelectHolidayForAI) {
                        onSelectHolidayForAI(holiday.name);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 shadow-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Chọn quà AI</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Cài đặt thông báo Email / Zalo / Push
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
