import { Form } from "antd";
import { useTranslation } from "react-i18next";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import CustomButton from "@/components/button";
// import apiCall from '@/services/apiServices';
// import endpoints from '@/services/endpoints';

export const ResetPassword = () => {
  const { t } = useTranslation();

  // const changePassword = async (values) => {
  //     const response = await apiCall.post(endpoints.changePassword1, {
  //         challenge: props.challenge,
  //         newPassword: values.password,
  //         code: props.verifyCode,
  //         phone: props.phone,
  //     });

  //     if (response.isSuccess) {
  //         toast.success(response?.data?.message);
  //         props.onPasswordChanged();
  //     }
  // };

  return (
    <Form
      className="reset-password-content"
      layout="vertical"
      // onFinish={changePassword}
    >
      <p className="text-sm text-colorSecondary mt-[2px] mb-4 fm-rg font-IRANSans">
        {t("newPass")}
      </p>
      <div className="relative">
        <Form.Item className="!mb-0" name="password">
          <FloatingInput
            size="large"
            type="password"
            label={t("user.password")}
            placeholder={t("error.passwordError")}
            className="login-input password-input"
          />
        </Form.Item>
      </div>

      <CustomButton
        size="large"
        type="primary"
        htmlType="submit"
        className="!w-full primary-grd !text-[#fafcfe] shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)] !bg-primary-gradient
                hover:shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:transition-all hover:duration-300"
      >
        {t("changePass")}
      </CustomButton>
    </Form>
  );
};

export default ResetPassword;
