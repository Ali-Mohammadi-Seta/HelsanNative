// src/components/EMR/components/PregnanciesCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import DataRow from './DataRow';
import moment from 'moment-jalaali';

interface PregnancyRecord {
  _id?: string;
  startDate: string;
  endDate: string;
  type: string;
  cause?: string;
}

interface PregnanciesCardProps {
  patientInfo?: { pregnancies?: PregnancyRecord[] };
}

const PregnanciesCard: React.FC<PregnanciesCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const pregnancies = patientInfo?.pregnancies ?? [];

  return (
    <EMRSectionCard
      title={t('savabeghBardari')}
      icon="woman-outline"
      iconColor="#db2777"
      badge={pregnancies.length}
      delay={380}
      isEmpty={pregnancies.length === 0}
      emptyText={t('NoData')}
    >
      <View style={{ gap: 12 }}>
        {pregnancies.map((preg, idx) => (
          <View
            key={preg._id || preg.startDate || String(idx)}
            style={[
              styles.pregCard,
              {
                backgroundColor: isDark ? colors.surface : '#fdf2f8',
                borderColor: isDark ? colors.border : '#fbcfe8',
              },
            ]}
          >
            <View
              style={[
                styles.typeRow,
                {
                  flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                  borderBottomColor: isDark ? colors.border : '#fbcfe8',
                },
              ]}
            >
              <Text
                style={[
                  styles.typeLabel,
                  { color: '#db2777', writingDirection: direction.dir },
                ]}
              >
                {preg.type}
              </Text>
            </View>
            <DataRow
              label={t('StartDate')}
              value={moment(preg.startDate).format('jYYYY/jMM/jDD')}
            />
            <DataRow
              label={t('EndDate')}
              value={moment(preg.endDate).format('jYYYY/jMM/jDD')}
            />
            {preg.cause && (
              <DataRow label={t('Cause')} value={preg.cause} last />
            )}
          </View>
        ))}
      </View>
    </EMRSectionCard>
  );
};

const styles = StyleSheet.create({
  pregCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  typeRow: {
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingBottom: 8,
  },
  typeLabel: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 13,
  },
});

export default PregnanciesCard;