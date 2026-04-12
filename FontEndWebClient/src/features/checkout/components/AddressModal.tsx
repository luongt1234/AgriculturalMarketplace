import { useState } from 'react';
import type { DeliveryAddress } from '../../../types/checkout.types';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: DeliveryAddress) => void;
    editingAddress?: DeliveryAddress | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingAddress
}) => {
    const [formData, setFormData] = useState<Partial<DeliveryAddress>>(
        editingAddress || {
            fullName: '',
            phone: '',
            city: '',
            district: '',
            ward: '',
            detailedAddress: '',
            label: 'home',
            isDefault: false,
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSave = () => {
        if (!formData.fullName || !formData.phone || !formData.city || !formData.detailedAddress) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }

        const address: DeliveryAddress = {
            id: editingAddress?.id || `addr_${Date.now()}`,
            fullName: formData.fullName,
            phone: formData.phone,
            city: formData.city,
            district: formData.district || '',
            ward: formData.ward || '',
            detailedAddress: formData.detailedAddress,
            label: (formData.label as any) || 'home',
            isDefault: formData.isDefault || false,
        };

        onSave(address);
        setFormData({
            fullName: '',
            phone: '',
            city: '',
            district: '',
            ward: '',
            detailedAddress: '',
            label: 'home',
            isDefault: false,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-background-light dark:bg-background-dark bg-surface-light dark:bg-surface-dark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10">
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
                            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Tỉnh/Thành phố <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="city"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            >
                                <option value="">Chọn tỉnh/thành</option>
                                <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                                <option value="Ha Noi">Ha Noi</option>
                                <option value="Da Nang">Da Nang</option>
                                <option value="Can Tho">Can Tho</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="district" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Quận/Huyện
                            </label>
                            <input
                                type="text"
                                id="district"
                                name="district"
                                value={formData.district || ''}
                                onChange={handleInputChange}
                                placeholder="vd: Quận 1"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="ward" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Phường/Xã
                            </label>
                            <input
                                type="text"
                                id="ward"
                                name="ward"
                                value={formData.ward || ''}
                                onChange={handleInputChange}
                                placeholder="vd: Phường Bến Nghé"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            />
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

                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
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
