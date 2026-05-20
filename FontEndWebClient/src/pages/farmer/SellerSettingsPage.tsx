import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getMyShop, updateMyShop } from '../../features/sellerStorefront/api/storefront.api';
import { uploadImage } from '../../features/upload/api/upload.api';
import type { StoreSettings } from '../../features/sellerStorefront/api/storefront.api';
import { getImageUrl } from '../../utils/imageUrl';

const PLACEHOLDER_BANNER = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80';
const PLACEHOLDER_AVATAR = 'https://ui-avatars.com/api/?background=2f7f34&color=fff&size=128&name=Shop';
const DEFAULT_AVATAR = '/assets/images/default-avatar.png'; // Hoặc tuỳ ý

const SellerSettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<StoreSettings>({
        hoTen: '',
        anhDaiDienUrl: '',
        anhBiaUrl: '',
        moTaCuaHang: '',
        diaChi: '',
        soDienThoai: ''
    });

    const fileAvatarRef = useRef<HTMLInputElement>(null);
    const fileBannerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                const data = await getMyShop();
                setFormData(data);
            } catch (error) {
                toast.error('Không thể tải cấu hình cửa hàng');
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateMyShop(formData);
            toast.success('Lưu cấu hình cửa hàng thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lưu cấu hình.');
        } finally {
            setSaving(false);
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const toastId = toast.loading('Đang tải ảnh đại diện lên...');
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, anhDaiDienUrl: getImageUrl(url) }));
            toast.success('Tải ảnh đại diện thành công!', { id: toastId });
        } catch (error) {
            toast.error('Lỗi khi tải ảnh. Vui lòng thử lại.');
        }
    };

    const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const toastId = toast.loading('Đang tải ảnh bìa lên...');
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, anhBiaUrl: getImageUrl(url) }));
            toast.success('Tải ảnh bìa thành công!', { id: toastId });
        } catch (error) {
            toast.error('Lỗi khi tải ảnh bìa. Vui lòng thử lại.');
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
            <header className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cấu hình Cửa Hàng</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Thiết lập thông tin và giao diện hiển thị cho người mua</p>
            </header>

            {loading ? (
                <div className="animate-pulse flex flex-col gap-6">
                    <div className="h-64 bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700" />
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Banners & Avatars */}
                    <div className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm overflow-hidden">
                        
                        {/* Cover Picture */}
                        <div className="relative h-48 md:h-64 bg-gray-100 group">
                            <img 
                                src={getImageUrl(formData.anhBiaUrl) || PLACEHOLDER_BANNER} 
                                alt="Cover" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => fileBannerRef.current?.click()}
                                    className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:bg-white transition"
                                >
                                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                    <span>Đổi ảnh bìa</span>
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileBannerRef} 
                                    onChange={handleUploadBanner} 
                                    className="hidden" 
                                    accept="image/*" 
                                />
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="px-6 pb-6 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16">
                            <div className="relative group shrink-0">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#1a261c] bg-white shadow-md overflow-hidden">
                                    <img 
                                        src={getImageUrl(formData.anhDaiDienUrl) || PLACEHOLDER_AVATAR} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileAvatarRef.current?.click()}
                                    className="absolute bottom-2 right-2 w-8 h-8 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-200"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-gray-700">edit</span>
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileAvatarRef} 
                                    onChange={handleUploadAvatar} 
                                    className="hidden" 
                                    accept="image/*" 
                                />
                            </div>
                            <div className="flex-1 space-y-1 text-center md:text-left mb-2 md:mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formData.hoTen || 'Tên Cửa Hàng'}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Store Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tên Cửa Hàng</label>
                                <input 
                                    type="text" 
                                    name="hoTen"
                                    value={formData.hoTen}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#131613] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ví dụ: Nông Trại Xanh"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Số Điện Thoại</label>
                                <input 
                                    type="text" 
                                    name="soDienThoai"
                                    value={formData.soDienThoai || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#131613] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="09xx..."
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Địa chỉ Cửa hàng</label>
                                <input 
                                    type="text" 
                                    name="diaChi"
                                    value={formData.diaChi || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#131613] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Địa chỉ vùng trồng/shop"
                                />
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Giới thiệu (Bio)</label>
                                <textarea 
                                    name="moTaCuaHang"
                                    value={formData.moTaCuaHang || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#131613] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    placeholder="Cam kết nông nghiệp sạch, 100% hữu cơ..."
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-60"
                            >
                                {saving ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                )}
                                Lưu Thay Đổi
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SellerSettingsPage;
