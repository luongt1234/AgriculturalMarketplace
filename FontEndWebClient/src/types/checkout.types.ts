export interface DeliveryAddress {
    id: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    detailedAddress: string;
    label?: 'home' | 'office' | string;
    isDefault?: boolean;
    createdAt?: string;
}

export interface DiaChiNguoiDungDto {
    id: string;
    diaChi: string;
    tenNguoiNhanHang: string;
    loaiDiaChiId?: string | null;
    loaiDiaChi?: any; // DanhMuc
    isDefault: boolean;
    soDienThoai: string;
    diaChiChiTiet: string;
    nguoiDungId: string;
    nguoiDung?: any; // NguoiDung
}

export interface DiaChiNguoiDungFormDto {
    diaChi: string;
    tenNguoiNhanHang: string;
    loaiDiaChiId?: string | null;
    isDefault: boolean;
    soDienThoai: string;
    diaChiChiTiet: string;
    nguoiDungId: string;
}

export interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    estimatedDays: string;
    baseFee: number;
    icon?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon?: string;
    available: boolean;
}

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
}

export interface OrderSummary {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    tax?: number;
    total: number;
}

export interface CheckoutState {
    currentStep: 1 | 2 | 3 | 4;
    selectedAddress: DeliveryAddress | null;
    selectedShippingMethod: ShippingMethod | null;
    selectedPaymentMethod: PaymentMethod | null;
    addresses: DeliveryAddress[];
    shippingMethods: ShippingMethod[];
    paymentMethods: PaymentMethod[];
    cartItems: CartItem[];
    orderSummary: OrderSummary | null;
    loading: boolean;
    error: string | null;

    // Actions
    setStep: (step: 1 | 2 | 3 | 4) => void;
    setSelectedAddress: (address: DeliveryAddress | null) => void;
    setSelectedShippingMethod: (method: ShippingMethod | null) => void;
    setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
    addAddress: (address: DeliveryAddress) => void;
    removeAddress: (id: string) => void;
    updateAddress: (id: string, address: Partial<DeliveryAddress>) => void;
    setAddresses: (addresses: DeliveryAddress[]) => void;
    setShippingMethods: (methods: ShippingMethod[]) => void;
    setPaymentMethods: (methods: PaymentMethod[]) => void;
    setCartItems: (items: CartItem[]) => void;
    setOrderSummary: (summary: OrderSummary) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    reset: () => void;
}
