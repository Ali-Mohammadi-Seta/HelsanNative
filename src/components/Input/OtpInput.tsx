// src/components/Input/OtpInput.tsx
import { toEnglishDigits } from '@/lib/format/digits';
import { shadows, useTheme } from '@/styles/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface OtpInputProps {
  length?: number;
  value?: string;
  onChangeText?: (otp: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  dir?: 'rtl' | 'ltr';
  containerStyle?: ViewStyle;
  boxStyle?: TextStyle;
  textStyle?: TextStyle;
}

function OtpCell({
  digit,
  isFocused,
}: {
  digit: string;
  isFocused: boolean;
}) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (digit) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 90 }),
        withSpring(1, { damping: 18, stiffness: 160 }),
      );
    }
  }, [digit, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        styles.cellContainer,
        {
          backgroundColor: digit
            ? isDark ? 'rgba(34, 197, 94, 0.10)' : 'rgba(22, 163, 74, 0.07)'
            : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.82)',
          borderColor: digit || isFocused ? colors.primary : colors.inputBorder,
          borderWidth: isFocused || digit ? 1.5 : 1,
        },
        digit ? shadows.sm : {},
      ]}
    />
  );
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value = '',
  onChangeText,
  disabled = false,
  autoFocus = false,
  containerStyle,
  boxStyle,
  textStyle,
}) => {
  const { colors } = useTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const cleanValue = toEnglishDigits(value).replace(/\D/g, '').slice(0, length);
    setDigits(Array.from({ length }, (_, index) => cleanValue[index] || ''));
  }, [value, length]);

  const emitDigits = (nextDigits: string[]) => {
    setDigits(nextDigits);
    onChangeText?.(nextDigits.join(''));
  };

  const handleChange = (text: string, index: number) => {
    const convertedText = toEnglishDigits(text).replace(/\D/g, '');

    if (!convertedText) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      emitDigits(nextDigits);
      return;
    }

    if (convertedText.length > 1) {
      const nextDigits = [...digits];
      for (let i = 0; i < convertedText.length && index + i < length; i += 1) {
        nextDigits[index + i] = convertedText[i];
      }
      emitDigits(nextDigits);
      inputRefs.current[Math.min(index + convertedText.length, length - 1)]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = convertedText[0];
    emitDigits(nextDigits);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key !== 'Backspace') return;
    if (digits[index] || index <= 0) return;

    const nextDigits = [...digits];
    nextDigits[index - 1] = '';
    emitDigits(nextDigits);
    inputRefs.current[index - 1]?.focus();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }).map((_, index) => (
        <View key={index} style={styles.cellWrapper}>
          <OtpCell digit={digits[index]} isFocused={focusedIndex === index} />
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={digits[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!disabled}
            autoFocus={autoFocus && index === 0}
            selectTextOnFocus
            style={[
              styles.hiddenInput,
              {
                color: colors.text,
                fontFamily: 'IRANSans-Bold',
                writingDirection: 'ltr',
                textAlign: 'center',
              },
              boxStyle,
              textStyle,
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 18,
  },
  cellWrapper: {
    height: 54,
    position: 'relative',
    width: 44,
  },
  cellContainer: {
    borderRadius: 14,
    height: 54,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 44,
  },
  hiddenInput: {
    backgroundColor: 'transparent',
    fontSize: 22,
    height: 54,
    left: 0,
    position: 'absolute',
    textAlign: 'center',
    top: 0,
    width: 44,
  },
});

export default OtpInput;
