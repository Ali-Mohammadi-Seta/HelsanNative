import apiServices from "@/services/apiServices";
import { setIsLoggedIn, setUserRole } from "../reducers/authReducer";
import endpoints from "@/services/endpoints";
import { setProfileLoading } from "../reducers/userReducer/userReducer";
import { AppDispatch } from "../store";

export const getUserProfile = () => async (dispatch: AppDispatch) => {
  dispatch(setProfileLoading(true));
  const result = await apiServices.get(endpoints.checkAuthorize);
  if (result.isSuccess) {
    dispatch(setIsLoggedIn(result?.data?.data?.isLogin));
    dispatch(setUserRole(result?.data?.data?.roles?.ourRoles));
  }
  dispatch(setProfileLoading(false));
};
