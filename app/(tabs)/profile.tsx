// app/(tabs)/profile.tsx
import { Button, Header } from '@/components';
import { useLogout, useUserProfile } from '@/lib/api/useAuth';
import { removeTokens } from '@/lib/auth/tokenStorage';
import { setIsLoggedIn } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const isRTL = i18n.language === 'fa';

  // Fetch user profile when logged in
  const { data: userProfile, isLoading } = useUserProfile(isLoggedIn);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    Alert.alert(
      t('logOut'),
      t('logoutConfirmation') || 'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
      [
        { text: t('cancel') || 'انصراف', style: 'cancel' },
        {
          text: t('logOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
              await removeTokens();
              dispatch(setIsLoggedIn(false));
              router.replace('/(tabs)/home');
            } catch (error) {
              await removeTokens();
              dispatch(setIsLoggedIn(false));
              router.replace('/(tabs)/home');
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    router.push('/(protected)/settings');
  };

  // If not logged in, show login button
  if (!isLoggedIn) {
    return (
      <View className="flex-1">
        <Header title={t('account')} />

        <View className={`flex-1 justify-center items-center p-5 ${isDark ? 'bg-background' : 'bg-white'}`}>
          <Ionicons name="person-circle-outline" size={100} color={isDark ? colors.textSecondary : '#cccccc'} />
          <Text className={`text-base text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
            {t('pleaseLoginToAccessProfile') || 'برای دسترسی به پروفایل وارد شوید'}
          </Text>

          <Button type="primary" size="large" onPress={() => router.push('/(auth)')} style={{ minWidth: 200 }}>
            {t('user.login')}
          </Button>
        </View>
      </View>
    );
  }

  // Get display name
  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : (userProfile?.phone || t('user') || 'کاربر');

  // If logged in, show profile options
  return (
    <View className="flex-1">
      <Header title={t('account')} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className={`items-center p-6 mx-4 mt-4 rounded-2xl shadow-lg ${isDark ? 'bg-card' : 'bg-white'}`}>
          <View className="w-[90px] h-[90px] rounded-full justify-center items-center mb-3 bg-primary/20">
            <Ionicons name="person" size={50} color={colors.primary} />
          </View>
          <Text className={`text-xl ${isDark ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'IRANSans-Bold' }}>
            {displayName}
          </Text>
          {userProfile?.phone && (
            <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'IRANSans' }}>
              {userProfile.phone}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View className="p-4">
          <TouchableOpacity
            className={`flex-row items-center p-4 rounded-2xl mb-2.5 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}
            onPress={() => router.push('/(protected)/edit-profile')}
          >
            <View className="w-[42px] h-[42px] rounded-xl justify-center items-center bg-primary/15">
              <Ionicons name="person-outline" size={22} color={colors.primary} />
            </View>
            <Text className={`flex-1 text-base mx-3.5 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
              {t('myProfile')}
            </Text>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={isDark ? colors.textSecondary : '#999999'} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center p-4 rounded-2xl mb-2.5 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}
            onPress={() => router.push('/(protected)/my-emr')}
          >
            <View className="w-[42px] h-[42px] rounded-xl justify-center items-center bg-red-500/15">
              <Ionicons name="heart-outline" size={22} color="#ef4444" />
            </View>
            <Text className={`flex-1 text-base mx-3.5 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
              {t('myDoc') || 'پرونده سلامت من'}
            </Text>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={isDark ? colors.textSecondary : '#999999'} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center p-4 rounded-2xl mb-2.5 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}
            onPress={handleSettings}
          >
            <View className="w-[42px] h-[42px] rounded-xl justify-center items-center bg-indigo-500/15">
              <Ionicons name="settings-outline" size={22} color="#6366f1" />
            </View>
            <Text className={`flex-1 text-base mx-3.5 ${isDark ? 'text-white' : 'text-black'} ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
              {t('settings') || 'تنظیمات'}
            </Text>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={isDark ? colors.textSecondary : '#999999'} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center p-4 rounded-2xl mt-5 shadow-sm ${isDark ? 'bg-card' : 'bg-white'}`}
            onPress={handleLogout}
          >
            <View className="w-[42px] h-[42px] rounded-xl justify-center items-center bg-red-600/15">
              <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            </View>
            <Text className={`flex-1 text-base mx-3.5 text-red-600 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'IRANSans' }}>
              {t('logOut') || 'خروج'}
            </Text>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}