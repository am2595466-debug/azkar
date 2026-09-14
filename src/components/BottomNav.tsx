import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isDarkMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
}) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: 'mosque' },
    { id: 'categories', label: 'الأذكار', icon: 'menu_book' },
    { id: 'audio-player', label: 'الصوتيات', icon: 'graphic_eq' },
    { id: 'tasbih', label: 'المسبحة', icon: 'counter_3' },
    { id: 'prayer-and-settings', label: 'المواقيت', icon: 'explore' },
  ] as const;

  return (
    <nav
      className={`fixed bottom-0 w-full z-50 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#0f1512]/95 border-t border-[#3c4a42]/40 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]'
          : 'bg-[#f9f9f8]/90 border-t border-[#e2e2e2]/60 shadow-[0_-2px_12px_rgba(26,36,33,0.05)]'
      } backdrop-blur-xl`}
    >
      <div className="max-w-[680px] mx-auto flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-200 ${
                isActive
                  ? isDarkMode
                    ? 'text-[#4edea3] font-bold drop-shadow-[0_0_8px_rgba(78,222,163,0.4)]'
                    : 'text-[#003820] font-bold'
                  : isDarkMode
                  ? 'text-[#bbcabf] hover:text-[#4edea3]'
                  : 'text-[#404942] hover:text-[#003820]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] transition-transform duration-200"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] leading-tight tracking-normal">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
