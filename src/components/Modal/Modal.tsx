// src/components/Modal/Modal.tsx
import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ModalProps as RNModalProps,
  DimensionValue, // ✅ ADD THIS
} from 'react-native';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../Button';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface CustomModalProps extends Omit<RNModalProps, 'visible'> {
  open: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  okText?: string;
  cancelText?: string;
  showClose?: boolean;
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  size?: ModalSize;
  containerClassName?: string;
  dir?: 'rtl' | 'ltr';
  destroyOnClose?: boolean;
}

const Modal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  onCancel,
  onOk,
  title,
  children,
  footer,
  okText = 'OK',
  cancelText = 'Cancel',
  showClose = true,
  closable,
  closeOnOverlayClick = true,
  maskClosable,
  centered = true,
  size = 'md',
  dir = 'rtl',
  destroyOnClose = false,
  ...rest
}) => {
  const { colors, isDark } = useTheme();

  const handleClose = onCancel || onClose;
  const shouldShowClose = closable ?? showClose;
  const shouldCloseOnOverlayClick = maskClosable ?? closeOnOverlayClick;

  if (destroyOnClose && !open) {
    return null;
  }

  // ✅ FIX: Use DimensionValue type
  const sizeWidths: Record<ModalSize, DimensionValue> = {
    sm: '80%',
    md: '85%',
    lg: '90%',
    xl: '95%',
    full: '100%',
  };

  const renderFooter = () => {
    if (footer !== undefined) return footer;
    if (onOk) {
      return (
        <View style={styles.defaultFooter}>
          <CustomButton
            type="secondary"
            variant="text"
            onPress={handleClose}
            style={{ flex: 1 }}
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            type="primary"
            onPress={onOk}
            style={{ flex: 1 }}
          >
            {okText}
          </CustomButton>
        </View>
      );
    }
    return null;
  };

  const finalFooter = renderFooter();

  return (
    <RNModal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      {...rest}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => shouldCloseOnOverlayClick && handleClose?.()}
      >
        <View
          style={[
            styles.modalWrapper,
            centered && styles.centered,
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? colors.card : colors.background,
                width: sizeWidths[size], // ✅ Now type-safe
              },
            ]}
          >
            {/* Header */}
            {(title || shouldShowClose) && (
              <View
                style={[
                  styles.header,
                  {
                    borderBottomColor: isDark ? colors.border : '#e0e0e0',
                    flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
                  },
                ]}
              >
                {title && (
                  <Text
                    style={[
                      styles.title,
                      {
                        color: isDark ? colors.text : '#000000',
                        fontFamily: 'IRANSans-Bold',
                        textAlign: dir === 'rtl' ? 'right' : 'left',
                      },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                {shouldShowClose && (
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDark ? colors.text : '#666666'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Body */}
            <ScrollView style={styles.body}>
              <View style={{ padding: 20 }}>{children}</View>
            </ScrollView>

            {/* Footer */}
            {finalFooter !== null && (
              <View
                style={[
                  styles.footer,
                  { borderTopColor: isDark ? colors.border : '#e0e0e0' },
                ]}
              >
                {finalFooter}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    maxHeight: '70%',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  defaultFooter: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default Modal;