import React, { useState } from "react";
import { Table } from "antd";
import moment from "moment-jalaali";
import allergyImg from "@/assets/images/allergy.png";
import { useTranslation } from "react-i18next";
import { Modal } from "../modal/Modal";
import LeftSideCard from "./LeftSideCard";
import { toPersianDigits } from "@/utils/antdPagination";

interface Allergy {
  _id?: string;
  name: string;
  reaction: string;
  date: string | Date;
  type: string;
}

interface PatientInfo {
  allergies?: Allergy[];
}

interface AllergiesProps {
  patientInfo?: PatientInfo;
}

const Allergies: React.FC<AllergiesProps> = () => {
  //   const [dataFoodAllergy, setDataFoodAllergy] = useState<Allergy[]>([]);
  //   const [dataMedicenAllergy, setDataMedicenAllergy] = useState<Allergy[]>([]);
  //   const [dataEnvirenAllergy, setDataEnvirenAllergy] = useState<Allergy[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();

  // Filter allergies by type translated strings
  //   const food = patientInfo?.allergies?.filter(
  //     (i) => i.type === t('edible')
  //   ) || [];
  //   const medicen = patientInfo?.allergies?.filter(
  //     (i) => i.type === t('medicinal')
  //   ) || [];
  //   const envirenment = patientInfo?.allergies?.filter(
  //     (i) => i.type === t('environmental')
  //   ) || [];

  //   useEffect(() => {
  //     setDataFoodAllergy(food);
  //     setDataMedicenAllergy(medicen);
  //     setDataEnvirenAllergy(envirenment);
  //   }, [food, medicen, envirenment]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: t("substanceName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("bodyReaction"),
      dataIndex: "reaction",
      key: "reaction",
    },
    {
      title: t("StartDate"),
      dataIndex: "date",
      key: "date",
      render: (text: string | Date) =>
        toPersianDigits(moment(text).format("dddd[،] jD jMMMM jYYYY")),
    },
  ];

  return (
    <>
      <LeftSideCard
        showModal={showModal}
        image={allergyImg}
        title={t("allergies")}
      />
      <Modal
        title={t("allergies")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        size="2xl"
        footer={null}
      >
        <div>
          <h3 className="mb-1">{t("foodAllergies")}</h3>
          <Table
            className="mb-4"
            columns={columns}
            // dataSource={dataFoodAllergy}
            // rowKey={(record) => record._id ?? record.name}
            pagination={false}
          />
        </div>
        <div>
          <h3 className="mb-1">{t("medicinalAllergies")}</h3>
          <Table
            className="mb-4"
            columns={columns}
            // dataSource={dataMedicenAllergy}
            // rowKey={(record) => record._id ?? record.name}
            pagination={false}
          />
        </div>
        <div>
          <h3 className="mb-1">{t("environmentalAllergies")}</h3>
          <Table
            className="mb-4"
            columns={columns}
            // dataSource={dataEnvirenAllergy}
            // rowKey={(record) => record._id ?? record.name}
            pagination={false}
          />
        </div>
      </Modal>
    </>
  );
};

export default Allergies;
