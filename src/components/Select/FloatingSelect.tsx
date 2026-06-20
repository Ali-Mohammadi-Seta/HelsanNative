// src/components/Select/FloatingSelect.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface FloatingSelectProps {
  label?: string;
  value?: string | number;
  options: SelectOption[];
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
  containerStyle?: ViewStyle;
  selectStyle?: ViewStyle;
  labelStyle?: TextStyle;
  floatingLabel?: boolean;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  value,
  options = [],
  onChange,
  disabled = false,
  error,
  placeholder,
  dir,
  containerStyle,
  selectStyle,
  labelStyle,
  floatingLabel = true,
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectWidth, setSelectWidth] = useState<number | undefined>();
  const inputDir = dir ?? direction.dir;
  const isRTL = inputDir === 'rtl';

  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = value !== undefined && value !== null && value !== '';

  const borderColor = error
    ? colors.error
    : modalVisible
      ? colors.primary
      : isDark
        ? colors.border
        : '#e0e0e0';

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        onLayout={(event) => setSelectWidth(event.nativeEvent.layout.width)}
        style={[
          styles.selectWrapper,
          {
            borderColor,
            backgroundColor: disabled
              ? isDark
                ? '#1a1a1a'
                : '#f5f5f5'
              : isDark
                ? colors.card
                : colors.background,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          selectStyle,
        ]}
      >
        <Text
          style={[
            styles.selectedText,
            {
              color: hasValue
                ? isDark
                  ? colors.text
                  : '#000000'
                : isDark
                  ? '#888888'
                  : '#999999',
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: inputDir,
              fontFamily: 'IRANSans',
            },
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder || 'Select...'}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? '#888888' : '#666666'}
          style={{
            marginLeft: isRTL ? 0 : 8,
            marginRight: isRTL ? 8 : 0,
            transform: [{ rotate: modalVisible ? '180deg' : '0deg' }],
          }}
        />

        {floatingLabel && label && (
          <Text
            style={[
              styles.label,
              {
                top: hasValue || modalVisible ? -10 : 16,
                fontSize: hasValue || modalVisible ? 12 : 14,
                color: error
                  ? colors.error
                  : modalVisible
                    ? colors.primary
                    : isDark
                      ? '#888888'
                      : '#666666',
                backgroundColor: isDark ? colors.card : colors.background,
                right: isRTL ? 12 : undefined,
                left: isRTL ? undefined : 12,
                fontFamily: 'IRANSans',
                writingDirection: inputDir,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.error,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: inputDir,
              fontFamily: 'IRANSans',
            },
          ]}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: selectWidth, maxWidth: '100%', maxHeight: '70%' }}
          >
            <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? colors.card : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: isDark ? colors.text : '#000000',
                  fontFamily: 'IRANSans-Bold',
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: inputDir,
                },
              ]}
            >
              {label || 'Select an option'}
            </Text>

            <ScrollView
              style={styles.optionsList}
              showsVerticalScrollIndicator={options.length > 6}
            >
              {options.map((item) => (
                <TouchableOpacity
                  key={String(item.value)}
                  onPress={() => handleSelect(item.value)}
                  style={[
                    styles.option,
                    {
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      backgroundColor:
                        item.value === value
                          ? isDark
                            ? '#2a2a2a'
                            : '#f0f9ff'
                          : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          item.value === value
                            ? colors.primary
                            : isDark
                              ? colors.text
                              : '#000000',
                        fontFamily:
                          item.value === value ? 'IRANSans-Bold' : 'IRANSans',
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: inputDir,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selectWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 14,
    flex: 1,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    width: '100%',
  },
  modalTitle: {
    fontSize: 15,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  optionsList: {
    maxHeight: 320,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
});

export default FloatingSelect;
