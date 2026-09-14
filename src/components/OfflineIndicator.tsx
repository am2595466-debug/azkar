import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  isDarkMode: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isDarkMode }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-40 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl shadow-xl transition-all ${
        isDarkMode
          ? 'bg-[#231a0e] border border-[#ffb95f]/30 text-[#ffdeb5]'
          : 'bg-[#fff8ee] border border-[#f59e0b]/40 text-[#92400e]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-xs font-semibold">
          أنت الآن دون اتصال — التطبيق يعمل بكامل ميزاته عبر التخزين المؤقت
        </span>
      </div>
    </div>
  );
};
