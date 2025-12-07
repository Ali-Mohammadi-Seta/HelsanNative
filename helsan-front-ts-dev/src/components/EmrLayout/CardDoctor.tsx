import React, { ReactNode, useState} from "react";
import { Row, Col } from '@/components/grid';
import barChart from "@/assets/images/bar-chart.png";
import { useTranslation } from "react-i18next";
import FilteredChartes from "./FilteredCharts";
import CustomButton from "../button";
import { Modal } from "../modal/Modal";

interface CardDoctorProps {
  title: string;
  children: ReactNode;
}

const CardDoctor: React.FC<CardDoctorProps> = ({ title, children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => setIsModalVisible(false);

const handleOk = (e?: React.MouseEvent) => {
  e?.preventDefault();
  setIsModalVisible(false);
};

  return (
    <>
      <div className="shadow-[0_3px_2px_rgba(218,218,217,0.38)] overflow-hidden text-center mb-[10px] rounded-md">
        <div className="bg-white">
          <h5 className="min-h-[20px] ps-2 py-2 bg-[#c4def6] text-center">
            <CustomButton
              className="hover:!bg-transparent !mt-2 !h-0 !w-6 !m-0 !p-0 !left-[2px] ms-2 !float-left !bg-[#fafafa]"
              onClick={showModal}
            >
              <img
                className="!h-5 !w-6 fas fa-chart-line !text-[#1e90ff]"
                src={barChart}
                alt="Chart Icon"
              />
            </CustomButton>
            {title}
          </h5>

          {children}
        </div>
      </div>

      <Modal
        title={t("chart")}
        footer={null}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={24}>
            <FilteredChartes />
          </Col>
          <Col span={24}>{children}</Col>
        </Row>
      </Modal>
    </>
  );
};

export default CardDoctor;
