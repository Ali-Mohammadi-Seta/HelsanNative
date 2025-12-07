import React, { useState, useRef, useEffect } from "react";
import { Form,   Input } from "antd";
import { AiOutlineEdit, AiOutlineRedo } from "react-icons/ai";
import apiCall from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { useTranslation } from "react-i18next";
import { toEnglishDigits } from "@/utils/toEnglishDigits";
import { useDispatch, useSelector } from "react-redux";
import { toPersianDigits } from "@/utils/antdPagination";
import ChooseCurrentRole from "./ChooseCurrentRole";
// import { getUserProfile } from "@/redux/middlewares/getUserProfile";
import type { AppDispatch } from "@/redux/store";
import { setIsLoggedIn, setUserRole } from "@/redux/reducers/authReducer";
import CustomButton from "@/components/button";
import { Modal } from "@/components/modal/Modal";
import { toast } from "@/components/toast/toastApi";
interface VerificationProps {
  phone: string;
  expiration?: number;
  onSubmit: (phone: string) => void;
  onVerified: () => void;
  onPhoneEdit: () => void;
}

// Ref interface for the ReactCodeInput component.
interface CodeInputRef {
  state: {
    values: string[];
  };
}

// Define the shape of registration form values from Redux.
interface UserRegisterFormValues {
  phone: string;
  role: string;
  // Add additional fields if needed.
}

interface UserState {
  userRegisterFormValues: UserRegisterFormValues;
}

interface RootState {
  user: UserState;
}

const Verification: React.FC<VerificationProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const codeRef = useRef<CodeInputRef | null>(null);
  const [verifyCode, setVerifyCode] = useState<string | null>(null);
  const [expiration, setExpiration] = useState<number>(60);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showChooseRoleModal, setShowChooseRoleModal] =
    useState<boolean>(false);
  const { userRegisterFormValues } = useSelector(
    (state: RootState) => state.user
  );

  // Resets the code input fields.
  const inputResetHandler = (): void => {
    if (codeRef.current) {
      const { values } = codeRef.current.state;
      for (let i = 0; i < values.length; i++) {
        values[i] = "";
      }
    }
  };

  const showRolesModal = (): void => {
    setShowChooseRoleModal(true);
  };

  // Countdown for expiration timer.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (expiration > 0) {
        setExpiration((prev) => prev - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [expiration]);

  // Resend code using the register endpoint.
  const resendCode = async (): Promise<void> => {
    setLoading(true);
    const res = await apiCall.post(endpoints.register, {
      ...userRegisterFormValues,
    });
    if (res.isSuccess) {
      setExpiration(60);
      props.onSubmit(userRegisterFormValues.phone); // Correct type
    } else {
      inputResetHandler();
    }
    setLoading(false);
  };

  // Verifies the entered code using the verifyRegister endpoint.
  const onVerifyRegister = async (code: string): Promise<void> => {
    const body: { otpValue: string } = {
      otpValue: code,
    };
    setLoading(true);
    const res = await apiCall.post(endpoints.verifyRegister, body);
    setLoading(false);
    if (res?.isSuccess) {
      const result = await apiCall.get(endpoints.checkAuthorize);
      if (result.isSuccess) {
        dispatch(setIsLoggedIn(result?.data?.data?.isLogin));
        dispatch(setUserRole(result?.data?.data?.roles?.ourRoles));
        showRolesModal();
      }
      toast.success(res.data?.messageFa);
      // setTimeout(() => props.onVerified(), 2000);
      setVerifyCode(null);
    } else {
      toast.error((res.error as any)?.messageFa);
    }
  };

  const handleOtpChange = (text: string) => {
    setCode(text);

    if (text.length === 6) {
      const englishValue = toEnglishDigits(text);
      onVerifyRegister(englishValue);
    }
  };

  return (
    <div className="verificaton-content">
      <p className="text-sm text-colorSecondary mt-[2px] mb-4 fm-rg font-IRANSans">
        {t("resetText2")}
        <span className="text-colorPrimary">
          {" "}
          {toPersianDigits(props.phone)}{" "}
        </span>
        {t("resetText3")}
      </p>
      <Form
        name="verify"
        // When the form is submitted (via the submit button), call onVerifyRegister
        // if verifyCode exists.
        onFinish={() => {
          if (verifyCode) {
            onVerifyRegister(verifyCode);
          }
        }}
        layout="vertical"
      >
        <div className="flex justify-center my-4">
          {/* ✅ FIX 3: Use the new handler and make it a controlled component with the `value` prop. */}
          <Input.OTP
            length={6}
            value={code}
            onChange={handleOtpChange}
            autoFocus
            disabled={loading}
            style={{ direction: "ltr" }}
          />
        </div>
        <Form.Item className="!mb-0">
          <CustomButton
            size="large"
            type="primary"
            htmlType="submit"
            className="!w-full primary-grd !text-[#fafcfe] shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)] !bg-primary-gradient
                        hover:shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:transition-all hover:duration-300"
            loading={loading}
            disabled={!!verifyCode}
          >
            {t("verifyCode")}
          </CustomButton>
        </Form.Item>
      </Form>
      {expiration !== 0 ? (
        <span className="flex items-center justify-center mt-4 mb-6">
          {t("resetText")} &nbsp;
          <span className="text-colorPrimary">
            {toPersianDigits(expiration)}
          </span>
          &nbsp; {t("second")}
        </span>
      ) : (
        <div
          className="flex items-center justify-center mt-4 mb-6 cursor-pointer font-bold text-colorPrimary"
          onClick={resendCode}
        >
          <AiOutlineRedo className="!me-2" />
          <span className="text-center">{t("sendAgain")}</span>
        </div>
      )}
      <CustomButton
        variant="link"
        className="!flex !items-center !my-0 !mx-auto !text-colorPrimary !p-0 !h-auto !rounded-none phone-link-dash"
        icon={<AiOutlineEdit />}
        onClick={props.onPhoneEdit}
      >
        {t("editNumberPhone")}
      </CustomButton>
      <Modal
        open={showChooseRoleModal}
        closable={false}
        width={500}
        footer={null}
      >
        <ChooseCurrentRole setShowChooseRoleModal={setShowChooseRoleModal} />
      </Modal>
    </div>
  );
};

export default Verification;
