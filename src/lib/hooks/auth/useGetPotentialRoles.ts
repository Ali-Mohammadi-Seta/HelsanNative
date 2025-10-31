// src/lib/hooks/panel/useGetPotentialRoles.ts
import { useQuery } from '@tanstack/react-query';
import { getPotentialRolesApi } from '@/lib/api/apiService';

export const useGetPotentialRoles = () => {
  return useQuery({
    queryKey: ['potentialRoles'],
    queryFn: getPotentialRolesApi,
    staleTime: 10 * 60 * 1000,
  });
};