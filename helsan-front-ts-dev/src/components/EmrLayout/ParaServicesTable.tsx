import { useState } from "react";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import ImagingImg from "@/assets/images/radiology.png";
import { Modal } from "@/components/modal/Modal";
import LeftSideCard from "./LeftSideCard";
interface ParaItem {
  srvName: string;
  srvQty: number;
  srvType: string;
  description?: string;
  ref: string;
}

interface PatientInfo {
  para?: ParaItem[];
}

interface FaNameItem {
  faName: string;
}

interface FaNameMap {
  [ref: string]: {
    [srvType: string]: FaNameItem;
  };
}

interface MedicalImagingTableProps {
  patientInfo?: PatientInfo;
  faName?: FaNameMap;
}

const MedicalImagingTable: React.FC<MedicalImagingTableProps> = ({
  patientInfo,
  faName,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const mapServiceTypeToFaName = (ref: string, srvType: string): string => {
    const refTypes = faName?.[ref] || {};
    const faType = refTypes[srvType] || refTypes[ref] || {};
    return faType?.faName || "-";
  };

  const columnsImaging = [
    {
      title: t("serviceName"),
      dataIndex: "srvName",
      key: "srvName",
    },
    {
      title: t("count"),
      dataIndex: "srvQty",
      key: "srvQty",
    },
    {
      title: t("Type"),
      dataIndex: "srvType",
      key: "srvType",
      render: (text: string, record: ParaItem) =>
        mapServiceTypeToFaName(record.ref, text),
    },
    {
      title: t("desc"),
      dataIndex: "description",
      key: "description",
      render: (text?: string) => text || "-",
    },
  ];

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={ImagingImg}
        title={t("khadamatPara")}
      />

      <Modal
        title={t("khadamatPara")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Table
          dataSource={patientInfo?.para || []}
          columns={columnsImaging}
          pagination={false}
          scroll={{ x: 300 }}
          rowKey={(record) =>
            `${record.ref}-${record.srvType}-${record.srvName}`
          }
        />
      </Modal>
    </>
  );
};

export default MedicalImagingTable;
