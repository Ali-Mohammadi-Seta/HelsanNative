import React, { useState } from "react";
import { Table } from "antd";
import diagnosis from "@/assets/images/diagnosis.png";
import { useTranslation } from "react-i18next";
import type { ColumnsType } from "antd/es/table";
import { Modal } from "@/components/modal/Modal";
import moment from "moment-jalaali";
import { toPersianDigits } from "@/utils/antdPagination";
import LeftSideCard from "./LeftSideCard";
interface Disease {
  id?: string | number;
  createdAt: string; // assuming ISO string or formatted date string
  name: string;
  severity?: string;
}

interface DiagnosisProps {
  patientInfo?: {
    diseases?: Disease[];
  };
}

const Diagnosis: React.FC<DiagnosisProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);

  const columns: ColumnsType<Disease> = [
    {
      title: t("doctorVisitDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        toPersianDigits(moment(text).format("dddd[،] jD jMMMM jYYYY")),
    },
    {
      title: t("diseaseName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("diseaseSeverity"),
      dataIndex: "severity",
      key: "severity",
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={diagnosis}
        title={t("bimariha")}
      />
      <Modal
        title={t("bimariha")}
        open={isModalVisible}
        onOk={handleClose}
        onCancel={handleClose}
        width={800}
        footer={null}
      >
        <Table<Disease>
          columns={columns}
          dataSource={patientInfo?.diseases || []}
          rowKey={(record) => record.id?.toString() || record.name}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default Diagnosis;
