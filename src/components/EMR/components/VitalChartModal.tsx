// src/components/EMR/components/VitalChartModal.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import Modal from '@/components/Modal/Modal';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import moment from 'moment-jalaali';

type ChartType = 'bloodPressure' | 'temperature' | 'heartRate' | 'respiratory' | 'bloodSugar' | 'bmi';

interface VitalChartModalProps {
  open: boolean;
  onClose: () => void;
  chartType: ChartType | null;
  vitalSigns?: any[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH * 0.85 - 40;

const chartConfig: Record<
  ChartType,
  { titleKey: string; icon: keyof typeof Ionicons.glyphMap; color: string; unit: string }
> = {
  bloodPressure: { titleKey: 'bloodPressure', icon: 'heart-outline', color: '#ef4444', unit: 'mmHg' },
  temperature: { titleKey: 'temp', icon: 'thermometer-outline', color: '#f59e0b', unit: '°C' },
  heartRate: { titleKey: 'heartBeats', icon: 'pulse-outline', color: '#ec4899', unit: 'bpm' },
  respiratory: { titleKey: 'NumberOfBreath', icon: 'water-outline', color: '#3b82f6', unit: 'br/min' },
  bloodSugar: { titleKey: 'bloodsugar', icon: 'water-outline', color: '#06b6d4', unit: 'mg/dL' },
  bmi: { titleKey: 'bmi', icon: 'body-outline', color: '#8b5cf6', unit: 'kg/m²' },
};

const extractChartData = (type: ChartType, signs: any[]): { date: string; value: number; label: string }[] => {
  const result: { date: string; value: number; label: string }[] = [];
  for (const sign of signs) {
    const dateStr = moment(sign.createdAt).format('jMM/jDD');
    switch (type) {
      case 'bloodPressure': {
        const bp = sign.bloodPressure?.slice(-1)[0];
        if (bp?.upper) result.push({ date: dateStr, value: Number(bp.upper), label: `${bp.upper}/${bp.lower}` });
        break;
      }
      case 'temperature':
        if (sign.temp != null) result.push({ date: dateStr, value: Number(sign.temp), label: `${sign.temp}°C` });
        break;
      case 'heartRate':
        if (sign.pulse != null) result.push({ date: dateStr, value: Number(sign.pulse), label: `${sign.pulse}` });
        break;
      case 'respiratory':
        if (sign.resp != null) result.push({ date: dateStr, value: Number(sign.resp), label: `${sign.resp}` });
        break;
      case 'bloodSugar': {
        const bs = sign.bloodSuger?.slice(-1)[0];
        if (bs?.beforeMeal) result.push({ date: dateStr, value: Number(bs.beforeMeal), label: `${bs.beforeMeal}` });
        break;
      }
      case 'bmi':
        if (sign.height && sign.weight) {
          const bmi = ((sign.weight / (sign.height * sign.height)) * 10000);
          result.push({ date: dateStr, value: parseFloat(bmi.toFixed(1)), label: bmi.toFixed(1) });
        }
        break;
    }
  }
  return result.slice(-10);
};

const VitalChartModal: React.FC<VitalChartModalProps> = ({
  open,
  onClose,
  chartType,
  vitalSigns = [],
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  if (!chartType) return null;
  const config = chartConfig[chartType];
  const data = extractChartData(chartType, vitalSigns);
  const maxVal = data.length ? Math.max(...data.map((d) => d.value)) : 100;
  const minVal = data.length ? Math.min(...data.map((d) => d.value)) : 0;
  const range = maxVal - minVal || 1;

  const BAR_HEIGHT = 140;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(config.titleKey)}
      size="lg"
    >
      <View
        style={[
          styles.chartWrap,
          { backgroundColor: isDark ? colors.card : '#ffffff' },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.modalHeader,
            { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${config.color}18` }]}>
            <Ionicons name={config.icon} size={22} color={config.color} />
          </View>
          <View style={[direction.startItems, { flex: 1, marginHorizontal: 10 }]}>
            <Text style={[styles.chartTitle, { color: colors.text, writingDirection: direction.dir }]}>
              {t(config.titleKey)}
            </Text>
            <Text style={[styles.chartUnit, { color: config.color }]}>{config.unit}</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: `${config.color}18` }]}>
            <Text style={[styles.countText, { color: config.color }]}>
              {data.length} {direction.isRTL ? 'رکورد' : 'records'}
            </Text>
          </View>
        </View>

        {/* Chart */}
        {data.length === 0 ? (
          <View style={styles.emptyChart}>
            <Ionicons name="bar-chart-outline" size={40} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('NoData')}
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 8, paddingBottom: 4, paddingTop: 12 }}>
              {/* Y axis label */}
              <View style={{ height: BAR_HEIGHT, position: 'relative', marginBottom: 4 }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                  <View
                    key={fraction}
                    style={[
                      styles.gridLine,
                      {
                        bottom: fraction * BAR_HEIGHT,
                        borderTopColor: isDark ? colors.border : '#e5e7eb',
                        width: Math.max(data.length * 52, CHART_WIDTH),
                      },
                    ]}
                  />
                ))}

                {/* Bars */}
                <View style={[styles.barsRow, { flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}>
                  {data.map((item, idx) => {
                    const barHeightPct = ((item.value - minVal) / range) * 0.8 + 0.1;
                    return (
                      <MotiView
                        key={idx}
                        from={{ height: 0, opacity: 0 }}
                        animate={{ height: BAR_HEIGHT * barHeightPct, opacity: 1 }}
                        transition={{ type: 'spring', damping: 14, stiffness: 120, delay: idx * 50 }}
                        style={[
                          styles.bar,
                          {
                            backgroundColor: config.color,
                            alignSelf: 'flex-end',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            opacity: 0.85 + (idx / data.length) * 0.15,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              {/* Labels + Values */}
              <View
                style={[
                  styles.labelsRow,
                  { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                {data.map((item, idx) => (
                  <View key={idx} style={styles.labelWrap}>
                    <Text style={[styles.barValue, { color: isDark ? colors.text : config.color }]}>{item.label}</Text>
                    <Text style={[styles.barDate, { color: colors.textSecondary }]}>{item.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {/* Summary row */}
        {data.length > 0 && (
          <View
            style={[
              styles.summary,
              {
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                backgroundColor: isDark ? colors.surface : '#f8fafc',
              },
            ]}
          >
            <SummaryStat label={direction.isRTL ? 'کمترین' : 'Min'} value={`${minVal}`} color={colors.info} />
            <View style={[styles.summaryDivider, { backgroundColor: isDark ? colors.border : '#e5e7eb' }]} />
            <SummaryStat label={direction.isRTL ? 'بیشترین' : 'Max'} value={`${maxVal}`} color={config.color} />
            <View style={[styles.summaryDivider, { backgroundColor: isDark ? colors.border : '#e5e7eb' }]} />
            <SummaryStat
              label={direction.isRTL ? 'میانگین' : 'Avg'}
              value={(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
              color={colors.primary}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

function SummaryStat({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrap: {
    borderRadius: 18,
  },
  modalHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  chartTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 16,
  },
  chartUnit: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    marginTop: 2,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
  },
  emptyChart: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'IRANSans',
    fontSize: 13,
  },
  gridLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    position: 'absolute',
    left: 0,
  },
  barsRow: {
    alignItems: 'flex-end',
    bottom: 0,
    gap: 10,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  bar: {
    borderRadius: 6,
    width: 38,
  },
  labelsRow: {
    gap: 10,
    marginTop: 6,
  },
  labelWrap: {
    alignItems: 'center',
    width: 48,
  },
  barValue: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 10,
    textAlign: 'center',
  },
  barDate: {
    fontFamily: 'IRANSans',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  summary: {
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
  },
  summaryLabel: {
    fontFamily: 'IRANSans',
    fontSize: 10,
  },
  summaryValue: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 16,
    marginTop: 3,
  },
});

export default VitalChartModal;
