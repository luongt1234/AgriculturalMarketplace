import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import TreeSelect from '../../../components/common/TreeSelect';
import { createProduct, updateProduct, getCommonProducts, getQualityOptions, type ProductFormRequest } from '../api/product.api';
import type { Product, CommonProduct, QualityOption } from '../../../types/product.types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Product | null;
}


export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [commonProducts, setCommonProducts] = useState<CommonProduct[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
    const [isLoadingQuality, setIsLoadingQuality] = useState(false);

    const isEditMode = !!initialData;

    const [formData, setFormData] = useState<ProductFormRequest>({
        tenHienThi: '',
        sanPhamChungId: '',
        chatLuongId: '',
        gia: 0,
        soLuong: 0,
        moTaChiTiet: '',
        hinhAnh: null,
    });

    // Effect: Load danh sách sản phẩm chung
    useEffect(() => {
        const loadCommonProducts = async () => {
            try {
                setIsLoadingProducts(true);
                const data = await getCommonProducts();
                setCommonProducts(data);
            } catch (error) {
                console.error('Lỗi load sản phẩm chung:', error);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        if (isOpen) {
            loadCommonProducts();
        }
    }, [isOpen]);

    // Effect: Load danh sách chất lượng
    useEffect(() => {
        const loadQualityOptions = async () => {
            try {
                setIsLoadingQuality(true);
                const data = await getQualityOptions();
                setQualityOptions(data);
            } catch (error) {
                console.error('Lỗi load chất lượng:', error);
            } finally {
                setIsLoadingQuality(false);
            }
        };

        if (isOpen) {
            loadQualityOptions();
        }
    }, [isOpen]);

    // Effect: Reset form hoặc Fill data khi mở Modal
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    tenHienThi: initialData.tenHienThi || '',
                    sanPhamChungId: initialData.sanPhamChungId || '',
                    chatLuongId: initialData.chatLuongId || '',
                    gia: initialData.gia,
                    soLuong: initialData.soLuong,
                    moTaChiTiet: initialData.moTaChiTiet || '',
                    hinhAnh: null,
                });
                setPreviewImage(initialData.hinhAnhUrl || null);
            } else {
                // --- CHẾ ĐỘ CREATE: Reset form ---
                setFormData({
                    tenHienThi: '',
                    sanPhamChungId: '',
                    chatLuongId: '',
                    gia: 0,
                    soLuong: 0,
                    moTaChiTiet: '',
                    hinhAnh: null,
                });
                setPreviewImage(null);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, hinhAnh: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate ảnh: Nếu tạo mới bắt buộc có ảnh, nếu sửa thì có thể dùng ảnh cũ (hinhAnh = null)
        if (!isEditMode && !formData.hinhAnh) {
            toast.error("Vui lòng chọn hình ảnh sản phẩm");
            return;
        }

        // Validate sản phẩm chung
        if (!formData.sanPhamChungId) {
            toast.error("Vui lòng chọn sản phẩm chung");
            return;
        }

        try {
            setIsLoading(true);
            if (isEditMode && initialData) {
                // Gọi API Update
                await updateProduct(initialData.id, formData);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                // Gọi API Create
                await createProduct(formData);
                toast.success("Thêm sản phẩm thành công!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
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
                                    value={formData.tenHienThi}
                                    onChange={e => setFormData({ ...formData, tenHienThi: e.target.value })}
                                    placeholder="Ví dụ: Gạo ST25 premium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Sản phẩm chung <span className="text-red-500">*</span></label>
                                {isLoadingProducts ? (
                                    <div className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm flex items-center text-gray-500">
                                        Đang tải...
                                    </div>
                                ) : (
                                    <TreeSelect<CommonProduct>
                                        data={commonProducts}
                                        value={formData.sanPhamChungId}
                                        onChange={(value) => setFormData({ ...formData, sanPhamChungId: value })}
                                        labelField="tenSanPham"
                                        valueField="id"
                                        childrenField="children"
                                        parentField="chaId"
                                        placeholder="-- Chọn sản phẩm chung --"
                                        className="h-10"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Chất lượng</label>
                                {isLoadingQuality ? (
                                    <div className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm flex items-center text-gray-500">
                                        Đang tải...
                                    </div>
                                ) : (
                                    <select
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.chatLuongId || ''}
                                        onChange={e => setFormData({ ...formData, chatLuongId: e.target.value })}
                                    >
                                        <option value="">-- Chọn chất lượng --</option>
                                        {qualityOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.tenHienThi}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.gia}
                                        onChange={e => setFormData({ ...formData, gia: Number(e.target.value) })}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Số lượng <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full h-10 px-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={formData.soLuong}
                                        onChange={e => setFormData({ ...formData, soLuong: Number(e.target.value) })}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Mô tả chi tiết</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                    value={formData.moTaChiTiet}
                                    onChange={e => setFormData({ ...formData, moTaChiTiet: e.target.value })}
                                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
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
                        disabled={isLoading || isLoadingProducts || isLoadingQuality}
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