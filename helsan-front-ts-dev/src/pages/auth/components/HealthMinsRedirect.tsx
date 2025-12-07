import { FC, useEffect } from "react";
import { useLocation, Navigate } from "react-router";
// import { useDispatch } from "react-redux";
import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { homePagePath } from "@/routes/pathRoutes";
import { toast } from "@/components/toast/toastApi";

const HealthMinsRedirect: FC = () => {
  console.log("hiiiiiiiiiiiiiiiiiiiii");
  // const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const code = queryParams.get("code");

  useEffect(() => {
    const sendHealthMinsCode = async () => {
      if (code) {
        const res = await apiServices.post(endpoints.healthGovRegister, {
          code,
        });
        if (res.isSuccess) {
          toast.success((res.data as any)?.messageFa);
        } else {
          toast.error((res.error as any)?.messageFa);
        }
      }
    };

    sendHealthMinsCode();
  }, [code]);

  return <Navigate to={homePagePath} replace />;
};

export default HealthMinsRedirect;
