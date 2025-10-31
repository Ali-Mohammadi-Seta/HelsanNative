// src/lib/hooks/public/useGetDoctorsList.ts
import { useQuery } from '@tanstack/react-query';
import { getDoctorsListApi } from '@/lib/api/apiService';

export const useGetDoctorsList = (filters: {
  LastDegreeField?: string;
  offset: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ['doctorsList', filters],
    queryFn: () => getDoctorsListApi(filters),
    staleTime: 5 * 60 * 1000,
  });
};