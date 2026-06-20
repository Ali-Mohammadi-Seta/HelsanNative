// src/components/EMR/components/AllergiesCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { Ionicons } from '@expo/vector-icons';
import EMRSectionCard from './EMRSectionCard';
import TableCard from './TableCard';
import moment from 'moment-jalaali';

interface Allergy {
  _id?: string;
  name: string;
  reaction: string;
  date: string | Date;
  type: string;
}

interface AllergiesCardProps {
  patientInfo?: { allergies?: Allergy[] };
}

type AllergyGroup = { key: string; labelKey: string; icon: keyof typeof Ionicons.glyphMap; color: string; types: string[] };

const allergyGroups: AllergyGroup[] = [
  { key: 'food', labelKey: 'foodAllergies', icon: 'restaurant-outline', color: '#f59e0b', types: ['edible'] },
  { key: 'medicine', labelKey: 'medicinalAllergies', icon: 'medkit-outline', color: '#ef4444', types: ['medicinal'] },
  { key: 'env', labelKey: 'environmentalAllergies', icon: 'leaf-outline', color: '#22c55e', types: ['environmental'] },
];

const AllergiesCard: React.FC<AllergiesCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const allergies = patientInfo?.allergies ?? [];

  const dateColumns = [
    { key: 'name', title: t('substanceName'), flex: 1 },
    { key: 'reaction', title: t('bodyReaction'), flex: 1.2 },
    {
      key: 'date',
      title: t('StartDate'),
      flex: 1.3,
      render: (val: string | Date) => {
        try { return moment(val).format('jYYYY/jMM/jDD'); } catch { return String(val) || '-'; }
      },
    },
  ];

  return (
    <EMRSectionCard
      title={t('allergies')}
      icon="warning-outline"
      iconColor="#f59e0b"
      badge={allergies.length}
      delay={140}
      isEmpty={allergies.length === 0}
      emptyText={t('NoData')}
    >
      {allergyGroups.map((group) => {
        const filtered = allergies.filter((a) =>
          group.types.includes(a.type) || group.types.includes(t(a.type))
        );
        return (
          <View key={group.key} style={{ marginBottom: 14 }}>
            <View
              style={[
                styles.groupHeader,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={[styles.groupIcon, { backgroundColor: `${group.color}18` }]}>
                <Ionicons name={group.icon} size={14} color={group.color} />
              </View>
              <Text
                style={[
                  styles.groupTitle,
                  { color: group.color, writingDirection: direction.dir },
                ]}
              >
                {t(group.labelKey)}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: `${group.color}18` }]}>
                <Text style={[styles.countText, { color: group.color }]}>{filtered.length}</Text>
              </View>
            </View>
            {filtered.length > 0 ? (
              <TableCard
                columns={dateColumns}
                data={filtered}
                keyExtractor={(item, idx) => item._id || item.name || String(idx)}
              />
            ) : (
              <Text style={[styles.emptyGroup, { color: colors.textTertiary }]}>{t('NoData')}</Text>
            )}
          </View>
        );
      })}
    </EMRSectionCard>
  );
};

const styles = StyleSheet.create({
  groupHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  groupIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  groupTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 12,
    flex: 1,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  countText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
  },
  emptyGroup: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
});

export default AllergiesCard;