// src/components/Modal/Modal.tsx
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme, shadows } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode, useEffect } from 'react';
import {
  DimensionValue,
  Modal as RNModal,
  ModalProps as RNModalProps,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
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
  disableScrollView?: boolean;
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
  dir,
  destroyOnClose = false,
  disableScrollView = false,
  ...rest
}) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const modalDir = dir ?? direction.dir;
  const isRTL = modalDir === 'rtl';

  const handleClose = onCancel || onClose;
  const shouldShowClose = closable ?? showClose;
  const shouldCloseOnOverlayClick = maskClosable ?? closeOnOverlayClick;

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (open) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [open, translateY, opacity, overlayOpacity]);

  const contentAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const overlayAnimStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (destroyOnClose && !open) {
    return null;
  }

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
        <View style={[styles.defaultFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      {...rest}
    >
      <View style={styles.fullContainer}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, overlayAnimStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => shouldCloseOnOverlayClick && handleClose?.()}
          />
        </Animated.View>

        {/* Modal Content */}
        <View style={[styles.modalWrapper, centered && styles.centered]}>
          <Animated.View
            style={[
              contentAnimStyle,
              styles.modalContent,
              shadows.xl,
              {
                backgroundColor: isDark ? colors.glass : 'rgba(255,255,255,0.9)',
                borderColor: colors.glassBorder,
                borderWidth: 1,
                width: sizeWidths[size],
              },
            ]}
          >
            {/* Handle bar */}
            <View style={styles.handleBarContainer}>
              <View
                style={[
                  styles.handleBar,
                  { backgroundColor: isDark ? colors.border : '#d1d5db' },
                ]}
              />
            </View>

            {(title || shouldShowClose) && (
              <View
                style={[
                  styles.header,
                  {
                    borderBottomColor: isDark ? colors.border : colors.divider,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
              >
                {title && (
                  <Text
                    style={[
                      styles.title,
                      {
                        color: colors.text,
                        fontFamily: 'IRANSans-Bold',
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: modalDir,
                      },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                {shouldShowClose && (
                  <Pressable
                    onPress={handleClose}
                    style={[
                      styles.closeButton,
                      {
                        backgroundColor: isDark ? colors.surface : colors.divider,
                      },
                    ]}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                )}
              </View>
            )}

            {disableScrollView ? (
              <View style={styles.bodyStatic}>
                <View style={{ padding: 20 }}>{children}</View>
              </View>
            ) : (
              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>{children}</View>
              </ScrollView>
            )}

            {finalFooter !== null && (
              <View
                style={[
                  styles.footer,
                  { borderTopColor: isDark ? colors.border : colors.divider },
                ]}
              >
                {finalFooter}
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
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
    borderRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 2,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    maxHeight: '70%',
  },
  bodyStatic: {
    flexShrink: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  defaultFooter: {
    gap: 12,
  },
});

export default Modal;
