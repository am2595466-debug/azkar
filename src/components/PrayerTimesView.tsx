import React from 'react';
import { toArabicNumerals } from '../utils/audioEngine';

interface PrayerTimesViewProps {
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ isDarkMode, onShowToast }) => {
  const prayers = [
    { name: 'الفجر', time: '٠٤:٣٢ ص', isPassed: true, isNext: false, icon: 'wb_twilight' },
    { name: 'الشروق', time: '٠٥:٥٨ ص', isPassed: true, isNext: false, icon: 'wb_sunny' },
    { name: 'الظهر', time: '١٢:١٤ م', isPassed: true, isNext: false, icon: 'sunny' },
    { name: 'العصر', time: '٠٣:٤٠ م', isPassed: false, isNext: true, icon: 'partly_cloudy_day' },
    { name: 'المغرب', time: '٠٦:٣٠ م', isPassed: false, isNext: false, icon: 'wb_twilight' },
    { name: 'العشاء', time: '٠٨:٠٠ م', isPassed: false, isNext: false, icon: 'bedtime' },
  ];

  return (
    <div className="flex flex-col w-full pb-28 space-y-5 select-none">
      {/* Next Prayer Hero Card */}
      <div
        className={`p-5 rounded-[24px] border shadow-md relative overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-gradient-to-tr from-[#121c16] via-[#1a2d24] to-[#1f382a] border-[#4edea3]/30 text-[#dee4de] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-gradient-to-tr from-[#0f5132] to-[#003820] text-white shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15">
            الصلاة القادمة
          </span>
          <span className="text-xs font-medium text-[#ffb95f]">مكة المكرمة</span>
        </div>

        <div className="my-4 flex items-center justify-between">
          <div>
            <h2 className="font-arabic text-[34px] font-bold leading-tight">صلاة العصر</h2>
            <p className="text-xs opacity-80 mt-0.5">موعد الأذان: ٠٣:٤٠ مساءً</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] opacity-80">المتبقي على الأذان</span>
            <span className="font-arabic text-[22px] font-bold text-[#ffb95f]">
              - ٠١:٢٥:١٤
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <span>«إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا»</span>
          <span className="material-symbols-outlined text-[18px]">mosque</span>
        </div>
      </div>

      {/* Prayers List */}
      <div className="flex flex-col gap-2.5">
        <h3 className="font-arabic text-[16px] font-bold px-1 text-on-surface">
          مواقيت الصلاة لليوم
        </h3>
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              prayer.isNext
                ? isDarkMode
                  ? 'bg-[#1e2f26] border-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.15)] text-[#4edea3]'
                  : 'bg-[#b0f1c7]/30 border-[#003820] text-[#003820] font-bold'
                : isDarkMode
                ? 'bg-[#18221d] border-[#3c4a42]/40 text-[#dee4de]'
                : 'bg-white border-[#e2e2e2]/70 text-[#1a1c1c]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[22px]">{prayer.icon}</span>
              <div className="flex flex-col text-right">
                <span className="font-bold text-[15px]">{prayer.name}</span>
                {prayer.isNext && (
                  <span className="text-[10px] text-[#ffb95f] font-semibold">الصلاة القادمة</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-arabic text-[16px] font-bold">{prayer.time}</span>
              {prayer.isPassed && (
                <span className="material-symbols-outlined text-[18px] opacity-60">check</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Qibla Direction Card */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
          isDarkMode
            ? 'bg-[#18221d] border-[#3c4a42]/40 text-[#dee4de]'
            : 'bg-white border-[#e2e2e2]/70 text-[#1a1c1c]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-[#ffb95f]/20 text-[#ffb95f]' : 'bg-[#ffdbca] text-[#9b4500]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">explore</span>
          </div>
          <div>
            <h4 className="font-bold text-[14px]">اتجاه القبلة الشريفة</h4>
            <p className="text-xs opacity-75">١٣٥° جنوب شرق بالنسبة لموقعك</p>
          </div>
        </div>
        <button
          onClick={() => onShowToast('البوصلة موجهة نحو الكعبة المشرفة ١٣٥°')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            isDarkMode
              ? 'bg-[#252b28] border-[#3c4a42] hover:bg-[#303633] text-[#dee4de]'
              : 'bg-[#f3f4f3] border-[#e2e2e2] hover:bg-[#e8e8e7] text-[#1a1c1c]'
          }`}
        >
          معايرة
        </button>
      </div>
    </div>
  );
};
