import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";

//user profile
export const getUserProfileApi = async () => {
  const result = await apiServices.get(endpoints.userProfileInfo);
  return result.data?.data;
};
