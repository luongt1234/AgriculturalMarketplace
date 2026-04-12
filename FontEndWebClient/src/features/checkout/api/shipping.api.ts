import axiosInstance from '../../../lip/axiosInstance';
import type { CartItem, ShippingMethod } from '../../../types/checkout.types';

const resolveGhnServiceList = (response: any): any[] => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.services) return response.services;
    if (response.data) return resolveGhnServiceList(response.data);
    return [];
};

const mapGhnServiceToShippingMethod = (service: any): ShippingMethod => {
    return {
        id: String(service.service_id ?? service.service_type_id ?? service.service_code ?? service.code ?? service.name ?? Math.random()),
        serviceId: Number(service.service_id ?? service.service_type_id ?? service.service_code ?? service.code ?? 2),
        name: service.short_name ?? service.service_name ?? service.name ?? 'GHN',
        description: service.service_name ?? service.short_name ?? service.service_name_en ?? 'Dịch vụ vận chuyển GHN',
        estimatedDays: service.lead_time ? `${service.lead_time} ngày` : service.estimated_days ?? '1-3 ngày',
        baseFee: Number(service.fee ?? service.fees ?? 0) || 0,
        icon: 'local_shipping',
    };
};

const calculateOrderSubtotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const calculateCartWeight = (items: CartItem[]): number => {
    const totalGrams = items.reduce((sum, item) => {
        const quantity = item.quantity || 0;
        const unit = item.unit?.toLowerCase() ?? '';

        if (unit.includes('tấn') || unit.includes('ton')) {
            return sum + quantity * 1_000_000;
        }

        if (unit.includes('kg') || unit.includes('kilogram') || unit.includes('kilo')) {
            return sum + quantity * 1000;
        }

        if (unit.includes('g') && !unit.includes('kg')) {
            return sum + quantity;
        }

        return sum + quantity * 1000;
    }, 0);

    return Math.max(1, Math.round(totalGrams));
};

export const calculateShippingFee = async (
    fromDistrictId: number,
    toDistrictId: number,
    toWardCode: string,
    items: CartItem[],
    serviceId?: number
): Promise<number> => {
    const weight = calculateCartWeight(items);

    const requestBody = {
        FromDistrictId: fromDistrictId,
        ToDistrictId: toDistrictId,
        ToWardCode: toWardCode,
        Weight: weight,
        ServiceId: serviceId ?? 2,
    };

    const response = await axiosInstance.post('/api/shipping/ghn/calculate-fee', requestBody);
    return Number(
        response?.data?.data?.data?.total ??
        response?.data?.data?.total ??
        response?.data?.total ??
        0
    );
};

export const getShippingFeeForDestination = async (
    destinationDistrictId: number,
    destinationWardCode: string,
    items: CartItem[],
    serviceId?: number
): Promise<number> => {
    const fromDistrictId = resolveFromDistrict(items, destinationDistrictId);
    return calculateShippingFee(fromDistrictId, destinationDistrictId, destinationWardCode, items, serviceId);
};

const resolvePackageType = (items: CartItem[]): string => {
    const heavyUnits = ['tấn', 'ton', 'kg', 'kilogram', 'tạ'];
    const hasHeavyProduct = items.some((item) =>
        item.unit?.toLowerCase().split(/\s+/).some((unit) => heavyUnits.includes(unit))
    );

    if (hasHeavyProduct || items.some((item) => item.quantity > 10)) {
        return 'bulk';
    }

    return 'standard';
};

const resolveFromDistrict = (items: CartItem[], defaultDistrictId: number): number => {
    const districtCount = items.reduce<Record<number, number>>((acc, item) => {
        if (typeof item.originDistrictCode === 'number') {
            acc[item.originDistrictCode] = (acc[item.originDistrictCode] ?? 0) + 1;
        }
        return acc;
    }, {});

    const mostCommon = Object.entries(districtCount).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? Number(mostCommon[0]) : defaultDistrictId;
};

export const getAvailableShippingMethods = async (
    destinationDistrictId: number,
    items: CartItem[]
): Promise<ShippingMethod[]> => {
    const fromDistrictId = resolveFromDistrict(items, destinationDistrictId);
    const orderValue = calculateOrderSubtotal(items);
    const packageType = resolvePackageType(items);

    const params = new URLSearchParams({
        fromDistrict: String(fromDistrictId),
        toDistrict: String(destinationDistrictId),
        orderValue: String(orderValue),
        packageType,
    });

    const response = await axiosInstance.get(`/api/shipping/ghn/services?${params.toString()}`);
    const services = resolveGhnServiceList(response);
    return services.map(mapGhnServiceToShippingMethod);
};
