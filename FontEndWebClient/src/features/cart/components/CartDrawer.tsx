import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/useCartStore';
import { useCheckoutStore } from '../../../store/useCheckoutStore';
import type { CartItemDto } from '../../../types/cart.types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, fetchCart } = useCartStore();
    const { setCartItems } = useCheckoutStore();
    const cartItems = cart?.chiTiet || [];
    // When drawer opens, initialise selection to all items; user can then deselect
    const initialSelected = useMemo(
        () => new Set(cartItems.map(i => i.id)),
        // Only re-compute when drawer opens (not on every cartItems change while open)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isOpen]
    );
    const [selectedIds, setSelectedIds] = useState<Set<string>>(initialSelected);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const toggleSelect = (productId: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === cartItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(cartItems.map(i => i.id)));
        }
    };

    const selectedItems = cartItems.filter(i => selectedIds.has(i.id));
    const subtotal = selectedItems.reduce((s, i) => s + i.gia * i.soLuong, 0);

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        // Convert selected items to CartItem format for checkout
        const checkoutItems = selectedItems.map(item => ({
            id: item.id,
            productId: item.sanPhamDangId,
            name: item.tenSanPham || '',
            price: item.gia,
            quantity: item.soLuong,
            image: item.hinhAnhUrl || '',
            unit: item.donVi || '',
            sellerId: item.nguoiBanId,
            sellerName: item.tenNguoiBan || '',
        }));
        setCartItems(checkoutItems);
        onClose();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#1a261c] shadow-2xl z-[70] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">shopping_cart</span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Giỏ hàng
                        </h2>
                        {cartItems.length > 0 && (
                            <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">close</span>
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                        <span className="material-symbols-outlined text-7xl text-gray-200 dark:text-gray-700">shopping_cart</span>
                        <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">Giỏ hàng trống</h3>
                        <p className="text-gray-400 text-sm">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
                        <button
                            onClick={onClose}
                            className="mt-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-colors text-sm"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Select All */}
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                            <input
                                type="checkbox"
                                id="select-all"
                                checked={selectedIds.size === cartItems.length && cartItems.length > 0}
                                onChange={toggleAll}
                                className="w-4 h-4 accent-primary cursor-pointer"
                            />
                            <label htmlFor="select-all" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                Chọn tất cả ({cartItems.length} sản phẩm)
                            </label>
                        </div>

                        {/* Items list */}
                        <div className="flex-1 overflow-y-auto py-2 divide-y divide-gray-100 dark:divide-gray-700/50">
                            {cartItems.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedIds.has(item.id)}
                                    onToggle={() => toggleSelect(item.id)}
                                    onRemove={() => removeFromCart(item.id)}
                                    onQtyChange={(q) => updateQuantity(item.id, q)}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 space-y-3 bg-white dark:bg-[#1a261c]">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>Đã chọn {selectedItems.length} sản phẩm</span>
                                <span className="font-bold text-gray-700 dark:text-gray-200">
                                    Tạm tính: {subtotal.toLocaleString('vi-VN')}₫
                                </span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                            >
                                <span className="material-symbols-outlined text-[20px]">payments</span>
                                Thanh toán ({selectedItems.length})
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

// ─── Cart Item Row ────────────────────────────────────────────────────────────

interface CartItemRowProps {
    item: CartItemDto;
    isSelected: boolean;
    onToggle: () => void;
    onRemove: () => void;
    onQtyChange: (quantity: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, isSelected, onToggle, onRemove, onQtyChange }) => {
    return (
        <div className={`flex gap-3 px-5 py-4 transition-colors ${isSelected ? 'bg-primary/4 dark:bg-primary/[0.06]' : ''}`}>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-4 h-4 accent-primary cursor-pointer"
                />
            </div>

            {/* Product image */}
            <div
                className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 bg-center bg-cover flex-shrink-0 border border-gray-200 dark:border-gray-600"
                style={{ backgroundImage: `url(${item.hinhAnhUrl})` }}
            />

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {item.tenSanPham}
                </h4>
                {item.tenNguoiBan && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.tenNguoiBan}</p>
                )}
                <p className="text-xs text-primary font-bold mt-1">{item.donVi}</p>

                <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onQtyChange(Math.max(1, item.soLuong - 1))}
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-500"
                        >
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="text-sm font-bold text-gray-900 dark:text-white w-6 text-center">
                            {item.soLuong}
                        </span>
                        <button
                            onClick={() => onQtyChange(item.soLuong + 1)}
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-500"
                        >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                    </div>

                    {/* Price + delete */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">
                            {(item.gia * item.soLuong).toLocaleString('vi-VN')}₫
                        </span>
                        <button
                            onClick={onRemove}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
