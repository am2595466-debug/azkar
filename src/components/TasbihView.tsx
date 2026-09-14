import React, { useState } from 'react';
import { toArabicNumerals, playTactileClick } from '../utils/audioEngine';

interface TasbihViewProps {
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
}

export const TasbihView: React.FC<TasbihViewProps> = ({ isDarkMode, onShowToast }) => {
  const tasbihPresets = [
    { title: 'سُبْحَانَ اللَّهِ', target: 33, virtue: 'تسبيح الملائكة وحط الخطايا' },
    { title: 'الحَمْدُ لِلَّهِ', target: 33, virtue: 'تملأ الميزان' },
    { title: 'اللَّهُ أَكْبَرُ', target: 33, virtue: 'خير مما طلعت عليه الشمس' },
    { title: 'لاَ إِلَهَ إِلاَّ اللَّهُ', target: 100, virtue: 'أفضل الذكر وخير ما قال النبيون' },
    { title: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100, virtue: 'تفريج الهموم واستجلاب الرزق' },
    { title: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 10, virtue: 'صلاة الله عشراً وشفاعة النبي' },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [activeTarget, setActiveTarget] = useState(33);

  const currentDhikr = tasbihPresets[selectedIdx];
  const target = activeTarget || currentDhikr.target;
  const progressPercent = Math.min(100, (currentCount / target) * 100);

  const handleBeadTap = () => {
    const next = currentCount + 1;
    if (next >= target) {
      playTactileClick('complete');
      setCurrentCount(0);
      setTotalSessions((t) => t + 1);
      onShowToast(`أتممت ${toArabicNumerals(target)} تسبيحة! تقبل الله منك.`);
    } else {
      playTactileClick('bead');
      setCurrentCount(next);
    }
  };

  const handleReset = () => {
    setCurrentCount(0);
    playTactileClick('rewind');
    onShowToast('تم تصفير العداد');
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-5 select-none">
      {/* Header card */}
      <div
        className={`p-4 rounded-2xl border transition-colors flex items-center justify-between shadow-sm ${
          isDarkMode
            ? 'bg-[#18221d] border-[#3c4a42]/40 text-[#dee4de]'
            : 'bg-white border-[#e2e2e2]/70 text-[#1a1c1c]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-[#0f5132]/10 text-[#003820]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">counter_3</span>
          </div>
          <div>
            <h2 className="font-arabic text-[18px] font-bold">المسبحة الإلكترونية الذكية</h2>
            <p className="text-xs text-on-surface-variant opacity-80">
              تسبيح واستغفار بنقرات هادئة
            </p>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-medium opacity-70">الدورات المكتملة</span>
          <span className="font-arabic text-[17px] font-bold text-[#ffb95f]">
            {toArabicNumerals(totalSessions)}
          </span>
        </div>
      </div>

      {/* Preset Dhikr Horizontal Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1">
        {tasbihPresets.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                playTactileClick('bead');
                setSelectedIdx(idx);
                setCurrentCount(0);
                setActiveTarget(item.target);
              }}
              className={`px-3.5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
                isSelected
                  ? isDarkMode
                    ? 'bg-[#10b981] text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-[#003820] text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-[#1b211e] text-[#bbcabf] hover:text-[#4edea3] border border-[#3c4a42]/40'
                  : 'bg-[#f3f4f3] text-[#404942] hover:text-[#003820]'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Main Dial Area */}
      <div
        className={`p-6 rounded-[28px] border shadow-md flex flex-col items-center justify-center relative overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-[#18221d] border-[#3c4a42]/40 text-[#dee4de]'
            : 'bg-white border-[#e2e2e2]/70 text-[#1a1c1c]'
        }`}
      >
        {/* Ambient glow behind dial */}
        <div
          className={`absolute w-56 h-56 rounded-full blur-3xl pointer-events-none ${
            isDarkMode ? 'bg-[#10b981]/15' : 'bg-[#b0f1c7]/40'
          }`}
        />

        {/* Current Dhikr Name & Virtue */}
        <div className="text-center z-10 mb-4">
          <p
            className={`font-arabic text-[24px] sm:text-[26px] font-bold ${
              isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
            }`}
          >
            {currentDhikr.title}
          </p>
          <p className="text-xs text-on-surface-variant opacity-80 mt-1">
            {currentDhikr.virtue}
          </p>
        </div>

        {/* Big Interactive Tactile Dial */}
        <div
          onClick={handleBeadTap}
          className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 z-10 shadow-2xl ${
            isDarkMode
              ? 'bg-gradient-to-tr from-[#121c16] via-[#1a2d24] to-[#203a2e] border-4 border-[#4edea3]/40 shadow-[0_0_35px_rgba(16,185,129,0.25)]'
              : 'bg-gradient-to-tr from-[#f3f4f3] to-white border-4 border-[#0f5132]/30 shadow-[0_8px_30px_rgba(15,81,50,0.15)]'
          }`}
        >
          {/* Progress Circular SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className={`stroke-current fill-none ${
                isDarkMode ? 'text-[#252b28]' : 'text-[#e8e8e7]'
              }`}
              strokeWidth="5"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className={`stroke-current fill-none transition-all duration-150 ${
                isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
              }`}
              strokeWidth="5"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Count */}
          <span className="font-arabic text-[52px] sm:text-[60px] font-bold leading-none select-none">
            {toArabicNumerals(currentCount)}
          </span>
          <span
            className={`text-xs font-semibold mt-1 tracking-wider ${
              isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
            }`}
          >
            الهدف: {toArabicNumerals(target)}
          </span>
          <span className="text-[10px] opacity-60 mt-1">اضغط للتسبيح</span>
        </div>

        {/* Target Buttons (33, 99, 100) & Reset */}
        <div className="flex items-center justify-between w-full max-w-xs mt-6 z-10">
          <div className="flex items-center gap-1.5">
            {[33, 99, 100].map((tVal) => (
              <button
                key={tVal}
                onClick={() => {
                  setActiveTarget(tVal);
                  setCurrentCount(0);
                  playTactileClick('bead');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  activeTarget === tVal
                    ? isDarkMode
                      ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]'
                      : 'bg-[#003820] text-white'
                    : isDarkMode
                    ? 'bg-[#252b28] text-[#bbcabf]'
                    : 'bg-[#f3f4f3] text-[#404942]'
                }`}
              >
                {toArabicNumerals(tVal)}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              isDarkMode
                ? 'bg-[#252b28] hover:bg-[#303633] text-[#bbcabf] hover:text-[#ffb95f]'
                : 'bg-[#f3f4f3] hover:bg-[#e8e8e7] text-[#404942]'
            }`}
            title="تصفير العداد"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>تصفير</span>
          </button>
        </div>
      </div>
    </div>
  );
};
