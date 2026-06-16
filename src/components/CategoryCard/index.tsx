// src/components/CategoryCard/index.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';

interface CategoryCardProps {
  title: string;
  icon: any;
  url?: string;
  gradientColors?: [string, string, ...string[]];
  onPress?: () => void;
  size?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  url,
  gradientColors = ['#16a34a', '#22c55e'],
  onPress,
  size,
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const { width } = useWindowDimensions();
  const computedSize = size ?? Math.min(112, Math.max(86, (width - 64) / 3));
  const iconSize = Math.min(64, computedSize * 0.56);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (url) {
      router.push(url as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.82}
      style={[styles.container, { width: computedSize }]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            width: computedSize,
            height: computedSize,
            shadowOpacity: isDark ? 0.28 : 0.16,
          },
        ]}
      >
        <Image
          source={icon}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
      </LinearGradient>

      <Text
        style={[
          styles.title,
          {
            width: computedSize,
            color: colors.text,
            writingDirection: direction.dir,
          },
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.84}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 14,
  },
  gradient: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: 'IRANSans-Bold',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 16,
  },
});

export default CategoryCard;
