// src/components/EMR/components/EMRSectionCard.tsx
import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, shadows, borderRadius } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';

interface EMRSectionCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  badge?: number | string;
  badgeColor?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  delay?: number;
  emptyText?: string;
  isEmpty?: boolean;
}

const EMRSectionCard: React.FC<EMRSectionCardProps> = ({
  title,
  icon,
  iconColor,
  iconBg,
  badge,
  badgeColor,
  children,
  defaultExpanded = false,
  delay = 0,
  emptyText,
  isEmpty = false,
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const accentColor = iconColor ?? colors.primary;
  const accentBg = iconBg ?? `${accentColor}18`;
  const badgeBg = badgeColor ?? accentColor;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 320, delay }}
      style={[
        styles.card,
        shadows.md,
        {
          backgroundColor: isDark ? colors.card : '#ffffff',
          borderColor: isDark ? colors.border : '#f0f4f0',
        },
      ]}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.75}
        style={[styles.header, { flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}
      >
        <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <View style={[styles.iconWrap, { backgroundColor: accentBg }]}>
            <Ionicons name={icon} size={20} color={accentColor} />
          </View>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, writingDirection: direction.dir },
            ]}
          >
            {title}
          </Text>
          {badge !== undefined && (
            <View style={[styles.badge, { backgroundColor: `${badgeBg}22` }]}>
              <Text style={[styles.badgeText, { color: badgeBg }]}>{badge}</Text>
            </View>
          )}
        </View>
        <MotiView
          animate={{ rotate: expanded ? '180deg' : '0deg' }}
          transition={{ type: 'timing', duration: 200 }}
        >
          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.textSecondary}
          />
        </MotiView>
      </TouchableOpacity>

      {/* Body */}
      {expanded && (
        <MotiView
          from={{ opacity: 0, translateY: -8, scale: 0.98 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: 'timing', duration: 180 }}
        >
          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? colors.border : '#f3f4f6' },
            ]}
          />
          <View style={styles.body}>
            {isEmpty ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="file-tray-outline" size={32} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                  {emptyText ?? 'موردی یافت نشد'}
                </Text>
              </View>
            ) : (
              children
            )}
          </View>
        </MotiView>
      )}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
    flexShrink: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  body: {
    padding: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  emptyText: {
    fontFamily: 'IRANSans',
    fontSize: 13,
  },
});

export default EMRSectionCard;
