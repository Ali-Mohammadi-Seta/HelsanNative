import apiServices from "../apiServices";
import endpoints from "../endpoints";
//get doctors list
export const getDoctorsListApi = async (filters: {
  LastDegreeField?: string;
  offset: number;
  limit: number;
}) => {
  const result = await apiServices.get(endpoints.getDoctorsList, filters);
  return result?.data?.data;
};
