import React from 'react';
import { RECITERS } from '../data/recitersData';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciterId: string;
  onSelectReciter: (id: string) => void;
  currentSpeed: number;
  onSelectSpeed: (speed: number) => void;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  isOfflineDownload: boolean;
  onToggleOfflineDownload: () => void;
  isDarkMode: boolean;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedReciterId,
  onSelectReciter,
  currentSpeed,
  onSelectSpeed,
  isAutoplay,
  onToggleAutoplay,
  isOfflineDownload,
  onToggleOfflineDownload,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const speeds = [
    { value: 0.75, arabic: '٠.٧٥×', label: 'متأني' },
    { value: 1.0, arabic: '١.٠×', label: 'طبيعي' },
    { value: 1.25, arabic: '١.٢٥×', label: 'سريع نسبياً' },
    { value: 1.5, arabic: '١.٥×', label: 'سريع' },
  ];

  const currentSpeedObj = speeds.find((s) => s.value === currentSpeed) || speeds[1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[680px] max-h-[88vh] flex flex-col rounded-t-[32px] shadow-2xl overflow-hidden border-t transition-transform duration-300 ${
          isDarkMode
            ? 'bg-[#141c18] border-[#3c4a42]/60 text-[#dee4de]'
            : 'bg-white border-[#e2e2e2] text-[#1a1c1c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab">
          <div
            className={`w-12 h-1.5 rounded-full ${
              isDarkMode ? 'bg-[#3c4a42]' : 'bg-[#c0c9c0]/70'
            }`}
          />
        </div>

        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${
            isDarkMode ? 'border-[#3c4a42]/40' : 'border-[#eeeeed]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isDarkMode ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-[#0f5132]/10 text-[#0f5132]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <h3
                className={`font-arabic text-[18px] font-bold leading-tight ${
                  isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
                }`}
              >
                إعدادات الصوت والقراء
              </h3>
              <p
                className={`text-[12px] ${
                  isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
                }`}
              >
                تحكم بسرعة التلاوة، القارئ المفضل والخيارات
              </p>
            </div>
          </div>
          <button
            aria-label="إغلاق"
            onClick={onClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isDarkMode
                ? 'bg-[#1b211e] hover:bg-[#252b28] text-[#bbcabf] hover:text-white'
                : 'bg-[#f3f4f3] hover:bg-[#e8e8e7] text-[#404942] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-6 flex-1 no-scrollbar">
          {/* Section: Recitation Speed */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className={`font-bold text-[14px] flex items-center gap-1.5 ${
                  isDarkMode ? 'text-[#ecfdf5]' : 'text-[#003820]'
                }`}
              >
                <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">speed</span>
                سرعة التلاوة
              </span>
              <span
                className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${
                  isDarkMode
                    ? 'bg-[#4edea3]/20 text-[#4edea3]'
                    : 'bg-[#b0f1c7]/50 text-[#0f5132]'
                }`}
              >
                {currentSpeedObj.label} {currentSpeedObj.arabic}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {speeds.map((s) => {
                const isSelected = currentSpeed === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => onSelectSpeed(s.value)}
                    className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-2 ring-[#4edea3] ring-offset-2 ring-offset-[#141c18]'
                          : 'bg-[#003820] text-white shadow-sm ring-2 ring-[#003820] ring-offset-2 ring-offset-white'
                        : isDarkMode
                        ? 'border border-[#3c4a42]/50 bg-[#1b211e]/70 hover:bg-[#252b28] text-[#bbcabf]'
                        : 'border border-[#c0c9c0]/50 bg-[#f3f4f3]/60 hover:bg-[#e8e8e7] text-[#404942]'
                    }`}
                  >
                    <span className="font-bold text-[15px]">{s.arabic}</span>
                    <span
                      className={`text-[11px] ${
                        isSelected
                          ? isDarkMode
                            ? 'text-emerald-100'
                            : 'text-emerald-200'
                          : isDarkMode
                          ? 'text-[#86948a]'
                          : 'text-[#707971]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section: Reciters Selection */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className={`font-bold text-[14px] flex items-center gap-1.5 ${
                  isDarkMode ? 'text-[#ecfdf5]' : 'text-[#003820]'
                }`}
              >
                <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">
                  record_voice_over
                </span>
                اختيار المقرئ
              </span>
              <span
                className={`text-[12px] ${
                  isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
                }`}
              >
                ٥ مقرئين متاحين
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {RECITERS.map((reciter) => {
                const isSelected = selectedReciterId === reciter.id;
                return (
                  <div
                    key={reciter.id}
                    onClick={() => onSelectReciter(reciter.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-[#1a2d24] border-2 border-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.15)]'
                          : 'bg-[#b0f1c7]/25 border-2 border-[#003820] shadow-sm'
                        : isDarkMode
                        ? 'bg-[#1b211e]/70 hover:bg-[#252b28] border border-[#3c4a42]/40 text-[#dee4de]'
                        : 'bg-[#f3f4f3]/60 hover:bg-[#f3f4f3] border border-[#c0c9c0]/40 text-[#1a1c1c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-[17px] shadow-sm ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-[#10b981] text-white'
                              : 'bg-[#003820] text-white'
                            : isDarkMode
                            ? 'bg-[#252b28] text-[#4edea3]'
                            : 'bg-[#e8e8e7] text-[#003820]'
                        }`}
                      >
                        {reciter.initial}
                      </div>
                      <div className="flex flex-col text-right">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-[14px] ${
                              isSelected
                                ? isDarkMode
                                ? 'text-[#4edea3]'
                                : 'text-[#003820]'
                                : isDarkMode
                                ? 'text-[#dee4de]'
                                : 'text-[#1a1c1c]'
                            }`}
                          >
                            {reciter.name}
                          </span>
                          {isSelected && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isDarkMode
                                  ? 'bg-[#4edea3]/30 text-[#4edea3]'
                                  : 'bg-[#003820] text-white'
                              }`}
                            >
                              الحالي
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[12px] mt-0.5 ${
                            isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
                          }`}
                        >
                          {reciter.description}
                        </span>
                      </div>
                    </div>

                    {/* Radio / Checkmark indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? isDarkMode
                            ? 'bg-[#10b981] text-white shadow-[0_0_10px_rgba(78,222,163,0.4)]'
                            : 'bg-[#003820] text-white shadow-sm'
                          : isDarkMode
                          ? 'border-2 border-[#3c4a42]'
                          : 'border-2 border-[#c0c9c0]'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: Audio Preferences */}
          <section className="flex flex-col gap-3 pt-1">
            <span
              className={`font-bold text-[14px] flex items-center gap-1.5 ${
                isDarkMode ? 'text-[#ecfdf5]' : 'text-[#003820]'
              }`}
            >
              <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">
                settings_suggest
              </span>
              خيارات وتفضيلات الصوت
            </span>

            <div className="space-y-2.5">
              {/* Autoplay Toggle */}
              <div
                onClick={onToggleAutoplay}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-[#1b211e]/70 border border-[#3c4a42]/30 hover:bg-[#252b28]'
                    : 'bg-[#f3f4f3]/60 border border-[#c0c9c0]/30 hover:bg-[#f3f4f3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-[#4edea3]/20 text-[#4edea3]'
                        : 'bg-[#0f5132]/10 text-[#0f5132]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">playlist_play</span>
                  </div>
                  <div>
                    <p
                      className={`font-bold text-[13px] ${
                        isDarkMode ? 'text-[#dee4de]' : 'text-[#1a1c1c]'
                      }`}
                    >
                      التشغيل التلقائي المتتالي
                    </p>
                    <p
                      className={`text-[11px] ${
                        isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
                      }`}
                    >
                      الانتقال للذكر التالي فور انتهاء التلاوة
                    </p>
                  </div>
                </div>

                {/* Switch indicator */}
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    isAutoplay
                      ? isDarkMode
                        ? 'bg-[#10b981]'
                        : 'bg-[#0f5132]'
                      : isDarkMode
                      ? 'bg-[#3c4a42]'
                      : 'bg-[#e2e2e2]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isAutoplay ? 'translate-x-0' : '-translate-x-5'
                    }`}
                  />
                </div>
              </div>

              {/* Offline download Toggle */}
              <div
                onClick={onToggleOfflineDownload}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-[#1b211e]/70 border border-[#3c4a42]/30 hover:bg-[#252b28]'
                    : 'bg-[#f3f4f3]/60 border border-[#c0c9c0]/30 hover:bg-[#f3f4f3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                        : 'bg-[#ffdbca] text-[#9b4500]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      download_for_offline
                    </span>
                  </div>
                  <div>
                    <p
                      className={`font-bold text-[13px] ${
                        isDarkMode ? 'text-[#dee4de]' : 'text-[#1a1c1c]'
                      }`}
                    >
                      تحميل الصوت للاستماع دون اتصال
                    </p>
                    <p
                      className={`text-[11px] ${
                        isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
                      }`}
                    >
                      تخزين ملفات المقرئ المختار تلقائياً
                    </p>
                  </div>
                </div>

                {/* Switch indicator */}
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    isOfflineDownload
                      ? isDarkMode
                        ? 'bg-[#10b981]'
                        : 'bg-[#0f5132]'
                      : isDarkMode
                      ? 'bg-[#3c4a42]'
                      : 'bg-[#e2e2e2]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isOfflineDownload ? 'translate-x-0' : '-translate-x-5'
                    }`}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer Confirmation Button */}
        <div
          className={`p-4 border-t ${
            isDarkMode
              ? 'bg-[#141c18] border-[#3c4a42]/40'
              : 'bg-white border-[#eeeeed]'
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] ${
              isDarkMode
                ? 'bg-[#10b981] text-white hover:bg-[#059669] shadow-[0_4px_20px_rgba(16,185,129,0.35)]'
                : 'bg-[#003820] text-white hover:bg-[#0f5132] shadow-[0_4px_14px_rgba(15,81,50,0.2)]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">done_all</span>
            <span>تأكيد الإعدادات والمتابعة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
