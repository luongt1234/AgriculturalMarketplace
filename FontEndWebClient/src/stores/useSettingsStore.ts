import { create } from 'zustand';
import { settingsApi } from '../features/settings/api/settingsApi';
import type { CaiDatGiaoDienDto } from '../types/settings.types';

interface SettingsState {
    settings: CaiDatGiaoDienDto | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isLoading: false,
    error: null,
    fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await settingsApi.getSettings();
            set({ settings: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch settings', isLoading: false });
        }
    }
}));
