import { useState } from "react";
import { Table } from "antd";
import moment from "moment-jalaali";
import { useTranslation } from "react-i18next";
import addictionsImg from "@/assets/images/addiction.png";
import { Modal } from "../modal/Modal";
import LeftSideCard from "./LeftSideCard";
import { toPersianDigits } from "@/utils/antdPagination";

// Define types
interface Addiction {
  _id?: string;
  type: string;
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
}

interface AddictionsProps {
  patientInfo?: {
    addictions?: Addiction[];
  };
}

function Addictions({ patientInfo }: AddictionsProps) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const columns = [
    {
      title: t("addictionType"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("addictionTo"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Dosage"),
      dataIndex: "dosage",
      key: "dosage",
    },
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
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={addictionsImg}
        title={t("savabeghEtiad")}
      />
      <Modal
        title={t("savabeghEtiad")}
        open={isModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={patientInfo?.addictions || []}
          rowKey={(record) => record._id || record.type}
          pagination={false}
          scroll={{ x: 300 }}
        />
      </Modal>
    </>
  );
}

export default Addictions;
