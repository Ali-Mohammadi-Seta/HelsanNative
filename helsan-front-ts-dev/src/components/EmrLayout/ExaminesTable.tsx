import React, { useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import ExaminesImg from "@/assets/images/Examines.png";
import { Modal } from "@/components/modal/Modal";
import LeftSideCard from "./LeftSideCard";
interface LabRecord {
  id?: string | number;
  srvName: string;
  srvQty: number | string;
  description?: string | null;
}

interface PatientInfo {
  lab?: LabRecord[];
}

interface ExaminesTableProps {
  patientInfo?: PatientInfo;
}

const ExaminesTable: React.FC<ExaminesTableProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const columnsTests: ColumnsType<LabRecord> = [
    {
      title: t("examineName"),
      dataIndex: "srvName",
      key: "srvName",
    },
    {
      title: t("count"),
      dataIndex: "srvQty",
      key: "srvQty",
    },
    {
      title: t("desc"),
      dataIndex: "description",
      key: "description",
      render: (text: string | null | undefined) => (text ? text : "-"),
    },
  ];

  const showModal = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={ExaminesImg}
        title={t("azmayeshha")}
      />

      <Modal
        title={t("azmayeshha")}
        open={isModalVisible}
        onOk={handleClose}
        onCancel={handleClose}
        width={800}
        footer={null}
      >
        <Table<LabRecord>
          dataSource={patientInfo?.lab || []}
          columns={columnsTests}
          pagination={false}
          scroll={{ x: 300 }}
          rowKey={(record) => record.id?.toString() || record.srvName}
          locale={{ emptyText: t("NoData") }}
        />
      </Modal>
    </>
  );
};

export default ExaminesTable;
