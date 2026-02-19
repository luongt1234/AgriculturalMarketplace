import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, type ProductFormRequest } from '../api/product.api';
import type { Product } from '../../../types/product.types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Product | null; // Dữ liệu sản phẩm cần sửa (nếu có)
}

// Mock Data (Thực tế nên lấy từ API)
const MOCK_SPC = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Cà phê Robusta' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Gạo ST25' },
];
const MOCK_QUALITY = [
    { id: 'aaaa-bbbb-cccc-dddd', name: 'Loại 1 (Xuất khẩu)' },
    { id: 'eeee-ffff-gggg-hhhh', name: 'Loại 2 (Thương mại)' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen, onClose, onSuccess, initialData
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Kiểm tra xem đang ở chế độ nào
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState<ProductFormRequest>({
        ten_san_pham: '',
        spc_id: '',
        chat_luong_id: '',
        gia: 0,
        so_luong: 0,
        mo_ta: '',
        hinh_anh: null,
    });

    // Effect: Reset form hoặc Fill data khi mở Modal
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // --- CHẾ ĐỘ EDIT: Fill dữ liệu ---
                setFormData({
                    ten_san_pham: initialData.name,
                    // Lưu ý: Cần map đúng ID từ tên danh mục nếu backend trả về tên
                    // Ở đây giả định initialData có chứa các ID này hoặc bạn phải tìm ID từ list MOCK_SPC
                    spc_id: MOCK_SPC.find(c => c.name === initialData.category)?.id || '',
                    chat_luong_id: '', // Cần logic tương tự để map ID chất lượng
                    gia: initialData.price,
                    so_luong: initialData.stock,
                    mo_ta: '', // Cần thêm field description vào Product type nếu chưa có
                    hinh_anh: null // Không set file object, chỉ hiển thị preview
                });
                setPreviewImage(initialData.imageUrl);
            } else {
                // --- CHẾ ĐỘ CREATE: Reset form ---
                setFormData({
                    ten_san_pham: '', spc_id: '', chat_luong_id: '', gia: 0, so_luong: 0, mo_ta: '', hinh_anh: null
                });
                setPreviewImage(null);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, hinh_anh: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate ảnh: Nếu tạo mới bắt buộc có ảnh, nếu sửa thì có thể dùng ảnh cũ (hinh_anh = null)
        if (!isEditMode && !formData.hinh_anh) {
            alert("Vui lòng chọn hình ảnh sản phẩm");
            return;
        }

        try {
            setIsLoading(true);
            if (isEditMode && initialData) {
                // Gọi API Update
                await updateProduct(initialData.id, formData);
                alert("Cập nhật sản phẩm thành công!");
            } else {
                // Gọi API Create
                await createProduct(formData);
                alert("Thêm sản phẩm thành công!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1a261c] rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-[#e0e2e0] dark:border-[#2f3a30] flex flex-col max-h-[90vh]">

                {/* Header Dynamic Title */}
                <div className="px-6 py-4 border-b border-[#e0e2e0] dark:border-[#2f3a30] flex justify-between items-center bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h3 className="text-lg font-bold text-[#131613] dark:text-white">
                        {isEditMode ? 'Cập nhật thông tin sản phẩm' : 'Thêm nông sản mới'}
                    </h3>
                    <button onClick={onClose} className="text-[#6b806c] hover:text-[#131613] dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <form id="product-form" onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Cột trái: Upload ảnh */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-2">Hình ảnh</label>
                            <div className="relative w-full aspect-square rounded-lg border-2 border-dashed border-[#e0e2e0] dark:border-[#2f3a30] bg-[#f9faf9] dark:bg-[#1e2a1f] flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer overflow-hidden group">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <span className="material-symbols-outlined text-4xl text-[#6b806c] mb-2">add_photo_alternate</span>
                                        <p className="text-xs text-[#6b806c]">Tải ảnh lên</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-white text-sm font-medium">Thay đổi</span>
                                </div>
                            </div>
                            {isEditMode && <p className="text-xs text-[#6b806c] mt-2 text-center">*Để trống nếu giữ ảnh cũ</p>}
                        </div>

                        {/* Cột phải: Inputs */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Tên hiển thị <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={formData.ten_san_pham}
                                    onChange={e => setFormData({ ...formData, ten_san_pham: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Loại nông sản</label>
                                    <select
                                        required
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.spc_id}
                                        onChange={e => setFormData({ ...formData, spc_id: e.target.value })}
                                    >
                                        <option value="">-- Chọn --</option>
                                        {MOCK_SPC.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Chất lượng</label>
                                    <select
                                        required
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.chat_luong_id}
                                        onChange={e => setFormData({ ...formData, chat_luong_id: e.target.value })}
                                    >
                                        <option value="">-- Chọn --</option>
                                        {MOCK_QUALITY.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Giá bán (VNĐ)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.gia}
                                        onChange={e => setFormData({ ...formData, gia: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Số lượng</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.so_luong}
                                        onChange={e => setFormData({ ...formData, so_luong: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Mô tả</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                    value={formData.mo_ta}
                                    onChange={e => setFormData({ ...formData, mo_ta: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#f9faf9] dark:bg-[#1f2d21] border-t border-[#e0e2e0] dark:border-[#2f3a30] flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-[#131613] dark:text-white text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-[#246328] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                    >
                        {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {isEditMode ? 'Lưu thay đổi' : 'Đăng bán ngay'}
                    </button>
                </div>
            </div>
        </div>
    );
};