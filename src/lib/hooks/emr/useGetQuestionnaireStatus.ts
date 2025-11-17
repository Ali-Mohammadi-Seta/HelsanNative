import { useQuery } from '@tanstack/react-query';
import { getQuestionnaireStatusApi } from '@/lib/api/apiService';

export const useGetQuestionnaireStatus = () => {
  const { data: questionnaireStatus, isPending: isLoading } = useQuery({
    queryKey: ['questionnaireStatus'],
    queryFn: getQuestionnaireStatusApi,
    staleTime: 5 * 60 * 1000,
  });
  return { questionnaireStatus, isLoading };
};