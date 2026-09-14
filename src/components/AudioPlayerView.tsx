import React, { useState, useEffect, useRef } from 'react';
import { DhikrItem, Reciter } from '../types';
import { RECITERS } from '../data/recitersData';
import { toArabicNumerals, formatTimeArabic, playTactileClick } from '../utils/audioEngine';

interface AudioPlayerViewProps {
  currentDhikr: DhikrItem;
  queue: DhikrItem[];
  onSelectDhikr: (dhikr: DhikrItem) => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (seconds: number) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  currentSpeed: number;
  onToggleSpeed: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onShowToast: (msg: string) => void;
}

export const AudioPlayerView: React.FC<AudioPlayerViewProps> = ({
  currentDhikr,
  queue,
  onSelectDhikr,
  selectedReciter,
  onSelectReciter,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek,
  onPrevTrack,
  onNextTrack,
  isAutoplay,
  onToggleAutoplay,
  currentSpeed,
  onToggleSpeed,
  onOpenSettings,
  isDarkMode,
  onShowToast,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentRepetition, setCurrentRepetition] = useState(1);
  const [downloadedItems, setDownloadedItems] = useState<Record<string, boolean>>({
    'ayat-al-kursi': true,
    'al-ikhlas-muawwidhatayn': true,
  });

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Waveform bars dynamic heights
  const [waveHeights, setWaveHeights] = useState<number[]>([
    12, 20, 32, 16, 40, 28, 44, 24, 32, 40, 24, 16, 36, 20, 32, 40, 24, 16, 28, 12,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 34) + 8)
        );
      }, 150);
    } else {
      setWaveHeights((prev) => prev.map(() => 8));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const progressPercent = Math.min(
    100,
    (currentTime / (currentDhikr.audioSeconds || 200)) * 100
  );

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent * (currentDhikr.audioSeconds || 200));
  };

  const handleRewind10 = () => {
    playTactileClick('rewind');
    onSeek(Math.max(0, currentTime - 10));
  };

  const handleForward10 = () => {
    playTactileClick('rewind');
    onSeek(Math.min(currentDhikr.audioSeconds || 200, currentTime + 10));
  };

  const handleRepetitionClick = () => {
    playTactileClick('bead');
    setCurrentRepetition((prev) => (prev % currentDhikr.repetitionTotal) + 1);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    onShowToast(!isBookmarked ? 'تم حفظ الذكر في المفضلة' : 'تمت الإزالة من المفضلة');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${currentDhikr.title}\n\n${currentDhikr.arabicText}\n\n${currentDhikr.source}`
      );
      onShowToast('تم نسخ الذكر للمشاركة بنجاح');
    }
  };

  const toggleDownloadItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !downloadedItems[id];
    setDownloadedItems((prev) => ({ ...prev, [id]: newState }));
    onShowToast(newState ? 'تم تحميل الذكر للاستماع دون إنترنت' : 'تم حذف التحميل');
  };

  return (
    <div className="flex flex-col w-full space-y-4 select-none pb-28">
      {/* Top Audio Meta & Reciters Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[18px] ${
                isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
              }`}
            >
              graphic_eq
            </span>
            <span
              className={`font-bold text-[14px] ${
                isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
              }`}
            >
              المقرئ المختار
            </span>
          </div>

          <div
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors shadow-sm ${
              isDarkMode
                ? 'bg-[#ffb95f]/15 text-[#ffb95f] border border-[#ffb95f]/30'
                : 'bg-[#ffdbca] text-[#331200]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              high_quality
            </span>
            <span>صوت نقي عالي الوضوح HQ</span>
          </div>
        </div>

        {/* Reciter Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
          {RECITERS.slice(0, 3).map((reciter) => {
            const isSelected = selectedReciter.id === reciter.id;
            return (
              <button
                key={reciter.id}
                onClick={() => {
                  playTactileClick('bead');
                  onSelectReciter(reciter);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-[#10b981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-[#003820] text-white shadow-sm'
                    : isDarkMode
                    ? 'bg-[#1b211e] text-[#bbcabf] hover:text-[#4edea3] border border-[#3c4a42]/40'
                    : 'bg-[#f3f4f3] text-[#404942] hover:text-[#003820]'
                }`}
              >
                {isSelected && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-white shadow-[0_0_6px_#fff]' : 'bg-[#b0f1c7]'
                    }`}
                  />
                )}
                <span className="text-[13px] font-semibold">{reciter.shortName}</span>
              </button>
            );
          })}

          {/* More reciters button */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors ${
              isDarkMode
                ? 'bg-[#1b211e] text-[#bbcabf] hover:text-white border border-[#3c4a42]/40'
                : 'bg-[#f3f4f3] text-[#404942] hover:text-[#003820]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>المزيد...</span>
          </button>
        </div>
      </div>

      {/* Active Supplication Card */}
      <div
        className={`relative overflow-hidden rounded-[24px] shadow-md p-5 flex flex-col justify-between border transition-all ${
          isDarkMode
            ? 'bg-[#18221d] border-[#3c4a42]/50 text-[#dee4de] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-white border-[#e2e2e2]/70 text-[#1a1c1c]'
        }`}
      >
        {/* Subtle ambient aura */}
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
            isDarkMode ? 'bg-[#ffb95f]/10' : 'bg-[#ffb68e]/20'
          }`}
        />
        <div
          className={`absolute -bottom-12 -left-12 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
            isDarkMode ? 'bg-[#10b981]/15' : 'bg-[#95d4ac]/20'
          }`}
        />

        {/* Card Header with Badges and Motif */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                isDarkMode
                  ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                  : 'bg-[#b0f1c7] text-[#002111]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">wb_twilight</span>
              <span>{currentDhikr.tag}</span>
            </span>

            {/* Repetition Badge (interactive tap) */}
            <button
              onClick={handleRepetitionClick}
              title="اضغط لتغيير عداد التكرار"
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95 cursor-pointer ${
                isDarkMode
                  ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40 shadow-sm'
                  : 'bg-[#ffdbca] text-[#331200]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">repeat</span>
              <span>
                التكرار: {toArabicNumerals(currentRepetition)} /{' '}
                {toArabicNumerals(currentDhikr.repetitionTotal)}
              </span>
            </button>
          </div>

          {/* Sacred Manuscript Symbol Rub el Hizb */}
          <div
            className={`flex items-center text-[22px] leading-none ${
              isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
            }`}
            title="۞"
          >
            ۞
          </div>
        </div>

        {/* Supplication Main Arabic Diacritical Text */}
        <div className="my-5 text-center px-1 z-10">
          <p
            className={`font-arabic text-[23px] sm:text-[25px] leading-[48px] sm:leading-[52px] tracking-normal select-text drop-shadow-sm ${
              isDarkMode ? 'text-[#ecfdf5]' : 'text-[#003820]'
            }`}
          >
            {currentDhikr.arabicText}
          </p>

          {/* Micro virtue note */}
          <p
            className={`mt-3 text-[13px] leading-relaxed text-center font-medium ${
              isDarkMode ? 'text-[#bbcabf]' : 'text-[#404942]'
            }`}
          >
            {currentDhikr.virtueText}
          </p>
        </div>

        {/* Card Footer & Attribution */}
        <div
          className={`pt-3 flex items-center justify-between z-10 border-t ${
            isDarkMode ? 'border-[#3c4a42]/40' : 'border-[#eeeeed]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[16px] ${
                isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
              }`}
            >
              menu_book
            </span>
            <span
              className={`text-[12px] font-medium ${
                isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'
              }`}
            >
              {currentDhikr.source}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmarkToggle}
              aria-label="حفظ الذكر"
              title="حفظ في المفضلة"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isBookmarked
                  ? 'text-[#ffb95f]'
                  : isDarkMode
                  ? 'text-[#bbcabf] hover:text-[#ffb95f] hover:bg-[#252b28]'
                  : 'text-[#404942] hover:text-[#9b4500] hover:bg-[#f3f4f3]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>

            <button
              onClick={handleShare}
              aria-label="مشاركة الذكر"
              title="مشاركة الذكر"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isDarkMode
                  ? 'text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#252b28]'
                  : 'text-[#404942] hover:text-[#003820] hover:bg-[#f3f4f3]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Player Deck */}
      <div
        className={`rounded-[24px] shadow-md p-5 flex flex-col gap-4 border transition-all ${
          isDarkMode
            ? 'bg-[#18221d] border-[#3c4a42]/50 text-[#dee4de] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'bg-white border-[#e2e2e2]/70 text-[#1a1c1c]'
        }`}
      >
        {/* Sound Waveform Visualizer */}
        <div
          className={`flex items-center justify-center gap-[5px] h-12 py-1 px-4 rounded-xl overflow-hidden ${
            isDarkMode ? 'bg-[#101713] border border-[#3c4a42]/30' : 'bg-[#f3f4f3]'
          }`}
        >
          {waveHeights.map((h, i) => {
            const isSecondary = i % 3 === 0;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSecondary
                    ? isDarkMode
                      ? 'bg-[#ffb95f]'
                      : 'bg-[#9b4500]'
                    : isDarkMode
                    ? 'bg-[#10b981]'
                    : 'bg-[#003820]'
                }`}
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>

        {/* Scrubber and Timers */}
        <div className="flex flex-col gap-1.5 w-full">
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="relative w-full h-4 flex items-center cursor-pointer group"
          >
            {/* Background Track */}
            <div
              className={`w-full h-1.5 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-[#252b28]' : 'bg-[#e8e8e7]'
              }`}
            >
              {/* Active Progress */}
              <div
                className={`h-full rounded-full transition-[width] duration-100 ${
                  isDarkMode
                    ? 'bg-gradient-to-l from-[#4edea3] to-[#10b981] shadow-[0_0_10px_rgba(78,222,163,0.5)]'
                    : 'bg-[#003820]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scrubber Handle */}
            <div
              className={`absolute w-4 h-4 rounded-full shadow-md transform -translate-x-1/2 group-hover:scale-125 transition-transform duration-100 flex items-center justify-center ${
                isDarkMode ? 'bg-[#10b981] ring-2 ring-[#4edea3]' : 'bg-[#0f5132]'
              }`}
              style={{ left: `${progressPercent}%` }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>

          {/* Timestamp counters */}
          <div className="flex items-center justify-between text-xs px-0.5 font-medium">
            <span className={isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'}>
              {formatTimeArabic(currentTime)}
            </span>
            <span
              className={`font-semibold ${
                isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
              }`}
            >
              صوت {selectedReciter.name}
            </span>
            <span className={isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'}>
              {toArabicNumerals(currentDhikr.duration)}
            </span>
          </div>
        </div>

        {/* Main Playback Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {/* Replay 10s */}
          <button
            onClick={handleRewind10}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-white hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#eeeeed]'
            }`}
            title="تأخير ١٠ ثوانٍ"
          >
            <span className="material-symbols-outlined text-[24px]">replay_10</span>
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrevTrack}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-white hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#eeeeed]'
            }`}
            title="الذكر السابق"
          >
            <span className="material-symbols-outlined text-[26px]">skip_next</span>
          </button>

          {/* Central Grand Play / Pause Button */}
          <button
            onClick={() => {
              playTactileClick('bead');
              onTogglePlay();
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-tr from-[#00422b] to-[#10b981] text-white shadow-[0_0_24px_rgba(16,185,129,0.4)] hover:brightness-110'
                : 'bg-[#0f5132] text-white hover:bg-[#003820] shadow-[0_4px_16px_rgba(15,81,50,0.3)]'
            }`}
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
          >
            <span
              className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next Track */}
          <button
            onClick={onNextTrack}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-white hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#eeeeed]'
            }`}
            title="الذكر التالي"
          >
            <span className="material-symbols-outlined text-[26px]">skip_previous</span>
          </button>

          {/* Forward 10s */}
          <button
            onClick={handleForward10}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-white hover:bg-[#252b28]'
                : 'text-[#404942] hover:text-[#003820] hover:bg-[#eeeeed]'
            }`}
            title="تقديم ١٠ ثوانٍ"
          >
            <span className="material-symbols-outlined text-[24px]">forward_10</span>
          </button>
        </div>

        {/* Control Toggles & Speed */}
        <div
          className={`pt-1 flex items-center justify-around rounded-xl p-2 ${
            isDarkMode ? 'bg-[#121a15] border border-[#3c4a42]/30' : 'bg-[#f3f4f3]/80'
          }`}
        >
          {/* Auto Play Next */}
          <button
            onClick={onToggleAutoplay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
              isAutoplay
                ? isDarkMode
                  ? 'bg-[#1b211e] text-[#4edea3] shadow-sm'
                  : 'bg-white shadow-sm text-[#003820]'
                : isDarkMode
                ? 'text-[#86948a] hover:text-[#dee4de]'
                : 'text-[#707971] hover:text-[#1a1c1c]'
            }`}
            title="التشغيل التلقائي"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isAutoplay
                  ? isDarkMode
                    ? 'text-[#4edea3]'
                    : 'text-[#003820]'
                  : ''
              }`}
              style={{ fontVariationSettings: isAutoplay ? "'FILL' 1" : "'FILL' 0" }}
            >
              playlist_play
            </span>
            <span>تلقائي</span>
          </button>

          {/* Repeat Count */}
          <button
            onClick={handleRepetitionClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-white'
                : 'text-[#404942] hover:text-[#003820]'
            }`}
            title="تكرار الذكر حسب السنة"
          >
            <span className="material-symbols-outlined text-[18px]">repeat_on</span>
            <span>تكرار {toArabicNumerals(currentDhikr.repetitionTotal)}×</span>
          </button>

          {/* Speed Control */}
          <button
            onClick={onToggleSpeed}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
              isDarkMode
                ? 'text-[#bbcabf] hover:text-[#4edea3]'
                : 'text-[#404942] hover:text-[#003820]'
            }`}
            title="سرعة التلاوة"
          >
            <span className="material-symbols-outlined text-[18px]">speed</span>
            <span>{toArabicNumerals(currentSpeed)}×</span>
          </button>
        </div>
      </div>

      {/* Supplication Queue Section */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
              }`}
            >
              queue_music
            </span>
            <h2
              className={`font-arabic text-[18px] font-bold ${
                isDarkMode ? 'text-[#4edea3]' : 'text-[#003820]'
              }`}
            >
              الأذكار التالية في قائمة التلاوة
            </h2>
          </div>
          <span
            className={`text-xs font-semibold ${
              isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'
            }`}
          >
            {toArabicNumerals(queue.length)} أذكار متبقية
          </span>
        </div>

        {/* Queue Items List */}
        <div className="flex flex-col gap-2.5">
          {queue.map((item) => {
            const isItemDownloaded = downloadedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => onSelectDhikr(item)}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-200 group border ${
                  isDarkMode
                    ? 'bg-[#18221d] border-[#3c4a42]/40 hover:bg-[#202c25] text-[#dee4de] shadow-sm'
                    : 'bg-white border-[#e2e2e2]/60 hover:shadow-md text-[#1a1c1c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isDarkMode
                        ? 'bg-[#252b28] text-[#4edea3] group-hover:bg-[#10b981] group-hover:text-white'
                        : 'bg-[#f3f4f3] text-[#003820] group-hover:bg-[#b0f1c7]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-[14px] leading-snug">{item.title}</span>
                    <span
                      className={`text-[12px] ${
                        isDarkMode ? 'text-[#bbcabf]' : 'text-[#707971]'
                      }`}
                    >
                      {item.subtitle || item.tag} •{' '}
                      {item.repetitionTotal === 1
                        ? 'مرة واحدة'
                        : `${toArabicNumerals(item.repetitionTotal)} مرات`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? 'text-[#86948a]' : 'text-[#707971]'
                    }`}
                  >
                    {toArabicNumerals(item.duration)}
                  </span>
                  <button
                    onClick={(e) => toggleDownloadItem(item.id, e)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isItemDownloaded
                        ? isDarkMode
                          ? 'bg-[#4edea3]/20 text-[#4edea3]'
                          : 'bg-[#0f5132]/10 text-[#0f5132]'
                        : isDarkMode
                        ? 'bg-[#252b28] text-[#bbcabf] hover:text-[#4edea3]'
                        : 'bg-[#f3f4f3] text-[#707971] hover:text-[#003820]'
                    }`}
                    title={
                      isItemDownloaded
                        ? 'تم التحميل للاستماع دون اتصال'
                        : 'تحميل للاستماع دون اتصال'
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isItemDownloaded ? 'cloud_done' : 'download'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
