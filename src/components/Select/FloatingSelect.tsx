// src/components/Select/FloatingSelect.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated, // ✅ ADD THIS for animations
} from 'react-native';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

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
  dir = 'rtl',
  containerStyle,
  selectStyle,
  labelStyle,
  floatingLabel = true,
}) => {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = !!value;

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
              textAlign: dir === 'rtl' ? 'right' : 'left',
              fontFamily: 'IRANSans',
            },
          ]}
        >
          {selectedOption?.label || placeholder || 'Select...'}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? '#888888' : '#666666'}
          style={[
            styles.icon,
            { transform: [{ rotate: modalVisible ? '180deg' : '0deg' }] },
          ]}
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
                right: dir === 'rtl' ? 12 : undefined,
                left: dir === 'ltr' ? 12 : undefined,
                fontFamily: 'IRANSans',
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
              textAlign: dir === 'rtl' ? 'right' : 'left',
              fontFamily: 'IRANSans',
            },
          ]}
        >
          {error}
        </Text>
      )}

      {/* Options Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.card : colors.background },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: isDark ? colors.text : '#000000',
                  fontFamily: 'IRANSans-Bold',
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                },
              ]}
            >
              {label || 'Select an option'}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={[
                    styles.option,
                    {
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
                        textAlign: dir === 'rtl' ? 'right' : 'left',
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
              )}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 14,
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 4,
    // ✅ REMOVED: transition property (doesn't exist in RN)
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
});

export default FloatingSelect;