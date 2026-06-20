import { BackHeader, Button, SkeletonList } from '@/components';
import { useLogout, useUserProfile } from '@/lib/api/useAuth';
import { useDirection } from '@/lib/hooks/useDirection';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';

type MenuItemProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  danger?: boolean;
};

const imageHeaders = {
  Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'User-Agent': 'Mozilla/5.0',
};

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const { width } = useWindowDimensions();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(isLoggedIn);
  const logoutMutation = useLogout();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const isCompact = width < 380;

  const text = {
    account: t('account'),
    loginRequired: t('pleaseLoginToAccessProfile'),
    login: t('user.login'),
    register: t('Register'),
    profile: t('myProfile'),
    profileSub: direction.isRTL ? 'اطلاعات هویتی و نقش کاربری' : 'Identity and role information',
    emr: t('myDoc'),
    emrSub: direction.isRTL ? 'سلامت، نسخه‌ها و مشاوره‌ها' : 'Health record, prescriptions, and advices',
    support: direction.isRTL ? 'پشتیبانی' : 'Support',
    supportSub: direction.isRTL ? 'ثبت و پیگیری تیکت‌ها' : 'Create and follow support tickets',
    settings: t('settings'),
    settingsSub: direction.isRTL ? 'زبان، ظاهر و نسخه برنامه' : 'Language, appearance, and app version',
    logout: t('logOut'),
    logoutConfirm: t('logoutConfirmation'),
    cancel: t('cancel'),
    citizen: t('roles.Citizen'),
  };

  const handleLogout = async () => {
    Alert.alert(text.logout, text.logoutConfirm, [
      { text: text.cancel, style: 'cancel' },
      {
        text: text.logout,
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutMutation.mutateAsync();
          } catch {
            // Cleanup still happens in the logout mutation onSettled handler.
          }
        },
      },
    ]);
  };

  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const displayName =
    firstName || lastName
      ? [firstName, lastName].filter(Boolean).join(' ')
      : userProfile?.phone || t('user.user');
  const role = (userProfile as any)?.currentRole || userProfile?.role || text.citizen;
  const avatarUri = ((userProfile as any)?.profilePhotoUrl || userProfile?.profileImage || '').trim();
  const showAvatar = avatarUri && !avatarFailed;

  const MenuItem = ({ title, subtitle, icon, color, onPress, danger }: MenuItemProps) => (
    <TouchableOpacity
      className="rounded-2xl p-4 mb-3 border"
      style={{ backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border }}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View className="items-center" style={direction.row}>
        <View
          className="w-12 h-12 rounded-2xl justify-center items-center"
          style={{ backgroundColor: `${color}1f` }}
        >
          <Ionicons name={icon} size={23} color={color} />
        </View>
        <View className="flex-1 mx-3" style={direction.startItems}>
          <Text
            style={{
              color: danger ? '#dc2626' : colors.text,
              fontFamily: 'IRANSans-Bold',
              fontSize: 15,
              ...direction.text,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: 'IRANSans',
                fontSize: 12,
                lineHeight: 20,
                marginTop: 2,
                ...direction.text,
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>
        <Ionicons
          name={direction.isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={danger ? '#dc2626' : colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <BackHeader title={text.account} showBackButton={false} />
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: isDark ? colors.background : colors.surface }}
          contentContainerStyle={{ padding: 16, paddingTop: 28, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className="rounded-3xl overflow-hidden border"
            style={{ backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border }}
          >
            <LinearGradient
              colors={isDark ? ['#0d1f17', '#132b1f'] : ['#ecfdf5', '#f0fdfa']}
              className="px-5 pt-7 pb-6"
            >
              <View className="items-center">
                <View className="w-24 h-24 rounded-3xl items-center justify-center mb-4 bg-white/70">
                  <Ionicons name="person-circle-outline" size={74} color={colors.primary} />
                </View>
                <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 21, ...direction.centeredText }}>
                  {text.account}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: 'IRANSans',
                    fontSize: 14,
                    lineHeight: 23,
                    marginTop: 8,
                    ...direction.centeredText,
                  }}
                >
                  {text.loginRequired}
                </Text>
              </View>
            </LinearGradient>

            <View className="p-5 gap-3">
              <Button
                type="primary"
                size="large"
                fullWidth
                icon={<Ionicons name="log-in-outline" size={19} color="#ffffff" />}
                onPress={() => router.push('/(auth)')}
              >
                {text.login}
              </Button>
              <Button
                type="secondary"
                variant="outline"
                size="large"
                fullWidth
                icon={<Ionicons name="person-add-outline" size={19} color={colors.primary} />}
                onPress={() => router.push({ pathname: '/(auth)', params: { flow: 'register' } })}
              >
                {text.register}
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (isProfileLoading) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <BackHeader title={text.account} showBackButton={false} />
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: isDark ? colors.background : colors.surface }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <SkeletonList count={6} rows={2} avatar />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <BackHeader title={text.account} showBackButton={false} />

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: isDark ? colors.background : colors.surface }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={isDark ? ['#0d1f17', '#162019'] : ['#ecfdf5', '#ffffff']}
          className="rounded-3xl p-5 mb-5 overflow-hidden border"
          style={{ borderColor: colors.border }}
        >
          <View className="items-center" style={isCompact ? undefined : direction.row}>
            <View className="w-[82px] h-[82px] rounded-3xl justify-center items-center overflow-hidden bg-white/70">
              {showAvatar ? (
                <Image
                  source={{ uri: encodeURI(avatarUri), headers: imageHeaders }}
                  style={{ width: 82, height: 82 }}
                  resizeMode="cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <Ionicons name="person" size={42} color={colors.primary} />
              )}
            </View>
            <View className={isCompact ? 'mt-4' : 'flex-1 mx-4'} style={isCompact ? { alignItems: 'center' } : direction.startItems}>
              <Text
                style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 20, ...direction.text }}
                numberOfLines={2}
              >
                {displayName}
              </Text>
              {userProfile?.phone && (
                <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', marginTop: 5, writingDirection: 'ltr' }}>
                  {userProfile.phone}
                </Text>
              )}
              <View className="rounded-full px-3 py-1 mt-3" style={{ backgroundColor: `${colors.primary}1f` }}>
                <Text style={{ color: colors.primary, fontFamily: 'IRANSans-Bold', fontSize: 11 }}>
                  {role}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <MenuItem
          title={text.profile}
          subtitle={text.profileSub}
          icon="person-outline"
          color={colors.primary}
          onPress={() => router.push('/(protected)/edit-profile')}
        />
        <MenuItem
          title={text.emr}
          subtitle={text.emrSub}
          icon="heart-outline"
          color="#ef4444"
          onPress={() => router.push('/(protected)/my-emr')}
        />
        <MenuItem
          title={text.support}
          subtitle={text.supportSub}
          icon="headset-outline"
          color={colors.secondary}
          onPress={() => router.push('/(protected)/support' as any)}
        />
        <MenuItem
          title={text.settings}
          subtitle={text.settingsSub}
          icon="settings-outline"
          color="#6366f1"
          onPress={() => router.push('/(protected)/settings')}
        />
        <MenuItem
          title={text.logout}
          icon="log-out-outline"
          color="#dc2626"
          danger
          onPress={handleLogout}
        />
      </ScrollView>
    </View>
  );
}
