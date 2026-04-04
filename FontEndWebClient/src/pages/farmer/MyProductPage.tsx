import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSetPageTitle } from '../../hooks/useSetPageTitle';
import type { Product } from '../../types/product.types';
import { ProductFormModal } from '../../features/products/components/ProductFormModal';
import { DeleteProductModal } from '../../features/products/components/DeleteProductModal';
import { getProducts } from '../../features/products/api/product.api';
import { DataTable, type Column } from '../../components/common/DataTable';

export const MyProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // State lưu sản phẩm đang được chọn để sửa (null = chế độ thêm mới)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleOpenCreate = () => {
        setSelectedProduct(null); // Reset về chế độ thêm
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product); // Set chế độ edit cho sản phẩm này
        setIsModalOpen(true);
    };

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSuccess = () => {
        setProductToDelete(null);
        setIsDeleteModalOpen(false);
        loadProducts();
    };

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getProducts({
                pageNumber,
                pageSize,
            });
            setProducts(response.data);
            setPageNumber(response.pageNumber || 1);
            setTotalRecords(response.totalRecords || 0);
        } catch (error) {
            console.error('Lỗi load sản phẩm:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        // Reload danh sách sau khi tạo/sửa thành công
        setPageNumber(1);
        loadProducts();
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

    // Load dữ liệu khi page thay đổi
    useEffect(() => {
        loadProducts();
    }, [pageNumber, pageSize]);

    // Định nghĩa columns cho DataTable
    const columns: Column<Product>[] = useMemo(() => [
        {
            header: 'Sản phẩm',
            key: 'tenHienThi',
            className: 'w-[300px]',
            render: (product) => (
                <div className="flex items-center gap-3">
                    <div
                        className="size-12 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 border border-gray-200 dark:border-gray-700"
                        style={{ backgroundImage: product.hinhAnhUrl ? `url('${product.hinhAnhUrl}')` : undefined }}
                    ></div>
                    <div className="flex flex-col">
                        <span className="font-medium text-[#131613] dark:text-white truncate max-w-[200px]" title={product.tenHienThi}>
                            {product.tenHienThi}
                        </span>
                        <span className="text-xs text-[#6b806c] font-mono mt-0.5">SKU: {product.sku || 'N/A'}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Loại sản phẩm',
            key: 'tenSanPhamChung',
            render: (product) => product.tenSanPhamChung || 'Không xác định',
        },
        {
            header: 'Giá bán',
            key: 'gia',
            className: 'text-right',
            render: (product) => `${product.gia.toLocaleString('vi-VN')} ₫`,
        },
        {
            header: 'Kho hàng',
            key: 'soLuong',
            className: 'text-center',
            render: (product) => (
                <span className={`font-medium ${product.soLuong > 0 ? 'text-[#131613] dark:text-white' : 'text-red-600'}`}>
                    {product.soLuong}
                </span>
            ),
        },
        {
            header: 'Trạng thái',
            key: 'trangThai',
            render: (product) => renderStatusBadge(product.trangThai),
        },
        {
            header: 'Hành động',
            key: 'id',
            className: 'text-right',
            render: (product) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#6b806c] hover:text-primary transition-colors"
                        title="Chỉnh sửa"
                        onClick={() => handleOpenEdit(product)}
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#6b806c] hover:text-red-600 transition-colors"
                        title="Xóa"
                        onClick={() => handleDelete(product)}
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            ),
        },
    ], []);

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'ConHang':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100 gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Đang bán
                    </span>
                );
            case 'HetHang':
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

            <div className="px-6 py-4 bg-white dark:bg-[#1a261c] border-b border-[#e0e2e0] dark:border-[#2f3a30]">
                {/* Search & Filter - TODO: Implement backend support for search/filter */}
            </div>

            <div className="flex-1 overflow-hidden custom-scrollbar bg-white dark:bg-[#1a261c] relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Đang tải...</span>
                        </div>
                    </div>
                )}
                <DataTable<Product>
                    data={products}
                    columns={columns}
                    loading={false}
                    pagination={{
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        total: totalRecords,
                        onPageChange: (page) => setPageNumber(page),
                    }}
                    emptyMessage="Không có sản phẩm nào"
                />
            </div>

            {/* Modals */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                initialData={selectedProduct}
            />
            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSuccess={handleDeleteSuccess}
                product={productToDelete}
            />
        </div>
    );
};