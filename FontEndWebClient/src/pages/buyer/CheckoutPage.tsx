import { useState, useEffect } from 'react';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import { useCartStore } from '../../store/useCartStore';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import type { DeliveryAddress, OrderSummary, CartItem, ShippingMethod } from '../../types/checkout.types';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { AddressStep } from '../../features/checkout/components/AddressStep';
import { AddressModal } from '../../features/checkout/components/AddressModal';
import { ShippingStep } from '../../features/checkout/components/ShippingStep';
import { PaymentStep } from '../../features/checkout/components/PaymentStep';
import { ConfirmationStep } from '../../features/checkout/components/ConfirmationStep';
import { OrderSummaryPanel } from '../../features/checkout/components/OrderSummaryPanel';
import { getUserAddresses, deleteAddress as deleteAddressApi } from '../../features/checkout/api/address.api';
import { getAvailableShippingMethods, getShippingFeeForDestination } from '../../features/checkout/api/shipping.api';
import { getSoDu, taoDonHang } from '../../features/checkout/api/order.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function CheckoutPage() {
    useSetPageTitle('Thanh toán');

    const store = useCheckoutStore();
    const { cart, fetchCart } = useCartStore();

    const checkoutItems = store.cartItems;

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);
    const [loadingShippingMethods, setLoadingShippingMethods] = useState(false);
    const [loadingShippingFee, setLoadingShippingFee] = useState(false);
    const [soDuVi, setSoDuVi] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const addresses = await getUserAddresses();
                const deliveryAddresses: DeliveryAddress[] = addresses.map(addr => {
                    let city = '', district = '', ward = '';
                    let provinceId: number | undefined;
                    let districtCode: number | undefined;
                    let wardCode: string | undefined;

                    try {
                        const diaChiObj = JSON.parse(addr.diaChi);

                        provinceId = diaChiObj.provinceId ?? diaChiObj.ProvinceID ?? diaChiObj.provinceID ?? undefined;
                        city = diaChiObj.provinceName ?? diaChiObj.ProvinceName ?? diaChiObj.name ?? '';
                        district = diaChiObj.districtName ?? diaChiObj.DistrictName ?? diaChiObj.district ?? '';
                        districtCode = diaChiObj.districtId ?? diaChiObj.DistrictID ?? diaChiObj.districtCode ?? undefined;
                        ward = diaChiObj.wardName ?? diaChiObj.WardName ?? diaChiObj.ward ?? '';
                        wardCode = String(diaChiObj.wardCode ?? diaChiObj.WardCode ?? diaChiObj.wardCode ?? '');
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
                        provinceId,
                        districtCode,
                        wardCode,
                        detailedAddress: addr.diaChiChiTiet,
                        label: 'home',
                        isDefault: addr.isDefault
                    };
                });
                store.setAddresses(deliveryAddresses);

                // Tự động chọn địa chỉ mặc định nếu người dùng chưa chọn địa chỉ nào
                const defaultAddress = deliveryAddresses.find(addr => addr.isDefault);
                if (defaultAddress && !useCheckoutStore.getState().selectedAddress) {
                    useCheckoutStore.getState().setSelectedAddress(defaultAddress);
                }
            } catch (error) {
                console.error('Error loading addresses:', error);
                toast.error('Không thể tải danh sách địa chỉ');
            }
        };

        loadAddresses();
    }, []);

    useEffect(() => {
        const loadShippingMethods = async () => {
            const selectedAddress = store.selectedAddress;
            if (!selectedAddress?.districtCode || !selectedAddress?.wardCode) {
                return;
            }

            setLoadingShippingMethods(true);
            try {
                const methods = await getAvailableShippingMethods(selectedAddress.districtCode, store.cartItems);

                const updatedMethods = await Promise.all(
                    methods.map(async (method) => {
                        if (!method.serviceId) {
                            return method;
                        }

                        try {
                            const fee = await getShippingFeeForDestination(
                                selectedAddress.districtCode!,
                                selectedAddress.wardCode!,
                                store.cartItems,
                                method.serviceId
                            );
                            return { ...method, baseFee: fee };
                        } catch (error) {
                            console.error('Error calculating shipping fee for method', method.id, error);
                            return method;
                        }
                    })
                );

                store.setShippingMethods(updatedMethods);

                if (selectedAddress && !updatedMethods.find((method) => method.id === store.selectedShippingMethod?.id)) {
                    store.setSelectedShippingMethod(null);
                } else if (store.selectedShippingMethod) {
                    const updatedSelected = updatedMethods.find((method) => method.id === store.selectedShippingMethod?.id);
                    if (updatedSelected) {
                        store.setSelectedShippingMethod(updatedSelected);
                    }
                }
            } catch (error) {
                console.error('Error loading shipping methods:', error);
                toast.error('Không thể tải phương thức vận chuyển từ backend');
            } finally {
                setLoadingShippingMethods(false);
            }
        };

        loadShippingMethods();
    }, [store.selectedAddress?.districtCode, store.selectedAddress?.wardCode, store.cartItems]);

    const handleSelectShippingMethod = async (method: ShippingMethod) => {
        if (!store.selectedAddress?.districtCode || !store.selectedAddress?.wardCode) {
            toast.warning('Vui lòng chọn địa chỉ đầy đủ để tính phí vận chuyển');
            return;
        }

        setLoadingShippingFee(true);
        try {
            const fee = await getShippingFeeForDestination(
                store.selectedAddress.districtCode,
                store.selectedAddress.wardCode,
                store.cartItems,
                method.serviceId
            );

            store.setSelectedShippingMethod({
                ...method,
                baseFee: fee,
            });
        } catch (error) {
            console.error('Error calculating shipping fee:', error);
            toast.error('Không thể tính phí vận chuyển. Vui lòng thử lại.');
            store.setSelectedShippingMethod(method);
        } finally {
            setLoadingShippingFee(false);
        }
    };

    useEffect(() => {
        const subtotal = store.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

    const handleRequestDeleteAddress = (id: string) => {
        setAddressToDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDeleteAddress = async () => {
        if (!addressToDeleteId) return;

        try {
            await deleteAddressApi(addressToDeleteId);
            store.removeAddress(addressToDeleteId);
            if (store.selectedAddress?.id === addressToDeleteId) {
                const firstAddress = store.addresses.find((addr) => addr.id !== addressToDeleteId);
                if (firstAddress) {
                    store.setSelectedAddress(firstAddress);
                }
            }
            toast.success('Xóa địa chỉ thành công');
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Không thể xóa địa chỉ');
        } finally {
            setShowDeleteConfirm(false);
            setAddressToDeleteId(null);
        }
    };

    const handleContinueToShipping = () => {
        if (!checkoutItems || checkoutItems.length === 0) {
            toast.warning('Vui lòng chọn sản phẩm trước khi thanh toán');
            return;
        }

        if (!store.selectedAddress) {
            toast.warning('Vui lòng chọn địa chỉ');
            return;
        }

        if (loadingShippingMethods) {
            toast.warning('Vui lòng đợi phương thức vận chuyển được tải');
            return;
        }

        if (!store.shippingMethods.length) {
            toast.warning('Không tìm thấy phương thức vận chuyển phù hợp với địa chỉ đã chọn');
            return;
        }

        store.goToNextStep();
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
        if (!store.selectedPaymentMethod) {
            toast.error('Vui lòng chọn phương thức thanh toán!');
            return;
        }
        if (!store.selectedAddress) {
            toast.error('Vui lòng chọn địa chỉ giao hàng!');
            return;
        }
        if (!store.selectedShippingMethod) {
            toast.error('Vui lòng chọn phương thức vận chuyển!');
            return;
        }
        if (!checkoutItems || checkoutItems.length === 0) {
            toast.error('Giỏ hàng trống, không thể đặt hàng!');
            return;
        }

        const paymentId = store.selectedPaymentMethod.id;

        // ── COD & MoMo: cùng một luồng đặt hàng ───────────────────────────────
        if (paymentId === 'COD' || paymentId === 'MOMO') {
            store.setLoading(true);
            store.setError(null);

            try {
                const addr = store.selectedAddress;
                const shipping = store.selectedShippingMethod;

                // Nhóm các item theo sellerId (mỗi seller = 1 đơn hàng riêng)

                // Lọc bỏ item không có sellerId (không nên xảy ra nhưng để TS an toàn)
                const validItems = checkoutItems.filter((i): i is typeof i & { sellerId: string } =>
                    typeof i.sellerId === 'string' && i.sellerId.length > 0
                );
                const grouped = validItems.reduce<Record<string, typeof validItems>>((acc, item) => {
                    if (!acc[item.sellerId]) acc[item.sellerId] = [];
                    acc[item.sellerId].push(item);
                    return acc;
                }, {});

                debugger;

                const orderPromises = Object.entries(grouped).map(([sellerId, items]) =>
                    taoDonHang({
                        diaChiGiaoHangId: addr.id,
                        diaChiGiaoHang: JSON.stringify({
                            provinceId: addr.provinceId,
                            provinceName: addr.city,
                            districtId: addr.districtCode,
                            districtName: addr.district,
                            wardCode: addr.wardCode,
                            wardName: addr.ward,
                            diaChiChiTiet: addr.detailedAddress,
                        }),
                        tenNguoiNhan: addr.fullName,
                        soDienThoai: addr.phone,
                        nguoiBanId: sellerId,
                        phiVanChuyen: shipping.baseFee ?? 0,
                        ghnServiceId: shipping.serviceId ?? undefined,
                        ghiChu: undefined,
                        phuongThucThanhToan: paymentId === 'MOMO' ? 'MoMo' : 'COD',
                        items: items.map(i => ({
                            sanPhamDangId: i.productId,
                            soLuong: i.quantity,
                            donGia: i.price,
                        })),
                    })
                );

                const results = await Promise.all(orderPromises);

                // ── MoMo: hiển thị QR modal ──────────────────────────────────────
                if (paymentId === 'MOMO') {
                    const momoResult = results[0]; // 1 đơn/1 seller
                    if (momoResult.momoQrCodeUrl && momoResult.momoPayUrl) {
                        // Refresh giỏ hàng (items đã bị xoá phía backend)
                        await fetchCart();
                        window.location.href = momoResult.momoPayUrl;
                        return;
                    } else {
                        throw new Error('Không nhận được thông tin thanh toán MoMo từ server.');
                    }
                }

                // ── COD: thành công ───────────────────────────────────────────────
                toast.success(
                    results.length === 1
                        ? `Đặt hàng thành công! Mã đơn: ${results[0].donHangId.slice(0, 8).toUpperCase()}`
                        : `Đã tạo ${results.length} đơn hàng thành công!`
                );

                // Reset store rồi chuyển trang
                store.goToNextStep();

                // chuyển đến trang đơn hàng của người dùng
                navigate('/orders');
                // Refresh giỏ hàng (items đã bị xoá phía backend)
                await fetchCart();

            } catch (error: unknown) {
                console.error('Lỗi khi đặt hàng:', error);
                const msg = error instanceof Error ? error.message : 'Gửi đơn hàng thất bại. Vui lòng thử lại.';
                store.setError(msg);
                toast.error(msg);
            } finally {
                store.setLoading(false);
            }
        }
    };

    const handleStepClick = (step: 1 | 2 | 3 | 4) => {
        if (step < store.currentStep) {
            store.setStep(step);
        }
    };

    const deletingAddress = addressToDeleteId
        ? store.addresses.find((addr) => addr.id === addressToDeleteId)
        : null;

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
                                    onDelete={handleRequestDeleteAddress}
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

                        {store.currentStep >= 2 && (
                            <>
                                <ShippingStep
                                    methods={store.shippingMethods}
                                    selectedMethod={store.selectedShippingMethod}
                                    onSelectMethod={handleSelectShippingMethod}
                                    loading={loadingShippingMethods || loadingShippingFee}
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

                        {store.currentStep >= 3 && (
                            <>
                                <PaymentStep
                                    methods={store.paymentMethods}
                                    selectedMethod={store.selectedPaymentMethod}
                                    soDuVi={soDuVi}
                                    onSelectMethod={async (method) => {
                                        store.setSelectedPaymentMethod(method);
                                        if (method.id === 'MOMO') {
                                            try {
                                                const balance = await getSoDu();
                                                setSoDuVi(balance);
                                            } catch {
                                                setSoDuVi(null);
                                            }
                                        } else {
                                            setSoDuVi(null);
                                        }
                                    }}
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

                    <div className="lg:w-1/3 sticky top-40 h-fit z-30 w-full">
                        <OrderSummaryPanel items={checkoutItems} summary={store.orderSummary} />
                    </div>
                </div>
            </main>

            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSave={handleSaveAddress}
                editingAddress={editingAddress}
            />

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a261c] w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                            <h2 className="text-lg font-bold text-[#131613] dark:text-white uppercase tracking-wide">
                                Xác nhận xóa địa chỉ
                            </h2>
                            <button onClick={() => {
                                setShowDeleteConfirm(false);
                                setAddressToDeleteId(null);
                            }} className="text-[#6b806c] hover:text-red-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-3xl">
                                    warning
                                </span>
                                <div>
                                    <p className="text-sm text-[#131613] dark:text-white font-medium">
                                        Bạn có chắc chắn muốn xóa địa chỉ này?
                                    </p>
                                    <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                                        Hành động này không thể hoàn tác.
                                    </p>
                                </div>
                            </div>
                            {deletingAddress && (
                                <div className="mt-4 p-3 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] border border-[#dee3de] dark:border-gray-700">
                                    <p className="text-sm font-bold text-[#131613] dark:text-white">
                                        {deletingAddress.fullName}
                                    </p>
                                    <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                                        {deletingAddress.phone}
                                    </p>
                                    <p className="text-xs text-[#6b806c] dark:text-gray-400 mt-1">
                                        {deletingAddress.detailedAddress}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-[#dee3de] dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setAddressToDeleteId(null);
                                }}
                                className="px-5 py-2 rounded-lg text-sm font-bold text-[#6b806c] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDeleteAddress}
                                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
                            >
                                XÁC NHẬN XÓA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BuyerFooter />
        </div>
    );
}