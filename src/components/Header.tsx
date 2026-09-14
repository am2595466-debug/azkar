import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNotifications: () => void;
  activeTabTitle: string;
  onShowToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenNotifications,
  activeTabTitle,
  onShowToast,
}) => {
  const LOGO_URL =
    'https://lh3.googleusercontent.com/aida/AEtjO1X-nSd45GLmsq54EUt6CpPwzMS9dr5FYR_VOs2ifZ7lRUsn6OixZNfpQ7-eRJTotGGyFWR97vRQQ2xeZyyLLcSKM0kfyRfniSHyQ5m6PM8MZbIqEkC46ERuXm0wvzknCv4LMQhTI1xf9yaYBS4z40YYzxLL1tKHkPhAIplb95X4UtW68juP2KmiFPQWaPh2WgmcOWhemVfpeyrXND-Fu1ecqdS8aVIoZXqdP5YGOXusIi7KzcOXrN_iwpIE';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#0f1512]/90 border-b border-[#3c4a42]/40 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-[#f9f9f8]/85 border-b border-[#e2e2e2]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      } backdrop-blur-xl`}
    >
      <div className="max-w-[680px] mx-auto h-20 px-4 flex items-center justify-between">
        {/* Brand & Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <img
              alt="شعار أذكار المسلم"
              className={`h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                isDarkMode ? 'drop-shadow-[0_0_10px_rgba(78,222,163,0.3)]' : 'drop-shadow-sm'
              }`}
              src={LOGO_URL}
            />
          </div>
          <div className="flex flex-col text-right">
            <span
              className={`font-arabic text-[20px] font-bold leading-tight ${
                isDarkMode ? 'text-[#4edea3] drop-shadow-[0_0_12px_rgba(78,222,163,0.25)]' : 'text-[#003820]'
              }`}
            >
              أذكار المسلم
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-medium ${isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'}`}>
                ١٤ رمضان ١٤٤٦ هـ
              </span>
              <span className={isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'}>•</span>
              <span className={isDarkMode ? 'text-[#bbcabf]' : 'text-[#404942]'}>
                {activeTabTitle || 'Audio Player'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Tools Section */}
        <div className="flex items-center gap-2">
          {/* In-App PWA Install Button */}
          <PWAInstallButton isDarkMode={isDarkMode} variant="compact" onShowToast={onShowToast} />

          {/* Light/Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            aria-label="تبديل الوضع الليلي والنهاري"
            title={isDarkMode ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isDarkMode
                ? 'bg-[#1b211e] text-[#ffb95f] hover:bg-[#252b28] border border-[#3c4a42]/60'
                : 'bg-[#f3f4f3] text-[#9b4500] hover:bg-[#e8e8e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            aria-label="التنبيهات"
            title="تنبيهات مواعيد الأذكار"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#f3f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          {/* Profile Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm cursor-pointer ${
              isDarkMode
                ? 'bg-[#4edea3]/20 border border-[#4edea3]/40 text-[#4edea3]'
                : 'bg-[#003820] text-white'
            }`}
            title="الملف الروحي والشارات"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
