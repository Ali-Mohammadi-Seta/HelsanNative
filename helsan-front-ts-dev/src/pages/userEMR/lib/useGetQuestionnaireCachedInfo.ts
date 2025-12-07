import { getQuestionnaireCachedInfoApi } from "@/services/emrServices";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestionnaireCachedInfo = () => {
  const { data: cachedInfo, isPending: isGettingCachedInfo } = useQuery({
    queryKey: ["questionnaireCachedInfo"],
    queryFn: getQuestionnaireCachedInfoApi,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  return { cachedInfo, isGettingCachedInfo };
};
