import { getPotentialRolesApi } from "@/services/profileServices";
import { useQuery } from "@tanstack/react-query";

export const useGetPotentialRoles = () => {
  const { data: rolesList, isPending: isGettingRoles } = useQuery({
    queryKey: ["potentialRoles"],
    queryFn: getPotentialRolesApi,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  return { rolesList, isGettingRoles };
};
