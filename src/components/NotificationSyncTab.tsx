import React, { useState } from 'react';
import {
  Bell,
  Mail,
  MessageCircle,
  Radio,
  Send,
  Cloud,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Moon,
  Sun,
  Smartphone,
  Info,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { NotificationSettings, UserProfile } from '../types';

interface NotificationSyncTabProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  isSyncing: boolean;
  lastSyncedAt: string;
  onManualSync: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
  onResetData: () => void;
}

export const NotificationSyncTab: React.FC<NotificationSyncTabProps> = ({
  settings,
  onUpdateSettings,
  user,
  onUpdateUser,
  isSyncing,
  lastSyncedAt,
  onManualSync,
  isDarkMode,
  toggleDarkMode,
  onExportBackup,
  onImportBackup,
  onResetData
}) => {
  const [testResult, setTestResult] = useState<{ channel: string; data: any } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Toggle remind days
  const toggleRemindDay = (days: number) => {
    let updated: number[];
    if (settings.remindDaysBefore.includes(days)) {
      updated = settings.remindDaysBefore.filter(d => d !== days);
    } else {
      updated = [...settings.remindDaysBefore, days].sort((a, b) => b - a);
    }
    onUpdateSettings({ ...settings, remindDaysBefore: updated });
  };

  // Test Unified Push
  const handleTestUnifiedPush = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notifications/unified-push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: 'ShopeeGift AI: Sắp đến sinh nhật Mai Anh!',
          body: 'Chỉ còn 3 ngày nữa. Shopee đang có ưu đãi 20% cho Set son dưỡng!',
          eventName: 'Sinh nhật Mai Anh'
        })
      });
      const data = await res.json();
      setTestResult({ channel: 'UnifiedPush', data });

      // Request browser push permission if supported
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  // Test Email
  const handleTestEmail = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notifications/test-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'email',
          recipient: settings.userEmail || user.email,
          eventTitle: 'Sinh nhật Mẹ Yêu',
          daysLeft: 5,
          giftSuggestion: 'Set trà hoa thảo mộc dưỡng nhan'
        })
      });
      const data = await res.json();
      setTestResult({ channel: 'Email', data });
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  // Test Zalo
  const handleTestZalo = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notifications/test-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'zalo',
          recipient: settings.zaloPhone || '0988686868',
          eventTitle: 'Kỷ niệm ngày yêu nhau',
          daysLeft: 3,
          giftSuggestion: 'Nến thơm tinh dầu cao cấp'
        })
      });
      const data = await res.json();
      setTestResult({ channel: 'Zalo', data });
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  // File import handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportBackup(text);
      } catch (err: any) {
        setImportError('File không hợp lệ hoặc dữ liệu bị hỏng');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-indigo-500" />
          <span>Cài Đặt Thông Báo & Đồng Bộ Đám Mây</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tùy chỉnh thông báo đa kênh qua Unified Push, Email, Zalo và đồng bộ dữ liệu thời gian thực giữa các thiết bị.
        </p>
      </div>

      {/* 1. Google Account & Cloud Sync Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Tài Khoản Google & Đồng Bộ Đám Mây Đa Thiết Bị
            </h2>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Đang trực tuyến & đồng bộ</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full ring-2 ring-indigo-500/50 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Google Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user.email}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Đồng bộ gần nhất: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString('vi-VN') : 'Vừa xong'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Unified Push Service Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Dịch Vụ Unified Push (Thông Báo Đẩy Chuẩn Mở)
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.unifiedPushEnabled}
              onChange={(e) => onUpdateSettings({ ...settings, unifiedPushEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
            <Info className="w-4 h-4 shrink-0" />
            <span>UnifiedPush là gì?</span>
          </div>
          <p className="leading-relaxed">
            UnifiedPush là tiêu chuẩn thông báo đẩy phi tập trung (open-standard), cho phép nhận thông báo sự kiện sinh nhật/dịp lễ tức thì trên điện thoại và trình duyệt máy tính mà không phụ thuộc vào Google Play Services hay độc quyền nền tảng, tiết kiệm pin tối đa.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              UnifiedPush Distributor Endpoint
            </label>
            <input
              type="text"
              value={settings.unifiedPushEndpoint}
              onChange={(e) => onUpdateSettings({ ...settings, unifiedPushEndpoint: e.target.value })}
              placeholder="https://unifiedpush.org/distributor/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Nhà phân phối: {settings.unifiedPushDistributor}
            </span>
            <button
              onClick={handleTestUnifiedPush}
              disabled={isTesting || !settings.unifiedPushEnabled}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-rose-600 hover:text-white hover:bg-rose-500 border border-rose-300 dark:border-rose-800 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi thông báo Push thử nghiệm</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Email & Zalo Notification Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Kênh Thông Báo Email & Zalo (Tránh Bỏ Lỡ Dịp Quan Trọng)
            </h2>
          </div>
        </div>

        {/* Email Setup */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Thông báo qua Email
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, emailEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="email"
              value={settings.userEmail}
              onChange={(e) => onUpdateSettings({ ...settings, userEmail: e.target.value })}
              placeholder="Email nhận thông báo (vd: thps1411@gmail.com)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleTestEmail}
              disabled={isTesting || !settings.emailEnabled}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 dark:bg-orange-950 dark:hover:bg-orange-900 dark:text-orange-300 transition-colors whitespace-nowrap"
            >
              Test Email
            </button>
          </div>
        </div>

        {/* Zalo Setup */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Thông báo qua Zalo (Zalo ZNS / Tin nhắn)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.zaloEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, zaloEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={settings.zaloPhone}
              onChange={(e) => onUpdateSettings({ ...settings, zaloPhone: e.target.value })}
              placeholder="Số điện thoại Zalo nhận tin nhắn (vd: 0988686868)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTestZalo}
              disabled={isTesting || !settings.zaloEnabled}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 transition-colors whitespace-nowrap"
            >
              Test Zalo
            </button>
          </div>
        </div>

        {/* Remind Frequency */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Thời điểm nhắc nhở trước ngày kỷ niệm:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { days: 7, label: 'Trước 7 ngày' },
              { days: 3, label: 'Trước 3 ngày' },
              { days: 1, label: 'Trước 1 ngày' },
              { days: 0, label: 'Đúng ngày' },
            ].map(item => {
              const active = settings.remindDaysBefore.includes(item.days);
              return (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => toggleRemindDay(item.days)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Test Notification Result Banner */}
      {testResult && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Kết quả thử nghiệm {testResult.channel}: Thành công!</span>
            </span>
            <button
              onClick={() => setTestResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Đóng
            </button>
          </div>
          <pre className="text-[11px] font-mono bg-black/40 p-2.5 rounded-lg overflow-x-auto text-slate-200">
            {JSON.stringify(testResult.data, null, 2)}
          </pre>
        </div>
      )}

      {/* 4. Display & Dark Mode Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
          <span>Giao Diện & Chế Độ Tối (Dark Mode)</span>
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Chế độ ban đêm</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Giảm mỏi mắt khi chọn quà lúc đêm muộn</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDarkMode ? 'Bật giao diện Sáng' : 'Bật giao diện Tối'}</span>
          </button>
        </div>
      </div>

      {/* 5. Cloud Backup, Export & Restore */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-500" />
          <span>Sao Lưu & Phục Hồi Dữ Liệu An Toàn</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Xuất dữ liệu người thân, ngày kỷ niệm và danh sách quà Shopee yêu thích ra file JSON an toàn để lưu trữ riêng hoặc chuyển sang máy khác.
        </p>

        {importError && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs font-medium">
            {importError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportBackup}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tải file sao lưu (JSON)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            <span>Khôi phục từ file JSON</span>
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn đặt lại dữ liệu mặc định?')) {
                onResetData();
              }
            }}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors ml-auto"
          >
            Khôi phục mẫu ban đầu
          </button>
        </div>
      </div>

    </div>
  );
};
