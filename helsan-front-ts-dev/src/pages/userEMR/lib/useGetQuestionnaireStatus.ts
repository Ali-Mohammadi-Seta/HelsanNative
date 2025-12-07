import { getQuestionnaireStatusApi } from "@/services/emrServices";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestionnaireStatus = () => {
  const { data: questionnaireStatus, isPending: isLoading } = useQuery({
    queryKey: ["questionnaireStatus"],
    queryFn: getQuestionnaireStatusApi,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  return { questionnaireStatus, isLoading };
};
