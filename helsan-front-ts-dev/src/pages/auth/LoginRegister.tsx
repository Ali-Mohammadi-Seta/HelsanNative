import { useState, useEffect, FC, ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Tabs, Card } from "antd";
import Logo from "@/components/logo";
import Login from "./components/Login";
import Register from "./components/Register";
import Verification from "./components/Verification";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordVerification from "./components/ResetPasswordVerification";
import ResetPassword from "./components/ResetPassword";
import * as pathRoute from "@/routes/pathRoutes";
import LoginVerification from "./components/LoginVerification";

type AuthStatus =
  | "login"
  | "register"
  | "forgotPassword"
  | "resetPasswordVerificaton"
  | "resetPassword"
  | "verification"
  | "loginVerification"
  | "done"; // مرحله تکمیل یا هر مرحله جدیدی که داری

const LoginRegister: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // گرفتن مقدار loginStep از redux
  const loginStep = useSelector((state: any) => state.auth.loginStep);

  // مقدار محلی authStatus برای کنترل UI
  const [authStatus, setAuthStatus] = useState<AuthStatus>("login");

  // سینک مقدار محلی با redux
  useEffect(() => {
    if (loginStep && loginStep !== authStatus) {
      setAuthStatus(loginStep as AuthStatus);
    }
  }, [loginStep]);

  // نگهداری شماره تلفن
  const [phone, setPhone] = useState<string>("");

  // Callback ثبت نام
  const handleSubmitRegisterForm = (mobilePhone: string): void => {
    setPhone(mobilePhone);
    setAuthStatus("verification");
  };
  // Callback ورود موفق
  const handleSubmitLoginForm = (mobilePhone: string): void => {
    setPhone(mobilePhone);
    setAuthStatus("loginVerification");
  };

  const renderByAuthState = (state: AuthStatus): ReactNode => {
    if (state === "login" || state === "register") {
      return (
        <Tabs
          centered
          className="!w-full"
          defaultActiveKey={(location.state as AuthStatus) || "login"}
          onChange={(activeKey: string) =>
            setAuthStatus(activeKey as AuthStatus)
          }
          items={[
            {
              key: "login",
              label: t("user.login"),
              children: (
                <div>
                  <Login onSubmit={handleSubmitLoginForm} />
                </div>
              ),
            },
            {
              key: "register",
              label: t("Register"),
              children: (
                <div>
                  <Register onSubmit={handleSubmitRegisterForm} />
                </div>
              ),
            },
          ]}
        />
      );
    }
    if (state === "forgotPassword") {
      return (
        <ForgotPassword
          onChallengeReceived={(phone: string) => {
            setAuthStatus("resetPasswordVerificaton");
            setPhone(phone);
          }}
        />
      );
    }
    if (state === "resetPassword") {
      return (
        <ResetPassword
        // onPasswordChanged={() => setAuthStatus("login")}
        // challenge={challenge}
        // verifyCode={verifyCode}
        // phone={phone}
        />
      );
    }
    if (state === "resetPasswordVerificaton") {
      return (
        <ResetPasswordVerification
        // onVerifiedResetPassword={handleVerifyResetPassword}
        // phone={phone}
        // onSubmit={handleSubmitRegisterForm}
        // onPhoneEdit={() => setAuthStatus("forgotPassword")}
        // challenge={challenge}
        />
      );
    }
    if (state === "verification") {
      return (
        <Verification
          onPhoneEdit={() => setAuthStatus("register")}
          onVerified={() => setAuthStatus("login")}
          phone={phone}
          onSubmit={handleSubmitRegisterForm}
        />
      );
    }
    if (state === "loginVerification") {
      return (
        <LoginVerification
          onPhoneEdit={() => setAuthStatus("login")}
          onVerified={() => setAuthStatus("login")}
          phone={phone}
          onSubmit={handleSubmitLoginForm}
        />
      );
    }
    return null;
  };

  return (
    <div className={`h-screen overflow-y-auto`}>
      <Card
        title={
          <Link to={pathRoute.homePagePath}>
            <Logo />
          </Link>
        }
        className="max-w-[518px] !min-w-64 xs:min-w-[518px] !mt-16 !mb-8 xs:!mx-auto !mx-3 login-registering shadow-md xs:!p-5 !p-2 !rounded-2xl"
      >
        {renderByAuthState(authStatus)}
      </Card>
    </div>
  );
};

export default LoginRegister;
