import React, { useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import MedicineImg from "@/assets/images/medicine.png";
import { Modal } from "@/components/modal/Modal";
import LeftSideCard from "./LeftSideCard";

interface DrugRecord {
  id?: string | number;
  srvName: string;
  drugAmntConcept?: string;
  drugInstConcept?: string;
  srvQty?: number | string;
  drugAmntCode?: string;
  description?: string | null;
}

interface PatientInfo {
  drug?: DrugRecord[];
}

interface DrugInfoProps {
  patientInfo?: PatientInfo;
}

const DrugInfo: React.FC<DrugInfoProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);

  const columns: ColumnsType<DrugRecord> = [
    {
      title: t("drugName"),
      dataIndex: "srvName",
      key: "srvName",
    },
    {
      title: t("usageAmount"),
      dataIndex: "drugAmntConcept",
      key: "drugAmntConcept",
    },
    {
      title: t("usageTime"),
      dataIndex: "drugInstConcept",
      key: "drugInstConcept",
    },
    {
      title: t("count"),
      dataIndex: "srvQty",
      key: "srvQty",
    },
    {
      title: t("repeatCycle"),
      dataIndex: "drugAmntCode",
      key: "drugAmntCode",
    },
    {
      title: t("desc"),
      dataIndex: "description",
      key: "description",
      render: (text: string | null | undefined) => (text ? text : "-"),
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={MedicineImg}
        title={t("consumableDrugs")}
      />

      <Modal
        title={t("consumableDrugs")}
        open={isModalVisible}
        onOk={handleClose}
        onCancel={handleClose}
        width={800}
        footer={null}
      >
        <Table<DrugRecord>
          columns={columns}
          dataSource={patientInfo?.drug || []}
          pagination={false}
          scroll={{ x: 400 }}
          rowKey={(record) => record.id?.toString() || record.srvName}
          locale={{ emptyText: t("NoData") }}
        />
      </Modal>
    </>
  );
};

export default DrugInfo;
