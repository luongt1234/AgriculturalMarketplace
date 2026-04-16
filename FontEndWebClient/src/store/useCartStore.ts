import { create } from 'zustand';
import { cartApi } from '../features/cart/api/cart.api';
import type { CartDto, CartItemDto, AddToCartDto } from '../types/cart.types';

interface CartState {
    cart: CartDto | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartDto) => Promise<void>;
    updateQuantity: (chiTietId: string, soLuong: number) => Promise<void>;
    removeFromCart: (chiTietId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    loading: false,
    error: null,

    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const cart = await cartApi.getCart();
            set({ cart, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch cart', loading: false });
        }
    },

    addToCart: async (data: AddToCartDto) => {
        set({ loading: true, error: null });
        try {
            const cart = await cartApi.addItem(data);
            set({ cart, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to add item to cart', loading: false });
        }
    },

    updateQuantity: async (chiTietId: string, soLuong: number) => {
        set({ loading: true, error: null });
        try {
            const cart = await cartApi.updateQuantity(chiTietId, { soLuong });
            set({ cart, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update quantity', loading: false });
        }
    },

    removeFromCart: async (chiTietId: string) => {
        set({ loading: true, error: null });
        try {
            const cart = await cartApi.removeItem(chiTietId);
            set({ cart, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to remove item from cart', loading: false });
        }
    },

    clearCart: async () => {
        set({ loading: true, error: null });
        try {
            await cartApi.clearCart();
            set({ cart: null, loading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to clear cart', loading: false });
        }
    },

    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
}));