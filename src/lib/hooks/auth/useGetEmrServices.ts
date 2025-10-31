// src/lib/hooks/emr/useGetEmrServices.ts
import { useQuery } from '@tanstack/react-query';
import { getEmrServicesApi } from '@/lib/api/apiService';

export const useGetEmrServices = () => {
  return useQuery({
    queryKey: ['userEmrServices'],
    queryFn: getEmrServicesApi,
  });
};