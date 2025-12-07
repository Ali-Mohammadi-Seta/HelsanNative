import { FC, useState } from "react";
import { Form } from "antd";
import { phoneRules2, requiredRules } from "@/utils/rules";
import { useTranslation } from "react-i18next";
import { toEnglishDigits } from "@/utils/toEnglishDigits";
import { Today } from "@/utils/getToday";
import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDirectionInterface } from "@/interfaces/layoutDirectionInterface";
import { setUserRegisterFormValues } from "@/redux/reducers/userReducer/userReducer";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import DatePicker from "@/components/datePicker";
import { convertMiladiToShamsiDate } from "@/utils/convertMiladiToShamsi";
import CustomButton from "@/components/button";
import { toast } from "@/components/toast/toastApi";
interface RegisteringProps {
  onSubmit: (phone: string) => void;
}

interface RegisterFormValues {
  phone: string;
  nationalId: string;
  birthDate: string;
  [key: string]: any;
}

const Register: FC<RegisteringProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isRtl } = useSelector(
    (state: LayoutDirectionInterface) => state.direction
  );

  const onRegister = async (values: RegisterFormValues) => {
    let validatedValues = {
      ...values,
      birthDate: toEnglishDigits(
        convertMiladiToShamsiDate(new Date(values.birthDate as string))
      ),
      phone: values?.phone,
      nationalId: values?.nationalId,
    };
    dispatch(setUserRegisterFormValues(validatedValues));
    setLoading(true);

    const res = await apiServices.post(endpoints.register, validatedValues);
    setLoading(false);
    var errorData = res?.error?.error as { errorCode?: string };
    if (res?.isSuccess) {
      props.onSubmit(values.phone);
      toast.success((res as any)?.messageFa);
      dispatch(setUserRegisterFormValues(validatedValues));
    } else if (res?.error?.statusCode === 404) {
      toast.error(res?.error?.message);
    } else if (
      res?.error?.statusCode == 429 &&
      errorData?.errorCode == "PREVIOUS_OTP_STILL_VALID"
    ) {
      props.onSubmit(values.phone);
      toast.warning((res as any)?.error?.messageFa);
    } else {
      toast.error((res as any)?.error?.messageFa);
    }
  };

  const onRegisterFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const healthMinistryLogin = () => {
    const callbackUrl = import.meta.env.VITE_BEHDASHT_CALLBACK_URL;
    window.open(
      `https://ssocore.behdasht.gov.ir/oauth2/authorize?response_type=code&scope=openid profile&client_id=salamhealth.ir&state=state1&redirect_uri=${callbackUrl}`,
      "_self"
    );
  };

  return (
    <Form
      form={registerForm}
      name="register"
      layout="vertical"
      onFinishFailed={onRegisterFailed}
      onFinish={onRegister}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Form.Item name="phone" rules={[...requiredRules, ...phoneRules2]}>
        <FloatingInput
          size="large"
          label={t("mobileNumber")}
          name="phone"
          type="number"
          className="login-input"
        />
      </Form.Item>
      <Form.Item name="nationalId" rules={[...requiredRules]}>
        <FloatingInput
          className="login-input"
          label={t("nationalId")}
          size="large"
          maxLength={10}
          name="nationalId"
          type="number"
        />
      </Form.Item>
      <Form.Item name="birthDate" rules={[...requiredRules]}>
        <DatePicker
          label={t("birth")}
          //disabled={loading}
          inputClassName="!w-full"
          maxDate={Today}
          className="inputIcon-style w-full"
        />
      </Form.Item>
      {/* <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={requiredRules}
        className="!mb-0"
      >
        <Checkbox className={`!mb-8 text-start`}>
          <a
            className="text-sm text-colorPrimary fm-md font-IRANSans"
            href="/rules"
          >
            {t("CustomerLoginRegister.text1")}{" "}
          </a>
          {t("CustomerLoginRegister.text2")}
        </Checkbox>
      </Form.Item> */}
      <Form.Item className="!mb-0">
        <CustomButton
          size="large"
          type="primary"
          htmlType="submit"
          className="!w-full primary-grd !text-[#fafcfe] shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)]
                    hover:shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:transition-all hover:duration-300"
          loading={loading}
        >
          {t("registering")}
        </CustomButton>
      </Form.Item>
      <div className="my-6 border-b text-center">
        <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
          {t("registeringOtherWays")}
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
export default Register;
