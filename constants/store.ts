import { create } from 'zustand';

interface AppState {
    selectedSoundId: string;
    setSelectedSoundId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    selectedSoundId: 'system_default',
    setSelectedSoundId: (id) => set({ selectedSoundId: id }),
}));
