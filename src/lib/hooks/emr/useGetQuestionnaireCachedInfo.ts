import { useQuery } from '@tanstack/react-query';
import { getQuestionnaireCachedInfoApi } from '@/lib/api/apiService';

export const useGetQuestionnaireCachedInfo = () => {
  const { data: cachedInfo, isPending: isGettingCachedInfo } = useQuery({
    queryKey: ['questionnaireCachedInfo'],
    queryFn: getQuestionnaireCachedInfoApi,
    staleTime: 5 * 60 * 1000,
  });
  return { cachedInfo, isGettingCachedInfo };
};