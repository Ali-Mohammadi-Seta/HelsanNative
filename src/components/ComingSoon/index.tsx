import { BackHeader, Button } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type ComingSoonProps = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
};

export default function ComingSoon({ title, icon = 'sparkles-outline', accent }: ComingSoonProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const primary = accent || colors.primary;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackHeader title={title} />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: isDark ? colors.background : colors.surface }}
        contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-3xl overflow-hidden border"
          style={{ backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border }}
        >
          <LinearGradient
            colors={isDark ? ['#17251f', '#1f2623'] : ['#ecfdf5', '#ffffff']}
            className="px-5 pt-8 pb-7"
          >
            <View className="items-center">
              <View
                className="w-24 h-24 rounded-3xl items-center justify-center mb-5"
                style={{ backgroundColor: `${primary}1f` }}
              >
                <Ionicons name={icon} size={46} color={primary} />
              </View>
              <Text
                style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 21, ...direction.centeredText }}
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

          <View className="p-5">
            <Button
              type="primary"
              variant="outline"
              fullWidth
              icon={<Ionicons name={direction.isRTL ? 'arrow-forward' : 'arrow-back'} size={18} color={colors.primary} />}
              onPress={() => router.back()}
            >
              {t('return')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
