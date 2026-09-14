export type TabType = 'home' | 'categories' | 'audio-player' | 'tasbih' | 'prayer-and-settings';

export type TimeOfDay = 'morning' | 'evening';

export interface Reciter {
  id: string;
  name: string;
  shortName: string;
  initial: string;
  description: string;
  badge?: string;
  audioPrefix?: string;
  quality: string;
}

export interface DhikrItem {
  id: string;
  title: string;
  subtitle?: string;
  tag: string;
  timeOfDay: TimeOfDay;
  arabicText: string;
  virtueTitle?: string;
  virtueText: string;
  source: string;
  repetitionTotal: number;
  duration: string; // e.g. "00:42"
  audioSeconds: number;
  meaning?: string;
  quranSurah?: string;
  quranAyah?: string;
  isDownloaded?: boolean;
}

export interface AudioState {
  currentTrackId: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  isAutoplay: boolean;
  repeatCount: number;
  reciterId: string;
  volume: number;
}

export interface PrayerTimeItem {
  name: string;
  arabicName: string;
  time: string;
  isPassed: boolean;
  isNext: boolean;
  icon: string;
}
