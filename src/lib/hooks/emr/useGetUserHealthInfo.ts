import { useQuery } from '@tanstack/react-query';
import { getUserHealthInfoApi } from '@/lib/api/apiService';

export const useGetUserHealthInfo = () => {
  const { data: userHealthInfo, isPending: isLoading } = useQuery({
    queryKey: ['userHealthInfo'],
    queryFn: getUserHealthInfoApi,
    staleTime: 5 * 60 * 1000,
  });
  return { userHealthInfo, isLoading };
};