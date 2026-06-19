import { BackHeader, Button } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme, shadows, gradients } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

type ComingSoonProps = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
  showBackButton?: boolean;
  showReturnButton?: boolean;
};

export default function ComingSoon({
  title,
  icon = 'sparkles-outline',
  accent,
  showBackButton = true,
  showReturnButton = true,
}: ComingSoonProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const primary = accent || colors.primary;

  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    // Floating icon animation
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    iconRotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Content entrance
    contentOpacity.value = withTiming(1, { duration: 500 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [iconScale, iconRotate, contentOpacity, contentTranslateY]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const contentAnimStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackHeader title={title} showBackButton={showBackButton} />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={contentAnimStyle}>
          <View
            style={[
              shadows.lg,
              {
                borderRadius: 28,
                overflow: 'hidden',
                backgroundColor: isDark ? colors.card : '#ffffff',
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <LinearGradient
              colors={isDark ? gradients.heroBanner.dark : gradients.heroBanner.light}
              className="px-5 pt-10 pb-8"
            >
              <View className="items-center">
                <Animated.View
                  style={[
                    iconAnimStyle,
                    {
                      width: 100,
                      height: 100,
                      borderRadius: 28,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${primary}14`,
                      marginBottom: 20,
                    },
                  ]}
                >
                  <Ionicons name={icon} size={48} color={primary} />
                </Animated.View>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: 'IRANSans-Bold',
                    fontSize: 22,
                    ...direction.centeredText,
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: 'IRANSans',
                    fontSize: 14,
                    lineHeight: 24,
                    marginTop: 10,
                    ...direction.centeredText,
                  }}
                >
                  {t('comingSoon')}
                </Text>
              </View>
            </LinearGradient>

            {showReturnButton && <View className="p-5">
              <Button
                type="primary"
                variant="outline"
                fullWidth
                icon={
                  <Ionicons
                    name={direction.isRTL ? 'arrow-forward' : 'arrow-back'}
                    size={18}
                    color={colors.primary}
                  />
                }
                onPress={() => router.back()}
              >
                {t('return')}
              </Button>
            </View>}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
