import React from 'react';
import { DhikrItem, Reciter, TabType } from '../types';
import { toArabicNumerals } from '../utils/audioEngine';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onPlayDhikr: (dhikr: DhikrItem) => void;
  morningAzkar: DhikrItem[];
  selectedReciter: Reciter;
  isDarkMode: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onPlayDhikr,
  morningAzkar,
  selectedReciter,
  isDarkMode,
}) => {
  return (
    <div className="flex flex-col w-full pb-28 space-y-5 select-none">
      {/* Welcoming Greeting Card */}
      <div
        className={`p-6 rounded-[28px] border shadow-md relative overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-gradient-to-tr from-[#121c16] via-[#1a2d24] to-[#1e3427] border-[#4edea3]/30 text-[#dee4de] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-gradient-to-tr from-[#0f5132] via-[#003820] to-[#042817] text-white shadow-xl'
        }`}
      >
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 inline-block mb-3">
            رمضان المبارك • ١٤٤٦ هـ
          </span>
          <h1 className="font-arabic text-[26px] sm:text-[30px] font-bold leading-tight">
            السلام عليكم ورحمة الله وبركاته
          </h1>
          <p className="text-xs sm:text-sm opacity-85 mt-2 leading-relaxed max-w-md">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — ابدأ يومك بنفحات النور، وأعطر لسانك
            بأذكار الصباح والمساء بصوت كبار القراء.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('categories')}
              className={`py-2.5 px-5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-[#10b981] text-white hover:bg-[#059669]'
                  : 'bg-white text-[#003820] hover:bg-[#f3f4f3]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>قراءة الأذكار</span>
            </button>

            <button
              onClick={() => onNavigateTab('audio-player')}
              className="py-2.5 px-5 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
              <span>المشغل الصوتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Pillars Grid (Morning & Evening) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Morning Azkar Pillar */}
        <div
          onClick={() => onNavigateTab('categories')}
          className={`p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-all ${
            isDarkMode
              ? 'bg-[#18221d] border-[#3c4a42]/40 hover:border-[#4edea3]/50 text-[#dee4de]'
              : 'bg-white border-[#e2e2e2]/70 hover:border-[#0f5132]/40 text-[#1a1c1c]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-[#ffb95f]/20 text-[#ffb95f]' : 'bg-[#ffdbca] text-[#9b4500]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">wb_sunny</span>
            </div>
            <span className="text-[11px] font-bold opacity-70">٢٤ ذكراً</span>
          </div>
          <h3 className="font-arabic text-[18px] font-bold">أذكار الصباح</h3>
          <p className="text-xs opacity-75 mt-0.5">تبدأ من بعد الفجر حتى الشروق</p>
        </div>

        {/* Evening Azkar Pillar */}
        <div
          onClick={() => onNavigateTab('categories')}
          className={`p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-all ${
            isDarkMode
              ? 'bg-[#18221d] border-[#3c4a42]/40 hover:border-[#4edea3]/50 text-[#dee4de]'
              : 'bg-white border-[#e2e2e2]/70 hover:border-[#0f5132]/40 text-[#1a1c1c]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-[#b0f1c7] text-[#003820]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">dark_mode</span>
            </div>
            <span className="text-[11px] font-bold opacity-70">٢٤ ذكراً</span>
          </div>
          <h3 className="font-arabic text-[18px] font-bold">أذكار المساء</h3>
          <p className="text-xs opacity-75 mt-0.5">تبدأ من بعد العصر حتى المغرب</p>
        </div>
      </div>

      {/* Audio Quick Bar */}
      <div
        onClick={() => onNavigateTab('audio-player')}
        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer shadow-sm transition-all ${
          isDarkMode
            ? 'bg-[#18221d] border-[#3c4a42]/40 hover:bg-[#202c25] text-[#dee4de]'
            : 'bg-white border-[#e2e2e2]/70 hover:shadow-md text-[#1a1c1c]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${
              isDarkMode
                ? 'bg-[#10b981] text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                : 'bg-[#003820] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[14px]">الاستماع للأذكار بصوت القراء</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDarkMode ? 'bg-[#ffb95f]/20 text-[#ffb95f]' : 'bg-[#ffdbca] text-[#9b4500]'
                }`}
              >
                HQ
              </span>
            </div>
            <p className="text-xs opacity-75 mt-0.5">
              القارئ الحالي: {selectedReciter.name}
            </p>
          </div>
        </div>

        <span className="material-symbols-outlined text-[22px] opacity-70">
          arrow_back_ios
        </span>
      </div>

      {/* Hadith of the Day */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDarkMode
            ? 'bg-[#16201b] border-[#3c4a42]/40 text-[#dee4de]'
            : 'bg-[#f3f4f3]/70 border-[#e2e2e2] text-[#1a1c1c]'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[20px] text-[#ffb95f]">
            auto_stories
          </span>
          <span className="font-bold text-xs text-[#ffb95f]">حديث اليوم الشريف</span>
        </div>
        <p className="font-arabic text-[16px] sm:text-[17px] leading-relaxed select-text">
          «مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ مَثَلُ الحَيِّ وَالمَيِّتِ»
        </p>
        <span className="text-[11px] opacity-70 mt-2 block">رواه البخاري ومسلم</span>
      </div>
    </div>
  );
};
