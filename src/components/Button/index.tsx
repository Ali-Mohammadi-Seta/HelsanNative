// src/components/Button/index.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';

type BtnType = 'primary' | 'secondary' | 'danger';
type BtnVariant = 'solid' | 'text' | 'link' | 'outline' | 'primary';
type BtnSize = 'large' | 'default' | 'small';
type IconPosition = 'left' | 'right';

interface CustomButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  children?: ReactNode;
  title?: string; // For backward compatibility
  type?: BtnType;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  loading?: boolean;
  disabled?: boolean;
  className?: string; // For NativeWind classes
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

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
  ...rest
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const isDisabled = disabled || loading;

  // Size configurations
  const sizeConfig = {
    large: { height: 48, paddingHorizontal: 16, fontSize: 16, gap: 8 },
    default: { height: 40, paddingHorizontal: 16, fontSize: 14, gap: 8 },
    small: { height: 32, paddingHorizontal: 12, fontSize: 12, gap: 6 },
  };

  const currentSize = sizeConfig[size];

  // Normalize variant: 'primary' means 'solid', 'outline' is outline style
  const normalizedVariant = variant === 'primary' ? 'solid' : variant;

  // Color configurations
  const getColors = () => {
    if (normalizedVariant === 'solid') {
      switch (type) {
        case 'primary':
          return {
            bg: isDark ? colors.primary : '#16a34a',
            text: '#ffffff',
          };
        case 'secondary':
          return {
            bg: isDark ? '#3b82f6' : '#6366f1',
            text: '#ffffff',
          };
        case 'danger':
          return {
            bg: '#dc2626',
            text: '#ffffff',
          };
      }
    }

    // Outline variant
    if (normalizedVariant === 'outline') {
      return {
        bg: 'transparent',
        text: isDark ? colors.primary : '#16a34a',
        border: isDark ? colors.primary : '#16a34a',
      };
    }

    // Text/Link variants
    switch (type) {
      case 'primary':
        return { bg: 'transparent', text: isDark ? '#22c55e' : '#16a34a' };
      case 'secondary':
        return { bg: 'transparent', text: isDark ? '#60a5fa' : '#6366f1' };
      case 'danger':
        return { bg: 'transparent', text: '#dc2626' };
    }
  };

  const colorScheme = getColors();

  // Styles
  const containerStyle: ViewStyle = {
    height: currentSize.height,
    paddingHorizontal: currentSize.paddingHorizontal,
    borderRadius: 16,
    flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: currentSize.gap,
    backgroundColor: normalizedVariant === 'solid' ? colorScheme.bg : 'transparent',
    opacity: isDisabled ? 0.6 : 1,
    ...(fullWidth && { width: '100%' }),
    ...(normalizedVariant === 'outline' && {
      borderWidth: 1,
      borderColor: (colorScheme as any).border || colorScheme.text,
    }),
  };

  const textStyleComputed: TextStyle = {
    color: colorScheme.text,
    fontSize: currentSize.fontSize,
    fontFamily: 'IRANSans-Medium',
    textAlign: 'center',
    writingDirection: direction.dir,
  };

  return (
    <TouchableOpacity
      {...rest}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[containerStyle, style]}
      className={className}
    >
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
    </TouchableOpacity>
  );
};

export default CustomButton;
