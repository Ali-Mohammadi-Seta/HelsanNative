import { useDirection } from '@/lib/hooks/useDirection';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { RootState } from '@/redux/store';
import { useTheme, shadows } from '@/styles/theme';
import { changeLanguage } from '@/translations/i18n';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ActionButton({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 12, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      style={animStyle}
    >
      {children}
    </AnimatedPressable>
  );
}

const Header: React.FC<HeaderProps> = ({ title, showBack, onBackPress }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const handleThemeToggle = useCallback(() => dispatch(toggleTheme()), [dispatch]);
  const handleLanguageToggle = useCallback(async () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    await changeLanguage(newLang);
  }, [i18n.language]);

  const LogoSection = () => (
    <View className="items-center gap-2" style={direction.row}>
      <Image source={require('@/assets/images/logo.png')} className="w-9 h-9" resizeMode="contain" />
      <View style={direction.startItems}>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'IRANSans-Bold',
            color: colors.primary,
            ...direction.text,
          }}
          numberOfLines={1}
        >
          {t('logoTitle')}
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'IRANSans',
            marginTop: -1,
            color: colors.textTertiary,
            ...direction.text,
          }}
          numberOfLines={1}
        >
          {t('footer.text3')}
        </Text>
      </View>
    </View>
  );

  const ActionsSection = () => (
    <View className="items-center gap-1" style={direction.row}>
      {/* Language toggle */}
      <ActionButton onPress={handleLanguageToggle}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            height: 34,
            paddingHorizontal: 10,
            borderRadius: 12,
            backgroundColor: isDark ? colors.cardElevated : colors.surface,
          }}
        >
          <Ionicons name="globe-outline" size={17} color={colors.textSecondary} />
          <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 11 }}>
            {i18n.language === 'fa' ? 'EN' : 'FA'}
          </Text>
        </View>
      </ActionButton>

      {/* Theme toggle */}
      <ActionButton onPress={handleThemeToggle}>
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
            name={isDark ? 'sunny' : 'moon'}
            size={18}
            color={isDark ? '#fbbf24' : '#6366f1'}
          />
        </View>
      </ActionButton>

      {/* Notifications */}
      {isLoggedIn && (
        <ActionButton onPress={() => {}}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? colors.cardElevated : colors.surface,
              position: 'relative',
            }}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
            <View
              style={{
                position: 'absolute',
                top: 3,
                right: 3,
                minWidth: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: colors.error,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 3,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 8, fontFamily: 'IRANSans-Bold' }}>3</Text>
            </View>
          </View>
        </ActionButton>
      )}
    </View>
  );

  const BackButtonSection = () => (
    <ActionButton onPress={onBackPress || (() => {})}>
      <View
        style={{
          width: 36,
          height: 36,
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
    </ActionButton>
  );

  return (
    <View
      style={[
        {
          paddingTop: insets.top + 4,
          backgroundColor: colors.headerBackground,
          borderBottomWidth: 1,
          borderBottomColor: colors.headerBorder,
        },
        shadows.sm,
      ]}
    >
      <View
        className="items-center justify-between px-4 py-2.5 min-h-[52px]"
        style={direction.row}
      >
        <View className="flex-1" style={direction.startItems}>
          {showBack ? <BackButtonSection /> : <LogoSection />}
        </View>

        {title && (
          <View className="flex-[2] items-center">
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'IRANSans-Bold',
                color: colors.text,
                textAlign: 'center',
                writingDirection: direction.dir,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        )}

        <View className="flex-1" style={direction.endItems}>
          <ActionsSection />
        </View>
      </View>
    </View>
  );
};

export default Header;
