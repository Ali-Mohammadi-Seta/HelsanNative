// src/components/EMR/components/ExaminesCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import TableCard from './TableCard';

interface LabRecord {
  id?: string | number;
  srvName: string;
  srvQty: number | string;
  description?: string | null;
}

interface ExaminesCardProps {
  services?: { lab?: LabRecord[] };
}

const ExaminesCard: React.FC<ExaminesCardProps> = ({ services }) => {
  const { t } = useTranslation();
  const direction = useDirection();
  const labs = services?.lab ?? [];

  const columns = [
    { key: 'srvName', title: t('examineName'), flex: 1.5 },
    { key: 'srvQty', title: t('count'), flex: 0.6 },
    {
      key: 'description',
      title: t('desc'),
      flex: 1,
      render: (val: string | null | undefined) => val || '-',
    },
  ];

  return (
    <EMRSectionCard
      title={t('azmayeshha')}
      icon="flask-outline"
      iconColor="#06b6d4"
      badge={labs.length}
      delay={420}
      isEmpty={labs.length === 0}
      emptyText={t('NoData')}
    >
      <TableCard
        columns={columns}
        data={labs}
        keyExtractor={(item, idx) => item.id?.toString() || item.srvName || String(idx)}
      />
    </EMRSectionCard>
  );
};

export default ExaminesCard;