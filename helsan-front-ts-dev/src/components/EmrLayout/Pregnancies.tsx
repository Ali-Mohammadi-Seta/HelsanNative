import { useState } from "react";
import { Table, TableColumnsType } from "antd";
import moment from "moment-jalaali";
import { useTranslation } from "react-i18next";
import PregnanciesImg from "@/assets/images/Pregnancies.png";
import { Modal } from "@/components/modal/Modal";
import LeftSideCard from "./LeftSideCard";
import { toPersianDigits } from "@/utils/antdPagination";

interface PregnancyRecord {
  _id?: string;
  startDate: string;
  endDate: string;
  type: string;
  cause?: string;
}

interface PregnanciesProps {
  patientInfo?: {
    pregnancies?: PregnancyRecord[];
  };
}

function Pregnancies({ patientInfo }: PregnanciesProps) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const columns: TableColumnsType<PregnancyRecord> = [
    {
      title: t("StartDate"),
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) =>
        toPersianDigits(moment(text).format("dddd[،] jD jMMMM jYYYY")),
    },
    {
      title: t("EndDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) =>
        toPersianDigits(moment(text).format("dddd[،] jD jMMMM jYYYY")),
    },
    {
      title: t("Type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("Cause"),
      dataIndex: "cause",
      key: "cause",
      render: (_: string, record: PregnancyRecord) => {
        if (record.type === "تولد زنده" && !record.cause) {
          return "-";
        }
        return record.cause || "-";
      },
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={PregnanciesImg}
        title={t("savabeghBardari")}
      />

      <Modal
        title={t("savabeghBardari")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Table<PregnancyRecord>
          columns={columns}
          dataSource={patientInfo?.pregnancies || []}
          rowKey={(record) => record._id || record.startDate}
          pagination={false}
          scroll={{ x: 300 }}
        />
      </Modal>
    </>
  );
}

export default Pregnancies;
