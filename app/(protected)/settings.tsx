// app/(protected)/settings.tsx
import { BackHeader } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { useTheme } from '@/styles/theme';
import { changeLanguage } from '@/translations/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const dispatch = useDispatch();

  const text = {
    settings: t('settings', { defaultValue: direction.isRTL ? 'تنظیمات' : 'Settings' }),
    appearance: t('appearance', { defaultValue: direction.isRTL ? 'ظاهر' : 'Appearance' }),
    darkMode: t('darkMode', { defaultValue: direction.isRTL ? 'حالت تاریک' : 'Dark mode' }),
    language: t('language', { defaultValue: direction.isRTL ? 'زبان' : 'Language' }),
    about: t('about', { defaultValue: direction.isRTL ? 'درباره' : 'About' }),
    version: t('appVersion', { defaultValue: direction.isRTL ? 'نسخه برنامه' : 'App version' }),
  };

  const handleLanguageToggle = async () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    await changeLanguage(newLang);
  };

  const SectionTitle = ({ children }: { children: string }) => (
    <Text
      style={{
        color: colors.textSecondary,
        fontFamily: 'IRANSans-Bold',
        fontSize: 12,
        marginBottom: 8,
        marginHorizontal: 4,
        textTransform: 'uppercase',
        ...direction.text,
      }}
    >
      {children}
    </Text>
  );

  return (
    <View className="flex-1">
      <BackHeader title={text.settings} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
      >
        <SectionTitle>{text.appearance}</SectionTitle>

        <View className="rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="items-center justify-between p-4" style={direction.row}>
            <View className="items-center flex-1" style={direction.row}>
              <View className="w-10 h-10 rounded-xl justify-center items-center bg-amber-400/20">
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={isDark ? '#fbbf24' : '#f59e0b'} />
              </View>
              <Text style={{ color: colors.text, fontFamily: 'IRANSans', fontSize: 15, marginHorizontal: 12, flex: 1, ...direction.text }}>
                {text.darkMode}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                dispatch(toggleTheme());
              }}
              trackColor={{ false: '#e5e7eb', true: `${colors.primary}66` }}
              thumbColor={isDark ? colors.primary : '#ffffff'}
            />
          </View>

          <View className="h-px mx-4" style={{ backgroundColor: isDark ? colors.border : '#f3f4f6' }} />

          <TouchableOpacity className="items-center justify-between p-4" style={direction.row} onPress={handleLanguageToggle}>
            <View className="items-center flex-1" style={direction.row}>
              <View className="w-10 h-10 rounded-xl justify-center items-center bg-indigo-500/15">
                <Ionicons name="language-outline" size={22} color="#6366f1" />
              </View>
              <Text style={{ color: colors.text, fontFamily: 'IRANSans', fontSize: 15, marginHorizontal: 12, flex: 1, ...direction.text }}>
                {text.language}
              </Text>
            </View>
            <View className="rounded-full px-3 py-1.5 bg-primary/15">
              <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', fontSize: 12 }}>
                {i18n.language === 'fa' ? 'فارسی' : 'English'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <SectionTitle>{text.about}</SectionTitle>

        <View className="rounded-2xl" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="items-center justify-between p-4" style={direction.row}>
            <View className="items-center flex-1" style={direction.row}>
              <View className="w-10 h-10 rounded-xl justify-center items-center bg-primary/15">
                <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
              </View>
              <Text style={{ color: colors.text, fontFamily: 'IRANSans', fontSize: 15, marginHorizontal: 12, flex: 1, ...direction.text }}>
                {text.version}
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13 }}>
              1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
