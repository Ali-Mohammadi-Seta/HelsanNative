import React, { useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { useTheme } from '@/styles/theme';

type SkeletonBoxProps = {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  radius?: number;
  style?: ViewStyle;
};

export function SkeletonBox({ width = '100%', height = 16, radius = 8, style }: SkeletonBoxProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[{ width, height }, style]}>
      <View style={{ width: width as DimensionValue, height: height as DimensionValue, overflow: 'hidden', borderRadius: radius }}>
        <Skeleton
          colorMode={isDark ? 'dark' : 'light'}
          width="100%"
          height="100%"
          radius={radius}
        />
      </View>
    </View>
  );
}

export function SkeletonCard({
  rows = 3,
  avatar = false,
  style,
}: {
  rows?: number;
  avatar?: boolean;
  style?: ViewStyle;
}) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.card : '#ffffff',
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {avatar && <SkeletonBox width={58} height={58} radius={18} />}
        <View style={styles.content}>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonBox
              key={index}
              height={index === 0 ? 18 : 12}
              width={index === 0 ? '72%' : index === rows - 1 ? '46%' : '92%'}
              style={{ marginBottom: index === rows - 1 ? 0 : 10 }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export function SkeletonList({
  count = 4,
  rows = 3,
  avatar = true,
}: {
  count?: number;
  rows?: number;
  avatar?: boolean;
}) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} rows={rows} avatar={avatar} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
});
