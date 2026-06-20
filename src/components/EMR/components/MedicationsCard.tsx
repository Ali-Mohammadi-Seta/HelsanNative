// src/components/EMR/components/MedicationsCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';

interface DrugRecord {
  id?: string | number;
  srvName: string;
  drugAmntConcept?: string;
  drugInstConcept?: string;
  srvQty?: number | string;
  drugAmntCode?: string;
  description?: string | null;
}

interface MedicationsCardProps {
  medications?: { drug?: DrugRecord[] };
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ medications }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const drugs = medications?.drug ?? [];
  const valueOrDash = (value?: string | number | null) =>
    value === null || value === undefined || value === '' ? '-' : String(value);

  return (
    <EMRSectionCard
      title={t('consumableDrugs')}
      icon="medkit-outline"
      iconColor="#3b82f6"
      badge={drugs.length}
      delay={180}
      isEmpty={drugs.length === 0}
      emptyText={t('NoData')}
    >
      <View style={{ gap: 8 }}>
        {drugs.map((drug, idx) => (
          <View
            key={drug.id?.toString() || drug.srvName || String(idx)}
            style={[
              styles.drugCard,
              {
                backgroundColor: isDark ? colors.surface : '#f8fafc',
                borderColor: isDark ? colors.border : '#e5e7eb',
              },
            ]}
          >
            <View
              style={[
                styles.drugHeader,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={[styles.drugIcon, { backgroundColor: '#3b82f618' }]}>
                <Ionicons name="medical-outline" size={18} color="#3b82f6" />
              </View>
              <View style={[direction.startItems, { flex: 1 }]}>
                <Text
                  style={[
                    styles.drugLabel,
                    {
                      color: colors.textSecondary,
                      textAlign: direction.textAlign,
                      writingDirection: direction.dir,
                    },
                  ]}
                >
                  {t('serviceName')}
                </Text>
                <Text
                  style={[
                    styles.drugName,
                    {
                      color: colors.text,
                      textAlign: direction.textAlign,
                      writingDirection: direction.dir,
                    },
                  ]}
                >
                  {valueOrDash(drug.srvName)}
                </Text>
              </View>
              <View style={[styles.qtyBadge, { backgroundColor: '#3b82f618' }]}>
                <Text style={[styles.qtyText, { color: '#3b82f6' }]}>
                  {t('count')}: {valueOrDash(drug.srvQty)}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.drugMeta,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <MetaChip label={t('usageAmount')} value={valueOrDash(drug.drugAmntConcept)} colors={colors} direction={direction} />
              <MetaChip label={t('usageTime')} value={valueOrDash(drug.drugInstConcept)} colors={colors} direction={direction} />
              <MetaChip label={t('repeatCycle')} value={valueOrDash(drug.drugAmntCode)} colors={colors} direction={direction} />
            </View>
            {drug.description && (
              <Text
                style={[
                styles.desc,
                  {
                    color: colors.textSecondary,
                    textAlign: direction.textAlign,
                    writingDirection: direction.dir,
                  },
                ]}
              >
                {drug.description}
              </Text>
            )}
          </View>
        ))}
      </View>
    </EMRSectionCard>
  );
};

function MetaChip({ label, value, colors, direction }: any) {
  return (
    <View
      style={[
        styles.metaChip,
        {
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          backgroundColor: `${colors.primary}0f`,
        },
      ]}
    >
      <Text style={[styles.metaLabel, { color: colors.textSecondary, writingDirection: direction.dir }]}>
        {label}:
      </Text>
      <Text style={[styles.metaValue, { color: colors.text, writingDirection: direction.dir }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  drugCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  drugHeader: {
    alignItems: 'flex-start',
    gap: 8,
    justifyContent: 'space-between',
  },
  drugIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  drugLabel: {
    fontFamily: 'IRANSans',
    fontSize: 10,
    lineHeight: 16,
  },
  drugName: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 2,
  },
  qtyBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qtyText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
  },
  drugMeta: {
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    alignItems: 'center',
    borderRadius: 8,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaLabel: {
    fontFamily: 'IRANSans',
    fontSize: 11,
  },
  metaValue: {
    fontFamily: 'IRANSans-Medium',
    fontSize: 11,
  },
  desc: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    lineHeight: 20,
  },
});

export default MedicationsCard;
