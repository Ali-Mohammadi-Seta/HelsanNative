// src/components/EMR/components/AddictionsCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import TableCard from './TableCard';
import moment from 'moment-jalaali';

interface Addiction {
  _id?: string;
  type: string;
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
}

interface AddictionsCardProps {
  patientInfo?: { addictions?: Addiction[] };
}

const AddictionsCard: React.FC<AddictionsCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const direction = useDirection();
  const addictions = patientInfo?.addictions ?? [];

  const columns = [
    { key: 'type', title: t('addictionType'), flex: 1 },
    { key: 'name', title: t('addictionTo'), flex: 1 },
    { key: 'dosage', title: t('Dosage'), flex: 1 },
    {
      key: 'startDate',
      title: t('StartDate'),
      flex: 1.2,
      render: (val: string) => {
        try { return moment(val).format('jYYYY/jMM/jDD'); } catch { return val || '-'; }
      },
    },
    {
      key: 'endDate',
      title: t('EndDate'),
      flex: 1.2,
      render: (val: string) => {
        try { return moment(val).format('jYYYY/jMM/jDD'); } catch { return val || '-'; }
      },
    },
  ];

  return (
    <EMRSectionCard
      title={t('savabeghEtiad')}
      icon="flame-outline"
      iconColor="#f97316"
      badge={addictions.length}
      delay={300}
      isEmpty={addictions.length === 0}
      emptyText={t('NoData')}
    >
      <TableCard
        columns={columns}
        data={addictions}
        keyExtractor={(item, idx) => item._id || item.type || String(idx)}
      />
    </EMRSectionCard>
  );
};

export default AddictionsCard;