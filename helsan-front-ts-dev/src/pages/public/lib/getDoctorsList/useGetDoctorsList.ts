import { getDoctorsListApi } from "@/services/publicServices";
import { useQuery } from "@tanstack/react-query";

export const useGetDoctorsList = (offset: number, limit: number) => {
  const filters = {
    offset,
    limit: limit || 10,
  };
  const { data: doctorsList, isPending: isGettingList } = useQuery({
    queryKey: ["doctorsList", offset],
    queryFn: async () => getDoctorsListApi(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return { doctorsList, isGettingList };
};
