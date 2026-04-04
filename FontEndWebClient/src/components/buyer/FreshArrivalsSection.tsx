import React from 'react';
import { ProductCard } from '../../features/products/components/ProductCard';
import type { BuyerProduct } from '../../types/buyer.types';

interface FreshArrivalsSectionProps {
    products?: BuyerProduct[];
    onAddToCart?: (product: BuyerProduct) => void;
    title?: string;
}

// Mock data for fresh arrivals
const FRESH_ARRIVALS_PRODUCTS: BuyerProduct[] = [
    {
        id: 'fa1',
        name: 'ST25 Rice Premium',
        price: 180000,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB2wANe1QNeMzAamGgBAMhXulLUWgCTrgy2kcGuXiV0uQ3BRtXr_-C6nbatijkPrNPU7z43LRYelo_87IudL160IO32piWvCuBVwVn5yVNr_NEr9HUa1gfbx2HZhY6RGHnnM65f-gBVQDIxoSnZOIj-G7ZOtUl6FCZAXjH6ucfK92K-jWe-Bw6q61al0zsxiGdN4XbqX0-cZeh-gACNlml15pl2D0SrglGVEZcHI79GkCmoF424gGH-Ri5lAqWIU1uzo-Fp6pNrdA',
        rating: 4.9,
        location: 'Soc Trang, Vietnam',
        seller: 'Soc Trang Farm',
        unit: '/5kg',
        category: 'Grain'
    },
    {
        id: 'fa2',
        name: 'Dak Lak Avocado',
        price: 45000,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBuegCBpj0GzCQ3X6Wq5dT9o3e8qrtux9AEW93xJipxd9EWqXtzXfdZu-jf0ZSj2HbsrMd34hhvCzyJe_HY65EcMB4TB9UpSTCAHWq1FleLVf3cP3s6xL9kvp6HRDpZ6O4f_fDcAXK5JIkEylEhx4yyLO6edmnKRXOEWb3mpohJpgS3mEwr0E4bK70xr-zwipZcPxLa3j2HGUYUKZpEkWFlOXjV7EkP7c2z27aVtMkBXP-LiCJClbaXHlHGIrFXPa1AeE1jcacVKg',
        rating: 4.8,
        location: 'Dak Lak, Vietnam',
        seller: 'Dak Lak Farm',
        unit: '/kg',
        category: 'Fruit'
    },
    {
        id: 'fa3',
        name: 'Baby Broccoli',
        price: 32000,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDVgAB2_OTZqrlHduUr2zsOu26D95CpddAfmbjZWkFpAKvO46fcEoT1o7l_O_fKA4AHQQme4UHfN-VGqT-iKlRqQmzCz-EiTswP77KCG0tm6ZZdv5h6B9b4bzb7gwZHdcYulSZquygo-g_M145cW6OoI5z2yBzTjlKCIZeIJlW_bVgC6GcWpz2Mio-AH9s3Xohy3A2Qes5BbdkeKY6yeLc6pgdRDliSEpokBvJ_YBdwvPHa9bQSQ3-vEuFpLNXypv5--fW2mnPUuQ',
        rating: 4.7,
        location: 'Da Lat, Lam Dong',
        seller: 'Da Lat Farm',
        unit: '/kg',
        category: 'Vegetable'
    },
    {
        id: 'fa4',
        name: 'Hoa Loc Mango',
        price: 65000,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCx013GxB42lOso-B4O1chB9rRyeLgVgTek7JGGqtI8QeSILEZdkGUkMO1m4wlp4hSap3PSELhJSdF-67RQRrrxEQeEKFbW0aIj07ObpDg_Ndnk62fsnsBM24h24p8SMFhhCLyoaAfcsxstjWm5fQQ0Qo14Zp6le5BHFs8AmqSQAWRmP_5y_k3nBBRgHbi8aKi0ypoduTGl_aIRMc5ACuVnVximQly2fF4ULa9_-5sTHknesbe7iq5GnwuEXOK98ekmqKbzl-oo-g',
        rating: 4.9,
        location: 'Tien Giang, Vietnam',
        seller: 'Tien Giang Farm',
        unit: '/kg',
        category: 'Fruit'
    },
    {
        id: 'fa5',
        name: 'Organic Spinach',
        price: 15000,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCXm-67BZHTLs5LOzFK642R-kFPE-rS8SIZ6ZHWWVzen_eFc2aykDL_yjmfmKf73JlcGlNggOSQHUIoExujYBf_PzjzZVBWMO1GAJWiYPCJ16lYKVID8vrREGmE8HHTey6mm_4xlYQM76yyMBIGQ0QhqXDTXnaDiGCvELF5FDLLwCyGUQBXaNxLiQn03E0-YHy3yp8MzkzKTdYaZJ5X8zHtWieMUnFlVo-DCuvX1_5TZVLnzlYDSQeQA58t4YPbzwIEZ8x8lL0Z0g',
        rating: 4.6,
        location: 'Local Hydroponic Farm',
        seller: 'Hydroponic Farm',
        unit: '/300g',
        category: 'Vegetable'
    }
];

export const FreshArrivalsSection: React.FC<FreshArrivalsSectionProps> = ({
    products = FRESH_ARRIVALS_PRODUCTS,
    onAddToCart,
    title = 'Fresh Arrivals'
}) => {
    return (
        <section className="pb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        variant="compact"
                        onAddToCart={onAddToCart}
                        showDiscount={false}
                    />
                ))}
            </div>
        </section>
    );
};
