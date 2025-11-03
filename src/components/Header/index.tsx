// src/components/Header/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';
import { changeLanguage } from '@/translations/i18n';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, onBackPress }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const isRTL = i18n.language === 'fa';

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageToggle = async () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    await changeLanguage(newLang);
  };

  // Logo Component
  const LogoSection = () => (
    <View className="flex-row items-center gap-2">
      <Image
        source={require('@/assets/images/logo.png')}
        className="w-10 h-10"
        resizeMode="contain"
      />
      <View>
        <Text className={`text-base font-bold text-primary ${isRTL  ? "text-right" : "text-left" } `}>
          {t('logoTitle')}
        </Text>
        <Text className={`text-[9px] font-sans -mt-0.5 ${isDark ? 'text-text-dark-secondary' : 'text-gray-600'}`}>
          {t('footer.text3')}
        </Text>
      </View>
    </View>
  );

  // Actions Component
  const ActionsSection = () => (
    <View className="flex-row items-center gap-1">
      <TouchableOpacity onPress={handleLanguageToggle} className="w-9 h-9 items-center justify-center">
        <Text className="text-[22px]">
          {i18n.language === 'fa' ? '🇮🇷' : '🇬🇧'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleThemeToggle} className="w-9 h-9 items-center justify-center">
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={22}
          color={isDark ? '#fbbf24' : '#6366f1'}
        />
      </TouchableOpacity>

      {isLoggedIn && (
        <TouchableOpacity className="w-9 h-9 items-center justify-center relative">
          <Ionicons
            name="notifications-outline"
            size={22}
            color={isDark ? colors.text : '#000000'}
          />
          <View className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-red-600 items-center justify-center px-1">
            <Text className="text-white text-[9px] font-bold">3</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  // Back Button
  const BackButtonSection = () => (
    <TouchableOpacity onPress={onBackPress} className="w-9 h-9 items-center justify-center">
      <Ionicons
        name={isRTL ? 'arrow-forward' : 'arrow-back'}
        size={24}
        color={isDark ? colors.text : '#000000'}
      />
    </TouchableOpacity>
  );

  return (
    <View
      className={`border-b ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-200'}`}
      style={{ paddingTop: insets.top + 8 }}
    >
      {/* ✅ FIXED RTL: Logo always on the side based on language */}
      <View className="flex-row items-center justify-between px-4 py-3 min-h-[56px]">
        {isRTL ? (
          <>
            {/* RTL: Actions (left) | Title (center) | Logo (right) */}
            <View className="flex-1 items-start">
              <ActionsSection />
            </View>
            {title && (
              <View className="flex-[2] items-center">
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {title}
                </Text>
              </View>
            )}
            <View className="flex-1 items-end">
              {showBack ? <BackButtonSection /> : <LogoSection />}
            </View>
          </>
        ) : (
          <>
            {/* LTR: Logo (left) | Title (center) | Actions (right) */}
            <View className="flex-1 items-start">
              {showBack ? <BackButtonSection /> : <LogoSection />}
            </View>
            {title && (
              <View className="flex-[2] items-center">
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {title}
                </Text>
              </View>
            )}
            <View className="flex-1 items-end">
              <ActionsSection />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Header;