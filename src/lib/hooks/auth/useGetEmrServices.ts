// src/lib/hooks/auth/useGetEmrServices.ts
import { getEmrServicesApi } from '@/lib/api/apiService';
import { useQuery } from '@tanstack/react-query';

export const useGetEmrServices = () => {
  const {
    data: userServices,
    isPending: isGettingServices,
    refetch,
  } = useQuery({
    queryKey: ['userEmrServices'],
    queryFn: getEmrServicesApi,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return { userServices, isGettingServices, refetch };
};