import { create } from 'zustand';
import type { CheckoutState } from '../types/checkout.types';
import type { DeliveryAddress, ShippingMethod, PaymentMethod, CartItem, OrderSummary } from '../types/checkout.types';

const mockShippingMethods: ShippingMethod[] = [
    {
        id: '1',
        name: 'Standard Shipping',
        description: 'Free delivery for orders over 500K',
        estimatedDays: '3-5 days',
        baseFee: 25000,
        icon: 'local_shipping',
    },
    {
        id: '2',
        name: 'Express Shipping',
        description: 'Next day delivery available',
        estimatedDays: '1-2 days',
        baseFee: 60000,
        icon: 'rocket_launch',
    },
    {
        id: '3',
        name: 'Overnight Shipping',
        description: 'Premium fast delivery',
        estimatedDays: 'Same day',
        baseFee: 100000,
        icon: 'flash_on',
    },
];

const mockPaymentMethods: PaymentMethod[] = [
    {
        id: 'MOMO',
        name: 'Ví MoMo',
        description: 'Quét mã QR bằng app MoMo. Tiền được giữ an toàn, chuyển cho người bán sau khi giao hàng thành công.',
        available: true,
        icon: 'account_balance_wallet',
    },
    {
        id: 'COD',
        name: 'Thanh toán khi nhận hàng (COD)',
        description: 'Trả tiền mặt khi nhận hàng tại nhà.',
        available: true,
        icon: 'money',
    },
];

export const useCheckoutStore = create<CheckoutState>()(
    (set) => ({
        currentStep: 1,
        selectedAddress: null,
        selectedShippingMethod: null,
        selectedPaymentMethod: null,
        addresses: [],
        shippingMethods: mockShippingMethods,
        paymentMethods: mockPaymentMethods,
        cartItems: [],
        orderSummary: null,
        loading: false,
        error: null,

        setStep: (step) => {
            set({ currentStep: step });
        },

        setSelectedAddress: (address) => {
            set({ selectedAddress: address });
        },

        setSelectedShippingMethod: (method) => {
            set({ selectedShippingMethod: method });
        },

        setSelectedPaymentMethod: (method) => {
            set({ selectedPaymentMethod: method });
        },

        addAddress: (address) => {
            set((state) => ({
                addresses: [...state.addresses, { ...address, id: String(state.addresses.length + 1) }],
            }));
        },

        removeAddress: (id) => {
            set((state) => ({
                addresses: state.addresses.filter((addr) => addr.id !== id),
            }));
        },

        updateAddress: (id, updatedAddress) => {
            set((state) => ({
                addresses: state.addresses.map((addr) => (addr.id === id ? { ...addr, ...updatedAddress } : addr)),
            }));
        },

        setAddresses: (addresses) => {
            set({ addresses });
        },

        setShippingMethods: (methods) => {
            set({ shippingMethods: methods });
        },

        setPaymentMethods: (methods) => {
            set({ paymentMethods: methods });
        },

        setCartItems: (items) => {
            set({ cartItems: items });
        },

        setOrderSummary: (summary) => {
            set({ orderSummary: summary });
        },

        setLoading: (loading) => {
            set({ loading });
        },

        setError: (error) => {
            set({ error });
        },

        goToNextStep: () => {
            set((state) => {
                if (state.currentStep < 4) {
                    return { currentStep: (state.currentStep + 1) as 1 | 2 | 3 | 4 };
                }
                return state;
            });
        },

        goToPreviousStep: () => {
            set((state) => {
                if (state.currentStep > 1) {
                    return { currentStep: (state.currentStep - 1) as 1 | 2 | 3 | 4 };
                }
                return state;
            });
        },

        reset: () => {
            set({
                currentStep: 1,
                selectedAddress: null,
                selectedShippingMethod: null,
                selectedPaymentMethod: null,
                addresses: [],
                cartItems: [],
                orderSummary: null,
                loading: false,
                error: null,
            });
        },

        updateItemQuantity: (itemId, quantity) => {
            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
                ),
            }));
        },

        removeCartItem: (itemId) => {
            set((state) => ({
                cartItems: state.cartItems.filter((item) => item.id !== itemId),
            }));
        },
    })
);