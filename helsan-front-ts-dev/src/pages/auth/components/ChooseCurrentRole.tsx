import { IAuthInterface } from "@/interfaces/authInterface";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { Radio,  message } from "antd";
import { useTranslation } from "react-i18next";
import { rolesListFa } from "@/utils/constants";
import { useNavigate } from "react-router";
import { homePagePath } from "@/routes/pathRoutes";
import CustomButton from "@/components/button";

interface GetDoctorsIdentifierProps {
  setShowChooseRoleModal: Dispatch<SetStateAction<boolean>>;
}

const ChooseCurrentRole: FC<GetDoctorsIdentifierProps> = ({
  setShowChooseRoleModal,
}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { userRole } = useSelector((state: IAuthInterface) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleChange = (e: any) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      message.warning(t("pleaseSelectRole") || "Please select a role first.");
      return;
    }
    localStorage.setItem("currentRole", selectedRole);
    message.success(
      `${t("currentRoleSetTo")}: ${rolesListFa[selectedRole] || selectedRole}`
    );
    setShowChooseRoleModal(false);
    navigate(homePagePath);
  };

  const normalizedRoles = Array.isArray(userRole) ? userRole : [userRole];

  return (
    <div>
      <p className="!font-bold mb-4">{t("chooseRole")}</p>

      <Radio.Group onChange={handleChange} value={selectedRole} className="gap-2">
        {normalizedRoles.map((role) => (
          <Radio key={role} value={role}>
            {rolesListFa[role] || role}
          </Radio>
        ))}
      </Radio.Group>

      <CustomButton
        type="primary"
        onClick={handleSubmit}
        disabled={!selectedRole}
        className="!mr-auto !flex"
        style={{ marginTop: 16 }}
      >
        {t("ok")}
      </CustomButton>
    </div>
  );
};

export default ChooseCurrentRole;
