// src/lib/hooks/panel/useGetUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import { getUserProfileApi } from '@/lib/api/apiService';

export const useGetUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfileApi,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};