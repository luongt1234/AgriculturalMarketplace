import { useState, useEffect } from 'react';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import { useCartStore } from '../../store/useCartStore';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import type { DeliveryAddress, OrderSummary, CartItem } from '../../types/checkout.types';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { AddressStep } from '../../features/checkout/components/AddressStep';
import { AddressModal } from '../../features/checkout/components/AddressModal';
import { ShippingStep } from '../../features/checkout/components/ShippingStep';
import { PaymentStep } from '../../features/checkout/components/PaymentStep';
import { ConfirmationStep } from '../../features/checkout/components/ConfirmationStep';
import { OrderSummaryPanel } from '../../features/checkout/components/OrderSummaryPanel';
import { getUserAddresses, deleteAddress as deleteAddressApi } from '../../features/checkout/api/address.api';
import { toast } from 'sonner';

export function CheckoutPage() {
    useSetPageTitle('Thanh toán');

    const store = useCheckoutStore();
    const { cart, fetchCart } = useCartStore();

    // Map cart items to CartItem[] format for checkout
    const checkoutItems: CartItem[] = cart?.chiTiet?.map(item => ({
        id: item.id,
        productId: item.sanPhamDangId,
        name: item.tenSanPham || '',
        price: item.gia,
        quantity: item.soLuong,
        image: item.hinhAnhUrl || '',
        unit: item.donVi || '',
        sellerId: item.nguoiBanId,
        sellerName: item.tenNguoiBan || '',
    })) || [];

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const addresses = await getUserAddresses();
                // Convert DiaChiNguoiDungDto[] to DeliveryAddress[]
                const deliveryAddresses: DeliveryAddress[] = addresses.map(addr => {
                    let city = '', district = '', ward = '';
                    try {
                        const diaChiObj = JSON.parse(addr.diaChi);
                        city = diaChiObj.name || '';
                        if (diaChiObj.districts && diaChiObj.districts.length > 0) {
                            district = diaChiObj.districts[0].name || '';
                            if (diaChiObj.districts[0].wards && diaChiObj.districts[0].wards.length > 0) {
                                ward = diaChiObj.districts[0].wards[0].name || '';
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing diaChi:', error);
                    }

                    return {
                        id: addr.id,
                        fullName: addr.tenNguoiNhanHang,
                        phone: addr.soDienThoai,
                        city,
                        district,
                        ward,
                        detailedAddress: addr.diaChiChiTiet,
                        label: 'home',
                        isDefault: addr.isDefault
                    };
                });
                store.setAddresses(deliveryAddresses);
            } catch (error) {
                console.error('Error loading addresses:', error);
                toast.error('Không thể tải danh sách địa chỉ');
            }
        };

        loadAddresses();
    }, []);

    useEffect(() => {
        const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingFee = store.selectedShippingMethod?.baseFee || 0;
        const total = subtotal + shippingFee;

        const summary: OrderSummary = {
            items: checkoutItems,
            subtotal,
            shippingFee,
            total,
        };

        const current = store.orderSummary;

        if (JSON.stringify(current) === JSON.stringify(summary)) {
            return;
        }

        store.setOrderSummary(summary);
    }, [checkoutItems, store.selectedShippingMethod?.id, store.selectedShippingMethod?.baseFee]);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setShowAddressModal(true);
    };

    const handleEditAddress = (address: DeliveryAddress) => {
        setEditingAddress(address);
        setShowAddressModal(true);
    };

    const handleSaveAddress = (address: DeliveryAddress) => {
        if (editingAddress) {
            store.updateAddress(editingAddress.id, address);
        } else {
            store.addAddress(address);
        }
        setShowAddressModal(false);
        setEditingAddress(null);
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

        try {
            await deleteAddressApi(id);
            store.removeAddress(id);
            if (store.selectedAddress?.id === id) {
                const firstAddress = store.addresses.find((addr) => addr.id !== id);
                if (firstAddress) {
                    store.setSelectedAddress(firstAddress);
                }
            }
            toast.success('Xóa địa chỉ thành công');
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Không thể xóa địa chỉ');
        }
    };

    const handleContinueToShipping = () => {
        if (!(cart?.chiTiet && cart.chiTiet.length > 0)) {
            toast.warning('Vui lòng chọn sản phẩm trước khi thanh toán');
            return;
        }

        if (store.selectedAddress) {
            store.goToNextStep();
        } else {
            toast.warning('Vui lòng chọn địa chỉ');
        }
    };

    const handleContinueToPayment = () => {
        if (store.selectedShippingMethod) {
            store.goToNextStep();
        } else {
            toast.warning('Vui lòng chọn phương thức vận chuyển');
        }
    };

    const handleContinueToConfirmation = () => {
        if (store.selectedPaymentMethod) {
            store.goToNextStep();
        } else {
            toast.warning('Vui lòng chọn phương thức thanh toán');
        }
    };

    const handleConfirmOrder = async () => {
        store.setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Order submitted:', {
                address: store.selectedAddress,
                shipping: store.selectedShippingMethod,
                payment: store.selectedPaymentMethod,
                summary: store.orderSummary,
            });

            toast.success('Đơn hàng đã được gửi thành công!');
            store.goToNextStep();
        } catch (error) {
            store.setError('Gửi đơn hàng thất bại. Vui lòng thử lại.');
        } finally {
            store.setLoading(false);
        }
    };

    const handleStepClick = (step: 1 | 2 | 3 | 4) => {
        if (step < store.currentStep) {
            store.setStep(step);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
            <BuyerHeader />

            <div className="hidden md:block bg-background-light dark:bg-background-dark sticky top-16 z-40 inset-x-0 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4].map((step, index) => (
                            <div key={step} className="flex items-center flex-1 max-w-xs">
                                <button
                                    onClick={() => handleStepClick(step as 1 | 2 | 3 | 4)}
                                    className="flex flex-col items-center relative cursor-pointer w-full group"
                                    disabled={step > store.currentStep}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10 ring-3 transition-all flex-shrink-0 ${step <= store.currentStep
                                            ? 'bg-primary text-white ring-primary/20'
                                            : 'bg-surface-light dark:bg-surface-dark border-2 border-gray-300 dark:border-gray-600 text-gray-400'
                                            }`}
                                    >
                                        {step < store.currentStep ? (
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        ) : (
                                            step
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold whitespace-nowrap mt-1 transition-colors ${step <= store.currentStep ? 'text-primary' : 'text-gray-400'
                                            }`}
                                    >
                                        {['Địa chỉ', 'Vận chuyển', 'Thanh toán', 'Xác nhận'][step - 1]}
                                    </span>
                                </button>
                                {index < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-1 rounded transition-colors ${step < store.currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT COLUMN: Checkout Steps */}
                    <div className="lg:w-2/3 space-y-6 w-full">
                        {store.error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 flex-shrink-0">error</span>
                                <p className="text-sm text-red-700 dark:text-red-300">{store.error}</p>
                            </div>
                        )}

                        {/* Step 1: Address Selection */}
                        {store.currentStep >= 1 && (
                            <>
                                <AddressStep
                                    addresses={store.addresses}
                                    selectedAddress={store.selectedAddress}
                                    onSelectAddress={(addr) => store.setSelectedAddress(addr)}
                                    onAddNew={handleAddAddress}
                                    onEdit={handleEditAddress}
                                    onDelete={handleDeleteAddress}
                                />
                                {store.currentStep === 1 && (
                                    <div className="p-6 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700 rounded-xl flex justify-end shadow-sm">
                                        <button
                                            onClick={handleContinueToShipping}
                                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                                        >
                                            Xác nhận địa chỉ và tiếp tục
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 2: Shipping Selection */}
                        {store.currentStep >= 2 && (
                            <>
                                <ShippingStep
                                    methods={store.shippingMethods}
                                    selectedMethod={store.selectedShippingMethod}
                                    onSelectMethod={(method) => store.setSelectedShippingMethod(method)}
                                />
                                {store.currentStep === 2 && (
                                    <div className="p-6 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700 rounded-xl flex justify-between shadow-sm">
                                        <button
                                            onClick={() => store.goToPreviousStep()}
                                            className="text-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">arrow_back</span>
                                            Quay lại
                                        </button>
                                        <button
                                            onClick={handleContinueToPayment}
                                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                                        >
                                            Tiếp tục đến thanh toán
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 3: Payment Selection */}
                        {store.currentStep >= 3 && (
                            <>
                                <PaymentStep
                                    methods={store.paymentMethods}
                                    selectedMethod={store.selectedPaymentMethod}
                                    onSelectMethod={(method) => store.setSelectedPaymentMethod(method)}
                                />
                                {store.currentStep === 3 && (
                                    <div className="p-6 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700 rounded-xl flex justify-between shadow-sm">
                                        <button
                                            onClick={() => store.goToPreviousStep()}
                                            className="text-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">arrow_back</span>
                                            Quay lại
                                        </button>
                                        <button
                                            onClick={handleContinueToConfirmation}
                                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                                        >
                                            Xem lại đơn hàng
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 4: Confirmation */}
                        {store.currentStep === 4 && (
                            <>
                                <ConfirmationStep
                                    address={store.selectedAddress}
                                    shippingMethod={store.selectedShippingMethod}
                                    paymentMethod={store.selectedPaymentMethod}
                                    orderSummary={store.orderSummary}
                                    onConfirm={handleConfirmOrder}
                                    loading={store.loading}
                                />
                                <div className="p-6 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700 rounded-xl flex justify-between shadow-sm">
                                    <button
                                        onClick={() => store.goToPreviousStep()}
                                        className="text-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        Quay lại
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Inactive Steps Display */}
                        {store.currentStep < 2 && (
                            <section className="opacity-60 grayscale pointer-events-none">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-lg font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs">
                                                2
                                            </span>
                                            Phương thức vận chuyển
                                        </h2>
                                    </div>
                                </div>
                            </section>
                        )}
                        {store.currentStep < 3 && (
                            <section className="opacity-60 grayscale pointer-events-none">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-lg font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs">
                                                3
                                            </span>
                                            Phương thức thanh toán
                                        </h2>
                                    </div>
                                </div>
                            </section>
                        )}
                        {store.currentStep < 4 && (
                            <section className="opacity-60 grayscale pointer-events-none">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-lg font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs">
                                                4
                                            </span>
                                            Xác nhận đơn hàng
                                        </h2>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Order Summary Panel */}
                    <div className="lg:w-1/3 sticky top-40 h-fit z-30 w-full">
                        <OrderSummaryPanel items={checkoutItems} summary={store.orderSummary} />
                    </div>
                </div>
            </main>

            {/* Address Modal */}
            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSave={handleSaveAddress}
                editingAddress={editingAddress}
            />

            <BuyerFooter />
        </div>
    );
}