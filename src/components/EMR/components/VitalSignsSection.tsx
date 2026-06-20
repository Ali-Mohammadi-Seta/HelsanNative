// src/components/EMR/components/VitalSignsSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme, shadows } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';

type ChartType =
  | 'bloodPressure'
  | 'temperature'
  | 'heartRate'
  | 'respiratory'
  | 'bloodSugar'
  | 'bmi';

interface VitalCardConfig {
  key: ChartType;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  unit: string;
  getValue: (signs: any[]) => string;
}

// All icons validated against @expo/vector-icons Ionicons set
const vitalCards: VitalCardConfig[] = [
  {
    key: 'bloodPressure',
    titleKey: 'bloodPressure',
    icon: 'heart-outline',
    color: '#ef4444',
    unit: 'mmHg',
    getValue: (signs) => {
      const last = [...signs].reverse().find((s) => s.bloodPressure?.length);
      const bp = last?.bloodPressure?.slice(-1)[0];
      return bp ? `${bp.upper}/${bp.lower}` : '-';
    },
  },
  {
    key: 'temperature',
    titleKey: 'temp',
    icon: 'thermometer-outline',
    color: '#f59e0b',
    unit: '°C',
    getValue: (signs) => {
      const last = [...signs].reverse().find((s) => s.temp != null);
      return last?.temp != null ? String(last.temp) : '-';
    },
  },
  {
    key: 'heartRate',
    titleKey: 'heartBeats',
    icon: 'pulse-outline',
    color: '#ec4899',
    unit: 'bpm',
    getValue: (signs) => {
      const last = [...signs].reverse().find((s) => s.pulse != null);
      return last?.pulse != null ? String(last.pulse) : '-';
    },
  },
  {
    key: 'respiratory',
    titleKey: 'NumberOfBreath',
    icon: 'fitness-outline',
    color: '#3b82f6',
    unit: 'br/min',
    getValue: (signs) => {
      const last = [...signs].reverse().find((s) => s.resp != null);
      return last?.resp != null ? String(last.resp) : '-';
    },
  },
  {
    key: 'bloodSugar',
    titleKey: 'bloodsugar',
    icon: 'flask-outline',
    color: '#06b6d4',
    unit: 'mg/dL',
    getValue: (signs) => {
      const last = [...signs].reverse().find((s) => s.bloodSuger?.length);
      const bs = last?.bloodSuger?.slice(-1)[0];
      return bs?.beforeMeal ? String(bs.beforeMeal) : '-';
    },
  },
  {
    key: 'bmi',
    titleKey: 'bmi',
    icon: 'body-outline',
    color: '#8b5cf6',
    unit: 'kg/m²',
    getValue: (signs) => {
      const last = [...signs].reverse().find((s) => s.height && s.weight);
      if (!last) return '-';
      return ((last.weight / (last.height * last.height)) * 10000).toFixed(1);
    },
  },
];

interface VitalSignsSectionProps {
  vitalSigns?: any[];
  onChartPress?: (type: ChartType) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function VitalCard({
  card,
  value,
  index,
  onPress,
}: {
  card: VitalCardConfig;
  value: string;
  index: number;
  onPress: () => void;
}) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.88, translateY: 10 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{
        type: 'spring',
        damping: 16,
        stiffness: 140,
        delay: index * 55,
      }}
      style={styles.cardWrap}
    >
      <AnimatedTouchable
        activeOpacity={0.78}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 14, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
        onPress={onPress}
        style={[
          animatedStyle,
          styles.card,
          shadows.sm,
          {
            backgroundColor: isDark ? colors.card : '#ffffff',
            borderColor: isDark ? colors.border : `${card.color}22`,
          },
        ]}
      >
        {/* Icon */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: `${card.color}1c` },
          ]}
        >
          <Ionicons name={card.icon} size={22} color={card.color} />
        </View>

        {/* Value */}
        <Text
          style={[styles.cardValue, { color: card.color }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>

        {/* Unit */}
        <Text style={[styles.cardUnit, { color: colors.textTertiary }]}>
          {card.unit}
        </Text>

        {/* Title */}
        <Text
          style={[
            styles.cardTitle,
            { color: colors.textSecondary, writingDirection: direction.dir },
          ]}
          numberOfLines={2}
        >
          {t(card.titleKey)}
        </Text>

        {/* Chart button */}
        {Boolean(onPress) && (
          <View
            style={[
              styles.chartBtn,
              { backgroundColor: `${card.color}14` },
            ]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={11}
              color={card.color}
            />
            <Text style={[styles.chartBtnText, { color: card.color }]}>
              {direction.isRTL ? 'نمودار' : 'Chart'}
            </Text>
          </View>
        )}
      </AnimatedTouchable>
    </MotiView>
  );
}

const VitalSignsSection: React.FC<VitalSignsSectionProps> = ({
  vitalSigns = [],
  onChartPress,
}) => {
  const { colors } = useTheme();
  const direction = useDirection();

  return (
    <View style={styles.wrap}>
      {/* Section header */}
      <MotiView
        from={{ opacity: 0, translateX: direction.isRTL ? 12 : -12 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 280 }}
        style={[
          styles.sectionHeader,
          { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        <View style={[styles.sectionBar, { backgroundColor: colors.primary }]} />
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, writingDirection: direction.dir },
          ]}
        >
          {direction.isRTL ? 'نمودارهای حیاتی' : 'Vital Charts'}
        </Text>
      </MotiView>

      {/* Grid */}
      <View style={styles.grid}>
        {vitalCards.map((card, idx) => (
          <VitalCard
            key={card.key}
            card={card}
            value={card.getValue(vitalSigns)}
            index={idx}
            onPress={() => onChartPress?.(card.key)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionBar: {
    borderRadius: 2,
    height: 18,
    width: 3,
  },
  sectionTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardWrap: {
    width: '47.5%',
  },
  card: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  cardValue: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 18,
    lineHeight: 24,
  },
  cardUnit: {
    fontFamily: 'IRANSans',
    fontSize: 10,
    marginTop: -4,
  },
  cardTitle: {
    fontFamily: 'IRANSans-Medium',
    fontSize: 12,
    textAlign: 'center',
  },
  chartBtn: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chartBtnText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 10,
  },
});

export default VitalSignsSection;
