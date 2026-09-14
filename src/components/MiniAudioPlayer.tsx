import React from 'react';
import { DhikrItem, Reciter } from '../types';

interface MiniAudioPlayerProps {
  currentDhikr: DhikrItem;
  selectedReciter: Reciter;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onOpenFullPlayer: () => void;
  isDarkMode: boolean;
}

export const MiniAudioPlayer: React.FC<MiniAudioPlayerProps> = ({
  currentDhikr,
  selectedReciter,
  isPlaying,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onOpenFullPlayer,
  isDarkMode,
}) => {
  return (
    <div className="fixed bottom-20 inset-x-0 mx-auto max-w-[648px] px-4 z-40 pointer-events-none">
      <div
        className={`backdrop-blur-md p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] pointer-events-auto flex items-center justify-between border transition-all duration-300 ${
          isDarkMode
            ? 'bg-[#121b16]/95 border-[#4edea3]/20 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_15px_rgba(16,185,129,0.12)] text-[#dee4de]'
            : 'bg-white/95 border-[#e2e2e2]/80 text-[#1a1c1c]'
        }`}
      >
        {/* Current Reciter & Playing Track info (Click opens full player) */}
        <div
          onClick={onOpenFullPlayer}
          className="flex items-center gap-3 min-w-0 pr-1 cursor-pointer group flex-1"
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isDarkMode
                ? 'bg-[#4edea3]/20 border border-[#4edea3]/30 text-[#4edea3] shadow-[0_0_12px_rgba(78,222,163,0.2)]'
                : 'bg-[#b0f1c7] text-[#003820]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${
                isPlaying ? 'animate-pulse' : ''
              }`}
            >
              graphic_eq
            </span>
          </div>

          <div className="flex flex-col text-right truncate">
            <span
              className={`font-bold text-[13px] truncate group-hover:underline ${
                isDarkMode ? 'text-[#ecfdf5]' : 'text-[#1a1c1c]'
              }`}
            >
              {currentDhikr.title || 'أذكار الصباح كاملة'}
            </span>
            <span
              className={`text-[11px] truncate ${
                isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
              }`}
            >
              القارئ: {selectedReciter.name}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 pl-1 shrink-0">
          <button
            onClick={onPrevTrack}
            aria-label="السابق"
            title="الذكر السابق"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#f3f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">skip_next</span>
          </button>

          <button
            onClick={onTogglePlay}
            aria-label="تشغيل / إيقاف"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              isDarkMode
                ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(78,222,163,0.4)]'
                : 'bg-[#003820] text-white shadow-sm'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={onNextTrack}
            aria-label="التالي"
            title="الذكر التالي"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#f3f4f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">skip_previous</span>
          </button>

          <div
            className={`h-6 w-px mx-1 ${
              isDarkMode ? 'bg-[#3c4a42]' : 'bg-[#e2e2e2]'
            }`}
          />

          <button
            onClick={onOpenFullPlayer}
            aria-label="فهرس الأذكار"
            title="فتح المشغل الكامل وقائمة الأذكار"
            className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-[12px] font-medium transition-colors ${
              isDarkMode
                ? 'bg-[#252b28] hover:bg-[#303633] text-[#dee4de] border border-[#3c4a42]/40'
                : 'bg-[#f3f4f3] hover:bg-[#e8e8e7] text-[#1a1c1c]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            <span className="hidden sm:inline">الفهرس</span>
          </button>
        </div>
      </div>
    </div>
  );
};
