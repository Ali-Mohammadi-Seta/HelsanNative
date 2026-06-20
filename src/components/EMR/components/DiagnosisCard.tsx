// src/components/EMR/components/DiagnosisCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import TableCard from './TableCard';
import moment from 'moment-jalaali';

interface Disease {
  id?: string | number;
  createdAt: string;
  name: string;
  severity?: string;
}

interface DiagnosisCardProps {
  patientInfo?: { diseases?: Disease[] };
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const diseases = patientInfo?.diseases ?? [];

  const columns = [
    {
      key: 'createdAt',
      title: t('doctorVisitDate'),
      flex: 1.4,
      render: (val: string) => {
        try {
          return moment(val).format('jYYYY/jMM/jDD');
        } catch {
          return val || '-';
        }
      },
    },
    { key: 'name', title: t('diseaseName'), flex: 1.2 },
    { key: 'severity', title: t('diseaseSeverity'), flex: 1 },
  ];

  return (
    <EMRSectionCard
      title={t('bimariha')}
      icon="medical-outline"
      iconColor="#ef4444"
      badge={diseases.length}
      delay={100}
      isEmpty={diseases.length === 0}
      emptyText={t('NoData')}
    >
      <TableCard
        columns={columns}
        data={diseases}
        keyExtractor={(item, idx) => item.id?.toString() || item.name || String(idx)}
      />
    </EMRSectionCard>
  );
};

export default DiagnosisCard;