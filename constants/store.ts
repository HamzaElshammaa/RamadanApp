import { create } from 'zustand';

export interface PrayerTime {
    id: string;
    name: string;
    time: string;      // "HH:MM" 24h format
    isoTime: Date;     // Full Date object for countdown calculations
}

interface AppState {
    // Sound
    selectedSoundId: string;
    setSelectedSoundId: (id: string) => void;

    // Location
    coords: { latitude: number; longitude: number } | null;
    setCoords: (coords: { latitude: number; longitude: number }) => void;

    // Prayer times
    prayerTimes: PrayerTime[];
    setPrayerTimes: (times: PrayerTime[]) => void;

    nextPrayer: PrayerTime | null;
    setNextPrayer: (prayer: PrayerTime | null) => void;

    lastFetchDate: string | null;      // 'YYYY-MM-DD'
    setLastFetchDate: (date: string) => void;

    // UI
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Sound
    selectedSoundId: 'adhan_mecca',
    setSelectedSoundId: (id) => set({ selectedSoundId: id }),

    // Location
    coords: null,
    setCoords: (coords) => set({ coords }),

    // Prayer times
    prayerTimes: [],
    setPrayerTimes: (times) => set({ prayerTimes: times }),

    nextPrayer: null,
    setNextPrayer: (prayer) => set({ nextPrayer: prayer }),

    lastFetchDate: null,
    setLastFetchDate: (date) => set({ lastFetchDate: date }),

    // UI
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    error: null,
    setError: (error) => set({ error }),
}));
