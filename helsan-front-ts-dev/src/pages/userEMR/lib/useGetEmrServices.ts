import { getEmrServicesApi } from "@/services/emrServices";
import { useQuery } from "@tanstack/react-query";

export const useGetEmrServices = () => {
  const { data: userServices, isPending: isGettingServices } = useQuery({
    queryKey: ["userEmrServices"],
    queryFn: getEmrServicesApi,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  return { userServices, isGettingServices };
};
