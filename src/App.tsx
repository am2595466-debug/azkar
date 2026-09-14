import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TabType, DhikrItem, Reciter } from './types';
import { AZKAR_LIST } from './data/azkarData';
import { RECITERS } from './data/recitersData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AudioPlayerView } from './components/AudioPlayerView';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { AzkarListView } from './components/AzkarListView';
import { MiniAudioPlayer } from './components/MiniAudioPlayer';
import { TasbihView } from './components/TasbihView';
import { PrayerTimesView } from './components/PrayerTimesView';
import { HomeView } from './components/HomeView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallBanner } from './components/PWAInstallBanner';

export default function App() {
  // Navigation & Screen View State (starts at 'audio-player' as in user's prompt main screens, or user can toggle)
  const [activeTab, setActiveTab] = useState<TabType>('audio-player');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Audio Playback State
  const [currentDhikr, setCurrentDhikr] = useState<DhikrItem>(AZKAR_LIST[3]); // 'أصبحنا وأصبح الملك لله'
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]); // Mishary Alafasy
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(75); // 01:15 as shown in design Image 8
  const [currentSpeed, setCurrentSpeed] = useState<number>(1.0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [isOfflineDownload, setIsOfflineDownload] = useState<boolean>(false);

  // Modals & Notifications
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Queue of remaining Azkar (Items 1, 2, 4 from AZKAR_LIST)
  const [queue, setQueue] = useState<DhikrItem[]>([
    AZKAR_LIST[1], // آية الكرسي
    AZKAR_LIST[0], // سيد الاستغفار
    AZKAR_LIST[4], // سورة الإخلاص والمعوذتين
  ]);

  // Handle Dark mode class on html/root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#0f1512';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f9f9f8';
    }
  }, [isDarkMode]);

  // Audio Progress Simulator: strictly increments currentTime
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        const maxSec = currentDhikr.audioSeconds || 200;
        setCurrentTime((prev) => {
          if (prev + 1 >= maxSec) {
            return maxSec;
          }
          return prev + 1;
        });
      }, 1000 / currentSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentDhikr.audioSeconds, currentSpeed]);

  // Handle Track Completion when audio reaches maximum duration
  useEffect(() => {
    const maxSec = currentDhikr.audioSeconds || 200;
    if (isPlaying && currentTime >= maxSec) {
      if (isAutoplay && queue.length > 0) {
        const nextTrack = queue[0];
        const remainingQueue = queue.slice(1);
        setCurrentDhikr(nextTrack);
        setQueue([...remainingQueue, currentDhikr]);
        setCurrentTime(0);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  }, [currentTime, isPlaying, currentDhikr, isAutoplay, queue]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handlePrevTrack = () => {
    setCurrentTime(0);
    showToast('العودة لبداية الذكر');
  };

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const remainingQueue = queue.slice(1);
      setCurrentDhikr(nextTrack);
      setQueue([...remainingQueue, currentDhikr]);
      setCurrentTime(0);
      setIsPlaying(true);
      showToast(`التشغيل: ${nextTrack.title}`);
    }
  };

  const handleSelectDhikrFromQueue = (dhikr: DhikrItem) => {
    setCurrentDhikr(dhikr);
    setCurrentTime(0);
    setIsPlaying(true);
    setQueue(AZKAR_LIST.filter((a) => a.id !== dhikr.id).slice(0, 3));
    showToast(`بدء تلاوة: ${dhikr.title}`);
  };

  const handleToggleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
    setCurrentSpeed(speeds[nextIdx]);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'الرئيسية';
      case 'categories':
        return 'أذكار الصباح والمساء';
      case 'audio-player':
        return 'Audio Player';
      case 'tasbih':
        return 'المسبحة الذكية';
      case 'prayer-and-settings':
        return 'مواقيت الصلاة';
      default:
        return 'Audio Player';
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0f1512] text-[#dee4de]' : 'bg-[#f9f9f8] text-[#1a1c1c]'
      }`}
      dir="rtl"
    >
      {/* Top Sanctuary Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        activeTabTitle={getActiveTabTitle()}
        onShowToast={showToast}
      />

      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-[680px] mx-auto pt-24 px-4">
        {activeTab === 'home' && (
          <HomeView
            onNavigateTab={setActiveTab}
            onPlayDhikr={(dhikr) => {
              setCurrentDhikr(dhikr);
              setCurrentTime(0);
              setIsPlaying(true);
              setActiveTab('audio-player');
            }}
            morningAzkar={AZKAR_LIST}
            selectedReciter={selectedReciter}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'categories' && (
          <AzkarListView
            azkar={AZKAR_LIST}
            selectedReciter={selectedReciter}
            onPlayDhikrAudio={(dhikr) => {
              setCurrentDhikr(dhikr);
              setCurrentTime(0);
              setIsPlaying(true);
              showToast(`تم تشغيل ${dhikr.title} بصوت ${selectedReciter.shortName}`);
            }}
            onShowToast={showToast}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'audio-player' && (
          <AudioPlayerView
            currentDhikr={currentDhikr}
            queue={queue}
            onSelectDhikr={handleSelectDhikrFromQueue}
            selectedReciter={selectedReciter}
            onSelectReciter={(r) => {
              setSelectedReciter(r);
              showToast(`تم اختيار ${r.name}`);
            }}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            currentTime={currentTime}
            onSeek={handleSeek}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            isAutoplay={isAutoplay}
            onToggleAutoplay={() => {
              setIsAutoplay(!isAutoplay);
              showToast(!isAutoplay ? 'تم تفعيل التشغيل التلقائي' : 'تم إيقاف التشغيل التلقائي');
            }}
            currentSpeed={currentSpeed}
            onToggleSpeed={handleToggleSpeed}
            onOpenSettings={() => setIsAudioSettingsOpen(true)}
            isDarkMode={isDarkMode}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'tasbih' && (
          <TasbihView isDarkMode={isDarkMode} onShowToast={showToast} />
        )}

        {activeTab === 'prayer-and-settings' && (
          <PrayerTimesView isDarkMode={isDarkMode} onShowToast={showToast} />
        )}
      </main>

      {/* Floating Ambient Mini Audio Player (Visible when browsing other tabs than audio-player) */}
      {activeTab !== 'audio-player' && (
        <MiniAudioPlayer
          currentDhikr={currentDhikr}
          selectedReciter={selectedReciter}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          onOpenFullPlayer={() => setActiveTab('audio-player')}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
      />

      {/* Audio Settings Bottom Sheet Modal */}
      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
        selectedReciterId={selectedReciter.id}
        onSelectReciter={(id) => {
          const reciter = RECITERS.find((r) => r.id === id);
          if (reciter) setSelectedReciter(reciter);
        }}
        currentSpeed={currentSpeed}
        onSelectSpeed={(speed) => setCurrentSpeed(speed)}
        isAutoplay={isAutoplay}
        onToggleAutoplay={() => setIsAutoplay(!isAutoplay)}
        isOfflineDownload={isOfflineDownload}
        onToggleOfflineDownload={() => {
          setIsOfflineDownload(!isOfflineDownload);
          showToast(
            !isOfflineDownload
              ? 'تم تفعيل تنزيل الصوت للاستماع دون اتصال'
              : 'تم إيقاف تنزيل الصوت'
          );
        }}
        isDarkMode={isDarkMode}
      />

      {/* Notifications Reminder Modal */}
      {isNotificationsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsNotificationsModalOpen(false)}
        >
          <div
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl transition-all ${
              isDarkMode
                ? 'bg-[#18221d] border-[#3c4a42]/60 text-[#dee4de]'
                : 'bg-white border-[#e2e2e2] text-[#1a1c1c]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isDarkMode ? 'text-[#ffb95f]' : 'text-[#9b4500]'
                  }`}
                >
                  notifications_active
                </span>
                <h3 className="font-arabic text-[18px] font-bold">تنبيهات الأذكار</h3>
              </div>
              <button
                onClick={() => setIsNotificationsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-black/10"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-[#121c16] border-[#3c4a42]/30' : 'bg-[#f3f4f3] border-[#e2e2e2]'
                }`}
              >
                <div>
                  <p className="font-bold text-[13px]">أذكار الصباح (الفجر)</p>
                  <p className="opacity-70 mt-0.5">موعد التذكير اليومي: ٠٥:١٥ صباحاً</p>
                </div>
                <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                  check_circle
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-[#121c16] border-[#3c4a42]/30' : 'bg-[#f3f4f3] border-[#e2e2e2]'
                }`}
              >
                <div>
                  <p className="font-bold text-[13px]">أذكار المساء (العصر)</p>
                  <p className="opacity-70 mt-0.5">موعد التذكير اليومي: ٠٤:٣٠ مساءً</p>
                </div>
                <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                  check_circle
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-[#121c16] border-[#3c4a42]/30' : 'bg-[#f3f4f3] border-[#e2e2e2]'
                }`}
              >
                <div>
                  <p className="font-bold text-[13px]">أذكار النوم والاستيقاظ</p>
                  <p className="opacity-70 mt-0.5">موعد التذكير: ١٠:٣٠ مساءً</p>
                </div>
                <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                  check_circle
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsNotificationsModalOpen(false);
                showToast('تم حفظ إعدادات التنبيهات بنجاح');
              }}
              className={`w-full mt-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                isDarkMode
                  ? 'bg-[#10b981] text-white hover:bg-[#059669]'
                  : 'bg-[#003820] text-white hover:bg-[#0f5132]'
              }`}
            >
              حفظ التفضيلات
            </button>
          </div>
        </div>
      )}

      {/* Connectivity & Offline State Indicator */}
      <OfflineIndicator isDarkMode={isDarkMode} />

      {/* PWA Install Banner */}
      <PWAInstallBanner isDarkMode={isDarkMode} onShowToast={showToast} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 inset-x-0 mx-auto max-w-xs z-50 flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-full text-xs font-bold shadow-xl border flex items-center gap-2 ${
              isDarkMode
                ? 'bg-[#18221d] border-[#4edea3]/40 text-[#4edea3] shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                : 'bg-[#003820] border-[#0f5132] text-white shadow-lg'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
