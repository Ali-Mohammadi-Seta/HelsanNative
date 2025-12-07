import { useState } from "react";
import { Table, TableColumnsType } from "antd";
import moment from "moment-jalaali";
import { useTranslation } from "react-i18next";
import VaccinationsImg from "@/assets/images/vaccination.png";
import { Modal } from "@/components/modal/Modal";
import LeftSideCard from "./LeftSideCard";
import { toPersianDigits } from "@/utils/antdPagination";
// Define the shape of a vaccination record
interface Vaccination {
  id?: string;
  type: string;
  date: string;
}

// Define the props
interface VaccinationsProps {
  patientInfo?: {
    vaccinations?: Vaccination[];
  };
}

function Vaccinations({ patientInfo }: VaccinationsProps) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const columns: TableColumnsType<Vaccination> = [
    {
      title: t("vaccinName"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "date",
      render: (text: string) =>
        toPersianDigits(moment(text).format("dddd[،] jD jMMMM jYYYY")),
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={VaccinationsImg}
        title={t("savabeghVaksan")}
      />

      <Modal
        title={t("savabeghVaksan")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Table<Vaccination>
          columns={columns}
          dataSource={patientInfo?.vaccinations || []}
          rowKey={(record) => (record?.id || record.type) ?? Date.now()}
          pagination={false}
        />
      </Modal>
    </>
  );
}

export default Vaccinations;
