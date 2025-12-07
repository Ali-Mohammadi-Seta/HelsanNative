import { FC, useState, Dispatch, SetStateAction } from "react";
import { Form, Button } from "antd";
// import { useNavigate } from 'react-router';
import endpoints from "@/services/endpoints";
import apiServices from "@/services/apiServices";
import { toEnglishDigits } from "@/utils/toEnglishDigits";
import { useTranslation } from "react-i18next";
import { toPersianDigits } from "@/utils/antdPagination";
import { setIsLoggedIn } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import { toast } from "../toast/toastApi";
// import { useDispatch } from 'react-redux';
// import { getInsurancesStatus } from '@/redux/middlewares/insurancesStatus/getInsurancesStatus';
// import { sakhadLoginPagePath } from '@/routes/pathRoutes';

interface GetDoctorsIdentifierProps {
  setShowVerifyDoctorModal: Dispatch<SetStateAction<boolean>>;
  onVerified: () => void;
  selectedRole?: string;
}

const GetDoctorsIdentifier: FC<GetDoctorsIdentifierProps> = ({
  setShowVerifyDoctorModal,
  onVerified,
  selectedRole,
}) => {
  // let navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: {
    medicalCode: string;
  }): Promise<void> => {
    if (!values.medicalCode) return;
    setLoading(true);
    const payload = {
      ...(selectedRole === "doctor" && {
        medicalCode: toEnglishDigits(values.medicalCode),
      }),
      ...(selectedRole === "psychologist" && {
        licenseNumber: toEnglishDigits(values.medicalCode),
      }),
    };
    const result = await apiServices.patch(
      endpoints.upgradeUser(selectedRole!),
      payload
    );
    setLoading(false);
    if (result.isSuccess) {
      toast.success(result?.data?.messageFa);
      // dispatch(getInsurancesStatus());
      // !isSkip
      // ?
      // navigate(sakhadLoginPagePath)
      //   :
      onVerified();
      form.resetFields();
      dispatch(setIsLoggedIn(true));
      setShowVerifyDoctorModal(false);
      setTimeout(() => onVerified(), 2000);
    } else {
      toast.warning(result?.error?.messageFa);
    }
  };
  return (
    <Form form={form} name="verify" layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="medicalCode" required>
        <FloatingInput
          name="medicalCode"
          label={
            selectedRole === "doctor"
              ? t("estelamNezam")
              : t("estelamNezamPsycho")
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            form.setFieldsValue({
              medicalCode: toPersianDigits(e.target.value),
            });
          }}
          autoFocus
        />
      </Form.Item>
      <Form.Item className="w-full!">
        <Button
          type="primary"
          loading={loading}
          htmlType="submit"
          className="w-full"
        >
          {t("okay")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GetDoctorsIdentifier;
