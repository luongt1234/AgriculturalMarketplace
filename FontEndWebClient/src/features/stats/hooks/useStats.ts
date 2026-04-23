import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/statsApi';

export const useFarmerStats = () => {
    return useQuery({
        queryKey: ['farmerStats'],
        queryFn: () => statsApi.getFarmerStats(),
    });
};

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['adminStats'],
        queryFn: () => statsApi.getAdminStats(),
    });
};
