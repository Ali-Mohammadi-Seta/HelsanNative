// app/(protected)/settings.tsx
import { BackHeader } from '@/components';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { useTheme } from '@/styles/theme';
import { changeLanguage } from '@/translations/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const { colors, isDark } = useTheme();
    const dispatch = useDispatch();
    const isRTL = i18n.language === 'fa';

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleLanguageToggle = async () => {
        const newLang = i18n.language === 'en' ? 'fa' : 'en';
        await changeLanguage(newLang);
    };

    return (
        <View className="flex-1">
            <BackHeader title={t('settings') || 'تنظیمات'} />

            <View className={`flex-1 p-4 ${isDark ? 'bg-background' : 'bg-gray-50'}`}>
                {/* Appearance Section */}
                <Text className={`text-xs uppercase mb-2 mx-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans-Bold' }}>
                    {t('appearance') || 'ظاهر'}
                </Text>

                <View className={`rounded-2xl shadow-sm overflow-hidden ${isDark ? 'bg-card' : 'bg-white'}`}>
                    {/* Dark Mode Toggle */}
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-xl justify-center items-center bg-amber-400/20">
                                <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={isDark ? '#fbbf24' : '#f59e0b'} />
                            </View>
                            <Text className={`text-base mx-3 flex-1 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
                                {t('darkMode') || 'حالت تاریک'}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={handleThemeToggle}
                            trackColor={{ false: '#e5e7eb', true: colors.primary + '60' }}
                            thumbColor={isDark ? colors.primary : '#ffffff'}
                        />
                    </View>

                    <View className={`h-px mx-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />

                    {/* Language Toggle */}
                    <TouchableOpacity className="flex-row items-center justify-between p-4" onPress={handleLanguageToggle}>
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-xl justify-center items-center bg-indigo-500/15">
                                <Ionicons name="language" size={22} color="#6366f1" />
                            </View>
                            <Text className={`text-base mx-3 flex-1 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
                                {t('language') || 'زبان'}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-xl">{i18n.language === 'fa' ? '🇮🇷' : '🇬🇧'}</Text>
                            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
                                {i18n.language === 'fa' ? 'فارسی' : 'English'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <Text className={`text-xs uppercase mb-2 mx-1 mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans-Bold' }}>
                    {t('about') || 'درباره'}
                </Text>

                <View className={`rounded-2xl shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}>
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-xl justify-center items-center bg-primary/15">
                                <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
                            </View>
                            <Text className={`text-base mx-3 flex-1 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
                                {t('appVersion') || 'نسخه برنامه'}
                            </Text>
                        </View>
                        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
                            1.0.0
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
