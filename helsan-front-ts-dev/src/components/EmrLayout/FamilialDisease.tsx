import React, { useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import FamilialDiseaseImg from "@/assets/images/familial.png";
import { Modal } from "@/components/modal/Modal";
import LeftSideCard from "./LeftSideCard";
interface FamilialDiseaseRecord {
  id?: string | number;
  name: string;
  relationship: string;
}

interface PatientInfo {
  familialDiseases?: FamilialDiseaseRecord[];
}

interface FamilialDiseaseProps {
  patientInfo?: PatientInfo;
}

const FamilialDisease: React.FC<FamilialDiseaseProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);

  const columns: ColumnsType<FamilialDiseaseRecord> = [
    {
      title: t("diseaseName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("familyRelationship"),
      dataIndex: "relationship",
      key: "relationship",
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={FamilialDiseaseImg}
        title={t("VitalSignPatient")}
      />

      <Modal
        title={t("VitalSignPatient")}
        open={isModalVisible}
        onOk={handleClose}
        onCancel={handleClose}
        width={800}
        footer={null}
      >
        <Table<FamilialDiseaseRecord>
          columns={columns}
          dataSource={patientInfo?.familialDiseases || []}
          rowKey={(record) => record.id?.toString() || record.name}
          pagination={false}
          locale={{ emptyText: t("NoData") }}
        />
      </Modal>
    </>
  );
};

export default FamilialDisease;
