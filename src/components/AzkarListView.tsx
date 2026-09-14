import React, { useState } from 'react';
import { DhikrItem, TimeOfDay, Reciter } from '../types';
import { toArabicNumerals, playTactileClick } from '../utils/audioEngine';

interface AzkarListViewProps {
  azkar: DhikrItem[];
  selectedReciter: Reciter;
  onPlayDhikrAudio: (dhikr: DhikrItem) => void;
  onShowToast: (msg: string) => void;
  isDarkMode: boolean;
}

export const AzkarListView: React.FC<AzkarListViewProps> = ({
  azkar,
  selectedReciter,
  onPlayDhikrAudio,
  onShowToast,
  isDarkMode,
}) => {
  const [activePeriod, setActivePeriod] = useState<TimeOfDay>('morning');
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2); // 1: small, 2: default, 3: large, 4: extra
  const [showMeanings, setShowMeanings] = useState<boolean>(false);
  const [counts, setCounts] = useState<Record<string, number>>({
    'sayyid-istighfar': 0,
    'ayat-al-kursi': 0,
    'afiyah-salamah': 1, // sample initial count as shown in design (2 of 3)
  });
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({
    'sayyid-istighfar': true,
  });

  const filteredAzkar = azkar.filter((a) => a.timeOfDay === activePeriod);

  // Compute daily completion
  const completedCount = filteredAzkar.filter((item) => {
    const current = counts[item.id] || 0;
    return current >= item.repetitionTotal;
  }).length;
  const totalCount = filteredAzkar.length || 24;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const fontSizes = [
    'text-[20px] sm:text-[22px] leading-[2.6rem]',
    'text-[22px] sm:text-[24px] leading-[2.8rem]',
    'text-[24px] sm:text-[26px] leading-[3.1rem]',
    'text-[27px] sm:text-[30px] leading-[3.5rem]',
  ];

  const handleIncrementCount = (id: string, total: number) => {
    const current = counts[id] || 0;
    const next = current + 1;
    if (next >= total) {
      playTactileClick('complete');
      onShowToast('ما شاء الله! اكتمل تكرار هذا الذكر');
    } else {
      playTactileClick('bead');
    }
    setCounts((prev) => ({ ...prev, [id]: next }));
  };

  const toggleBookmark = (id: string) => {
    const state = !bookmarks[id];
    setBookmarks((prev) => ({ ...prev, [id]: state }));
    onShowToast(state ? 'تمت إضافة الذكر للمفضلة' : 'تمت الإزالة من المفضلة');
  };

  const copyDhikr = (item: DhikrItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${item.title}\n\n${item.arabicText}\n\n${item.source}`);
      onShowToast('تم نسخ الذكر إلى الحافظة');
    }
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Period Switcher & Overview Header */}
      <section className="flex flex-col gap-4 mb-6">
        {/* Period Tab (Morning / Evening) */}
        <div
          className={`p-1.5 rounded-full flex items-center justify-between shadow-inner border transition-colors ${
            isDarkMode
              ? 'bg-[#171d1a]/90 border-[#3c4a42]/40'
              : 'bg-[#f3f4f3] border-[#e2e2e2]/60'
          }`}
        >
          <button
            onClick={() => setActivePeriod('morning')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-[15px] transition-all duration-200 ${
              activePeriod === 'morning'
                ? isDarkMode
                  ? 'bg-[#10b981] text-white shadow-[0_2px_12px_rgba(78,222,163,0.3)]'
                  : 'bg-[#003820] text-white shadow-sm'
                : isDarkMode
                ? 'text-[#bbcabf] hover:text-white'
                : 'text-[#404942] hover:text-[#003820]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: activePeriod === 'morning' ? "'FILL' 1" : "'FILL' 0" }}
            >
              wb_sunny
            </span>
            <span>أذكار الصباح</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full mr-1 font-semibold ${
                activePeriod === 'morning'
                  ? 'bg-black/20 text-white'
                  : isDarkMode
                  ? 'bg-[#252b28] text-[#bbcabf]'
                  : 'bg-[#eeeeed] text-[#404942]'
              }`}
            >
              {toArabicNumerals(totalCount)}
            </span>
          </button>

          <button
            onClick={() => setActivePeriod('evening')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-[15px] transition-all duration-200 ${
              activePeriod === 'evening'
                ? isDarkMode
                  ? 'bg-[#10b981] text-white shadow-[0_2px_12px_rgba(78,222,163,0.3)]'
                  : 'bg-[#003820] text-white shadow-sm'
                : isDarkMode
                ? 'text-[#bbcabf] hover:text-white'
                : 'text-[#404942] hover:text-[#003820]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: activePeriod === 'evening' ? "'FILL' 1" : "'FILL' 0" }}
            >
              dark_mode
            </span>
            <span>أذكار المساء</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full mr-1 font-semibold ${
                activePeriod === 'evening'
                  ? 'bg-black/20 text-white'
                  : isDarkMode
                  ? 'bg-[#252b28] text-[#bbcabf]'
                  : 'bg-[#eeeeed] text-[#404942]'
              }`}
            >
              {toArabicNumerals(totalCount)}
            </span>
          </button>
        </div>

        {/* Spiritual Reading Progress & Utilities Card */}
        <div
          className={`p-4 rounded-xl border shadow-sm flex flex-col gap-3 transition-colors ${
            isDarkMode
              ? 'bg-[#1b211e]/80 border-[#3c4a42]/40 shadow-[0_4px_24px_rgba(0,0,0,0.35)] text-[#dee4de]'
              : 'bg-white border-[#e2e2e2]/70 shadow-[0_2px_12px_rgba(26,36,33,0.04)] text-[#1a1c1c]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
                }`}
              >
                auto_stories
              </span>
              <span className="font-bold text-[14px]">
                {activePeriod === 'morning'
                  ? 'الإنجاز اليومي للصباح'
                  : 'الإنجاز اليومي للمساء'}
              </span>
            </div>
            <span
              className={`font-bold text-[14px] ${
                isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
              }`}
            >
              {toArabicNumerals(completedCount)} من {toArabicNumerals(totalCount)} (
              {toArabicNumerals(progressPercent)}٪)
            </span>
          </div>

          {/* Linear Progress Bar */}
          <div
            className={`w-full h-2 rounded-full overflow-hidden ${
              isDarkMode ? 'bg-[#090f0d] border border-[#3c4a42]/30' : 'bg-[#eeeeed]'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDarkMode
                  ? 'bg-gradient-to-l from-[#4edea3] to-[#10b981] shadow-[0_0_10px_rgba(78,222,163,0.6)]'
                  : 'bg-[#003820]'
              }`}
              style={{ width: `${progressPercent || 21}%` }}
            />
          </div>

          {/* Display & Audio Quick Toggles */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {/* Font Resizing (A+ / A-) */}
              <div
                className={`flex items-center rounded-lg p-1 border ${
                  isDarkMode
                    ? 'bg-[#171d1a] border-[#3c4a42]/30'
                    : 'bg-[#f3f4f3] border-[#e2e2e2]'
                }`}
              >
                <button
                  onClick={() => setFontSizeLevel((l) => Math.min(3, l + 1))}
                  aria-label="تكبير الخط"
                  title="تكبير الخط"
                  className={`w-8 h-8 flex items-center justify-center font-bold text-[15px] transition-colors rounded ${
                    isDarkMode
                      ? 'text-[#dee4de] hover:text-[#4edea3]'
                      : 'text-[#1a1c1c] hover:text-[#003820]'
                  }`}
                >
                  أ+
                </button>
                <span
                  className={`h-4 w-px mx-0.5 ${
                    isDarkMode ? 'bg-[#3c4a42]' : 'bg-[#c0c9c0]'
                  }`}
                />
                <button
                  onClick={() => setFontSizeLevel((l) => Math.max(0, l - 1))}
                  aria-label="تصغير الخط"
                  title="تصغير الخط"
                  className={`w-8 h-8 flex items-center justify-center text-[13px] transition-colors rounded ${
                    isDarkMode
                      ? 'text-[#bbcabf] hover:text-[#4edea3]'
                      : 'text-[#404942] hover:text-[#003820]'
                  }`}
                >
                  أ-
                </button>
              </div>

              {/* Meanings Toggle */}
              <button
                onClick={() => setShowMeanings(!showMeanings)}
                className={`flex items-center gap-1 text-[13px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                  showMeanings
                    ? isDarkMode
                      ? 'bg-[#4edea3]/20 border-[#4edea3] text-[#4edea3]'
                      : 'bg-[#b0f1c7]/40 border-[#0f5132] text-[#003820]'
                    : isDarkMode
                    ? 'bg-[#171d1a] border-[#3c4a42]/30 text-[#bbcabf] hover:text-white'
                    : 'bg-[#f3f4f3] border-[#e2e2e2] text-[#404942] hover:text-[#003820]'
                }`}
                title="عرض معاني الكلمات والغريب"
              >
                <span className="material-symbols-outlined text-[18px]">translate</span>
                <span>المعاني</span>
              </button>
            </div>

            {/* Continuous Audio Button */}
            <button
              onClick={() => onPlayDhikrAudio(filteredAzkar[0])}
              className={`flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full border transition-colors shadow-sm ${
                isDarkMode
                  ? 'text-[#ffb95f] bg-[#ffb95f]/15 border-[#ffb95f]/30 hover:bg-[#ffb95f]/25 shadow-[0_0_12px_rgba(255,185,95,0.15)]'
                  : 'text-[#9b4500] bg-[#ffdbca]/60 border-[#ffb68e] hover:bg-[#ffdbca]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>تشغيل متواصل</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dhikr Cards Stack */}
      <div className="flex flex-col gap-5">
        {filteredAzkar.map((item, index) => {
          const currentCount = counts[item.id] || 0;
          const isDone = currentCount >= item.repetitionTotal;
          const isFavorited = !!bookmarks[item.id];

          return (
            <article
              key={item.id}
              id={`dhikr-${item.id}`}
              className={`rounded-xl p-5 border flex flex-col gap-4 relative overflow-hidden transition-all duration-200 ${
                isDarkMode
                  ? isDone
                    ? 'bg-[#152019] border-[#4edea3]/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                    : 'bg-[#18221d] border-[#3c4a42]/40 shadow-[0_4px_28px_rgba(0,0,0,0.5)]'
                  : isDone
                  ? 'bg-white border-[#b0f1c7] shadow-[0_4px_20px_rgba(15,81,50,0.06)]'
                  : 'bg-white border-[#e2e2e2]/70 shadow-[0_2px_12px_rgba(26,36,33,0.04)]'
              }`}
            >
              {/* Card Top Ribbon / Badge Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1 ${
                      isDarkMode
                        ? 'bg-[#ffb95f]/15 border border-[#ffb95f]/40 text-[#ffb95f]'
                        : 'bg-[#ffdbca] text-[#331200]'
                    }`}
                  >
                    <span>۞</span>
                    <span>{item.title}</span>
                  </span>

                  {item.subtitle && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        isDarkMode
                          ? 'bg-[#252b28] border-[#3c4a42]/40 text-[#bbcabf]'
                          : 'bg-[#f3f4f3] border-[#e2e2e2] text-[#404942]'
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  )}
                </div>

                {/* Repetition target pill */}
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold border ${
                    item.repetitionTotal === 1
                      ? isDarkMode
                        ? 'bg-[#4edea3]/20 border-[#4edea3]/40 text-[#4edea3]'
                        : 'bg-[#b0f1c7] border-[#95d4ac] text-[#002111]'
                      : isDarkMode
                      ? 'bg-[#ee9800]/20 border-[#ee9800]/40 text-[#ffb95f]'
                      : 'bg-[#fd8a42]/20 border-[#fd8a42]/40 text-[#9b4500]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {item.repetitionTotal > 1 ? 'restart_alt' : 'repeat'}
                  </span>
                  <span>
                    {item.repetitionTotal === 1
                      ? 'مرة واحدة'
                      : `${toArabicNumerals(item.repetitionTotal)} مرات`}
                  </span>
                </div>
              </div>

              {/* Main Arabic Text with Diacritics */}
              <div className="pt-2 pb-1 text-center">
                <p
                  className={`font-arabic ${fontSizes[fontSizeLevel]} tracking-wide select-text transition-all duration-200 ${
                    isDarkMode ? 'text-[#ecfdf5] drop-shadow-sm' : 'text-[#003820]'
                  }`}
                >
                  {item.arabicText}
                </p>
              </div>

              {/* Repetition beads indicator for items with > 1 repeat */}
              {item.repetitionTotal > 1 && (
                <div className="flex items-center justify-center gap-2 py-1">
                  {Array.from({ length: item.repetitionTotal }).map((_, beadIdx) => {
                    const isBeadDone = beadIdx < currentCount;
                    return (
                      <div
                        key={beadIdx}
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                          isBeadDone
                            ? isDarkMode
                              ? 'bg-[#4edea3] ring-2 ring-[#4edea3]/30 shadow-[0_0_8px_rgba(78,222,163,0.5)]'
                              : 'bg-[#003820] ring-2 ring-[#003820]/20'
                            : isDarkMode
                            ? 'bg-[#252b28] ring-1 ring-[#3c4a42]'
                            : 'bg-[#eeeeed] ring-1 ring-[#c0c9c0]'
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Meanings Box (if toggled) */}
              {showMeanings && item.meaning && (
                <div
                  className={`rounded-lg p-3 border flex flex-col gap-1 text-right text-xs ${
                    isDarkMode
                      ? 'bg-[#101713] border-[#3c4a42]/30 text-[#bbcabf]'
                      : 'bg-[#f9f9f8] border-[#e2e2e2] text-[#404942]'
                  }`}
                >
                  <span className="font-bold text-[#ffb95f] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    معاني الكلمات:
                  </span>
                  <p className="leading-relaxed">{item.meaning}</p>
                </div>
              )}

              {/* Virtue & Source Box */}
              <div
                className={`rounded-lg p-3.5 flex flex-col gap-1 text-right border ${
                  isDarkMode
                    ? 'bg-[#171d1a]/90 border-[#3c4a42]/30'
                    : 'bg-[#f3f4f3] border-[#e2e2e2]/60'
                }`}
              >
                <div
                  className={`flex items-center gap-1 font-bold text-[13px] ${
                    isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">verified</span>
                  <span>{item.virtueTitle || 'فضل هذا الذكر'}</span>
                </div>
                <p
                  className={`text-[13px] leading-relaxed ${
                    isDarkMode ? 'text-[#bbcabf]' : 'text-[#404942]'
                  }`}
                >
                  {item.virtueText}
                </p>
                <span
                  className={`text-[11px] mt-1 self-start font-medium ${
                    isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'
                  }`}
                >
                  {item.source}
                </span>
              </div>

              {/* Interactive Counter & Action Deck */}
              <div className="flex items-center justify-between pt-1">
                {/* Audio Reciter Trigger */}
                <button
                  onClick={() => onPlayDhikrAudio(item)}
                  aria-label="استماع للذكر"
                  title="استماع لتلاوة هذا الذكر"
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-full border transition-colors ${
                    isDarkMode
                      ? 'bg-[#252b28]/80 border-[#3c4a42]/30 hover:border-[#4edea3]/40 text-[#dee4de]'
                      : 'bg-[#f3f4f3] border-[#e2e2e2] hover:bg-[#e8e8e7] text-[#1a1c1c]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
                    }`}
                  >
                    play_circle
                  </span>
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-[12px] leading-tight">
                      بصوت {selectedReciter.shortName}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'
                      }`}
                    >
                      {toArabicNumerals(item.duration)}
                    </span>
                  </div>
                </button>

                {/* Big Tactile Tap Counter Dial */}
                <button
                  onClick={() => handleIncrementCount(item.id, item.repetitionTotal)}
                  disabled={isDone}
                  aria-label="احتساب التكرار"
                  title={isDone ? 'اكتمل الذكر' : 'اضغط لاحتساب التكرار'}
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all select-none ${
                    isDone
                      ? isDarkMode
                        ? 'bg-gradient-to-tr from-[#00422b] to-[#10b981] border border-[#4edea3]/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-default'
                        : 'bg-[#003820] text-white shadow-[0_4px_14px_rgba(15,81,50,0.25)]'
                      : isDarkMode
                      ? 'bg-[#252b28] border border-[#3c4a42]/50 hover:border-[#4edea3]/60 text-[#dee4de] active:scale-90 shadow-md'
                      : 'bg-[#0f5132] text-white hover:scale-95 active:scale-90 shadow-[0_4px_14px_rgba(15,81,50,0.25)]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <span
                        className="material-symbols-outlined text-[26px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span className="text-[10px] mt-0.5 font-bold text-emerald-100">
                        تمت
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-arabic text-[26px] font-bold leading-none">
                        {toArabicNumerals(currentCount + 1)}
                      </span>
                      <span
                        className={`text-[10px] mt-0.5 font-semibold ${
                          isDarkMode ? 'text-[#bbcabf]' : 'text-[#b0f1c7]'
                        }`}
                      >
                        {item.repetitionTotal > 1
                          ? `من ${toArabicNumerals(item.repetitionTotal)}`
                          : 'اضغط'}
                      </span>
                    </>
                  )}
                </button>

                {/* Tooling buttons: Copy / Bookmark / Share */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyDhikr(item)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isDarkMode
                        ? 'text-[#bbcabf] hover:text-white hover:bg-[#252b28]'
                        : 'text-[#404942] hover:text-[#003820] hover:bg-[#f3f4f3]'
                    }`}
                    title="نسخ الذكر"
                  >
                    <span className="material-symbols-outlined text-[19px]">content_copy</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isFavorited
                        ? 'text-[#ffb95f]'
                        : isDarkMode
                        ? 'text-[#bbcabf] hover:text-[#ffb95f] hover:bg-[#252b28]'
                        : 'text-[#404942] hover:text-[#9b4500] hover:bg-[#f3f4f3]'
                    }`}
                    title="إضافة للمفضلة"
                  >
                    <span
                      className="material-symbols-outlined text-[19px]"
                      style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {isFavorited ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      copyDhikr(item);
                      onShowToast('تم تجهيز الذكر للمشاركة');
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isDarkMode
                        ? 'text-[#bbcabf] hover:text-white hover:bg-[#252b28]'
                        : 'text-[#404942] hover:text-[#003820] hover:bg-[#f3f4f3]'
                    }`}
                    title="مشاركة"
                  >
                    <span className="material-symbols-outlined text-[19px]">share</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
