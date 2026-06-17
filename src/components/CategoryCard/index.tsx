// src/components/CategoryCard/index.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme, shadows } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface CategoryCardProps {
  title: string;
  icon: any;
  url?: string;
  gradientColors?: [string, string, ...string[]];
  onPress?: () => void;
  size?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const iconSize = Math.min(58, computedSize * 0.52);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 180 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 180 });
  }, [scale]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (url) {
      router.push(url as any);
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, styles.container, { width: computedSize }]}
    >
      <View
        style={[
          shadows.md,
          {
            borderRadius: 18,
            width: computedSize,
            height: computedSize,
          },
        ]}
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
            },
          ]}
        >
          {/* Glass overlay for premium feel */}
          <View style={styles.glassOverlay} />
          <Image
            source={icon}
            style={{ width: iconSize, height: iconSize }}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

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
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 14,
  },
  gradient: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
  },
  title: {
    fontSize: 12,
    fontFamily: 'IRANSans-Bold',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 17,
  },
});

export default CategoryCard;
