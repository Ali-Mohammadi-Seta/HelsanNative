// src/components/Input/OtpInput.tsx
import { useTheme } from '@/styles/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

const toEnglishDigits = (str: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  return str.replace(/[۰-۹]/g, (w) => persianNumbers.indexOf(w).toString())
    .replace(/[٠-٩]/g, (w) => arabicNumbers.indexOf(w).toString());
};

interface OtpInputProps {
  length?: number;
  value?: string;
  onChangeText?: (otp: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  dir?: 'rtl' | 'ltr';
  containerStyle?: ViewStyle;
  boxStyle?: TextStyle; // ✅ FIX: Changed from ViewStyle to TextStyle
  textStyle?: TextStyle;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value = '',
  onChangeText,
  disabled = false,
  autoFocus = false,
  dir = 'rtl',
  containerStyle,
  boxStyle,
  textStyle,
}) => {
  const { colors, isDark } = useTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    const cleanValue = toEnglishDigits(value).replace(/\D/g, '').slice(0, length);
    const newDigits = Array.from({ length }, (_, i) => cleanValue[i] || '');
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    const convertedText = toEnglishDigits(text).replace(/\D/g, '');

    if (!convertedText) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      onChangeText?.(newDigits.join(''));
      return;
    }

    // Handle paste
    if (convertedText.length > 1) {
      const newDigits = [...digits];
      for (let i = 0; i < convertedText.length && index + i < length; i++) {
        newDigits[index + i] = convertedText[i];
      }
      setDigits(newDigits);
      onChangeText?.(newDigits.join(''));

      const nextIndex = Math.min(index + convertedText.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single digit
    const newDigits = [...digits];
    newDigits[index] = convertedText[0];
    setDigits(newDigits);
    onChangeText?.(newDigits.join(''));

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        onChangeText?.(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        { flexDirection: 'row' }, // OTP should ALWAYS be LTR, numbers read left-to-right
        containerStyle,
      ]}
    >
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digits[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          editable={!disabled}
          autoFocus={autoFocus && index === 0}
          selectTextOnFocus
          style={[
            styles.box,
            {
              borderBottomColor: digits[index]
                ? colors.primary
                : isDark
                  ? colors.border
                  : '#e0e0e0',
              color: isDark ? colors.text : '#000000',
              fontFamily: 'IRANSans-Medium',
              writingDirection: 'ltr', // OTP numbers should always be LTR
              textAlign: 'center',
            },
            boxStyle, // ✅ Now correctly typed as TextStyle
            textStyle,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  box: {
    width: 45,
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    borderBottomWidth: 2,
    backgroundColor: 'transparent',
  },
});

export default OtpInput;