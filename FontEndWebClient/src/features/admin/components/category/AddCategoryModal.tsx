import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../../lip/axiosInstance';
import type { DanhMuc, LoaiDanhMuc } from '../../../../types/danhMuc.type';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'LOAI_DANH_MUC' | 'DANH_MUC';
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    type
}) => {
    const [loading, setLoading] = useState(false);
    const [loaiDanhMucList, setLoaiDanhMucList] = useState<LoaiDanhMuc[]>([]);
    const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconSearch, setIconSearch] = useState('');

    // Danh sách icon phong phú hơn, phân nhóm để dễ quản lý trong code
    // Danh sách icon phong phú hơn, ĐÃ FIX LỖI FONT
    const commonIcons = [
        // Nông nghiệp, Cây trồng & Tự nhiên
        'agriculture', 'eco', 'grass', 'forest', 'yard', 'nature',
        'sunny', 'water_drop', 'pest_control', 'compost', 'local_florist', 'park',

        // Thực phẩm & Đồ uống
        'restaurant', 'bakery_dining', 'local_cafe', 'coffee', 'cake', 'icecream', 'ramen_dining',
        'local_pizza', 'rice_bowl', 'dinner_dining', 'food_bank', 'emoji_food_beverage',
        'set_meal', 'egg', 'kebab_dining', 'liquor', 'local_bar', 'fastfood',

        // Mua sắm & Thương mại
        'shopping_cart', 'storefront', 'local_grocery_store', 'sell', 'price_check', 'inventory_2',
        'inventory', 'local_offer', 'category', 'shopping_bag', 'payments', 'point_of_sale',
        'receipt_long', 'loyalty', 'shopping_basket',

        // Vận chuyển & Logistics
        'delivery_dining', 'local_shipping', 'package_2', 'route', 'airport_shuttle', 'warehouse',

        // Giao diện chung & Tiện ích
        'star', 'settings', 'verified', 'shield_moon', 'health_and_safety', 'info', 'check_circle',
        'favorite', 'home', 'search', 'person', 'notifications', 'spa', 'thumb_up'
    ];

    const filteredIcons = commonIcons.filter(icon => icon.includes(iconSearch.trim().toLowerCase()));

    // Form data cho LOAI_DANH_MUC
    const [formDataLoai, setFormDataLoai] = useState({
        maLoaiDanhMuc: '',
        tenLoaiDanhMuc: ''
    });

    // Form data cho DANH_MUC
    const [formDataDanhMuc, setFormDataDanhMuc] = useState({
        loaiDanhMucId: '',
        maGiaTri: '',
        tenHienThi: '',
        thuTu: 1,
        danhMucCapTrenId: '',
        icon: ''
    });

    // Fetch dữ liệu cần thiết khi mở modal
    useEffect(() => {
        if (isOpen && type === 'DANH_MUC') {
            fetchLoaiDanhMucAndDanhMuc();
        }
    }, [isOpen, type]);

    const fetchLoaiDanhMucAndDanhMuc = async () => {
        try {
            const resLoai = await axiosInstance.get('/api/LoaiDanhMuc');
            if (resLoai) setLoaiDanhMucList(resLoai.data || []);

            const resDanhMuc = await axiosInstance.get('/api/DanhMuc');
            if (resDanhMuc) setDanhMucList(resDanhMuc.data || []);
        } catch (err: any) {
            console.error('Lỗi khi fetch dữ liệu:', err);
        }
    };

    const handleChangeLoai = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataLoai(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeDanhMuc = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'thuTu') {
            setFormDataDanhMuc(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
        } else {
            setFormDataDanhMuc(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitLoai = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/api/LoaiDanhMuc', { ...formDataLoai });
            toast.success('Thêm mới loại danh mục thành công!');
            onSuccess();
            onClose();
            setFormDataLoai({ maLoaiDanhMuc: '', tenLoaiDanhMuc: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm loại danh mục.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDanhMuc = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                loaiDanhMucId: formDataDanhMuc.loaiDanhMucId,
                maGiaTri: formDataDanhMuc.maGiaTri,
                tenHienThi: formDataDanhMuc.tenHienThi,
                thuTu: formDataDanhMuc.thuTu,
                danhMucCapTrenId: formDataDanhMuc.danhMucCapTrenId ? formDataDanhMuc.danhMucCapTrenId : null,
                icon: formDataDanhMuc.icon || null
            };
            await axiosInstance.post('/api/DanhMuc', payload);
            toast.success('Thêm mới danh mục thành công!');
            onSuccess();
            onClose();
            setFormDataDanhMuc({ loaiDanhMucId: '', maGiaTri: '', tenHienThi: '', thuTu: 1, danhMucCapTrenId: '', icon: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {/* Main Modal */}
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h2 className="text-lg font-bold text-[#131613] dark:text-white uppercase tracking-wide">
                        {type === 'LOAI_DANH_MUC' ? 'Thêm loại danh mục' : 'Thêm danh mục'}
                    </h2>
                    <button onClick={onClose} className="text-[#6b806c] hover:text-red-500 transition-colors bg-gray-100 hover:bg-red-50 p-1.5 rounded-full dark:bg-gray-800 dark:hover:bg-red-900/30">
                        <span className="material-symbols-outlined block text-xl">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={type === 'LOAI_DANH_MUC' ? handleSubmitLoai : handleSubmitDanhMuc} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {type === 'LOAI_DANH_MUC' ? (
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Mã loại danh mục *</label>
                                <input
                                    required name="maLoaiDanhMuc" value={formDataLoai.maLoaiDanhMuc} onChange={handleChangeLoai}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="VD: MAU_SAC, KICH_THUOC"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Tên loại danh mục *</label>
                                <input
                                    required name="tenLoaiDanhMuc" value={formDataLoai.tenLoaiDanhMuc} onChange={handleChangeLoai}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="VD: Màu sắc, Kích thước"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Loại danh mục *</label>
                                <select
                                    required name="loaiDanhMucId" value={formDataDanhMuc.loaiDanhMucId} onChange={handleChangeDanhMuc}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
                                >
                                    <option value="">-- Chọn loại danh mục --</option>
                                    {loaiDanhMucList.map(item => (
                                        <option key={item.id} value={item.id}>{item.tenLoaiDanhMuc}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Mã giá trị *</label>
                                <input
                                    required name="maGiaTri" value={formDataDanhMuc.maGiaTri} onChange={handleChangeDanhMuc}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="VD: DO, XANH"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Thứ tự *</label>
                                <input
                                    required type="number" name="thuTu" value={formDataDanhMuc.thuTu} onChange={handleChangeDanhMuc}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    min="1"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Tên hiển thị *</label>
                                <input
                                    required name="tenHienThi" value={formDataDanhMuc.tenHienThi} onChange={handleChangeDanhMuc}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="VD: Đỏ, Xanh lá"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Icon (Tùy chọn)</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(true)}
                                        className="flex-1 px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] hover:bg-white dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 text-left flex items-center gap-3 transition-all"
                                    >
                                        {formDataDanhMuc.icon ? (
                                            <>
                                                <span className="material-symbols-outlined text-primary text-xl">{formDataDanhMuc.icon}</span>
                                                <span className="truncate font-medium">{formDataDanhMuc.icon}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-gray-400 text-xl">add_circle</span>
                                                <span className="text-gray-500">Nhấn để chọn icon...</span>
                                            </>
                                        )}
                                    </button>
                                    {formDataDanhMuc.icon && (
                                        <button
                                            type="button"
                                            onClick={() => setFormDataDanhMuc(prev => ({ ...prev, icon: '' }))}
                                            className="px-4 border border-red-200 dark:border-red-800/50 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                                            title="Xóa icon"
                                        >
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1.5">Danh mục cấp trên (Tùy chọn)</label>
                                <select
                                    name="danhMucCapTrenId" value={formDataDanhMuc.danhMucCapTrenId} onChange={handleChangeDanhMuc}
                                    className="w-full px-4 py-2.5 border border-[#dee3de] dark:border-gray-700 rounded-xl bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
                                >
                                    <option value="">-- Không có (Làm danh mục gốc) --</option>
                                    {danhMucList.map(item => (
                                        <option key={item.id} value={item.id}>{item.tenHienThi}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-[#dee3de] dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            HỦY BỎ
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#246328] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2">
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">save</span>
                            )}
                            XÁC NHẬN LƯU
                        </button>
                    </div>
                </form>
            </div>

            {/* Icon Picker Modal Mới (Đẹp hơn) */}
            {showIconPicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a261c] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                        {/* Header của Picker */}
                        <div className="px-6 py-5 border-b border-[#dee3de] dark:border-gray-700 bg-white dark:bg-[#1a261c] shadow-sm z-10">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl font-bold text-[#131613] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">apps</span>
                                    Thư viện Icon
                                </h3>
                                <button onClick={() => setShowIconPicker(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors dark:bg-gray-800 dark:hover:bg-red-900/30">
                                    <span className="material-symbols-outlined block text-xl">close</span>
                                </button>
                            </div>

                            {/* Thanh Search cải tiến */}
                            <div className="relative w-full max-w-md">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input
                                    type="search"
                                    value={iconSearch}
                                    onChange={e => setIconSearch(e.target.value)}
                                    placeholder="Tìm kiếm icon..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Icon Grid */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#121a13]">
                            {filteredIcons.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-20 flex flex-col items-center">
                                    <span className="material-symbols-outlined text-6xl mb-3 text-gray-300">search_off</span>
                                    <p>Không tìm thấy icon nào phù hợp với "{iconSearch}"</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                    {filteredIcons.map((iconName) => {
                                        const isSelected = formDataDanhMuc.icon === iconName;
                                        return (
                                            <button
                                                key={iconName}
                                                type="button"
                                                onClick={() => {
                                                    setFormDataDanhMuc(prev => ({ ...prev, icon: iconName }));
                                                    setShowIconPicker(false);
                                                    setIconSearch('');
                                                }}
                                                className={`group relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 min-h-[96px] ${isSelected
                                                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_0_2px_rgba(var(--color-primary),0.2)]'
                                                    : 'border-white dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-1 shadow-sm'
                                                    }`}
                                                title={iconName}
                                            >
                                                <span className={`material-symbols-outlined text-3xl transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                    {iconName}
                                                </span>
                                                <span className="truncate w-full px-1 text-[11px] text-center font-medium opacity-80">
                                                    {iconName.replace(/_/g, ' ')}
                                                </span>

                                                {/* Dấu check nhỏ khi đang chọn */}
                                                {isSelected && (
                                                    <span className="absolute top-1.5 right-1.5 material-symbols-outlined text-[16px] text-primary bg-white rounded-full">
                                                        check_circle
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};