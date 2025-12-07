import { Form } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/button";
export const ResetPasswordVerfication = () => {
  // const codeRef = useRef(null);
  // const [verifyCode, setVerifyCode] = useState(null);
  // const [expiration, setExpiration] = useState(120);
  // const [verifyError, setVerifyError] = useState();

  // const [form] = Form.useForm();
  const { t } = useTranslation();
  // const inputResetHandler = () => {
  //     const values = codeRef.current.state.values;
  //     for (let i = 0; i < values.length; i++) {
  //         values[i] = '';
  //     }
  // };
  // const changePasswordHandler = async () => {
  //     const response = await apiCall.get(endpoints.changePassword1, {
  //         phone: props.phone,
  //     });
  //     if (response.isSuccess) {
  //         toast.success(response.message);
  //         setExpiration(20);
  //     }
  // };

  // const verifyPasswordReset = async (verifyCode) => {
  //     setVerifyCode(verifyCode);
  //     const response = await apiCall.post(endpoints.verifyOTP1, {
  //         phone: props.phone,
  //         code: verifyCode,
  //     });
  //     if (response.isSuccess) {
  //         props.onVerifiedResetPassword(verifyCode);
  //         toast.success(response.message);
  //     } else {
  //         setVerifyCode(null);
  //     }
  // };

  // useEffect(() => {
  //     setTimeout(() => {
  //         if (expiration > 0) {
  //             setExpiration(expiration - 1);
  //         }
  //     }, 1000);
  // }, [expiration]);
  return (
    <div className="verificaton-content">
      <p className="text-sm text-colorSecondary mt-[2px] mb-4 fm-rg font-IRANSans">
        &nbsp;&nbsp; {t("resetText2")}
        <span className="text-colorPrimary">{/* {props.phone} */}</span>
        {t("resetText3")}
      </p>
      <Form
        layout="vertical"
        //  onFinish={verifyPasswordReset}
      >
        <Form.Item name="verify" className="!mb-0">
          {/* <ReactCodeInput
                        className="code-inputs"
                        type="number"
                        autoFocus
                        ref={codeRef}
                        onComplete={(value) => {
                            verifyPasswordReset(value);
                        }}
                    /> */}
        </Form.Item>
        <span className="error-msg !text-[#ff4370]">{/* {verifyError} */}</span>
        <Form.Item className="!mb-0">
          <CustomButton
            size="large"
            type="primary"
            htmlType="submit"
            className="!w-full primary-grd !text-[#fafcfe] shadow-[0px_10px_20p_rgba(63, 158, 255, 0.251)] !bg-primary-gradient
                        hover:shadow-[0px_10px_20px_10px_rgba(63, 158, 255, 0.251)] hover:transition-all hover:duration-300"
            // disabled={verifyCode}
          >
            {t("verifyCode")}
          </CustomButton>
        </Form.Item>
      </Form>
      {/* {expiration !== 0 ? (
        <span className="flex items-center justify-center mt-4 mb-6">
          {t("resetText")} &nbsp;
          <span className="text-colorPrimary">{expiration}</span>
          &nbsp; {t("second")}
        </span>
      ) : (
        <div
          className="flex items-center justify-center mt-4 mb-6 cursor-pointer font-bold text-colorPrimary"
          onClick={() => {
            changePasswordHandler();
            inputResetHandler();
          }}
        >
          <RedoOutlined className={`!me-2 `} />
          <span className="text-center">{t("sendAgain")}</span>
        </div>
      )} */}
      <CustomButton
        variant="link"
        // htmlType="submit"
        className="!flex !items-center !my-0 !mx-auto !text-colorPrimary !p-0 !h-auto !rounded-none phone-link-dash"
        icon={<AiOutlineEdit />}
        // onClick={() => props.onPhoneEdit()}
      >
        {t("editNumberPhone")}
      </CustomButton>
    </div>
  );
};

export default ResetPasswordVerfication;
