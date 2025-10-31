// app/(tabs)/profile.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';
import { Button, Header } from '@/components'; // ✅ ADD Header
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // If not logged in, show login button
  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1 }}>
        {/* ✅ ADD HEADER */}
        <Header title={t('account')} />
        
        <View style={[styles.container, { backgroundColor: isDark ? colors.background : '#ffffff' }]}>
          <View style={styles.content}>
            <Ionicons 
              name="person-circle-outline" 
              size={100} 
              color={isDark ? colors.textSecondary : '#cccccc'} 
            />
            <Text style={[styles.subtitle, { color: isDark ? colors.textSecondary : '#666666' }]}>
              Please login to access your profile
            </Text>
            
            <Button
              type="primary"
              size="large"
              onPress={() => router.push('/(auth)')}
              style={styles.loginButton}
            >
              {t('user.login')}
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // If logged in, show profile options
  return (
    <View style={{ flex: 1 }}>
      {/* ✅ ADD HEADER */}
      <Header title={t('myProfile')} />
      
      <View style={[styles.container, { backgroundColor: isDark ? colors.background : '#f9fafb' }]}>
        <View style={styles.header}>
          <Ionicons 
            name="person-circle" 
            size={80} 
            color={colors.primary} 
          />
          <Text style={[styles.userName, { color: isDark ? colors.text : '#000000' }]}>
            Welcome Back!
          </Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: isDark ? colors.card : '#ffffff' }]}
            onPress={() => router.push('/(protected)/edit-profile')}
          >
            <Ionicons name="person-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: isDark ? colors.text : '#000000' }]}>
              {t('myProfile')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? colors.textSecondary : '#999999'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: isDark ? colors.card : '#ffffff' }]}
            onPress={() => router.push('/(protected)/my-emr')}
          >
            <Ionicons name="heart-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: isDark ? colors.text : '#000000' }]}>
              {t('myDoc')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? colors.textSecondary : '#999999'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: isDark ? colors.card : '#ffffff' }]}
          >
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: isDark ? colors.text : '#000000' }]}>
              {t('settings')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? colors.textSecondary : '#999999'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: isDark ? colors.card : '#ffffff' }]}
          >
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
            <Text style={[styles.menuText, { color: '#dc2626' }]}>
              {t('logOut')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'IRANSans-Bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'IRANSans',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    minWidth: 200,
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'IRANSans',
    marginLeft: 12,
  },
});