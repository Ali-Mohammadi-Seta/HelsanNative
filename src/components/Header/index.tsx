import { useDirection } from '@/lib/hooks/useDirection';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';
import { changeLanguage } from '@/translations/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, onBackPress }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const handleThemeToggle = () => dispatch(toggleTheme());
  const handleLanguageToggle = async () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    await changeLanguage(newLang);
  };

  const LogoSection = () => (
    <View className="items-center gap-2" style={direction.row}>
      <Image source={require('@/assets/images/logo.png')} className="w-10 h-10" resizeMode="contain" />
      <View style={direction.startItems}>
        <Text
          style={{
            fontSize: 16,
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
            marginTop: -2,
            color: isDark ? colors.textSecondary : '#6b7280',
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
    <View className="flex-row items-center gap-1">
      <TouchableOpacity onPress={handleLanguageToggle} className="h-9 min-w-9 px-2 items-center justify-center rounded-full">
        <View className="flex-row items-center gap-1">
          <Ionicons name="language-outline" size={20} color={colors.text} />
          <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 11 }}>
            {i18n.language === 'fa' ? 'EN' : 'FA'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleThemeToggle} className="w-9 h-9 items-center justify-center rounded-full">
        <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={isDark ? '#fbbf24' : '#6366f1'} />
      </TouchableOpacity>

      {isLoggedIn && (
        <TouchableOpacity className="w-9 h-9 items-center justify-center relative rounded-full">
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-error items-center justify-center px-1">
            <Text className="text-white text-[9px] font-bold">3</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const BackButtonSection = () => (
    <TouchableOpacity onPress={onBackPress} className="w-9 h-9 items-center justify-center rounded-full">
      <Ionicons name={direction.isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        backgroundColor: isDark ? colors.card : '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? colors.border : colors.divider,
      }}
    >
      <View
        className="items-center justify-between px-4 py-3 min-h-[56px]"
        style={direction.row}
      >
        <View className="flex-1" style={direction.startItems}>
          {showBack ? <BackButtonSection /> : <LogoSection />}
        </View>

        {title && (
          <View className="flex-[2] items-center">
            <Text
              style={{
                fontSize: 18,
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
