import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { setIsLoggedIn, setUserRole } from "@/redux/reducers/authReducer";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const checkAuthorize = async () => {
    const result = await apiServices.get(endpoints.checkAuthorize);
    if (result.isSuccess) {
      dispatch(setIsLoggedIn(result?.data?.data?.isLogin));
      dispatch(setUserRole(result?.data?.data?.roles?.ourRoles));
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthorize();
  }, []);

  return { loading, checkAuthorize };
};
