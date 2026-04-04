export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    href?: string;
}

export interface FlashDeal {
    id: string;
    title: string;
    discount: number;
    endTime: string;
}

export interface BuyerProduct {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    rating: number;
    location: string;
    seller: string;
    unit: string;
    category: string;
}
