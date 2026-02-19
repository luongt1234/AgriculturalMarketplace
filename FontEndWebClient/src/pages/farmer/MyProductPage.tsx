import React, { useMemo, useState } from 'react';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import { MOCK_PRODUCTS, type Product } from '../../types/product.types';
import { ProductFormModal } from '../../features/products/components/ProductFormModal';

export const MyProductPage = () => {
    const [products] = useState<Product[]>(MOCK_PRODUCTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State lưu sản phẩm đang được chọn để sửa (null = chế độ thêm mới)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleOpenCreate = () => {
        setSelectedProduct(null); // Reset về chế độ thêm
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product); // Set chế độ edit cho sản phẩm này
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        console.log("Reloading data...");
        // TODO: Fetch lại list products
    };

    const headerAction = useMemo(() => (
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-11 px-5 rounded-lg border border-[#dee3de] dark:border-[#2f3a30] bg-white dark:bg-[#1e2a1f] text-[#131613] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2f3a30] font-medium transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">file_upload</span>
                <span>Xuất file</span>
            </button>
            <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-white hover:bg-[#246328] font-bold transition-colors shadow-sm"
            >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Thêm mới</span>
            </button>
        </div>
    ), []);

    useSetPageTitle('Quản lý Nông sản', headerAction);

    const renderStatusBadge = (status: Product['status']) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100 gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Đang bán
                    </span>
                );
            case 'out_of_stock':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100 gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        Hết hàng
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        Nháp
                    </span>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark rounded-xl overflow-hidden border border-[#e0e2e0] dark:border-[#2f3a30] shadow-sm">

            <div className="px-6 py-4 bg-white dark:bg-[#1a261c] border-b border-[#e0e2e0] dark:border-[#2f3a30] flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-96">
                    <label className="flex items-center h-10 w-full rounded-lg bg-[#f1f3f1] dark:bg-[#253326] overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                        <div className="flex items-center justify-center pl-3 pr-2">
                            <span className="material-symbols-outlined text-[#6b806c]" style={{ fontSize: '20px' }}>search</span>
                        </div>
                        <input
                            className="w-full bg-transparent border-none text-[#131613] dark:text-white placeholder:text-[#6b806c] text-sm focus:outline-none focus:ring-0 h-full"
                            placeholder="Tìm kiếm theo tên, mã SKU..."
                        />
                    </label>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] px-3 hover:bg-[#f1f3f1] dark:hover:bg-[#253326] transition-colors">
                        <span className="text-[#131613] dark:text-gray-300 text-sm font-medium">Danh mục</span>
                        <span className="material-symbols-outlined text-[#6b806c]" style={{ fontSize: '18px' }}>keyboard_arrow_down</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] px-3 hover:bg-[#f1f3f1] dark:hover:bg-[#253326] transition-colors">
                        <span className="text-[#131613] dark:text-gray-300 text-sm font-medium">Trạng thái</span>
                        <span className="material-symbols-outlined text-[#6b806c]" style={{ fontSize: '18px' }}>filter_list</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#1a261c]">
                <table className="w-full text-left text-sm min-w-[1000px]">
                    <thead className="bg-[#f9faf9] dark:bg-[#1f2d21] border-b border-[#e0e2e0] dark:border-[#2f3a30] sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 w-14 text-center">
                                <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer" type="checkbox" />
                            </th>
                            <th className="px-4 py-4 font-semibold text-[#6b806c] dark:text-gray-400 uppercase text-xs tracking-wider w-[300px]">Sản phẩm</th>
                            <th className="px-4 py-4 font-semibold text-[#6b806c] dark:text-gray-400 uppercase text-xs tracking-wider">Danh mục</th>
                            <th className="px-4 py-4 font-semibold text-[#6b806c] dark:text-gray-400 uppercase text-xs tracking-wider text-right">Giá bán</th>
                            <th className="px-4 py-4 font-semibold text-[#6b806c] dark:text-gray-400 uppercase text-xs tracking-wider text-center">Kho hàng</th>
                            <th className="px-4 py-4 font-semibold text-[#6b806c] dark:text-gray-400 uppercase text-xs tracking-wider">Trạng thái</th>
                            <th className="px-4 py-4 font-semibold text-[#6b806c] dark:text-gray-400 uppercase text-xs tracking-wider text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e2e0] dark:divide-[#2f3a30]">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-[#f9faf9] dark:hover:bg-[#1e2a1f] transition-colors group">
                                <td className="px-6 py-4 text-center">
                                    <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer" type="checkbox" />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="size-12 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 border border-gray-200 dark:border-gray-700"
                                            style={{ backgroundImage: `url('${product.imageUrl}')` }}
                                        ></div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#131613] dark:text-white text-base truncate max-w-[200px]" title={product.name}>
                                                {product.name}
                                            </span>
                                            <span className="text-xs text-[#6b806c] font-mono mt-0.5">SKU: {product.sku}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-[#131613] dark:text-gray-300">
                                    {product.category}
                                </td>
                                <td className="px-4 py-4 text-right font-medium text-[#131613] dark:text-white">
                                    {product.price.toLocaleString('vi-VN')} ₫ <span className="text-xs text-[#6b806c] font-normal">/ {product.unit}</span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className={`font-medium ${product.stock > 0 ? 'text-[#131613] dark:text-white' : 'text-red-600'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {renderStatusBadge(product.status)}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#6b806c] hover:text-primary transition-colors"
                                            title="Chỉnh sửa"
                                            onClick={() => handleOpenEdit(product)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#6b806c] hover:text-red-600 transition-colors" title="Xóa">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 border-t border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] flex items-center justify-between shrink-0">
                <span className="text-sm text-[#6b806c]">Hiển thị 1-7 của 45 sản phẩm</span>
                <div className="flex items-center rounded-lg border border-[#e0e2e0] dark:border-[#2f3a30] bg-white dark:bg-[#1a261c] p-0.5">
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-50" disabled>
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-[#131613] dark:text-gray-200">
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Modal */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                initialData={selectedProduct}
            />
        </div>
    );
};