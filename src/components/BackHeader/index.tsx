import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme, shadows } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { BlurView } from 'expo-blur';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackHeaderProps {
  title?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightElement,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.88, { damping: 12, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [scale]);

  const handleBackPress = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View style={shadows.sm}>
      <BlurView
        intensity={60}
        tint={isDark ? "dark" : "light"}
        style={[
          {
            paddingTop: insets.top + 4,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.headerBorder,
            backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
          },
        ]}
      >
      <View
        className="items-center justify-between px-4 py-2.5 min-h-[52px]"
        style={direction.row}
      >
        <View className="flex-1" style={direction.startItems}>
          {showBackButton && (
            <AnimatedPressable
              onPress={handleBackPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[
                animatedStyle,
                {
                  flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 6,
                },
              ]}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? colors.cardElevated : colors.surface,
                }}
              >
                <Ionicons
                  name={direction.isRTL ? 'arrow-forward' : 'arrow-back'}
                  size={20}
                  color={colors.text}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'IRANSans-Medium',
                  color: colors.textSecondary,
                  writingDirection: direction.dir,
                }}
              >
                {t('return')}
              </Text>
            </AnimatedPressable>
          )}
        </View>

        <View className="flex-[2] items-center justify-center">
          {title && (
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'IRANSans-Bold',
                textAlign: 'center',
                writingDirection: direction.dir,
                color: colors.text,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        <View className="flex-1" style={direction.endItems}>
          {rightElement}
        </View>
      </View>
      </BlurView>
    </View>
  );
};

export default BackHeader;
