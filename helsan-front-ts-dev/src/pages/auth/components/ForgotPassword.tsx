import { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { mobileRules, requiredRules } from "@/utils/rules";
import apiCall from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { toEnglishDigits } from "@/utils/toEnglishDigits";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import CustomButton from "@/components/button";

interface ForgotPasswordProps {
  onChallengeReceived: (challenge: string, phone: string) => void;
}

interface ForgotPasswordFormValues {
  phone: string;
}

const ForgotPassword: FC<ForgotPasswordProps> = () => {
  const [error] = useState<Record<string, string>>({});
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const requestChangePassword = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    // Pass the RegisterResponse type as a generic parameter
    const response = await apiCall.get(endpoints.changePassword1, {
      phone: toEnglishDigits(values.phone),
    });
    setLoading(false);
    if (response?.isSuccess) {
      // Now TypeScript recognizes that response.data.challenge exists.
      //   props.onChallengeReceived(response.data?.challenge, values.phone);
    }
  };

  return (
    <Form
      className="forgot-password-content"
      onFinish={requestChangePassword}
      layout="vertical"
    >
      <p className="text-sm text-colorSecondary mt-[2px] mb-4 fm-rg font-IRANSans">
        {t("reminderInstruction")}
      </p>
      <Form.Item
        name="phone"
        help={error.phone}
        rules={[...mobileRules, ...requiredRules]}
        className="!mb-0"
      >
        <FloatingInput
          name="phone"
          label={t("mobileNumber")}
          className="login-input"
          type="tel"
        />
      </Form.Item>
      <CustomButton
        size="large"
        type="primary"
        htmlType="submit"
        loading={loading}
        className="!w-full primary-grd !text-[#fafcfe] shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)] !bg-primary-gradient
                hover:shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:transition-all hover:duration-300"
      >
        {t("passwordReminder")}
      </CustomButton>
    </Form>
  );
};

export default ForgotPassword;
