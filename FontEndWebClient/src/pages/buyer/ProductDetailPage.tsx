import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../lip/axiosInstance';
import { useCartStore } from '../../store/useCartStore';
import { useCheckoutStore } from '../../store/useCheckoutStore';
import { toast } from 'sonner';
import { BuyerHeader } from '../../components/layout/BuyerHeader';
import { BuyerFooter } from '../../components/layout/BuyerFooter';
import { FloatingChat } from '../../features/chat/components/FloatingChat';
import { AIChatbot } from '../../features/chatbot/components/AIChatbot';

interface ProductDetailApiData {
    id: string;
    tenHienThi: string;
    gia: number;
    soLuong: number;
    trangThai: string;
    hinhAnhUrl: string | null;
    moTaChiTiet: string;
    ngayDang: string;
    sanPhamChungId: string;
    nguoiBanId: string;
    chatLuongId: string;
    tenSanPhamChung: string;
    tenNguoiBan: string;
    anhDaiDienNguoiBan: string | null;
    tenChatLuong: string;
    donViId: string;
    tenDonVi: string;
    loaiId: string;
    tenLoai: string;
    anhSanPham: string | null;
    displayScore: number;
    isFeatured: boolean;
    diaChi?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: any | null;
}

interface ProductDetail {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    unit: string;
    location: string;
    seller: string;
    sellerAvatar: string;
    image: string;
    description: string;
    harvestDate: string;
    stock: string;
    availableQuantity: number;
    certifications: string[];
    rating: number;
    reviews: number;
    sold: string;
    sellerDistrictCode?: number;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCartStore();
    const checkoutStore = useCheckoutStore();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Thông tin người bán cho FloatingChat
    const [sellerInfo, setSellerInfo] = useState<{ id: string; name: string; avatar?: string } | null>(null);

    // Sử dụng number | string để cho phép người dùng xóa trắng input khi gõ
    const [quantity, setQuantity] = useState<number | string>(1);
    const [isFavorite, setIsFavorite] = useState(false);

    // ==========================================
    // CÁC HÀM XỬ LÝ SỐ LƯỢNG MỚI
    // ==========================================
    const incrementQuantity = () => {
        if (!product) return;
        const currentQty = typeof quantity === 'number' ? quantity : parseInt(quantity || '1', 10);
        if (currentQty < product.availableQuantity) {
            setQuantity(currentQty + 1);
        } else {
            toast.error(`Sản phẩm này chỉ còn tối đa ${product.availableQuantity} ${product.unit}`);
        }
    };

    const decrementQuantity = () => {
        const currentQty = typeof quantity === 'number' ? quantity : parseInt(quantity || '1', 10);
        if (currentQty > 1) {
            setQuantity(currentQty - 1);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!product) return;
        const val = e.target.value;

        // Chỉ cho phép nhập số
        if (/^\d*$/.test(val)) {
            if (val === '') {
                setQuantity(''); // Cho phép trống tạm thời để dễ gõ phím
                return;
            }

            const num = parseInt(val, 10);
            if (num > product.availableQuantity) {
                setQuantity(product.availableQuantity);
                toast.error(`Sản phẩm này chỉ còn tối đa ${product.availableQuantity} ${product.unit}`);
            } else if (num === 0) {
                setQuantity(1); // Không cho nhập số 0
            } else {
                setQuantity(num);
            }
        }
    };

    const handleQuantityBlur = () => {
        if (quantity === '' || Number(quantity) < 1) {
            setQuantity(1);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        const finalQuantity = typeof quantity === 'number' ? quantity : parseInt(quantity || '1', 10);

        const existingItemIndex = checkoutStore.cartItems.findIndex((item) => item.productId === product.id);
        const newItem = {
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: finalQuantity,
            image: product.image,
            unit: product.unit,
            sellerId: sellerInfo?.id || '',
            sellerName: product.seller,
            originDistrictCode: product.sellerDistrictCode,
        };

        const newTotalQty = existingItemIndex >= 0
            ? checkoutStore.cartItems[existingItemIndex].quantity + finalQuantity
            : finalQuantity;

        if (newTotalQty > product.availableQuantity) {
            toast.error(`Không thể thêm. Bạn đã có tổng cộng ${product.availableQuantity} ${product.unit} trong giỏ.`);
            return;
        }

        try {
            await addToCart({ sanPhamDangId: product.id, soLuong: finalQuantity });

            if (existingItemIndex >= 0) {
                const updatedItems = [...checkoutStore.cartItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: newTotalQty,
                };
                checkoutStore.setCartItems(updatedItems);
            } else {
                checkoutStore.setCartItems([...checkoutStore.cartItems, newItem]);
            }

            toast.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (error) {
            toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;

        const finalQuantity = typeof quantity === 'number' ? quantity : parseInt(quantity || '1', 10);
        const item = {
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: finalQuantity,
            image: product.image,
            unit: product.unit,
            sellerId: sellerInfo?.id || '',
            sellerName: product.seller,
            originDistrictCode: product.sellerDistrictCode,
        };

        try {
            await addToCart({ sanPhamDangId: product.id, soLuong: finalQuantity });
            checkoutStore.setCartItems([item]);
            checkoutStore.setOrderSummary({
                items: [item],
                subtotal: product.price * finalQuantity,
                shippingFee: checkoutStore.selectedShippingMethod?.baseFee || 0,
                total: product.price * finalQuantity + (checkoutStore.selectedShippingMethod?.baseFee || 0),
            });
            checkoutStore.setSelectedShippingMethod(null);
            checkoutStore.setSelectedPaymentMethod(null);
            checkoutStore.setStep(1);
            navigate('/checkout');
        } catch (error) {
            toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Không có ID sản phẩm.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/SanPhamDang/detail/${id}`) as unknown as ApiResponse<ProductDetailApiData>;
                const item = response.data;
                const imageUrl = item.hinhAnhUrl
                    ? item.hinhAnhUrl.startsWith('http')
                        ? item.hinhAnhUrl
                        : `${axiosInstance.defaults.baseURL}${item.hinhAnhUrl}`
                    : '';

                let sellerDistrictCode: number | undefined;
                if (item.diaChi) {
                    try {
                        const diaChiObj = JSON.parse(item.diaChi);
                        if (diaChiObj.districts && diaChiObj.districts.length > 0) {
                            sellerDistrictCode = diaChiObj.districts[0].district_code ?? diaChiObj.districts[0].code;
                        }
                    } catch (err) {
                        console.error('Error parsing seller address for product:', err);
                    }
                }

                setProduct({
                    id: item.id,
                    name: item.tenHienThi,
                    category: item.tenLoai || item.tenSanPhamChung || 'Nông sản',
                    price: item.gia,
                    originalPrice: undefined,
                    discount: undefined,
                    unit: item.tenDonVi || 'kg',
                    location: item.tenLoai || 'Việt Nam',
                    seller: item.tenNguoiBan,
                    sellerAvatar: item.anhDaiDienNguoiBan
                        ? item.anhDaiDienNguoiBan.startsWith('http')
                            ? item.anhDaiDienNguoiBan
                            : `${axiosInstance.defaults.baseURL}${item.anhDaiDienNguoiBan}`
                        : 'https://via.placeholder.com/150?text=Seller',
                    image: imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
                    description: item.moTaChiTiet,
                    harvestDate: new Date(item.ngayDang).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short' }),
                    stock: item.trangThai === 'ConHang' ? 'Available' : 'Out of stock',
                    availableQuantity: item.soLuong, // Lấy số lượng từ API
                    certifications: [item.tenChatLuong, item.tenSanPhamChung].filter(Boolean),
                    rating: 4.8,
                    reviews: 128,
                    sold: item.soLuong ? `${item.soLuong}+` : 'N/A',
                    sellerDistrictCode,
                });
                setSellerInfo({
                    id: item.nguoiBanId,
                    name: item.tenNguoiBan,
                    avatar: item.anhDaiDienNguoiBan
                        ? item.anhDaiDienNguoiBan.startsWith('http')
                            ? item.anhDaiDienNguoiBan
                            : `${axiosInstance.defaults.baseURL}${item.anhDaiDienNguoiBan}`
                        : undefined,
                });
            } catch (fetchError) {
                console.error(fetchError);
                setError('Lỗi khi tải chi tiết sản phẩm. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen">
                <BuyerHeader showNavigation={true} />
                <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
                    <div className="text-center text-gray-600 dark:text-gray-300">Đang tải chi tiết sản phẩm...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen">
                <BuyerHeader showNavigation={true} />
                <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
                    <div className="text-center text-red-600 dark:text-red-400">
                        {error ?? 'Không tìm thấy sản phẩm.'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
            {/* Header */}
            <BuyerHeader
                showNavigation={true}
            />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <a className="inline-flex items-center hover:text-primary dark:hover:text-white transition-colors" href="/">
                                <span className="material-symbols-outlined text-[18px] mr-2">home</span>
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                                <a className="ml-1 md:ml-2 hover:text-primary dark:hover:text-white transition-colors" href="/">{product.category}</a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                                <span className="ml-1 md:ml-2 font-medium text-gray-900 dark:text-white">{product.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
                    {/* Product Images */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[4/3] bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm relative group">
                            <img alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" src={product.image} />
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <div className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-md bg-opacity-95">
                                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                    Authentic
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            <button className="aspect-square rounded-xl border-2 border-primary overflow-hidden relative">
                                <img alt="Thumbnail 1" className="w-full h-full object-cover" src={product.image} />
                            </button>
                            <button className="aspect-square rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center text-gray-400 hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">rice_bowl</span>
                            </button>
                            <button className="aspect-square rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center text-gray-400 hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">nutrition</span>
                            </button>
                            <button className="aspect-square rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center text-gray-400 hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">local_shipping</span>
                            </button>
                            <button className="aspect-square rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center text-gray-400 hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">play_circle</span>
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {product.certifications.map((cert, index) => (
                                    <span key={index} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${index === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'}`}>
                                        <span className="material-symbols-outlined text-[14px] fill-1">{index === 0 ? 'verified' : 'stars'}</span>
                                        {cert}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-amber-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={`material-symbols-outlined ${star <= Math.floor(product.rating) ? 'fill-1' : star === Math.ceil(product.rating) && product.rating % 1 !== 0 ? 'fill-0.5' : ''} text-[20px]`}>star</span>
                                    ))}
                                    <span className="ml-2 text-sm font-bold text-gray-900 dark:text-white">{product.rating}</span>
                                </div>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <a className="text-sm text-primary font-medium hover:underline" href="#reviews">{product.reviews} Reviews</a>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Sold {product.sold}</span>
                            </div>
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-4xl font-black text-primary">{product.price.toLocaleString('vi-VN')}₫</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through mb-1">{product.originalPrice.toLocaleString('vi-VN')}₫</span>
                                    )}
                                    {product.discount && (
                                        <span className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md mb-2">-{product.discount}%</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Unit: {product.unit}</p>
                                <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-primary/20 hover:border-primary text-primary font-bold rounded-lg transition-all duration-200 hover:bg-primary/5 group">
                                    <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">compare_arrows</span>
                                    Compare Market Price
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img className="w-full h-full object-cover" src={product.sellerAvatar} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-0.5">Direct from Farmer</p>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                        {product.seller}
                                        <span className="material-symbols-outlined text-[14px] text-blue-500" title="Verified Producer">verified</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.location}</p>
                                </div>
                                <button
                                    onClick={() => sellerInfo?.id && navigate(`/shop/${sellerInfo.id}`)}
                                    className="text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    View Profile
                                </button>
                            </div>
                            <div className="mb-8 space-y-3">
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">spa</span>
                                    <p>{product.description}</p>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">calendar_month</span>
                                    <p>Harvested: <span className="font-bold text-gray-800 dark:text-white">{product.harvestDate}</span> (New Season)</p>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">inventory_2</span>
                                    {/* FIX: Thêm hiển thị cụ thể số lượng còn lại cho rõ ràng */}
                                    <p>Stock: <span className="text-green-600 font-bold">{product.availableQuantity} {product.unit}</span> ({product.stock})</p>
                                </div>
                            </div>
                            <div className="mt-auto flex flex-col gap-4">
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg h-12 w-full sm:w-auto sm:min-w-[120px]">
                                    <button onClick={decrementQuantity} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">remove</span>
                                    </button>

                                    {/* FIX: Thay readOnly bằng onChange và onBlur */}
                                    <input
                                        className="w-full text-center border-none bg-transparent h-full focus:ring-0 font-bold text-gray-900 dark:text-white p-0"
                                        type="text"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onBlur={handleQuantityBlur}
                                    />

                                    <button onClick={incrementQuantity} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-lg shadow-lg hover:shadow-green-900/20 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                        Thêm vào giỏ
                                    </button>
                                    <button onClick={handleBuyNow} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-lg shadow-lg hover:shadow-green-900/20 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                    <nav aria-label="Tabs" className="flex space-x-8">
                        <a aria-current="page" className="border-b-2 border-primary py-4 px-1 text-sm font-bold text-primary" href="#reviews">Reviews ({product.reviews})</a>
                        <a className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300" href="#">Product Details</a>
                        <a className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300" href="#">Shipping Policy</a>
                    </nav>
                </div>
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-10" id="reviews">
                    <div className="lg:col-span-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-5xl font-black text-gray-900 dark:text-white">{product.rating}</div>
                                <div className="flex flex-col">
                                    <div className="flex text-amber-400 text-sm">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className={`material-symbols-outlined ${star <= Math.floor(product.rating) ? 'fill-1' : star === Math.ceil(product.rating) && product.rating % 1 !== 0 ? 'fill-0.5' : ''}`}>star</span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Based on {product.reviews} reviews</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {[85, 10, 3, 1, 1].map((percentage, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                        <span className="w-8 text-gray-500">{6 - index} star</span>
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="w-8 text-right text-gray-400">{percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <button className="px-4 py-2 rounded-full border border-primary bg-primary/10 text-primary font-bold text-sm transition-colors">
                                All
                            </button>
                            <button className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                                With Photos (24)
                            </button>
                            <button className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                                5 <span className="material-symbols-outlined text-[14px]">star</span> (108)
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">LM</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Le Minh</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <div className="flex text-amber-400">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span key={star} className="material-symbols-outlined fill-1 text-[14px]">star</span>
                                                    ))}
                                                </div>
                                                <span>• 2 days ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                    Rice is extremely fragrant and soft. Packaging was very secure. Will definitely buy again from this farm!
                                </p>
                                <div className="flex gap-2">
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer">
                                        <img className="w-full h-full object-cover opacity-80 hover:opacity-100" src={product.image} />
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">TH</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Tran Hieu</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <div className="flex text-amber-400">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span key={star} className="material-symbols-outlined fill-1 text-[14px]">star</span>
                                                    ))}
                                                </div>
                                                <span>• 1 week ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                    Best rice I've had in a while. It's truly worthy of the "World's Best Rice" title. Delivery was a bit slow, but the product quality makes up for it.
                                </p>
                            </div>
                        </div>
                        <button className="mt-4 text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                            Show more reviews <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                    </div>
                </section>
            </main>

            <AIChatbot />
            <FloatingChat
                targetSellerId={sellerInfo?.id}
                targetSellerName={sellerInfo?.name}
                targetSellerAvatar={sellerInfo?.avatar}
            />

            <BuyerFooter />
        </div>
    );
};

export default ProductDetailPage;