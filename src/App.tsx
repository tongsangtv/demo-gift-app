import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { GiftGeneratorTab } from './components/GiftGeneratorTab';
import { RecipientsTab } from './components/RecipientsTab';
import { WishlistTab } from './components/WishlistTab';
import { ShopeeCatalogTab } from './components/ShopeeCatalogTab';
import { NotificationSyncTab } from './components/NotificationSyncTab';
import { GreetingCardModal } from './components/GreetingCardModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import {
  getLocalRecipients,
  saveLocalRecipients,
  getLocalWishlist,
  saveLocalWishlist,
  getLocalSettings,
  saveLocalSettings,
  getLocalUserProfile,
  saveLocalUserProfile,
  getUpcomingEvents,
  INITIAL_RECIPIENTS,
  INITIAL_WISHLIST,
  DEFAULT_SETTINGS
} from './utils/storage';
import { Recipient, GiftItem, NotificationSettings, UserProfile } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'generator' | 'recipients' | 'wishlist' | 'catalog' | 'settings'>('generator');
  
  // Data States
  const [recipients, setRecipients] = useState<Recipient[]>(() => getLocalRecipients());
  const [wishlist, setWishlist] = useState<GiftItem[]>(() => getLocalWishlist());
  const [settings, setSettings] = useState<NotificationSettings>(() => getLocalSettings());
  const [user, setUser] = useState<UserProfile>(() => getLocalUserProfile());
  
  // App State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('shopeegift_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => user.lastSyncedAt || new Date().toISOString());
  
  // Cross-tab & Modal states
  const [selectedRecipientIdForAI, setSelectedRecipientIdForAI] = useState<string | null>(null);
  const [selectedOccasionForAI, setSelectedOccasionForAI] = useState<string | null>(null);
  const [activeCardModalGift, setActiveCardModalGift] = useState<GiftItem | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync ref to debounce cloud sync
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply Dark Mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('shopeegift_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Helper for quick toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync with Cloud Server
  const syncWithCloud = async (overrideRecipients?: Recipient[], overrideWishlist?: GiftItem[], overrideSettings?: NotificationSettings) => {
    setIsSyncing(true);
    try {
      const payload = {
        userId: user.id,
        recipients: overrideRecipients || recipients,
        wishlist: overrideWishlist || wishlist,
        settings: overrideSettings || settings
      };

      const res = await fetch('/api/cloud-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setLastSyncedAt(data.lastSyncedAt);
      }
    } catch (e) {
      console.warn('Background sync queued or offline:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Debounced cloud sync on data mutation
  const triggerDebouncedSync = (newRecipients?: Recipient[], newWishlist?: GiftItem[], newSettings?: NotificationSettings) => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncWithCloud(newRecipients, newWishlist, newSettings);
    }, 1200);
  };

  // Initial cloud check on boot
  useEffect(() => {
    const fetchInitialCloudData = async () => {
      try {
        const res = await fetch(`/api/cloud-sync?userId=${user.id}`);
        const data = await res.json();
        if (data.success && data.data) {
          if (Array.isArray(data.data.recipients) && data.data.recipients.length > 0) {
            setRecipients(data.data.recipients);
            saveLocalRecipients(data.data.recipients);
          }
          if (Array.isArray(data.data.wishlist) && data.data.wishlist.length > 0) {
            setWishlist(data.data.wishlist);
            saveLocalWishlist(data.data.wishlist);
          }
          if (data.data.lastSyncedAt) {
            setLastSyncedAt(data.data.lastSyncedAt);
          }
        }
      } catch (e) {
        console.warn('Initial cloud fetch skipped, using local cache', e);
      }
    };

    fetchInitialCloudData();
  }, []);

  // Compute upcoming occasions
  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(recipients);
  }, [recipients]);

  // Recipient Handlers
  const handleAddRecipient = (r: Omit<Recipient, 'id' | 'createdAt'>) => {
    const newRecipient: Recipient = {
      ...r,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newRecipient, ...recipients];
    setRecipients(updated);
    saveLocalRecipients(updated);
    triggerDebouncedSync(updated, wishlist, settings);
    showToast(`Đã thêm "${newRecipient.name}" vào danh sách theo dõi!`);
  };

  const handleUpdateRecipient = (updatedR: Recipient) => {
    const updated = recipients.map(r => r.id === updatedR.id ? updatedR : r);
    setRecipients(updated);
    saveLocalRecipients(updated);
    triggerDebouncedSync(updated, wishlist, settings);
    showToast(`Đã cập nhật thông tin của "${updatedR.name}"!`);
  };

  const handleDeleteRecipient = (id: string) => {
    const target = recipients.find(r => r.id === id);
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${target?.name || 'người này'}"?`)) return;

    const updated = recipients.filter(r => r.id !== id);
    setRecipients(updated);
    saveLocalRecipients(updated);
    triggerDebouncedSync(updated, wishlist, settings);
    showToast('Đã xóa người thân khỏi danh sách.');
  };

  const handleSelectForAI = (r: Recipient) => {
    setSelectedRecipientIdForAI(r.id);
    setActiveTab('generator');
  };

  const handleSelectHolidayForAI = (holidayName: string, r?: Recipient) => {
    setSelectedOccasionForAI(holidayName);
    if (r) {
      setSelectedRecipientIdForAI(r.id);
    } else {
      setSelectedRecipientIdForAI(null);
    }
    setActiveTab('generator');
  };

  // Wishlist Handlers
  const handleSaveToWishlist = (gift: GiftItem) => {
    const exists = wishlist.some(g => g.name === gift.name);
    if (exists) {
      showToast('Món quà này đã có trong Wishlist của bạn!');
      return;
    }

    const updated = [gift, ...wishlist];
    setWishlist(updated);
    saveLocalWishlist(updated);
    triggerDebouncedSync(recipients, updated, settings);
    showToast(`Đã thêm "${gift.name}" vào Wishlist!`);
  };

  const handleRemoveFromWishlist = (id: string) => {
    const updated = wishlist.filter(g => g.id !== id);
    setWishlist(updated);
    saveLocalWishlist(updated);
    triggerDebouncedSync(recipients, updated, settings);
    showToast('Đã xóa món quà khỏi Wishlist.');
  };

  const handleToggleWishlistStatus = (id: string) => {
    const updated = wishlist.map(g => {
      if (g.id === id) {
        const nextStatus = g.status === 'bought' ? 'considering' : 'bought';
        return { ...g, status: nextStatus as 'considering' | 'bought' };
      }
      return g;
    });

    setWishlist(updated);
    saveLocalWishlist(updated);
    triggerDebouncedSync(recipients, updated, settings);
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    saveLocalSettings(newSettings);
    triggerDebouncedSync(recipients, wishlist, newSettings);
    showToast('Đã lưu cấu hình thông báo!');
  };

  // User Handlers
  const handleUpdateUser = (newUser: UserProfile) => {
    setUser(newUser);
    saveLocalUserProfile(newUser);
    showToast('Đã cập nhật thông tin tài khoản!');
  };

  // Backup Export & Import
  const handleExportBackup = () => {
    const backupData = {
      app: 'ShopeeGift AI',
      exportedAt: new Date().toISOString(),
      user,
      recipients,
      wishlist,
      settings
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopeegift-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải file sao lưu thành công!');
  };

  const handleImportBackup = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.recipients || !data.wishlist) {
        throw new Error('Định dạng file không đúng cấu trúc ShopeeGift AI');
      }

      setRecipients(data.recipients);
      saveLocalRecipients(data.recipients);

      setWishlist(data.wishlist);
      saveLocalWishlist(data.wishlist);

      if (data.settings) {
        setSettings(data.settings);
        saveLocalSettings(data.settings);
      }

      triggerDebouncedSync(data.recipients, data.wishlist, data.settings);
      showToast('Khôi phục dữ liệu từ file sao lưu thành công!');
    } catch (e: any) {
      alert(`Lỗi khôi phục: ${e.message}`);
    }
  };

  const handleResetData = () => {
    setRecipients(INITIAL_RECIPIENTS);
    saveLocalRecipients(INITIAL_RECIPIENTS);

    setWishlist(INITIAL_WISHLIST);
    saveLocalWishlist(INITIAL_WISHLIST);

    setSettings(DEFAULT_SETTINGS);
    saveLocalSettings(DEFAULT_SETTINGS);

    triggerDebouncedSync(INITIAL_RECIPIENTS, INITIAL_WISHLIST, DEFAULT_SETTINGS);
    showToast('Đã đặt lại dữ liệu mẫu thành công!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        onManualSync={() => {
          syncWithCloud();
          showToast('Đã kích hoạt đồng bộ đám mây tức thì!');
        }}
        upcomingEvents={upcomingEvents}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        wishlistCount={wishlist.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'generator' && (
          <GiftGeneratorTab
            recipients={recipients}
            initialRecipientId={selectedRecipientIdForAI}
            initialOccasion={selectedOccasionForAI}
            onSaveToWishlist={handleSaveToWishlist}
            savedGifts={wishlist}
            onOpenCardModal={(gift) => setActiveCardModalGift(gift)}
          />
        )}

        {activeTab === 'recipients' && (
          <RecipientsTab
            recipients={recipients}
            onAddRecipient={handleAddRecipient}
            onUpdateRecipient={handleUpdateRecipient}
            onDeleteRecipient={handleDeleteRecipient}
            onSelectForAI={handleSelectForAI}
            onSelectHolidayForAI={handleSelectHolidayForAI}
            upcomingEvents={upcomingEvents}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistTab
            wishlist={wishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onToggleStatus={handleToggleWishlistStatus}
            onOpenCardModal={(gift) => setActiveCardModalGift(gift)}
            onSwitchToGenerator={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'catalog' && (
          <ShopeeCatalogTab
            onSaveToWishlist={handleSaveToWishlist}
            savedGifts={wishlist}
            recipients={recipients}
          />
        )}

        {activeTab === 'settings' && (
          <NotificationSyncTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            user={user}
            onUpdateUser={handleUpdateUser}
            isSyncing={isSyncing}
            lastSyncedAt={lastSyncedAt}
            onManualSync={() => syncWithCloud()}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Greeting Card Modal */}
      {activeCardModalGift && (
        <GreetingCardModal
          gift={activeCardModalGift}
          onClose={() => setActiveCardModalGift(null)}
        />
      )}

      {/* Notification Center Modal */}
      <NotificationCenterModal
        events={upcomingEvents}
        recipients={recipients}
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSelectForAI={handleSelectForAI}
        onSelectHolidayForAI={handleSelectHolidayForAI}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
