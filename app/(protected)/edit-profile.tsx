// app/(protected)/edit-profile.tsx
import { BackHeader } from '@/components';
import { useUserProfile } from '@/lib/api/useAuth';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function EditProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';

  const { data: userProfile, isLoading } = useUserProfile(true);

  if (isLoading) {
    return (
      <View className="flex-1">
        <BackHeader title={t('myProfile') || 'پروفایل من'} />
        <View className={`flex-1 justify-center items-center ${isDark ? 'bg-background' : 'bg-white'}`}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  const profileFields = [
    { label: t('firstName') || 'نام', value: userProfile?.firstName || '-', icon: 'person-outline' },
    { label: t('lastName') || 'نام خانوادگی', value: userProfile?.lastName || '-', icon: 'person-outline' },
    { label: t('mobileNumber') || 'شماره موبایل', value: userProfile?.phone || '-', icon: 'call-outline' },
    { label: t('nationalId') || 'کد ملی', value: userProfile?.nationalId || '-', icon: 'card-outline' },
  ];

  return (
    <View className="flex-1">
      <BackHeader title={t('myProfile') || 'پروفایل من'} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Avatar */}
        <View className="items-center p-6">
          <View className="w-24 h-24 rounded-full justify-center items-center bg-primary/20">
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
        </View>

        {/* Profile Fields */}
        <View className="p-4">
          {profileFields.map((field, index) => (
            <View
              key={index}
              className={`flex-row items-center p-4 rounded-2xl mb-2.5 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}
            >
              <View className="w-10 h-10 rounded-xl justify-center items-center bg-primary/15">
                <Ionicons name={field.icon as any} size={20} color={colors.primary} />
              </View>
              <View className={`flex-1 mx-3 ${isRTL ? 'items-end' : 'items-start'}`}>
                <Text className={`text-xs mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
                  {field.label}
                </Text>
                <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'IRANSans-Bold' }}>
                  {field.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}