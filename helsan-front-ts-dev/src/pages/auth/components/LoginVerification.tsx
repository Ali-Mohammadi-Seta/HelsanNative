import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { AiOutlineEdit, AiOutlineRedo } from "react-icons/ai";
import apiCall from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { useTranslation } from "react-i18next";
import { toEnglishDigits } from "@/utils/toEnglishDigits";
import { useDispatch, useSelector } from "react-redux";
import { toPersianDigits } from "@/utils/antdPagination";
import ChooseCurrentRole from "./ChooseCurrentRole";
import type { AppDispatch } from "@/redux/store";
import { setIsLoggedIn, setUserRole } from "@/redux/reducers/authReducer";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import CustomButton from "@/components/button";
import { Modal } from "@/components/modal/Modal";
import { toast } from "@/components/toast/toastApi";

interface LoginVerificationProps {
  phone: string;
  expiration?: number;
  onSubmit: (phone: string) => void;
  onVerified: () => void;
  onPhoneEdit: () => void;
}

interface UserRegisterFormValues {
  phone: string;
}

interface UserState {
  userLoginFormValues: UserRegisterFormValues;
}

interface RootState {
  user: UserState;
}

const LoginVerification: React.FC<LoginVerificationProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [expiration, setExpiration] = useState<number>(60);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showChooseRoleModal, setShowChooseRoleModal] =
    useState<boolean>(false);
  const { userLoginFormValues } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (expiration > 0) {
      const timer = setTimeout(() => {
        setExpiration((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [expiration]);

  const showRolesModal = (): void => {
    setShowChooseRoleModal(true);
  };

  const resendCode = async (): Promise<void> => {
    setLoading(true);
    const res = await apiCall.post(endpoints.login, {
      ...userLoginFormValues,
    });
    if (res.isSuccess) {
      setCode("");
      setExpiration(60);
      props.onSubmit(userLoginFormValues.phone);
    }
    setLoading(false);
  };

  const onVerifyRegister = async (otpCode: string): Promise<void> => {
    const body = { otp: otpCode };
    setLoading(true);
    const res = await apiCall.post(endpoints.verifyLogin, body);
    if (res?.isSuccess) {
      const result = await apiCall.get(endpoints.checkAuthorize);
      if (result.isSuccess) {
        dispatch(setIsLoggedIn(result?.data?.data?.isLogin));
        dispatch(setUserRole(result?.data?.data?.roles?.ourRoles));
        showRolesModal();
      }
      toast.success(res.data?.messageFa);
    } else {
      toast.error((res.error as any)?.messageFa);
      setCode("");
    }
    setLoading(false);
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
      <Form name="verify" layout="vertical">
        <div className="flex justify-center">
          <FloatingInput
            otp
            dir="ltr"
            length={6}
            value={code}
            onChange={handleOtpChange}
            autoFocus
            disabled={loading}
          />
        </div>
      </Form>
      <div className="mt-8">
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
      </div>
      <Modal
        open={showChooseRoleModal}
        closable={false}
        width={500}
        footer={null}
        closeOnOverlayClick={false}
      >
        <ChooseCurrentRole setShowChooseRoleModal={setShowChooseRoleModal} />
      </Modal>
    </div>
  );
};

export default LoginVerification;
