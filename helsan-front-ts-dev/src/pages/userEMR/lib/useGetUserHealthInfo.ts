import { getUserHealthInfoApi } from "@/services/emrServices";
import { useQuery } from "@tanstack/react-query";

export const useGetUserHealthInfo = () => {
  const { data: userHealthInfo, isPending: isLoading } = useQuery({
    queryKey: ["userHealthInfo"],
    queryFn: getUserHealthInfoApi,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  return { userHealthInfo, isLoading };
};
