import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import TreeSelect from '../../../components/common/TreeSelect';
import { AutocompleteSelect } from '../../../components/common/AutocompleteSelect';
import { createProduct, updateProduct, getCommonProducts, getQualityOptions, type ProductFormRequest } from '../api/product.api';
import type { Product, CommonProduct, QualityOption } from '../../../types/product.types';
import axiosInstance from '../../../lip/axiosInstance';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Product | null;
}

// CHUẨN HOÁ TYPE THEO DỮ LIỆU GHN TRẢ VỀ
type GHNProvince = { ProvinceID: number; ProvinceName: string };
type GHNDistrict = { DistrictID: number; DistrictName: string };
type GHNWard = { WardCode: string; WardName: string };

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // State dữ liệu danh mục
    const [commonProducts, setCommonProducts] = useState<CommonProduct[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
    const [isLoadingQuality, setIsLoadingQuality] = useState(false);

    // State dữ liệu địa chỉ GHN
    const [provinces, setProvinces] = useState<GHNProvince[]>([]);
    const [districts, setDistricts] = useState<GHNDistrict[]>([]);
    const [wards, setWards] = useState<GHNWard[]>([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // State lưu trữ địa chỉ được chọn (Lưu cả ID để API hiểu và Name để render)
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
    const [selectedWardCode, setSelectedWardCode] = useState<string>('');

    const [selectedCityName, setSelectedCityName] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');

    const isEditMode = !!initialData;

    // State Form
    const [formData, setFormData] = useState<ProductFormRequest>({
        tenHienThi: '',
        sanPhamChungId: '',
        chatLuongId: '',
        gia: 0,
        soLuong: 0,
        moTaChiTiet: '',
        hinhAnh: null,
        diaChi: '',
        diaChiChiTiet: '',
    });

    // ==========================================
    // TẢI DỮ LIỆU DANH MỤC & CHẤT LƯỢNG
    // ==========================================
    useEffect(() => {
        const loadCommonProducts = async () => {
            try {
                setIsLoadingProducts(true);
                setCommonProducts(await getCommonProducts());
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        if (isOpen) loadCommonProducts();
    }, [isOpen]);

    useEffect(() => {
        const loadQualityOptions = async () => {
            try {
                setIsLoadingQuality(true);
                setQualityOptions(await getQualityOptions());
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingQuality(false);
            }
        };
        if (isOpen) loadQualityOptions();
    }, [isOpen]);

    // ==========================================
    // TẢI DỮ LIỆU ĐỊA CHỈ TỪ BACKEND GHN
    // ==========================================
    const fetchProvinces = async () => {
        try {
            setLoadingProvinces(true);
            const response = await axiosInstance.get(`/api/shipping/ghn/provinces`);
            if (response) {
                setProvinces(response.data || response.data.data);
            }
        } catch (error) {
            console.error('Lỗi tải Tỉnh/Thành:', error);
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceId: number) => {
        try {
            setLoadingDistricts(true);
            const response = await axiosInstance.get(`/api/shipping/ghn/districts/${provinceId}`);
            if (response) {
                setDistricts(response.data || response.data.data);
            }
        } catch (error) {
            console.error('Lỗi tải Quận/Huyện:', error);
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId: number) => {
        try {
            setLoadingWards(true);
            const response = await axiosInstance.get(`/api/shipping/ghn/wards/${districtId}`);
            if (response) {
                setWards(response.data || response.data.data);
            }
        } catch (error) {
            console.error('Lỗi tải Phường/Xã:', error);
            setWards([]);
        } finally {
            setLoadingWards(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        fetchProvinces();

        if (initialData) {
            setFormData({
                tenHienThi: initialData.tenHienThi || '',
                sanPhamChungId: initialData.sanPhamChungId || '',
                chatLuongId: initialData.chatLuongId || '',
                gia: initialData.gia,
                soLuong: initialData.soLuong,
                moTaChiTiet: initialData.moTaChiTiet || '',
                hinhAnh: null,
                diaChi: initialData.diaChi || '',
                diaChiChiTiet: initialData.diaChiChiTiet || '',
            });
            setPreviewImage(initialData.hinhAnhUrl || null);

            try {
                if (initialData.diaChi) {
                    const parsedAddress = JSON.parse(initialData.diaChi);
                    if (parsedAddress.provinceId) {
                        setSelectedProvinceId(parsedAddress.provinceId);
                        setSelectedCityName(parsedAddress.provinceName);

                        setSelectedDistrictId(parsedAddress.districtId);
                        setSelectedDistrictName(parsedAddress.districtName);

                        setSelectedWardCode(parsedAddress.wardCode);
                        setSelectedWardName(parsedAddress.wardName);
                    }
                }
            } catch (e) {
                console.error("Lỗi parse địa chỉ cũ", e);
            }
        } else {
            setFormData({
                tenHienThi: '', sanPhamChungId: '', chatLuongId: '', gia: 0, soLuong: 0,
                moTaChiTiet: '', hinhAnh: null, diaChi: '', diaChiChiTiet: '',
            });
            setPreviewImage(null);
            setSelectedProvinceId(null); setSelectedCityName('');
            setSelectedDistrictId(null); setSelectedDistrictName('');
            setSelectedWardCode(''); setSelectedWardName('');
        }
    }, [isOpen, initialData]);

    // Load cấp dưới khi cấp trên thay đổi
    useEffect(() => {
        if (selectedProvinceId) fetchDistricts(selectedProvinceId);
        else { setDistricts([]); setWards([]); }
    }, [selectedProvinceId]);

    useEffect(() => {
        if (selectedDistrictId) fetchWards(selectedDistrictId);
        else setWards([]);
    }, [selectedDistrictId]);

    // ==========================================
    // XỬ LÝ SỰ KIỆN GIAO DIỆN
    // ==========================================
    const handleCityChange = (item: GHNProvince) => {
        setSelectedProvinceId(item.ProvinceID);
        setSelectedCityName(item.ProvinceName);
        setSelectedDistrictId(null); setSelectedDistrictName('');
        setSelectedWardCode(''); setSelectedWardName('');
    };

    const handleDistrictChange = (item: GHNDistrict) => {
        setSelectedDistrictId(item.DistrictID);
        setSelectedDistrictName(item.DistrictName);
        setSelectedWardCode(''); setSelectedWardName('');
    };

    const handleWardChange = (item: GHNWard) => {
        setSelectedWardCode(item.WardCode);
        setSelectedWardName(item.WardName);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, hinhAnh: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditMode && !formData.hinhAnh) {
            toast.error("Vui lòng chọn hình ảnh sản phẩm"); return;
        }
        if (!formData.sanPhamChungId) {
            toast.error("Vui lòng chọn sản phẩm chung"); return;
        }
        if (!selectedProvinceId || !selectedDistrictId || !selectedWardCode || !formData.diaChiChiTiet) {
            toast.error("Vui lòng điền đầy đủ địa chỉ lấy hàng"); return;
        }

        const diaChiObject = {
            provinceId: selectedProvinceId,
            provinceName: selectedCityName,
            districtId: selectedDistrictId,
            districtName: selectedDistrictName,
            wardCode: selectedWardCode,
            wardName: selectedWardName
        };

        const submitData = {
            ...formData,
            diaChi: JSON.stringify(diaChiObject),
            diaChiChiTiet: formData.diaChiChiTiet,
        };

        try {
            setIsLoading(true);
            if (isEditMode && initialData) {
                await updateProduct(initialData.id, submitData);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                await createProduct(submitData);
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

    if (!isOpen) return null;

    // CSS Dùng chung cho Input / Textarea / Select (Đã Fix lỗi Theme mượt mà)
    const inputClasses = "w-full px-3 py-2 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary/50 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1a261c] rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-[#e0e2e0] dark:border-[#2f3a30] flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[#e0e2e0] dark:border-[#2f3a30] flex justify-between items-center bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {isEditMode ? 'Cập nhật thông tin sản phẩm' : 'Thêm nông sản mới'}
                    </h3>
                    <button type="button" onClick={onClose} className="text-[#6b806c] hover:text-gray-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto custom-scrollbar flex-1 relative">
                    <form id="product-form" onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Cột trái: Ảnh */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Hình ảnh <span className="text-red-500">*</span></label>
                            <div className="relative w-full aspect-square rounded-lg border-2 border-dashed border-[#e0e2e0] dark:border-[#2f3a30] bg-[#f9faf9] dark:bg-[#1e2a1f] flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer overflow-hidden group">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <span className="material-symbols-outlined text-4xl text-[#6b806c] mb-2">add_photo_alternate</span>
                                        <p className="text-xs text-[#6b806c]">Tải ảnh lên</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-white text-sm font-medium">Thay đổi</span>
                                </div>
                            </div>
                            {isEditMode && <p className="text-xs text-[#6b806c] mt-2 text-center">*Để trống nếu giữ ảnh cũ</p>}
                        </div>

                        {/* Cột phải: Form */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Tên hiển thị <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    name="tenHienThi"
                                    className={inputClasses}
                                    value={formData.tenHienThi}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Gạo ST25 premium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Sản phẩm chung <span className="text-red-500">*</span></label>
                                {isLoadingProducts ? (
                                    <div className={`${inputClasses} flex items-center text-gray-500`}>Đang tải...</div>
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
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Chất lượng</label>
                                {isLoadingQuality ? (
                                    <div className={`${inputClasses} flex items-center text-gray-500`}>Đang tải...</div>
                                ) : (
                                    <select
                                        name="chatLuongId"
                                        className={inputClasses}
                                        value={formData.chatLuongId || ''}
                                        onChange={handleInputChange}
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
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="number"
                                        name="gia"
                                        className={inputClasses}
                                        value={formData.gia === 0 && !isEditMode ? '' : formData.gia}
                                        onChange={e => setFormData({ ...formData, gia: Number(e.target.value) })}
                                        min="0"
                                        placeholder="VD: 50000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Số lượng <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="number"
                                        name="soLuong"
                                        className={inputClasses}
                                        value={formData.soLuong === 0 && !isEditMode ? '' : formData.soLuong}
                                        onChange={e => setFormData({ ...formData, soLuong: Number(e.target.value) })}
                                        min="0"
                                        placeholder="VD: 100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Mô tả chi tiết</label>
                                <textarea
                                    name="moTaChiTiet"
                                    rows={3}
                                    className={`${inputClasses} resize-none`}
                                    value={formData.moTaChiTiet}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                ></textarea>
                            </div>

                            {/* Khu vực địa chỉ */}
                            <div className="space-y-4 pt-4 border-t border-[#e0e2e0] dark:border-[#2f3a30]">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Địa chỉ lấy hàng (Kho/Vườn) <span className="text-red-500">*</span></h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-50">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Tỉnh/Thành phố</label>
                                        <AutocompleteSelect
                                            options={provinces}
                                            value={selectedProvinceId?.toString() || ''}
                                            onChange={(value, item) => handleCityChange(item)}
                                            getOptionLabel={(item) => item.ProvinceName}
                                            getOptionValue={(item) => item.ProvinceID.toString()}
                                            placeholder="Chọn tỉnh/thành"
                                            disabled={loadingProvinces}
                                            loading={loadingProvinces}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Quận/Huyện</label>
                                        <AutocompleteSelect
                                            options={districts}
                                            value={selectedDistrictId?.toString() || ''}
                                            onChange={(value, item) => handleDistrictChange(item)}
                                            getOptionLabel={(item) => item.DistrictName}
                                            getOptionValue={(item) => item.DistrictID.toString()}
                                            placeholder="Chọn quận/huyện"
                                            disabled={!districts.length || loadingDistricts}
                                            loading={loadingDistricts}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Phường/Xã</label>
                                        <AutocompleteSelect
                                            options={wards}
                                            value={selectedWardCode}
                                            onChange={(value, item) => handleWardChange(item)}
                                            getOptionLabel={(item) => item.WardName}
                                            getOptionValue={(item) => item.WardCode}
                                            placeholder="Chọn phường/xã"
                                            disabled={!wards.length || loadingWards}
                                            loading={loadingWards}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="diaChiChiTiet"
                                        rows={2}
                                        className={`${inputClasses} resize-none`}
                                        value={formData.diaChiChiTiet || ''}
                                        onChange={handleInputChange}
                                        placeholder="Số nhà, tên đường, vườn..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#f9faf9] dark:bg-[#1f2d21] border-t border-[#e0e2e0] dark:border-[#2f3a30] flex justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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