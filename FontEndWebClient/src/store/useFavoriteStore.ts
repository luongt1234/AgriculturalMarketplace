import { create } from 'zustand';
import { favoriteApi, type FavoriteProductDto } from '../features/favorites/api/favorite.api';

interface FavoriteState {
    favoriteIds: string[];
    favorites: FavoriteProductDto[];
    loading: boolean;
    error: string | null;

    fetchFavoriteIds: () => Promise<void>;
    fetchFavorites: () => Promise<void>;
    toggleFavorite: (sanPhamDangId: string) => Promise<void>;
    isFavorite: (sanPhamDangId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
    favoriteIds: [],
    favorites: [],
    loading: false,
    error: null,

    fetchFavoriteIds: async () => {
        try {
            const res = await favoriteApi.getFavoriteIds();
            set({ favoriteIds: res.data || [] });
        } catch (error) {
            console.error('Failed to fetch favorite ids:', error);
        }
    },

    fetchFavorites: async () => {
        set({ loading: true, error: null });
        try {
            const res = await favoriteApi.getFavorites();
            const favoritesList = res.data || [];
            set({ favorites: favoritesList, favoriteIds: favoritesList.map(item => item.sanPhamDangId), loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch favorites', loading: false });
        }
    },

    toggleFavorite: async (sanPhamDangId: string) => {
        const { favoriteIds, favorites } = get();
        const isCurrentFav = favoriteIds.includes(sanPhamDangId);

        // Optimistic UI update
        const newFavoriteIds = isCurrentFav
            ? favoriteIds.filter(id => id !== sanPhamDangId)
            : [...favoriteIds, sanPhamDangId];

        const newFavorites = isCurrentFav
            ? favorites.filter(item => item.sanPhamDangId !== sanPhamDangId)
            : favorites; // Add will be handled by fetchFavorites later if needed, or we just trust favoriteIds for icon

        set({ favoriteIds: newFavoriteIds, favorites: newFavorites });

        try {
            await favoriteApi.toggleFavorite(sanPhamDangId);
        } catch (error) {
            // Revert on error
            set({ favoriteIds, favorites });
            console.error('Failed to toggle favorite:', error);
        }
    },

    isFavorite: (sanPhamDangId: string) => {
        return get().favoriteIds.includes(sanPhamDangId);
    }
}));
