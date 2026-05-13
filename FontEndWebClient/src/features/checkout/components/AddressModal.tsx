import { useEffect, useState, useRef } from 'react';
import type { DeliveryAddress } from '../../../types/checkout.types';
import axios from 'axios';
import { useAuthStore } from '../../../store/useAuthStore';
import { createAddress, updateAddress } from '../api/address.api';
import { toast } from 'sonner';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: any) => void; // Changed to any for new format
    editingAddress?: DeliveryAddress | null;
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

const API_ADDRESS = import.meta.env.PROVINCES_API_URL || 'https://provinces.open-api.vn/api/v1';

const emptyAddress: DeliveryAddress = {
    id: '',
    fullName: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    detailedAddress: '',
    label: 'home',
    isDefault: false,
};

export function AddressModal({
    isOpen,
    onClose,
    onSave,
    editingAddress,
}: AddressModalProps) {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState<Partial<DeliveryAddress>>(emptyAddress);
    const [provinces, setProvinces] = useState<FullLocationItem[]>([]);
    const [districts, setDistricts] = useState<FullLocationItem[]>([]);
    const [wards, setWards] = useState<FullLocationItem[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const provinceSearchRef = useRef('');
    const districtSearchRef = useRef('');
    const wardSearchRef = useRef('');

    const handleAutoSelectKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>, options: FullLocationItem[], searchRef: React.MutableRefObject<string>, onChange: (name: string) => void) => {
        const key = e.key;
        if (key === 'Backspace') {
            searchRef.current = searchRef.current.slice(0, -1);
        } else if (key.length === 1 && key.match(/[a-zA-Z0-9\s]/)) {
            searchRef.current += key.toLowerCase();
        } else {
            return;
        }

        const matchingOption = options.find(option =>
            option.name.toLowerCase().startsWith(searchRef.current)
        );

        if (matchingOption) {
            onChange(matchingOption.name);
            // Clear search after selection
            setTimeout(() => {
                searchRef.current = '';
            }, 100);
        }
    };

    const normalizeLocations = (data: any): FullLocationItem[] => {
        if (!data) return [];
        if (Array.isArray(data)) {
            return data.map((item) => ({
                code: item.code,
                name: item.name ?? item.name_with_type ?? item.full_name ?? item.label ?? '',
                division_type: item.division_type,
                codename: item.codename,
                phone_code: item.phone_code,
                province_code: item.province_code,
                district_code: item.district_code,
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
            const response = await axios.get(API_ADDRESS);
            const list = normalizeLocations(response.data);
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
            const response = await axios.get(`${API_ADDRESS}/p/${provinceCode}?depth=2`);
            const list = normalizeLocations(response.data.districts);
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
            const response = await axios.get(`${API_ADDRESS}/d/${districtCode}?depth=2`);
            const list = normalizeLocations(response.data.wards);
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

    // Khởi tạo dữ liệu khi mở Modal — cascade fetch theo thứ tự để đảm bảo đúng
    useEffect(() => {
        if (!isOpen) return;

        const init = async () => {
            const provinceList = await fetchProvinces();

            if (editingAddress) {
                setFormData(editingAddress);

                // Ưu tiên match theo ID (format mới), fallback theo tên (format cũ)
                const province = editingAddress.provinceId
                    ? provinceList.find(p => p.code === editingAddress.provinceId)
                    : provinceList.find(p => p.name === editingAddress.city);
                if (!province) return;

                const districtList = await fetchDistricts(province.code.toString());

                const district = editingAddress.districtCode
                    ? districtList.find(d => d.code === editingAddress.districtCode)
                    : districtList.find(d => d.name === editingAddress.district);
                if (!district) return;

                const wardList = await fetchWards(district.code.toString());

                // wardCode trong format mới là string (mã ward)
                if (editingAddress.wardCode) {
                    const ward = wardList.find(w => String(w.code) === String(editingAddress.wardCode));
                    if (ward) {
                        setFormData(prev => ({ ...prev, ward: ward.name }));
                    }
                }
            } else {
                setFormData(emptyAddress);
            }
        };

        init();
    }, [isOpen, editingAddress]);


    // Xử lý các Input text thông thường
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    // Các hàm xử lý riêng cho select — fetch cấp dưới và reset giá trị phụ thuộc
    const handleCityChange = async (cityName: string) => {
        setFormData(prev => ({ ...prev, city: cityName, district: '', ward: '' }));
        setDistricts([]);
        setWards([]);
        provinceSearchRef.current = '';
        const province = provinces.find(p => p.name === cityName);
        if (province) await fetchDistricts(province.code.toString());
    };

    const handleDistrictChange = async (districtName: string) => {
        setFormData(prev => ({ ...prev, district: districtName, ward: '' }));
        setWards([]);
        districtSearchRef.current = '';
        const district = districts.find(d => d.name === districtName);
        if (district) await fetchWards(district.code.toString());
    };

    const handleWardChange = (wardName: string) => {
        setFormData(prev => ({ ...prev, ward: wardName }));
        wardSearchRef.current = '';
    };

    const handleSave = async () => {
        if (!formData.fullName || !formData.phone || !formData.city || !formData.district || !formData.ward || !formData.detailedAddress || !user?.id) {
            toast.warning('Vui lòng điền đầy đủ các trường bắt buộc và đăng nhập');
            return;
        }

        const selectedProvince = provinces.find(p => p.name === formData.city);
        const selectedDistrict = districts.find(d => d.name === formData.district);
        const selectedWard = wards.find(w => w.name === formData.ward);

        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            toast.error('Không tìm thấy thông tin địa chỉ đã chọn');
            return;
        }

        const diaChiObject = {
            provinceId: selectedProvince.code,
            provinceName: selectedProvince.name,
            districtId: selectedDistrict.code,
            districtName: selectedDistrict.name,
            wardCode: String(selectedWard.code),
            wardName: selectedWard.name,
        };

        const addressData = {
            diaChi: JSON.stringify(diaChiObject),
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

            // Convert to DeliveryAddress format for store
            const deliveryAddress: DeliveryAddress = {
                id: savedAddress.id,
                fullName: savedAddress.tenNguoiNhanHang,
                phone: savedAddress.soDienThoai,
                city: selectedProvince.name,
                district: selectedDistrict.name,
                ward: selectedWard.name,
                provinceId: selectedProvince.code,
                districtCode: selectedDistrict.code,
                wardCode: String(selectedWard.code),
                detailedAddress: savedAddress.diaChiChiTiet,
                label: 'home',
                isDefault: savedAddress.isDefault
            };

            onSave(deliveryAddress);
            setFormData(emptyAddress);
            toast.success(editingAddress ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công');
            onClose();
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Có lỗi xảy ra khi lưu địa chỉ');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* FIX: Đổi overflow-hidden thành overflow-visible để Dropdown không bị cắt ngang */}
            <div className="relative bg-background-light dark:bg-background-dark bg-surface-light dark:bg-surface-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-visible z-10">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_location_alt</span>
                        {editingAddress ? 'Chỉnh sửa địa chỉ giao hàng' : 'Thêm địa chỉ giao hàng mới'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleInputChange}
                                placeholder="vd: Nguyễn Văn A"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                                placeholder="vd: 090 123 4567"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Tỉnh/Thành phố <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.city || ''}
                                onChange={(e) => handleCityChange(e.target.value)}
                                onKeyDown={(e) => handleAutoSelectKeyDown(e, provinces, provinceSearchRef, handleCityChange)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                disabled={loadingProvinces}
                            >
                                <option value="">Chọn tỉnh/thành</option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.name}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Quận/Huyện <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.district || ''}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                                onKeyDown={(e) => handleAutoSelectKeyDown(e, districts, districtSearchRef, handleDistrictChange)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                disabled={!districts.length || loadingDistricts}
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Phường/Xã <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.ward || ''}
                                onChange={(e) => handleWardChange(e.target.value)}
                                onKeyDown={(e) => handleAutoSelectKeyDown(e, wards, wardSearchRef, handleWardChange)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                disabled={!wards.length || loadingWards}
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.name}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Địa chỉ chi tiết <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="address"
                            name="detailedAddress"
                            value={formData.detailedAddress || ''}
                            onChange={handleInputChange}
                            placeholder="Số nhà, tên đường, tòa nhà..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors min-h-[100px]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is-default"
                            name="isDefault"
                            checked={formData.isDefault || false}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="is-default" className="text-sm text-gray-600 dark:text-gray-400">
                            Đặt làm địa chỉ giao hàng mặc định
                        </label>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition-all"
                    >
                        {editingAddress ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
                    </button>
                </div>
            </div>
        </div>
    );
}