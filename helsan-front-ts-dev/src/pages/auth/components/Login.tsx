import { FC, useState } from "react";
import { Form } from "antd";
import { phoneRules2, requiredRules } from "@/utils/rules";
import { useTranslation } from "react-i18next";
import endpoints from "@/services/endpoints";
import apiServices from "@/services/apiServices";
import { useDispatch } from "react-redux";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import { setUserLoginFormValues } from "@/redux/reducers/userReducer/userReducer";
import { setLoginStep } from "@/redux/reducers/authReducer";
import CustomButton from "@/components/button";
import { toast } from "@/components/toast/toastApi";
// import CaptchaWidget from "@/components/captchaWidgets";

interface LoginFormValues {
  phone: string;
  nationalId: string;
  [key: string]: any;
}
interface LoginProps {
  onSubmit: (phone: string) => void;
}
const Login: FC<LoginProps> = ({ onSubmit }) => {
  const { useForm } = Form;
  const [form] = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  //   const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  //   const [captcha, setCaptcha] = useState<{
  //     svg: ReactNode;
  //     id: string;
  //   }>({ svg: null });
  // const [userCaptchaInput, setUserCaptchaInput] = useState("");

  const healthMinistryLogin = () => {
    const callbackUrl = import.meta.env.VITE_BEHDASHT_CALLBACK_URL;
    window.open(
      `https://ssocore.behdasht.gov.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=salamhealth.ir&state=state1&redirect_uri=${callbackUrl}`,
      "_self"
    );
  };

  const onLogin = async (values: LoginFormValues) => {
    // if (isProd) await recaptchaRef.current.executeAsync();
    let validatedValues = {
      phone: values.phone,
      nationalId: values.nationalId,
    };
    setLoading(true);
    const result = await apiServices.post(endpoints.login, validatedValues);
    setLoading(false);

    // const callBackLogin = (data) => {
    //   if (data?.role === rolesList.doctor) {
    //       history.push(kartablPagePath);
    //   } else if (data?.role === 'admin') {
    //       history.push(adminDashboardPagePath);
    //   } else if (data?.role === 'clinicAdmin') {
    //       history.push(clinicAdminPagePath);
    //   } else if (data?.role === 'paraclinicadmin') {
    //       history.push(personalPagePath);
    //   } else {
    //       history.push(panelPagePath);
    //   }
    // };

    if (result.isSuccess) {
      // dispatch(login(result.data));
      //   dispatch(getUserProfile({ callBackLogin }));
      //   setLoginError({});
      // } else {
      //   newCaptcha();
      // }
      dispatch(setUserLoginFormValues(validatedValues));
      dispatch(setLoginStep("loginVerification")); // این خط اضافه شده
      toast.success((result.data as any)?.messageFa);
      onSubmit(values.phone);
    } else if (result?.error?.error?.errorCode === "PREVIOUS_OTP_STILL_VALID") {
      dispatch(setUserLoginFormValues(validatedValues));
      dispatch(setLoginStep("loginVerification")); // این خط اضافه شده برای همسانی
      onSubmit(values.phone);
      toast.error((result.error as any)?.messageFa);
    } else {
      toast.error((result.error as any)?.messageFa);
    }
  };
  //   const newCaptcha = async () => {
  //     setLoadingCaptcha(true);
  //     setUserCaptchaInput("");
  //     const result = await apiCall.get(endpoints.getCaptcha);
  //     setLoadingCaptcha(false);
  //     if (result.isSuccess) {
  //       setCaptcha(result?.data?.data);
  //     } else {
  //       setCaptcha("");
  //     }
  //   };

  //   useEffect(() => {
  //     //first time render
  //     newCaptcha();

  //     //new captcha on time intervals
  //     const intervalId = setInterval(() => {
  //       newCaptcha();
  //     }, 180000); // 180 seconds = 3 minutes

  //     return () => clearInterval(intervalId); // clean up interval on unmount
  //   }, []);

  return (
    <Form name="login" layout="vertical" onFinish={onLogin} form={form}>
      <Form.Item
        name="phone"
        // help={loginError.phone}
        // validateStatus={loginError.phone ? "error" : null}
        rules={[...requiredRules, ...phoneRules2]}
      >
        <FloatingInput
          size="large"
          label={t("mobileNumber")}
          name="phone"
          type="number"
          className="login-input"
          placeholder="*********09"
          // maxLength={11}
        />
      </Form.Item>
      <Form.Item name="nationalId" rules={[...requiredRules]}>
        <FloatingInput
          className="login-input"
          label={t("nationalId")}
          size="large"
          type="number"
          maxLength={10}
          name="nationalId"
        />
      </Form.Item>
      {/* <CaptchaWidget
        // captcha={captcha}
        // captchaLoading={loadingCaptcha}
        // inputValue={userCaptchaInput}
        // setInputValue={setUserCaptchaInput}
        // onRefresh={newCaptcha}
        // form={form}
      // /> */}
      <Form.Item className="!mb-0">
        <CustomButton
          size="large"
          type="primary"
          htmlType="submit"
          className="!w-full !bg-colorPrimary !mt-4  !text-[#fafcfe] shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)]
                    hover:shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:transition-all hover:duration-300"
          loading={loading}
        >
          {t("accountLogin")}
        </CustomButton>
      </Form.Item>
      <div className="my-6 border-b text-center">
        <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
          {t("loginOtherWays")}
        </div>
      </div>
      <CustomButton
        size="large"
        type="primary"
        variant="link"
        onClick={healthMinistryLogin}
        className="!w-full !text-xs xs:!text-base px-2 py-2 mt-4 bg-colorPrimary !primary-grd shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)] primary-grd !text-colorPrimary !border !p-4 !border-colorPrimary
                    hover:!shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:!transition-all hover:!duration-300 transition-all !duration-300 !text-center !whitespace-normal !break-words"
        disabled={loading}
      >
        {t("healthMinistry")}
      </CustomButton>
    </Form>
  );
};
export default Login;
