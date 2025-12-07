// app/doctors-consultation.tsx
import { BackHeader, Button } from '@/components';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text, View } from 'react-native';

const SSO_URL = 'https://sso.inhso.ir/oidc/auth?client_id=client_1754117598828_b4e0885381f0f549&redirect_uri=https://consultation.inhso.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir';

export default function DoctorsConsultationScreen() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    const openConsultationWebsite = () => {
        Linking.openURL(SSO_URL);
    };

    return (
        <View className="flex-1">
            <BackHeader title={t('doctorsAndCounselingPsychologist')} />
            <ScrollView
                className="flex-1"
                style={{ backgroundColor: isDark ? colors.background : '#ffffff' }}
                contentContainerStyle={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }}
            >
                <Text
                    className="text-xl mb-3 text-center"
                    style={{ fontFamily: 'IRANSans-Bold', color: isDark ? colors.text : '#000' }}
                >
                    👨‍⚕️ {t('doctorsAndCounselingPsychologist')}
                </Text>
                <Text
                    className="text-sm text-center mb-6"
                    style={{ fontFamily: 'IRANSans', color: isDark ? colors.textSecondary : '#666' }}
                >
                    برای مشاوره با پزشکان و روانشناسان، به سامانه مشاوره آنلاین هدایت می‌شوید
                </Text>
                <Button type="primary" size="large" onPress={openConsultationWebsite}>
                    ورود به سامانه مشاوره
                </Button>
            </ScrollView>
        </View>
    );
}
