// app/health-tourism.tsx
import { BackHeader } from '@/components';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

export default function HealthTourismScreen() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    return (
        <View className="flex-1">
            <BackHeader title={t('healthTourism')} />
            <ScrollView
                className="flex-1"
                style={{ backgroundColor: isDark ? colors.background : '#ffffff' }}
                contentContainerStyle={{ padding: 20 }}
            >
                <Text
                    className="text-xl mb-3"
                    style={{ fontFamily: 'IRANSans-Bold', color: isDark ? colors.text : '#000' }}
                >
                    ✈️ {t('healthTourism')}
                </Text>
                <Text
                    className="text-sm"
                    style={{ fontFamily: 'IRANSans', color: isDark ? colors.textSecondary : '#666' }}
                >
                    {t('comingSoon') || 'این بخش به زودی فعال خواهد شد'}
                </Text>
            </ScrollView>
        </View>
    );
}
