// src/components/Input/FloatingInput.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

const PERSIAN_DIGITS = ['\u06f0', '\u06f1', '\u06f2', '\u06f3', '\u06f4', '\u06f5', '\u06f6', '\u06f7', '\u06f8', '\u06f9'];
const ARABIC_DIGITS = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];

const toEnglishDigits = (str: string): string =>
  str
    .replace(/[\u06f0-\u06f9]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[\u0660-\u0669]/g, (char) => String(ARABIC_DIGITS.indexOf(char)));

const toPersianDigits = (str: string): string =>
  str.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);

const formatPrice = (value: string): string => {
  if (!value) return '';
  const numberValue = Number(value.replace(/,/g, ''));
  if (Number.isNaN(numberValue)) return '';
  return new Intl.NumberFormat('en-US').format(numberValue);
};

interface FloatingInputProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  type?: 'text' | 'number' | 'password';
  priceFormatter?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  dir?: 'rtl' | 'ltr';
  passwordToggle?: boolean;
  floatingLabel?: boolean;
  localizeDigits?: boolean;
  allowPersian?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value = '',
  onChangeText,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  type = 'text',
  priceFormatter = false,
  containerStyle,
  inputStyle,
  labelStyle,
  dir,
  passwordToggle = false,
  floatingLabel = true,
  localizeDigits,
  allowPersian: _allowPersian = true,
  placeholder,
  ...rest
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelDir = dir ?? direction.dir;
  const labelIsRTL = labelDir === 'rtl';
  const isNumeric = type === 'number' || priceFormatter;
  const inputDir = isNumeric ? 'ltr' : labelDir;
  const inputIsRTL = inputDir === 'rtl';
  const shouldLocalizeDigits = localizeDigits ?? (direction.isRTL && isNumeric);
  const normalizedValue = isNumeric ? toEnglishDigits(value) : value;
  const formattedValue = priceFormatter ? formatPrice(normalizedValue) : normalizedValue;
  const displayValue = shouldLocalizeDigits ? toPersianDigits(formattedValue) : formattedValue;

  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const focusAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, labelAnimation]);

  useEffect(() => {
    Animated.timing(focusAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, focusAnimation]);

  const handleChange = (text: string) => {
    if (priceFormatter) {
      const unformatted = toEnglishDigits(text).replace(/,/g, '');
      if (!/^\d*$/.test(unformatted)) return;
      onChangeText?.(unformatted);
      return;
    }

    if (type === 'number') {
      const convertedValue = toEnglishDigits(text);
      onChangeText?.(convertedValue);
      return;
    }

    onChangeText?.(text);
  };

  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [multiline ? 20 : 16, -10],
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12],
  });

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.inputBorderFocused
      : colors.inputBorder;

  const borderWidth = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const labelBackgroundColor = disabled
    ? isDark
      ? colors.surface
      : '#f5f5f5'
    : colors.inputBackground;

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderWidth,
            backgroundColor: labelBackgroundColor,
            minHeight: multiline ? 80 : 52,
            borderRadius: 14,
          },
        ]}
      >
        <TextInput
          {...rest}
          value={displayValue}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={isNumeric ? 'numeric' : rest.keyboardType ?? 'default'}
          style={[
            styles.input,
            {
              color: colors.text,
              textAlign: inputIsRTL ? 'right' : 'left',
              writingDirection: inputDir,
              paddingTop: floatingLabel && (isFocused || value) ? 18 : 14,
              fontFamily: 'IRANSans',
            },
            multiline && { textAlignVertical: 'top', paddingTop: 24 },
            inputStyle,
          ]}
          placeholder={floatingLabel ? (isFocused ? placeholder : undefined) : placeholder}
          placeholderTextColor={colors.textTertiary}
        />

        {floatingLabel && label && (
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelFontSize,
                color: error
                  ? colors.error
                  : isFocused
                    ? colors.primary
                    : colors.textTertiary,
                backgroundColor: labelBackgroundColor,
                right: labelIsRTL ? 12 : undefined,
                left: labelIsRTL ? undefined : 12,
                fontFamily: 'IRANSans',
                writingDirection: labelDir,
                textAlign: labelIsRTL ? 'right' : 'left',
                zIndex: 2,
              },
              labelStyle,
            ]}
          >
            {label}
          </Animated.Text>
        )}

        {type === 'password' && passwordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={[
              styles.eyeIcon,
              { left: labelIsRTL ? 12 : undefined, right: labelIsRTL ? undefined : 12 },
            ]}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {error && (
        <View
          style={[
            styles.errorContainer,
            { flexDirection: labelIsRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text
            style={[
              styles.errorText,
              {
                color: colors.error,
                textAlign: labelIsRTL ? 'right' : 'left',
                writingDirection: labelDir,
                fontFamily: 'IRANSans',
              },
            ]}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingTop: 8,
  },
  inputWrapper: {
    position: 'relative',
    paddingHorizontal: 14,
    overflow: 'visible',
  },
  input: {
    fontSize: 14,
    paddingVertical: 14,
    minHeight: 52,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 4,
  },
  eyeIcon: {
    position: 'absolute',
    top: 16,
  },
  errorContainer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
});

export default FloatingInput;
