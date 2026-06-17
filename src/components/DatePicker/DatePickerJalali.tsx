import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Button from '../Button';
import { Ionicons } from '@expo/vector-icons';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface DatePickerJalaliProps {
  selectedDate?: string;
  onDateChange: (date: string) => void;
  maxDate?: Date;
  minDate?: Date;
}

const DatePickerJalali: React.FC<DatePickerJalaliProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const [year, setYear] = useState(
    selectedDate ? parseInt(selectedDate.split('/')[0], 10) : 1370
  );
  const [month, setMonth] = useState(
    selectedDate ? parseInt(selectedDate.split('/')[1], 10) : 1
  );
  const [day, setDay] = useState(
    selectedDate ? parseInt(selectedDate.split('/')[2], 10) : 1
  );

  const headerScale = useSharedValue(1);

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
  ];

  const getDaysInMonth = (m: number, y: number) => {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    const isLeap = ((y % 33) * 8 + 21) % 128 < 8;
    return isLeap ? 30 : 29;
  };

  const daysInMonth = getDaysInMonth(month, year);

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [month, year]);

  useEffect(() => {
    headerScale.value = withSpring(1.06, { damping: 10 }, () => {
      headerScale.value = withSpring(1);
    });
  }, [day, month, year]);

  // Dynamically calculate current Shamsi year (approximate based on Gregorian)
  const getDisplayYear = () => {
    const date = new Date();
    // Before March 21, it's 622 years behind. After, it's 621.
    const isBeforeNewYear = date.getMonth() < 2 || (date.getMonth() === 2 && date.getDate() < 21);
    return date.getFullYear() - (isBeforeNewYear ? 622 : 621);
  };

  const START_YEAR = 1300;
  const MAX_YEAR = getDisplayYear();

  // Generate years from 1300 up to the current Shamsi year
  const years = Array.from({ length: MAX_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    const dateStr = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onDateChange(dateStr);
  };

  const headerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const bg = isDark ? colors.card : '#ffffff';
  const primaryText = isDark ? colors.text : '#1a1a2e';
  const secondaryText = isDark ? colors.textSecondary : '#555577';

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      style={[styles.container, { backgroundColor: bg }]}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: isDark ? colors.surface : `${colors.primary}18` }]}>
        <Animated.View style={[styles.headerContent, headerAnimStyle]}>
          <Text style={[styles.headerDay, { color: colors.primary }]}>
            {String(day).padStart(2, '0')} {persianMonths[month - 1]}
          </Text>
          <View style={styles.headerMeta}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={secondaryText}
            />
            <Text style={[styles.headerYear, { color: secondaryText }]}>
              {year}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* ── Column labels ── */}
      <View style={[styles.labelRow, direction.row]}>
        {[
          direction.isRTL ? 'روز' : 'Day',
          direction.isRTL ? 'ماه' : 'Month',
          direction.isRTL ? 'سال' : 'Year',
        ].map((lbl) => (
          <Text key={lbl} style={[styles.colLabel, { color: primaryText }]}>
            {lbl}
          </Text>
        ))}
      </View>

      {/* ── Drum picker ── */}
      <View style={[styles.pickerWrapper, { marginHorizontal: 16 }]}>
        {/* Centre selection band */}
        <View
          pointerEvents="none"
          style={[
            styles.selectionBand,
            {
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}14`,
            },
          ]}
        />
        {/* Top / bottom gradient masks */}
        <View pointerEvents="none" style={[styles.maskTop, { backgroundColor: bg }]} />
        <View pointerEvents="none" style={[styles.maskBottom, { backgroundColor: bg }]} />

        <View style={[styles.columnsRow, direction.row]}>
          {/* Day */}
          <DrumColumn
            items={days.map(String)}
            selectedIndex={day - 1}
            onSelect={(i) => setDay(i + 1)}
            colors={colors}
            isDark={isDark}
            primaryText={primaryText}
            secondaryText={secondaryText}
          />

          <View style={[styles.colDivider, { backgroundColor: `${colors.primary}25` }]} />

          {/* Month */}
          <DrumColumn
            items={persianMonths}
            selectedIndex={month - 1}
            onSelect={(i) => setMonth(i + 1)}
            colors={colors}
            isDark={isDark}
            primaryText={primaryText}
            secondaryText={secondaryText}
          />

          <View style={[styles.colDivider, { backgroundColor: `${colors.primary}25` }]} />

          {/* Year */}
          <DrumColumn
            items={years.map(String)}
            selectedIndex={year - START_YEAR}
            onSelect={(i) => setYear(START_YEAR + i)}
            colors={colors}
            isDark={isDark}
            primaryText={primaryText}
            secondaryText={secondaryText}
          />
        </View>
      </View>

      {/* ── Footer ── */}
      <Animated.View
        entering={FadeInDown.delay(80).duration(250)}
        style={[
          styles.footer,
          direction.row,
          { borderTopColor: isDark ? colors.border : '#ebebeb' },
        ]}
      >
        <Button type="primary" size="large" onPress={handleConfirm} style={{ flex: 1 }}>
          <View style={styles.confirmRow}>
            <Ionicons name="checkmark-circle-outline" size={17} color="#fff" />
            <Text style={styles.confirmText}>
              {t('ok', { defaultValue: direction.isRTL ? 'تایید' : 'Confirm' })}
            </Text>
          </View>
        </Button>
      </Animated.View>
    </Animated.View>
  );
};

/* ─────────────────────────────────────────────────────────────
   DrumColumn
───────────────────────────────────────────────────────────── */
interface DrumColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  colors: any;
  isDark: boolean;
  primaryText: string;
  secondaryText: string;
}

function DrumColumn({
  items,
  selectedIndex,
  onSelect,
  colors,
  isDark,
  primaryText,
  secondaryText,
}: DrumColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const lastIndex = useRef(selectedIndex);
  const isMomentum = useRef(false);

  // Initial scroll
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
      lastIndex.current = selectedIndex;
    }, 60);
    return () => clearTimeout(t);
  }, []);

  // External change (e.g. day clamped after month change)
  useEffect(() => {
    if (selectedIndex !== lastIndex.current) {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: true,
      });
      lastIndex.current = selectedIndex;
    }
  }, [selectedIndex]);

  const snap = useCallback(
    (offsetY: number) => {
      const index = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT))
      );
      if (index !== lastIndex.current) {
        lastIndex.current = index;
        onSelect(index);
      }
    },
    [items.length, onSelect]
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isMomentum.current) {
        snap(e.nativeEvent.contentOffset.y);
      }
    },
    [snap]
  );

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      isMomentum.current = false;
      snap(e.nativeEvent.contentOffset.y);
    },
    [snap]
  );

  return (
    <View style={styles.drumColumn}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={Platform.OS === 'android' ? 0.85 : 'fast'}
        onScrollBeginDrag={() => { isMomentum.current = false; }}
        onMomentumScrollBegin={() => { isMomentum.current = true; }}
        onMomentumScrollEnd={onMomentumEnd}
        onScrollEndDrag={onScrollEndDrag}
        nestedScrollEnabled
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
      >
        {items.map((item, index) => (
          <DrumItem
            key={`${item}-${index}`}
            label={item}
            active={index === selectedIndex}
            onPress={() => {
              onSelect(index);
              scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true,
              });
            }}
            colors={colors}
            isDark={isDark}
            primaryText={primaryText}
            secondaryText={secondaryText}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────────────────────────────────────────
   DrumItem
───────────────────────────────────────────────────────────── */
function DrumItem({
  label,
  active,
  onPress,
  colors,
  isDark,
  primaryText,
  secondaryText,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: any;
  isDark: boolean;
  primaryText: string;
  secondaryText: string;
}) {
  const scale = useSharedValue(active ? 1 : 0.85);
  const opacity = useSharedValue(active ? 1 : 0.7);

  useEffect(() => {
    scale.value = withSpring(active ? 1 : 0.85, { damping: 14, stiffness: 200 });
    opacity.value = withSpring(active ? 1 : 0.7, { damping: 14 });
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={styles.drumItemTouch}
    >
      <Animated.View style={[styles.drumItem, animStyle]}>
        <Text
          style={[
            styles.drumItemText,
            {
              color: active ? colors.primary : isDark ? secondaryText : primaryText,
              fontFamily: active ? 'IRANSans-Bold' : 'IRANSans',
              fontSize: active ? 16 : 14,
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerDay: {
    fontSize: 24,
    fontFamily: 'IRANSans-Bold',
    marginBottom: 2,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerYear: {
    fontSize: 13,
    fontFamily: 'IRANSans-Medium',
    marginLeft: 3,
  },
  labelRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    justifyContent: 'space-around',
  },
  colLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'IRANSans-Bold',
    letterSpacing: 0.4,
    opacity: 0.7,
  },
  pickerWrapper: {
    height: PICKER_HEIGHT,
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
  },
  selectionBand: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    zIndex: 1,
  },
  maskTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    opacity: 0.5,
    zIndex: 2,
  },
  maskBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    opacity: 0.5,
    zIndex: 2,
  },
  columnsRow: {
    flex: 1,
    alignItems: 'center',
  },
  colDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
  drumColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  drumItemTouch: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drumItem: {
    height: ITEM_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drumItemText: {
    textAlign: 'center',
  },
  footer: {
    padding: 14,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmText: {
    color: '#fff',
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
  },
});

export default DatePickerJalali;