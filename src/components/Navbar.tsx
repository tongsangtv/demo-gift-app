import React from 'react';
import { Gift, CalendarHeart, BookmarkCheck, ShoppingBag, Settings, Sun, Moon, Cloud, CheckCircle2, Bell, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { UserProfile, UpcomingEvent } from '../types';

interface NavbarProps {
  activeTab: 'generator' | 'recipients' | 'wishlist' | 'catalog' | 'settings';
  setActiveTab: (tab: 'generator' | 'recipients' | 'wishlist' | 'catalog' | 'settings') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: UserProfile;
  isSyncing: boolean;
  lastSyncedAt: string;
  onManualSync: () => void;
  upcomingEvents: UpcomingEvent[];
  onOpenNotifications: () => void;
  wishlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  user,
  isSyncing,
  lastSyncedAt,
  onManualSync,
  upcomingEvents,
  onOpenNotifications,
  wishlistCount
}) => {
  // Urgent events in next 7 days
  const urgentCount = upcomingEvents.filter(e => e.daysLeft <= 7).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-white/90 border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Shopee<span className="text-orange-500">Gift</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Gợi ý quà tặng & Nhắc lịch thông minh
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'generator'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>AI Gợi ý quà</span>
            </button>

            <button
              onClick={() => setActiveTab('recipients')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'recipients'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarHeart className="w-4 h-4 text-rose-500" />
              <span>Dịp & Người thân</span>
              {urgentCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {urgentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-amber-500" />
              <span>Đã lưu</span>
              {wishlistCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>Shopee Hot</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-indigo-500" />
              <span>Cài đặt & Đồng bộ</span>
            </button>
          </nav>

          {/* Right Actions: Sync status, Notifications, Theme, User */}
          <div className="flex items-center gap-2">
            
            {/* Cloud Sync indicator */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              title={`Đám mây: ${isSyncing ? 'Đang đồng bộ...' : 'Đã đồng bộ an toàn'}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'text-blue-500 animate-spin' : 'text-emerald-500'}`} />
              <span className="hidden xl:inline">
                {isSyncing ? 'Đang đồng bộ...' : 'Đám mây đã lưu'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Thông báo nhắc lịch"
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Google User Avatar / Profile */}
            <div
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer"
              title={`Tài khoản Google: ${user.email}`}
            >
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/50"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1">
                  Google Sync
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur px-2 py-1.5 flex justify-around items-center">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'generator' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Gợi ý AI</span>
        </button>

        <button
          onClick={() => setActiveTab('recipients')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'recipients' ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarHeart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dịp lễ</span>
          {urgentCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'wishlist' ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Đã lưu</span>
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 px-1 text-[9px] rounded-full bg-amber-500 text-white font-bold">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'catalog' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Shopee</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'settings' ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Cài đặt</span>
        </button>
      </div>
    </header>
  );
};
