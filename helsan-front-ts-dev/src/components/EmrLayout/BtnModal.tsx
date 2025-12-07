import React, { useEffect, useState } from 'react';
import { Modal } from "@/components/modal/Modal";
import DiagnosisChart from './Charts/ChartDiagnosis';
import ChartSensitive from './Charts/ChartSensitive';
import ChartExplainPatient from './Charts/ChartExplainPatient';
import ChartSurgeryPatient from './Charts/ChartSurgeryPatient';
import ChartVaccinate from './Charts/ChartVaccinate';
import ChartFamilyHistory from './Charts/ChartFamilyHistory';
import ChartRxhistory from './Charts/ChartRxhistory';

interface ContentModalProps {
  nameChart: string;
}

const Contentmodal: React.FC<ContentModalProps> = ({ nameChart }) => {
  switch (nameChart) {
    case 'explainpatient':
      return <ChartExplainPatient />;
    case 'diagnosis':
      return <DiagnosisChart />;
    case 'sensitive':
      return <ChartSensitive />;
    case 'surgery':
      return <ChartSurgeryPatient />;
    case 'vaccinate':
      return <ChartVaccinate />;
    case 'familyhistory':
      return <ChartFamilyHistory />;
    case 'RxHistory':
      return <ChartRxhistory />;
    default:
      return null;
  }
};

interface BtnModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  message: string;
}

const BtnModal: React.FC<BtnModalProps> = ({ open, onCancel, onOk, message }) => {
  const [nameChart, setNameChart] = useState(message);

  useEffect(() => {
    setNameChart(message);
  }, [message]);

  return (
    <Modal
      destroyOnClose
      title="Modal"
      centered
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <div>
        <Contentmodal nameChart={nameChart} />
      </div>
    </Modal>
  );
};

export default BtnModal;
