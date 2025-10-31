// src/components/Input/FloatingInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

// Utility to convert Persian/Arabic digits to English
const toEnglishDigits = (str: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return str.replace(/[۰-۹]/g, (w) => persianNumbers.indexOf(w).toString())
            .replace(/[٠-٩]/g, (w) => arabicNumbers.indexOf(w).toString());
};

// Price formatter
const formatPrice = (value: string): string => {
  if (!value) return '';
  const numberValue = Number(value.replace(/,/g, ''));
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat().format(numberValue);
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
  dir = 'rtl',
  passwordToggle = false,
  floatingLabel = true,
  ...rest
}) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const englishValue = toEnglishDigits(value);
    setDisplayValue(priceFormatter ? formatPrice(englishValue) : englishValue);
  }, [value, priceFormatter]);

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, labelAnimation]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleChange = (text: string) => {
    const convertedValue = toEnglishDigits(text);

    if (priceFormatter) {
      const unformatted = convertedValue.replace(/,/g, '');
      if (!/^\d*$/.test(unformatted)) return;
      setDisplayValue(formatPrice(unformatted));
      onChangeText?.(unformatted);
      return;
    }

    if (type === 'number' && !/^\d*$/.test(convertedValue)) return;
    
    setDisplayValue(convertedValue);
    onChangeText?.(convertedValue);
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
    ? colors.primary
    : isDark
    ? colors.border
    : '#e0e0e0';

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: disabled
              ? isDark
                ? '#1a1a1a'
                : '#f5f5f5'
              : isDark
              ? colors.card
              : colors.background,
            minHeight: multiline ? 80 : 48,
          },
        ]}
      >
        <TextInput
          {...rest}
          value={displayValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={
            type === 'number' || priceFormatter ? 'numeric' : 'default'
          }
          style={[
            styles.input,
            {
              color: isDark ? colors.text : '#000000',
              textAlign: dir === 'rtl' ? 'right' : 'left',
              paddingTop: floatingLabel && (isFocused || value) ? 20 : 12,
              fontFamily: 'IRANSans',
            },
            multiline && { textAlignVertical: 'top', paddingTop: 24 },
            inputStyle,
          ]}
          placeholder={floatingLabel ? undefined : rest.placeholder}
          placeholderTextColor={isDark ? '#888888' : '#999999'}
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
                  : isDark
                  ? '#888888'
                  : '#666666',
                backgroundColor: isDark ? colors.card : colors.background,
                right: dir === 'rtl' ? 12 : undefined,
                left: dir === 'ltr' ? 12 : undefined,
                fontFamily: 'IRANSans',
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
              { left: dir === 'rtl' ? 12 : undefined, right: dir === 'ltr' ? 12 : undefined },
            ]}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isDark ? '#888888' : '#666666'}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.error,
              textAlign: dir === 'rtl' ? 'right' : 'left',
              fontFamily: 'IRANSans',
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 4,
  },
  eyeIcon: {
    position: 'absolute',
    top: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
});

export default FloatingInput;