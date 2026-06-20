// src/components/EMR/components/ParaServicesCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import TableCard from './TableCard';

interface ParaItem {
  srvName: string;
  srvQty: number;
  srvType: string;
  description?: string;
  ref: string;
}

interface ParaServicesCardProps {
  services?: { para?: ParaItem[] };
}

const ParaServicesCard: React.FC<ParaServicesCardProps> = ({ services }) => {
  const { t } = useTranslation();
  const direction = useDirection();
  const para = services?.para ?? [];

  const columns = [
    { key: 'srvName', title: t('serviceName'), flex: 1.5 },
    { key: 'srvType', title: t('Type'), flex: 1 },
    { key: 'srvQty', title: t('count'), flex: 0.6 },
    {
      key: 'description',
      title: t('desc'),
      flex: 1,
      render: (val?: string) => val || '-',
    },
  ];

  return (
    <EMRSectionCard
      title={t('khadamatPara')}
      icon="scan-outline"
      iconColor="#0ea5e9"
      badge={para.length}
      delay={460}
      isEmpty={para.length === 0}
      emptyText={t('NoData')}
    >
      <TableCard
        columns={columns}
        data={para}
        keyExtractor={(item, idx) =>
          `${item.ref}-${item.srvType}-${item.srvName}-${idx}`
        }
      />
    </EMRSectionCard>
  );
};

export default ParaServicesCard;