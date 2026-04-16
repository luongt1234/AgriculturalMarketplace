import { useEffect, useState, useRef } from 'react';
import type { DeliveryAddress } from '../../../types/checkout.types';
import { useAuthStore } from '../../../store/useAuthStore';
import { createAddress, updateAddress } from '../api/address.api';
import { toast } from 'sonner';
import axiosInstance from '../../../lip/axiosInstance';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: any) => void;
    editingAddress?: DeliveryAddress | null;
}

// Cấu trúc chuẩn của GHN trả về
type GHNProvince = { ProvinceID: number; ProvinceName: string };
type GHNDistrict = { DistrictID: number; DistrictName: string };
type GHNWard = { WardCode: string; WardName: string };

// Base URL trỏ về Backend của bạn
// Hãy cấu hình biến môi trường này hoặc import từ axios instance cấu hình sẵn
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

const emptyAddress: Partial<DeliveryAddress> = {
    id: '',
    fullName: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    provinceId: undefined,
    districtCode: 0,
    wardCode: '',
    detailedAddress: '',
    label: 'home',
    isDefault: false,
};

export const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingAddress,
}) => {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState<Partial<DeliveryAddress>>(emptyAddress);

    // Lưu ID để fetch cấp con
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

    const [provinces, setProvinces] = useState<GHNProvince[]>([]);
    const [districts, setDistricts] = useState<GHNDistrict[]>([]);
    const [wards, setWards] = useState<GHNWard[]>([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // ==========================================
    // 1. GỌI API TỪ BACKEND (CHUẨN BASECONTROLLER)
    // ==========================================
    const fetchProvinces = async () => {
        try {
            setLoadingProvinces(true);
            const response = await axiosInstance.get(`/api/shipping/ghn/provinces`);
            // BaseController bọc dữ liệu trong thuộc tính .data
            if (response) {
                setProvinces(response.data); // Tùy cấu trúc GHN trả về
            }
        } catch (error) {
            console.error('Lỗi tải Tỉnh/Thành:', error);
            toast.error('Không thể tải danh sách Tỉnh/Thành phố');
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
        } finally {
            setLoadingWards(false);
        }
    };

    // ==========================================
    // 2. EFFECTS ĐỂ LOAD DỮ LIỆU LIÊN HOÀN
    // ==========================================
    useEffect(() => {
        if (isOpen) {
            setFormData(editingAddress ?? emptyAddress);
            setSelectedProvinceId(editingAddress?.provinceId ?? null);
            setSelectedDistrictId(editingAddress?.districtCode ?? null);
            fetchProvinces();
        } else {
            // Reset modal khi đóng
            setSelectedProvinceId(null);
            setSelectedDistrictId(null);
            setDistricts([]);
            setWards([]);
        }
    }, [isOpen, editingAddress]);

    useEffect(() => {
        if (selectedProvinceId) fetchDistricts(selectedProvinceId);
        else setDistricts([]);
    }, [selectedProvinceId]);

    useEffect(() => {
        if (selectedDistrictId) fetchWards(selectedDistrictId);
        else setWards([]);
    }, [selectedDistrictId]);


    // ==========================================
    // 3. XỬ LÝ SỰ KIỆN GIAO DIỆN
    // ==========================================
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = Number(e.target.value);
        const provinceName = e.target.options[e.target.selectedIndex].text;

        setSelectedProvinceId(provinceId);
        setSelectedDistrictId(null); // Reset cấp dưới

        setFormData(prev => ({
            ...prev,
            city: provinceName,
            district: '',
            ward: '',
            districtCode: 0,
            wardCode: ''
        }));
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = Number(e.target.value);
        const districtName = e.target.options[e.target.selectedIndex].text;

        setSelectedDistrictId(districtId);

        setFormData(prev => ({
            ...prev,
            district: districtName,
            districtCode: districtId, // LƯU MÃ NÀY LẠI ĐỂ TÍNH PHÍ GHN
            ward: '',
            wardCode: ''
        }));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardCode = e.target.value;
        const wardName = e.target.options[e.target.selectedIndex].text;

        setFormData(prev => ({
            ...prev,
            ward: wardName,
            wardCode: wardCode // LƯU MÃ NÀY LẠI ĐỂ TÍNH PHÍ GHN
        }));
    };

    const handleSave = async () => {
        if (!formData.fullName || !formData.phone || !formData.city || !formData.district || !formData.ward || !formData.detailedAddress || !user?.id) {
            toast.warning('Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }

        // Tạo cục JSON địa chỉ map chuẩn cho DB của bạn
        const addressData = {
            diaChi: JSON.stringify({
                provinceId: selectedProvinceId,
                provinceName: formData.city,
                districtId: formData.districtCode,
                districtName: formData.district,
                wardCode: formData.wardCode,
                wardName: formData.ward
            }),
            tenNguoiNhanHang: formData.fullName,
            loaiDiaChiId: null,
            isDefault: formData.isDefault || false,
            soDienThoai: formData.phone,
            diaChiChiTiet: formData.detailedAddress,
            nguoiDungId: user.id
        };

        try {
            let savedAddress;
            if (editingAddress) {
                await updateAddress(editingAddress.id, addressData);
                savedAddress = { ...addressData, id: editingAddress.id };
            } else {
                savedAddress = await createAddress(addressData);
            }

            const deliveryAddress: DeliveryAddress = {
                id: savedAddress.id,
                fullName: formData.fullName,
                phone: formData.phone,
                city: formData.city,
                district: formData.district,
                ward: formData.ward,
                districtCode: formData.districtCode, // CỰC KỲ QUAN TRỌNG CHO BƯỚC CHECKOUT
                wardCode: formData.wardCode,         // CỰC KỲ QUAN TRỌNG CHO BƯỚC CHECKOUT
                detailedAddress: formData.detailedAddress,
                label: 'home',
                isDefault: formData.isDefault
            };

            onSave(deliveryAddress);
            toast.success(editingAddress ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công');
            onClose();
        } catch (error) {
            console.error('Lỗi khi lưu địa chỉ:', error);
            toast.error('Có lỗi xảy ra khi lưu địa chỉ');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-visible z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ giao hàng'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6 space-y-6">
                    {/* Full Name & Phone - GIỮ NGUYÊN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Họ và tên *</label>
                            <input name="fullName" value={formData.fullName || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Số điện thoại *</label>
                            <input name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    {/* Lọc Tỉnh/Huyện/Xã bằng ID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Tỉnh/Thành phố *</label>
                            <select
                                value={selectedProvinceId || ''}
                                onChange={handleCityChange}
                                disabled={loadingProvinces}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="">Chọn tỉnh/thành</option>
                                {provinces.map((p) => (
                                    <option key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Quận/Huyện *</label>
                            <select
                                value={selectedDistrictId || ''}
                                onChange={handleDistrictChange}
                                disabled={!districts.length || loadingDistricts}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map((d) => (
                                    <option key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Phường/Xã *</label>
                            <select
                                value={formData.wardCode || ''}
                                onChange={handleWardChange}
                                disabled={!wards.length || loadingWards}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((w) => (
                                    <option key={w.WardCode} value={w.WardCode}>{w.WardName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Chi tiết & Mặc định - GIỮ NGUYÊN */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Địa chỉ chi tiết *</label>
                        <textarea name="detailedAddress" value={formData.detailedAddress || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg min-h-[100px]" />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="isDefault" checked={formData.isDefault || false} onChange={handleInputChange} className="w-4 h-4" />
                        <label className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</label>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg font-bold text-gray-600 bg-gray-200">Hủy</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold">Lưu địa chỉ</button>
                </div>
            </div>
        </div>
    );
}