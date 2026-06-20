// src/components/EMR/components/FamilialDiseaseCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';

interface FamilialDiseaseRecord {
  id?: string | number;
  name: string;
  relationship: string;
}

interface FamilialDiseaseCardProps {
  patientInfo?: { familialDiseases?: FamilialDiseaseRecord[] };
}

const FamilialDiseaseCard: React.FC<FamilialDiseaseCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const diseases = patientInfo?.familialDiseases ?? [];

  return (
    <EMRSectionCard
      title={t('VitalSignPatient')}
      icon="people-outline"
      iconColor="#ec4899"
      badge={diseases.length}
      delay={340}
      isEmpty={diseases.length === 0}
      emptyText={t('NoData')}
    >
      <View style={{ gap: 8 }}>
        {diseases.map((disease, idx) => (
          <View
            key={disease.id?.toString() || disease.name || String(idx)}
            style={[
              styles.row,
              {
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                backgroundColor: isDark ? colors.surface : '#fdf2f8',
                borderColor: isDark ? colors.border : '#fbcfe8',
              },
            ]}
          >
            <View style={styles.dotWrap}>
              <View style={[styles.dot, { backgroundColor: '#ec4899' }]} />
            </View>
            <View style={[{ flex: 1 }, direction.startItems]}>
              <Text
                style={[
                  styles.diseaseName,
                  { color: colors.text, writingDirection: direction.dir },
                ]}
              >
                {disease.name}
              </Text>
              <Text
                style={[
                  styles.relation,
                  { color: '#ec4899' },
                ]}
              >
                {disease.relationship}
              </Text>
            </View>
            <Ionicons name="git-merge-outline" size={16} color={colors.textTertiary} />
          </View>
        ))}
      </View>
    </EMRSectionCard>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    padding: 10,
  },
  dotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 12,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  diseaseName: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 13,
  },
  relation: {
    fontFamily: 'IRANSans',
    fontSize: 11,
    marginTop: 2,
  },
});

export default FamilialDiseaseCard;