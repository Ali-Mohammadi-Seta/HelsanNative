import { useState } from "react";
import { Table, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import SurgeryImg from "@/assets/images/surgery.png";
import { Modal } from "@/components/modal/Modal";
import { toPersianDigits } from "@/utils/antdPagination";
import moment from "moment-jalaali";
import LeftSideCard from "./LeftSideCard";

interface SurgeryRecord {
  id?: string;
  name: string;
  type: string;
  surgeonName: string;
  anesthesiaType: string;
  medicalCenterName: string;
  date: string;
  time: string;
}

interface SurgeryProps {
  patientInfo?: {
    surgeries?: SurgeryRecord[];
  };
}

function Surgery({ patientInfo }: SurgeryProps) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const columns: TableColumnsType<SurgeryRecord> = [
    {
      title: t("surgeryName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("surgeryType"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("surgeonName"),
      dataIndex: "surgeonName",
      key: "surgeonName",
    },
    {
      title: t("anesthesiaType"),
      dataIndex: "anesthesiaType",
      key: "anesthesiaType",
    },
    {
      title: t("medicalCenterName"),
      dataIndex: "medicalCenterName",
      key: "medicalCenterName",
    },
    {
      title: t("surgeryDate"),
      dataIndex: "date",
      key: "date",
      render: (text: string) =>
        toPersianDigits(moment(text).format("dddd[،] jD jMMMM jYYYY")),
    },
    {
      title: t("time"),
      dataIndex: "time",
      key: "time",
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={SurgeryImg}
        title={t("savabeghJarahi")}
      />

      <Modal
        title={t("savabeghJarahi")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Table<SurgeryRecord>
          columns={columns}
          dataSource={patientInfo?.surgeries || []}
          rowKey={(record) => record.id || record.name}
          pagination={false}
          scroll={{ x: 300 }}
        />
      </Modal>
    </>
  );
}

export default Surgery;
