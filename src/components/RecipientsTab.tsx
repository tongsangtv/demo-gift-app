import React, { useState } from 'react';
import { CalendarHeart, Plus, User, Sparkles, Clock, Edit2, Trash2, CheckCircle2, AlertCircle, Gift, Heart, Calendar, ArrowRight, Tag, Flame, Compass } from 'lucide-react';
import { Recipient, UpcomingEvent } from '../types';
import { calculateDaysLeft, getUpcomingAnnualHolidays } from '../utils/storage';

interface RecipientsTabProps {
  recipients: Recipient[];
  onAddRecipient: (recipient: Omit<Recipient, 'id' | 'createdAt'>) => void;
  onUpdateRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (id: string) => void;
  onSelectForAI: (recipient: Recipient) => void;
  onSelectHolidayForAI?: (holidayName: string, recipient?: Recipient) => void;
  upcomingEvents: UpcomingEvent[];
}

export const RecipientsTab: React.FC<RecipientsTabProps> = ({
  recipients,
  onAddRecipient,
  onUpdateRecipient,
  onDeleteRecipient,
  onSelectForAI,
  onSelectHolidayForAI,
  upcomingEvents
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'bought' | 'needed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [showAllHolidays, setShowAllHolidays] = useState(false);

  const annualHolidays = getUpcomingAnnualHolidays();

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formRelationship, setFormRelationship] = useState('Người yêu (Bạn gái)');
  const [formGender, setFormGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nữ');
  const [formBirthday, setFormBirthday] = useState('');
  const [formAnniversaryName, setFormAnniversaryName] = useState('');
  const [formAnniversaryDate, setFormAnniversaryDate] = useState('');
  const [formInterests, setFormInterests] = useState<string>('Mỹ phẩm & Skincare, Decor phòng');
  const [formPersonality, setFormPersonality] = useState('Tinh tế, lãng mạn');
  const [formBudget, setFormBudget] = useState('300.000₫ - 500.000₫');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = (presetHoliday?: { name: string; date: string; defaultRel?: string }) => {
    setEditingRecipient(null);
    setFormName('');
    setFormRelationship(presetHoliday?.defaultRel || 'Người yêu (Bạn gái)');
    setFormGender('Nữ');
    setFormBirthday('');
    setFormAnniversaryName(presetHoliday?.name || '');
    setFormAnniversaryDate(presetHoliday?.date || '');
    setFormInterests('Mỹ phẩm & Skincare, Decor phòng');
    setFormPersonality('Tinh tế, lãng mạn');
    setFormBudget('300.000₫ - 500.000₫');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (r: Recipient) => {
    setEditingRecipient(r);
    setFormName(r.name);
    setFormRelationship(r.relationship);
    setFormGender(r.gender);
    setFormBirthday(r.birthday || '');
    setFormAnniversaryName(r.anniversaryName || '');
    setFormAnniversaryDate(r.anniversaryDate || '');
    setFormInterests(r.interests ? r.interests.join(', ') : '');
    setFormPersonality(r.personality || '');
    setFormBudget(r.budgetPreference || '300.000₫ - 500.000₫');
    setFormNotes(r.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const interestArray = formInterests
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    if (editingRecipient) {
      onUpdateRecipient({
        ...editingRecipient,
        name: formName.trim(),
        relationship: formRelationship,
        gender: formGender,
        birthday: formBirthday || undefined,
        anniversaryName: formAnniversaryName || undefined,
        anniversaryDate: formAnniversaryDate || undefined,
        interests: interestArray,
        personality: formPersonality.trim(),
        budgetPreference: formBudget,
        notes: formNotes.trim(),
      });
    } else {
      onAddRecipient({
        name: formName.trim(),
        relationship: formRelationship,
        gender: formGender,
        birthday: formBirthday || undefined,
        anniversaryName: formAnniversaryName || undefined,
        anniversaryDate: formAnniversaryDate || undefined,
        interests: interestArray,
        personality: formPersonality.trim(),
        budgetPreference: formBudget,
        notes: formNotes.trim(),
        giftStatus: 'none',
      });
    }

    setIsModalOpen(false);
  };

  const toggleGiftStatus = (r: Recipient) => {
    const nextStatus = r.giftStatus === 'none' ? 'considering' : r.giftStatus === 'considering' ? 'bought' : 'none';
    onUpdateRecipient({ ...r, giftStatus: nextStatus });
  };

  // Filtered list
  const filteredRecipients = recipients.filter(r => {
    if (filter === 'bought') return r.giftStatus === 'bought';
    if (filter === 'needed') return r.giftStatus === 'none';
    if (filter === 'upcoming') {
      const bCalc = calculateDaysLeft(r.birthday);
      const aCalc = calculateDaysLeft(r.anniversaryDate);
      return bCalc.days <= 14 || aCalc.days <= 14;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarHeart className="w-7 h-7 text-rose-500" />
            <span>Quản lý Dịp Đặc Biệt & Người Thân</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi sinh nhật, ngày kỷ niệm và các dịp lễ lớn trong năm (14/2, 8/3, 20/11, 20/10, Giáng sinh...) để tặng quà đúng hẹn!
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/25 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm người thân / Dịp mới</span>
        </button>
      </div>

      {/* Lịch Dịp Lễ Đặc Biệt Trong Năm (14/2, 8/3, 20/11, 20/10, 24/12, Tết...) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Lịch Dịp Lễ Đặc Biệt Trong Năm (14/2, 8/3, 20/11, 20/10...)
            </h2>
          </div>
          <button
            onClick={() => setShowAllHolidays(!showAllHolidays)}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
          >
            <span>{showAllHolidays ? 'Thu gọn lịch' : 'Xem toàn bộ dịp lễ trong năm'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(showAllHolidays ? annualHolidays : annualHolidays.slice(0, 3)).map((holiday) => (
            <div
              key={holiday.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 hover:border-orange-300 dark:hover:border-orange-800 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {holiday.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {holiday.fullDisplayDate}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 ${
                    holiday.daysLeft === 0
                      ? 'bg-rose-500 text-white animate-pulse'
                      : holiday.daysLeft <= 14
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {holiday.daysLeft === 0 ? 'Hôm nay!' : `Còn ${holiday.daysLeft} ngày`}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {holiday.description}
                </p>

                {/* Target relationships */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {holiday.targetRelationships.map((rel, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {rel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => openAddModal({ name: holiday.name, date: holiday.dateStr, defaultRel: holiday.targetRelationships[0] })}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gắn cho người thân</span>
                </button>

                <button
                  onClick={() => onSelectHolidayForAI ? onSelectHolidayForAI(holiday.name) : null}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chọn quà AI</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Countdown Alert Banner for Urgent Events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300 text-sm mb-3">
            <Clock className="w-4 h-4 text-rose-500 animate-spin" />
            <span>Sự kiện sắp diễn ra gần nhất:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingEvents.slice(0, 3).map((event, idx) => {
              const matchedRecipient = recipients.find(r => r.id === event.recipientId);

              return (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {event.recipientName}
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      {event.eventName} • {event.eventDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded-lg text-xs font-extrabold ${
                      event.daysLeft === 0
                        ? 'bg-rose-600 text-white animate-pulse'
                        : event.daysLeft <= 3
                        ? 'bg-orange-500 text-white'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                    }`}>
                      {event.daysLeft === 0 ? 'Hôm nay!' : `Còn ${event.daysLeft} ngày`}
                    </span>

                    {matchedRecipient && (
                      <button
                        onClick={() => onSelectForAI(matchedRecipient)}
                        title="AI Gợi ý quà ngay"
                        className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-950 dark:hover:bg-orange-900 dark:text-orange-300"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Tất cả ({recipients.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'upcoming'
              ? 'bg-rose-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Sắp tới trong 14 ngày
        </button>
        <button
          onClick={() => setFilter('needed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'needed'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Chưa chuẩn bị quà
        </button>
        <button
          onClick={() => setFilter('bought')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'bought'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Đã mua quà
        </button>
      </div>

      {/* Recipients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredRecipients.map((r) => {
          const birthdayCalc = calculateDaysLeft(r.birthday);
          const anniversaryCalc = calculateDaysLeft(r.anniversaryDate);

          return (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              
              {/* Header: Name, Relationship & Actions */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-100 to-orange-100 dark:from-rose-950 dark:to-orange-950 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold text-lg border border-rose-200/60 dark:border-rose-900/60 shrink-0">
                      {r.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                        {r.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {r.relationship}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {r.gender}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(r)}
                      title="Chỉnh sửa thông tin"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRecipient(r.id)}
                      title="Xóa người thân"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dates & Countdown */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {r.birthday && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Sinh nhật</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{r.birthday}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        birthdayCalc.days <= 7
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        Còn {birthdayCalc.days} ngày
                      </span>
                    </div>
                  )}

                  {r.anniversaryDate && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block truncate max-w-[110px]">
                          {r.anniversaryName || 'Dịp kỷ niệm'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{r.anniversaryDate}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        anniversaryCalc.days <= 7
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        Còn {anniversaryCalc.days} ngày
                      </span>
                    </div>
                  )}
                </div>

                {/* Interests & Personality Summary */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {r.personality && (
                    <p className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="font-medium truncate">{r.personality}</span>
                    </p>
                  )}
                  {r.interests && r.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {r.interests.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                      {r.interests.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{r.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions: Gift status & AI button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                
                {/* Gift Preparation Status */}
                <button
                  onClick={() => toggleGiftStatus(r)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    r.giftStatus === 'bought'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : r.giftStatus === 'considering'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                  title="Nhấn để đổi trạng thái chuẩn bị quà"
                >
                  {r.giftStatus === 'bought' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Đã có quà</span>
                    </>
                  ) : r.giftStatus === 'considering' ? (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Đang chọn quà</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Chưa có quà</span>
                    </>
                  )}
                </button>

                {/* AI Gift Generator button */}
                <button
                  onClick={() => onSelectForAI(r)}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Gợi ý quà</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarHeart className="w-5 h-5 text-rose-500" />
                <span>{editingRecipient ? 'Chỉnh sửa thông tin người thân' : 'Thêm người thân & Dịp đặc biệt'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Mai Anh, Mẹ yêu..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mối quan hệ *
                  </label>
                  <select
                    value={formRelationship}
                    onChange={(e) => setFormRelationship(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Người yêu (Bạn gái)">Người yêu (Bạn gái)</option>
                    <option value="Người yêu (Bạn trai)">Người yêu (Bạn trai)</option>
                    <option value="Vợ">Vợ</option>
                    <option value="Chồng">Chồng</option>
                    <option value="Bạn thân">Bạn thân</option>
                    <option value="Mẹ">Mẹ</option>
                    <option value="Bố">Bố</option>
                    <option value="Đồng nghiệp">Đồng nghiệp</option>
                    <option value="Sếp / Quản lý">Sếp / Quản lý</option>
                    <option value="Em gái">Em gái</option>
                    <option value="Em trai">Em trai</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Giới tính
                </label>
                <div className="flex gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {(['Nữ', 'Nam', 'Khác'] as const).map(g => (
                    <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={formGender === g}
                        onChange={() => setFormGender(g)}
                        className="text-rose-500 focus:ring-rose-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Birthday */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ngày sinh nhật
                  </label>
                  <input
                    type="date"
                    value={formBirthday}
                    onChange={(e) => setFormBirthday(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ngày kỷ niệm / Dịp đặc biệt
                  </label>
                  <input
                    type="date"
                    value={formAnniversaryDate}
                    onChange={(e) => setFormAnniversaryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Quick Holiday Preset Selector */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 block">
                  Chọn nhanh các dịp lễ đặc biệt trong năm:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '💖 14/2 Valentine', name: '14/2 - Lễ Tình Nhân (Valentine Đỏ)', date: '2027-02-14' },
                    { label: '🌸 8/3 Phụ Nữ', name: '8/3 - Quốc tế Phụ nữ', date: '2027-03-08' },
                    { label: '🎓 20/11 Nhà Giáo VN', name: '20/11 - Ngày Nhà giáo Việt Nam', date: '2026-11-20' },
                    { label: '🌹 20/10 Phụ Nữ VN', name: '20/10 - Ngày Phụ nữ Việt Nam', date: '2026-10-20' },
                    { label: '🎄 24/12 Giáng Sinh', name: '24/12 - Lễ Giáng Sinh (Noel)', date: '2026-12-24' },
                    { label: '🧧 Tết Cổ Truyền', name: 'Tết Nguyên Đán (Tết Cổ Truyền)', date: '2027-01-29' },
                    { label: '🤍 14/3 Valentine Trắng', name: '14/3 - Valentine Trắng (White Day)', date: '2027-03-14' },
                    { label: '💐 Ngày của Mẹ', name: 'Ngày của Mẹ (Mother’s Day)', date: '2027-05-10' },
                    { label: '👔 Ngày của Cha', name: 'Ngày của Cha (Father’s Day)', date: '2027-06-21' },
                    { label: '🎈 1/6 Thiếu Nhi', name: '01/06 - Quốc tế Thiếu nhi', date: '2027-06-01' },
                    { label: '💑 Kỷ niệm yêu', name: 'Kỷ niệm ngày yêu nhau', date: '2024-12-15' },
                    { label: '💍 Kỷ niệm ngày cưới', name: 'Kỷ niệm ngày cưới', date: '2023-05-20' }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormAnniversaryName(preset.name);
                        setFormAnniversaryDate(preset.date);
                      }}
                      className="px-2 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:text-rose-600 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên dịp kỷ niệm
                </label>
                <input
                  type="text"
                  value={formAnniversaryName}
                  onChange={(e) => setFormAnniversaryName(e.target.value)}
                  placeholder="VD: 14/2 Valentine, 8/3 Quốc tế Phụ nữ, 20/11..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Interests & Personality */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sở thích (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formInterests}
                  onChange={(e) => setFormInterests(e.target.value)}
                  placeholder="VD: Nấu ăn, Mỹ phẩm, Nến thơm, Đọc sách..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tính cách / Vibe
                </label>
                <input
                  type="text"
                  value={formPersonality}
                  onChange={(e) => setFormPersonality(e.target.value)}
                  placeholder="VD: Tinh tế & lãng mạn, Thực tế tiện dụng..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Khoảng ngân sách dự kiến
                </label>
                <input
                  type="text"
                  value={formBudget}
                  onChange={(e) => setFormBudget(e.target.value)}
                  placeholder="VD: 300.000₫ - 500.000₫"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ghi chú riêng (Kích thước áo, dị ứng, gu màu...)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="VD: Thích màu pastel, ghét đồ ngọt..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-500 hover:bg-rose-600 shadow-sm"
                >
                  {editingRecipient ? 'Cập nhật' : 'Lưu người thân'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
