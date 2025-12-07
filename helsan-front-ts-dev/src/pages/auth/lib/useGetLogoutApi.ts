import { useMutation } from "@tanstack/react-query";
import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await apiServices.get(endpoints.logout);
      return result;
    },
  });
};
