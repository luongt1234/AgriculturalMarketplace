import { useState } from 'react';
import type { DeliveryAddress } from '../../types/checkout.types';

interface AddressStepProps {
    addresses: DeliveryAddress[];
    selectedAddress: DeliveryAddress | null;
    onSelectAddress: (address: DeliveryAddress) => void;
    onAddNew: () => void;
    onEdit: (address: DeliveryAddress) => void;
    onDelete: (id: string) => void;
}

export function AddressStep({
    addresses,
    selectedAddress,
    onSelectAddress,
    onAddNew,
    onEdit,
    onDelete,
}: AddressStepProps) {
    return (
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-primary/10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">
                            1
                        </span>
                        Chọn địa chỉ giao hàng
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 ml-11">
                        Chọn nơi bạn muốn nhận sản phẩm tươi ngon
                    </p>
                </div>
                <button
                    onClick={onAddNew}
                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">add_location_alt</span>
                    Thêm địa chỉ mới
                </button>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2">
                {addresses.map((address) => (
                    <label key={address.id} className="relative cursor-pointer group">
                        <input
                            type="radio"
                            name="address"
                            checked={selectedAddress?.id === address.id}
                            onChange={() => onSelectAddress(address)}
                            className="peer sr-only"
                        />
                        <div className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:bg-green-50/30 dark:peer-checked:bg-green-900/10 transition-all hover:border-primary/50">
                            <div className="flex justify-between items-start mb-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                                    {address.label || 'Địa chỉ'}
                                </span>
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-colors">
                                    <div className="hidden peer-checked:block w-2.5 h-2.5 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                {address.fullName}
                            </h3>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-gray-400">call</span>
                                {address.phone}
                            </p>
                            <div className="flex gap-2">
                                <span className="material-symbols-outlined text-gray-400 text-sm flex-shrink-0 mt-0.5">
                                    location_on
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {address.detailedAddress}
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                                <button
                                    onClick={() => onEdit(address)}
                                    className="text-xs font-bold text-gray-500 hover:text-primary transition-colors"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => onDelete(address.id)}
                                    className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </section>
    );
}
