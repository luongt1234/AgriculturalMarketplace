import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import axiosInstance from '../../../lip/axiosInstance';
import TreeSelect from '../../../components/common/TreeSelect';
import { AutocompleteSelect } from '../../../components/common/AutocompleteSelect';
import { createProduct, updateProduct, getCommonProducts, getQualityOptions, type ProductFormRequest } from '../api/product.api';
import type { Product, CommonProduct, QualityOption } from '../../../types/product.types';
import { getImageUrl } from '../../../utils/imageUrl';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Product | null;
}

type FullLocationItem = {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    phone_code?: number;
    province_code?: number;
    district_code?: number;
};

const GHN_LOCATION_PROXY = '/api/shipping/ghn';


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
    const [provinces, setProvinces] = useState<FullLocationItem[]>([]);
    const [districts, setDistricts] = useState<FullLocationItem[]>([]);
    const [wards, setWards] = useState<FullLocationItem[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    // Track whether user has manually changed address in edit mode
    const [addressChanged, setAddressChanged] = useState(false);

    const isEditMode = !!initialData;

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

    // Effect: Load provinces + pre-fill address khi mở Modal
    useEffect(() => {
        if (!isOpen) return;

        const init = async () => {
            // 1. Load provinces
            const provinceList = await fetchProvinces();

            if (initialData) {
                // 2a. Edit mode: fill form
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
                setPreviewImage(getImageUrl(initialData.hinhAnhUrl) || null);
                setAddressChanged(false);

                // 3. Parse địa chỉ cũ rồi cascade fetch districts → wards
                try {
                    const parsed = JSON.parse(initialData.diaChi || '{}');
                    const cityName = parsed.provinceName ?? parsed.name ?? '';
                    const districtName = parsed.districtName ?? parsed.districts?.[0]?.name ?? '';
                    const wardName = parsed.wardName ?? parsed.districts?.[0]?.wards?.[0]?.name ?? '';

                    const province = provinceList.find(p => p.name === cityName);
                    if (province) {
                        setSelectedCity(cityName);
                        const districtList = await fetchDistricts(province.code.toString());
                        const district = districtList.find((d: any) => d.name === districtName);
                        if (district) {
                            setSelectedDistrict(districtName);
                            await fetchWards(district.code.toString());
                            setSelectedWard(wardName);
                        }
                    }
                } catch {
                    setSelectedCity('');
                    setSelectedDistrict('');
                    setSelectedWard('');
                }
            } else {
                // 2b. Create mode: reset form
                setFormData({
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
                setPreviewImage(null);
                setSelectedCity('');
                setSelectedDistrict('');
                setSelectedWard('');
                setAddressChanged(false);
            }
        };

        init();
    }, [isOpen, initialData]);

    // Effect: Load districts khi user tự chọn tỉnh (không phải từ init)
    useEffect(() => {
        if (!selectedCity || !provinces.length) return;
        const province = provinces.find((item) => item.name === selectedCity);
        if (!province) {
            setDistricts([]);
            setWards([]);
        }
        // Không fetch districts ở đây vì đã được xử lý trong handleCityChange và init
    }, [selectedCity, provinces]);

    // Effect: Load wards khi user tự chọn quận
    useEffect(() => {
        if (!selectedDistrict || !districts.length) return;
        const district = districts.find((item) => item.name === selectedDistrict);
        if (!district) {
            setWards([]);
        }
        // Không fetch wards ở đây vì đã được xử lý trong handleDistrictChange và init
    }, [selectedDistrict, districts]);


    if (!isOpen) return null;

    const normalizeLocations = (data: any): FullLocationItem[] => {
        if (!data) return [];
        if (Array.isArray(data)) {
            return data.map((item) => ({
                code: item.WardCode ?? item.ward_code ?? item.DistrictID ?? item.district_id ?? item.ProvinceID ?? item.province_id ?? item.Code ?? item.code ?? item.WardID ?? 0,
                name: item.WardName ?? item.ward_name ?? item.DistrictName ?? item.district_name ?? item.ProvinceName ?? item.province_name ?? item.name ?? item.full_name ?? item.name_with_type ?? item.label ?? '',
                division_type: item.Type ?? item.division_type ?? item.ProvinceType ?? item.DistrictType ?? item.ward_type ?? '',
                codename: item.codename,
                phone_code: item.phone_code,
                province_code: item.ProvinceID ?? item.province_code ?? item.province_id ?? item.provinceId,
                district_code: item.DistrictID ?? item.district_code ?? item.district_id ?? item.districtId,
            }));
        }
        if (data.provinces) return normalizeLocations(data.provinces);
        if (data.districts) return normalizeLocations(data.districts);
        if (data.wards) return normalizeLocations(data.wards);
        if (data.data) return normalizeLocations(data.data);
        return [];
    };

    const fetchProvinces = async () => {
        try {
            setLoadingProvinces(true);
            const response = await axiosInstance.get(`${GHN_LOCATION_PROXY}/provinces`);
            const list = normalizeLocations((response as any)?.data ?? response);
            setProvinces(list);
            return list;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            setProvinces([]);
            return [];
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceCode: string) => {
        try {
            setLoadingDistricts(true);
            const response = await axiosInstance.get(`${GHN_LOCATION_PROXY}/districts/${provinceCode}`);
            const list = normalizeLocations((response as any)?.data ?? response);
            setDistricts(list);
            return list;
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
            return [];
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtCode: string) => {
        try {
            setLoadingWards(true);
            const response = await axiosInstance.get(`${GHN_LOCATION_PROXY}/wards/${districtCode}`);
            const list = normalizeLocations((response as any)?.data ?? response);
            setWards(list);
            return list;
        } catch (error) {
            console.error('Error fetching wards:', error);
            setWards([]);
            return [];
        } finally {
            setLoadingWards(false);
        }
    };

    const handleCityChange = async (cityName: string) => {
        setSelectedCity(cityName);
        setSelectedDistrict('');
        setSelectedWard('');
        setAddressChanged(true);
        setDistricts([]);
        setWards([]);
        const province = provinces.find(p => p.name === cityName);
        if (province) await fetchDistricts(province.code.toString());
    };

    const handleDistrictChange = async (districtName: string) => {
        setSelectedDistrict(districtName);
        setSelectedWard('');
        setAddressChanged(true);
        setWards([]);
        const district = districts.find(d => d.name === districtName);
        if (district) await fetchWards(district.code.toString());
    };

    const handleWardChange = (wardName: string) => {
        setSelectedWard(wardName);
        setAddressChanged(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

        // Validate địa chỉ
        // Trong chế độ edit: nếu user không thay đổi địa chỉ thì dùng lại địa chỉ cũ
        let diaChiJson = formData.diaChi;
        if (!isEditMode || addressChanged) {
            if (!selectedCity || !selectedDistrict || !selectedWard || !formData.diaChiChiTiet) {
                toast.error("Vui lòng điền đầy đủ địa chỉ giao hàng");
                return;
            }

            const selectedProvince = provinces.find(p => p.name === selectedCity);
            const selectedDistrictObj = districts.find(d => d.name === selectedDistrict);
            const selectedWardObj = wards.find(w => w.name === selectedWard);

            if (!selectedProvince || !selectedDistrictObj || !selectedWardObj) {
                toast.error('Không tìm thấy thông tin địa chỉ đã chọn');
                return;
            }

            diaChiJson = JSON.stringify({
                provinceId: selectedProvince.code,
                provinceName: selectedProvince.name,
                districtId: selectedDistrictObj.code,
                districtName: selectedDistrictObj.name,
                wardCode: String(selectedWardObj.code),
                wardName: selectedWardObj.name,
                diaChiChiTiet: formData.diaChiChiTiet
            });
        }

        const submitData = {
            ...formData,
            diaChi: diaChiJson,
            diaChiChiTiet: formData.diaChiChiTiet,
        };

        try {
            setIsLoading(true);
            if (isEditMode && initialData) {
                // Gọi API Update
                await updateProduct(initialData.id, submitData);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                // Gọi API Create
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

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-[#131613] dark:text-gray-200">Địa chỉ bán hàng <span className="text-red-500">*</span></h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Tỉnh/Thành phố</label>
                                        <AutocompleteSelect
                                            options={provinces}
                                            value={selectedCity}
                                            onChange={(value, item) => handleCityChange(item.name)}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            placeholder="Chọn tỉnh/thành"
                                            disabled={loadingProvinces}
                                            loading={loadingProvinces}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Quận/Huyện</label>
                                        <AutocompleteSelect
                                            options={districts}
                                            value={selectedDistrict}
                                            onChange={(value, item) => handleDistrictChange(item.name)}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            placeholder="Chọn quận/huyện"
                                            disabled={!districts.length || loadingDistricts}
                                            loading={loadingDistricts}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Phường/Xã</label>
                                        <AutocompleteSelect
                                            options={wards}
                                            value={selectedWard}
                                            onChange={(value, item) => handleWardChange(item.name)}
                                            getOptionLabel={(item) => item.name}
                                            getOptionValue={(item) => item.name}
                                            placeholder="Chọn phường/xã"
                                            disabled={!wards.length || loadingWards}
                                            loading={loadingWards}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#131613] dark:text-gray-200 mb-1">Địa chỉ chi tiết</label>
                                    <textarea
                                        name="diaChiChiTiet"
                                        rows={2}
                                        className="w-full p-3 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                        value={formData.diaChiChiTiet || ''}
                                        onChange={handleInputChange}
                                        placeholder="Số nhà, tên đường, thôn/xóm..."
                                    ></textarea>
                                </div>
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