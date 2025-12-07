import { useTranslation } from "react-i18next";
import { useGetUserProfile } from "../lib/useGetUserProfile";
import { Divider, Skeleton, Typography } from "antd";
import FloatingInput from "@/components/floatingFields/FloatingInput";
import FloatingSelect from "@/components/floatingFields/FloatingSelect";
import { useState } from "react";
import GetDoctorsIdentifier from "@/components/roleBasedComponents/GetDoctorsIdentifier";
import { useGetPotentialRoles } from "../lib/useGetPotentialRoles";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getUserProfile } from "@/redux/middlewares/getUserProfile";
import ContentLayout from "@/layouts/publicLayout/Content";
import CustomButton from "@/components/button";
import { Modal } from "@/components/modal/Modal";
import { Row, Col } from "@/components/grid";
const { Title } = Typography;

type Role = {
  english: string;
  persian: string;
};

type RoleInfo = {
  roleType: string;
};

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const queryClient = useQueryClient();

  const { userProfile, isGettingProfile } = useGetUserProfile();
  const { rolesList, isGettingRoles } = useGetPotentialRoles();

  const handleSelectRole = (val: string) => {
    setSelectedRole(val);
  };
  return (
    <div className="py-10">
      <ContentLayout className="p-9! pb-11!">
        <Title level={5}>
          {t("userInfo")}
        </Title>
        <Row gutter={[16, 16]}>
          {isGettingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {Array.from({ length: 4 }, (_, i: number) => (
                <Skeleton.Input className="w-full!" key={i} />
              ))}
            </div>
          ) : (
            <>
              <Col xs={24} sm={12} className="mt-4">
                <FloatingInput
                  name="firstName"
                  label={t("title")}
                  value={userProfile?.firstName}
                  readOnly
                />
              </Col>
              <Col xs={24} sm={12} className="mt-4">
                <FloatingInput
                  label={t("lastName")}
                  value={userProfile?.lastName}
                  readOnly
                />
              </Col>
              <Col xs={24} sm={12}>
                <FloatingInput
                  label={t("gender")}
                  value={
                    userProfile?.gender === "MALE" ? t("male") : t("female")
                  }
                  readOnly
                />
              </Col>
              <Col xs={24} sm={12}>
                <FloatingInput
                  label={t("phone")}
                  value={userProfile?.phone}
                  readOnly
                />
              </Col>
            </>
          )}
        </Row>

        <Divider />
        <Title level={5}>{t("upgradeAccount")}</Title>
        <div className="sm:w-1/2 sm:pl-2">
          <div className="mt-4">
            <FloatingSelect
              label={t("selectRole")}
              loading={isGettingRoles}
              value={selectedRole}
              onChange={handleSelectRole}
              options={(rolesList?.roles ?? []).map((role: Role) => ({
                label: role.persian,
                value: role.english.toLowerCase(),
                disabled: (userProfile?.rolesInfo ?? []).some(
                  (item: RoleInfo) => item.roleType === role.english
                ),
              }))}
            />
          </div>
          <div className="flex sm:mt-0">
            <CustomButton
              type="primary"
              className=" mt-5 mr-auto! "
              onClick={() => {
                if (selectedRole) {
                  setOpenModal(true);
                }
              }}
            >
              {t("upgradeAccount")}
            </CustomButton>
          </div>
        </div>

        <Divider />
        <Title level={5}>{t("selectRole")}</Title>
        <div className="sm:w-1/2 sm:pl-2">
          <FloatingSelect
            className="w-full"
            label={t("selectRole")}
            value={selectedPosition}
            onChange={setSelectedPosition}
            options={
              userProfile?.positions
                ? userProfile.positions.map((item: any) => ({
                    label: item.pn,
                    value: item.oid,
                  }))
                : []
            }
          />
        </div>
      </ContentLayout>

      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedRole("");
        }}
        footer={null}
        title={
          selectedRole === "doctor"
            ? t("estelamNezam")
            : t("estelamNezamPsycho")
        }
        size="lg"
      >
        <GetDoctorsIdentifier
          setShowVerifyDoctorModal={setOpenModal}
          selectedRole={selectedRole}
          onVerified={() => {
            setOpenModal(false);
            setSelectedRole("");
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            dispatch(getUserProfile());
          }}
        />
      </Modal>
    </div>
  );
};

export default Profile;
