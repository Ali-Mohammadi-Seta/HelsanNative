import { getUserProfileApi } from "@/services/authServices/authServices";
import { useQuery } from "@tanstack/react-query";
export const useGetUserProfile = ({ enabled = true } = {}) => {
  const {
    data: userProfile,
    isPending: isGettingProfile,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfileApi,
    staleTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });
  return { userProfile, isGettingProfile, refetch };
};
