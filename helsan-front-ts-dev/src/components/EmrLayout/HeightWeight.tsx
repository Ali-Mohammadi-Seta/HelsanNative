import React from 'react';
import human from '@/assets/images/human.jpg';
import { Row, Col } from '@/components/grid';
import { useTranslation } from 'react-i18next';

interface PatientInfo {
  height?: string | number;
  weight?: string | number;
}

interface HeightWeightProps {
  patientInfo?: PatientInfo;
}

const HeightWeight: React.FC<HeightWeightProps> = ({ patientInfo }) => {
  const { t } = useTranslation();

  return (
    <Row className="!h-40 !bg-white !mb-2 p-3">
      <Col xs={4} md={8}>
        <img
          style={{ width: 35, height: 100, top: 0, float: 'right' }}
          src={human}
          alt={t('humanImageAlt') || 'Human'}
        />
      </Col>
      <Col xs={20} md={16}>
        <div className="wrapper">
          <div className="line"></div>
          <div className="wordwrapper">
            <div className="word">
              {t('height')}: {patientInfo?.height ?? '-'}
            </div>
          </div>
        </div>
        <div>
          <span>{t('weight')}: </span>
          {patientInfo?.weight ?? '-'}
        </div>
      </Col>
    </Row>
  );
};

export default HeightWeight;
