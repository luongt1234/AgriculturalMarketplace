import { create } from 'zustand';
import type { ReactNode } from 'react';

interface UIState {
    // State cho Header
    pageTitle: string;
    headerActions: ReactNode | null; // Nút bấm (ví dụ: Button "Thêm mới")

    // Actions để cập nhật State
    setPageTitle: (title: string) => void;
    setHeaderActions: (actions: ReactNode | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    pageTitle: 'Dashboard',
    headerActions: null,

    setPageTitle: (title) => set({ pageTitle: title }),
    setHeaderActions: (actions) => set({ headerActions: actions }),
}));