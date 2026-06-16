import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Button from '@/components/Button';
import {
  consumePendingSsoRedirectUrl,
  normalizeRoles,
  setStoredCurrentRole,
} from '@/lib/auth/sso';
import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';

const roleTranslationKey: Record<string, string> = {
  Citizen: 'roles.Citizen',
  Doctor: 'roles.Doctor',
  Nurse: 'roles.nurse',
  Receptionist: 'roles.receptionist',
  ClinicAdmin: 'roles.clinicAdmin',
  ParaclinicAdmin: 'roles.paraclinicAdmin',
  Psychologist: 'roles.Psychologist',
};

interface ChooseCurrentRoleProps {
  setShowChooseRoleModal: (show: boolean) => void;
}

export default function ChooseCurrentRole({ setShowChooseRoleModal }: ChooseCurrentRoleProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { userRole } = useSelector((state: RootState) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const normalizedRoles = normalizeRoles(userRole);

  const roleLabel = (role: string) =>
    t(roleTranslationKey[role] || `roles.${role}`, { defaultValue: role });

  const handleSubmit = async () => {
    if (!selectedRole) {
      Toast.show({
        type: 'warning',
        text1: t('pleaseSelectRole'),
      });
      return;
    }

    await setStoredCurrentRole(selectedRole);

    Toast.show({
      type: 'success',
      text1: `${t('currentRoleSetTo')}: ${roleLabel(selectedRole)}`,
    });

    const pendingSsoRedirectUrl = await consumePendingSsoRedirectUrl();
    if (pendingSsoRedirectUrl) {
      router.replace({ pathname: '/doctors-consultation', params: { url: pendingSsoRedirectUrl } });
      return;
    }

    setShowChooseRoleModal(false);
    router.replace('/(tabs)/home');
  };

  return (
    <View className="p-4">
      <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
        {t('chooseRole')}
      </Text>

      <View className="gap-2">
        {normalizedRoles.map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => setSelectedRole(role)}
            className={`p-4 rounded-lg border-2 ${
              selectedRole === role
                ? 'border-primary bg-primary/10'
                : isDark
                  ? 'border-border-dark bg-card-dark'
                  : 'border-gray-200 bg-white'
            }`}
          >
            <View className="flex-row items-center">
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedRole === role
                    ? 'border-primary bg-primary'
                    : isDark
                      ? 'border-gray-600'
                      : 'border-gray-400'
                }`}
              >
                {selectedRole === role && (
                  <View className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </View>
              <Text className={`text-base ${isDark ? 'text-white' : 'text-black'}`}>
                {roleLabel(role)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        type="primary"
        size="large"
        onPress={handleSubmit}
        disabled={!selectedRole}
        fullWidth
        className="mt-6"
      >
        {t('ok')}
      </Button>
    </View>
  );
}
