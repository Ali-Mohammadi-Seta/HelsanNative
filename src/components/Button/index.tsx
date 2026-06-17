// src/components/Button/index.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme, shadows, gradients } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode, useCallback } from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  ViewStyle,
  Pressable,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type BtnType = 'primary' | 'secondary' | 'danger';
type BtnVariant = 'solid' | 'text' | 'link' | 'outline' | 'primary';
type BtnSize = 'large' | 'default' | 'small';
type IconPosition = 'left' | 'right';

interface CustomButtonProps {
  children?: ReactNode;
  title?: string;
  type?: BtnType;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  title,
  type = 'primary',
  variant = 'solid',
  size = 'default',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  style,
  textStyle,
  fullWidth = false,
  onPress,
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const isDisabled = disabled || loading;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.965, { damping: 15, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [scale]);

  // Size configurations
  const sizeConfig = {
    large: { height: 52, paddingHorizontal: 20, fontSize: 16, gap: 10, borderRadius: 16 },
    default: { height: 44, paddingHorizontal: 16, fontSize: 14, gap: 8, borderRadius: 14 },
    small: { height: 34, paddingHorizontal: 12, fontSize: 12, gap: 6, borderRadius: 12 },
  };

  const currentSize = sizeConfig[size];

  // Normalize variant
  const normalizedVariant = variant === 'primary' ? 'solid' : variant;

  // Color configurations
  const getColors = () => {
    if (normalizedVariant === 'solid') {
      switch (type) {
        case 'primary':
          return { bg: colors.primary, text: '#ffffff', gradient: true };
        case 'secondary':
          return { bg: isDark ? '#3b82f6' : '#6366f1', text: '#ffffff', gradient: false };
        case 'danger':
          return { bg: '#dc2626', text: '#ffffff', gradient: false };
      }
    }

    if (normalizedVariant === 'outline') {
      return {
        bg: 'transparent',
        text: colors.primary,
        border: colors.primary,
        gradient: false,
      };
    }

    // Text/Link variants
    switch (type) {
      case 'primary':
        return { bg: 'transparent', text: colors.primary, gradient: false };
      case 'secondary':
        return { bg: 'transparent', text: isDark ? '#60a5fa' : '#6366f1', gradient: false };
      case 'danger':
        return { bg: 'transparent', text: '#dc2626', gradient: false };
    }
  };

  const colorScheme = getColors();
  const useGradient = normalizedVariant === 'solid' && type === 'primary' && !isDisabled;

  // Container style
  const containerStyle: ViewStyle = {
    height: currentSize.height,
    paddingHorizontal: currentSize.paddingHorizontal,
    borderRadius: currentSize.borderRadius,
    flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: currentSize.gap,
    backgroundColor: normalizedVariant === 'solid' && !useGradient ? colorScheme.bg : 'transparent',
    opacity: isDisabled ? 0.5 : 1,
    overflow: 'hidden' as const,
    ...(fullWidth && { width: '100%' as any }),
    ...(normalizedVariant === 'outline' && {
      borderWidth: 1.5,
      borderColor: (colorScheme as any).border || colorScheme.text,
    }),
  };

  const shadowStyle = normalizedVariant === 'solid' && !isDisabled
    ? (type === 'primary' ? shadows.colored(colors.primary) : shadows.md)
    : shadows.none;

  const textStyleComputed: TextStyle = {
    color: colorScheme.text,
    fontSize: currentSize.fontSize,
    fontFamily: 'IRANSans-Bold',
    textAlign: 'center',
    writingDirection: direction.dir,
  };

  const innerContent = (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={colorScheme.text}
          style={{ marginLeft: direction.isRTL ? 4 : 0, marginRight: direction.isRTL ? 0 : 4 }}
        />
      )}
      {icon && !loading && <View>{icon}</View>}
      {(children || title) && (
        <Text style={[textStyleComputed, textStyle]}>
          {children || title}
        </Text>
      )}
    </>
  );

  return (
    <AnimatedPressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={isDisabled ? undefined : handlePressIn}
      onPressOut={isDisabled ? undefined : handlePressOut}
      disabled={isDisabled}
      style={[animatedStyle, shadowStyle, !useGradient && containerStyle, style]}
      className={className}
    >
      {useGradient ? (
        <LinearGradient
          colors={isDark ? gradients.primaryButtonDark : gradients.primaryButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[containerStyle, { backgroundColor: 'transparent' }]}
        >
          {innerContent}
        </LinearGradient>
      ) : (
        <>{!useGradient && innerContent}</>
      )}
    </AnimatedPressable>
  );
};

export default CustomButton;
