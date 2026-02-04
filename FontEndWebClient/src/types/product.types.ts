// src/types/product.types.ts
export interface Product {
    id: string;
    name: string;
    sku: string; // Mã sản phẩm
    category: string;
    price: number;
    stock: number;
    unit: string; // kg, bó, thùng
    status: 'active' | 'out_of_stock' | 'draft';
    imageUrl: string;
    lastUpdated: string;
}

// Mock data
export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Cà chua hữu cơ (Organic Tomatoes)',
        sku: 'PRD-2024-001',
        category: 'Rau củ quả',
        price: 25000,
        stock: 150,
        unit: 'kg',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80',
        lastUpdated: '24 Oct, 09:30 AM'
    },
    {
        id: '2',
        name: 'Gạo ST25 (Túi 5kg)',
        sku: 'PRD-2024-002',
        category: 'Lúa gạo',
        price: 180000,
        stock: 0,
        unit: 'túi',
        status: 'out_of_stock',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=100&q=80',
        lastUpdated: '23 Oct, 10:00 AM'
    },
    // ... thêm data khác
];