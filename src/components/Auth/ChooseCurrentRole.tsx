import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ CHANGED - Direct import instead of barrel
import Button from '@/components/Button';

import { RootState } from '@/redux/store';
import { useTheme } from '@/styles/theme';

const rolesListFa: Record<string, string> = {
  Citizen: 'شهروند',
  Doctor: 'پزشک',
  Nurse: 'پرستار',
  Receptionist: 'منشی',
  ClinicAdmin: 'مدیر کلینیک',
  ParaclinicAdmin: 'مدیر پاراکلینیک',
  Psychologist: 'روانشناس',
};

interface ChooseCurrentRoleProps {
  setShowChooseRoleModal: (show: boolean) => void;
}

export default function ChooseCurrentRole({ setShowChooseRoleModal }: ChooseCurrentRoleProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { userRole } = useSelector((state: RootState) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const normalizedRoles = Array.isArray(userRole) ? userRole : [userRole];

  const handleSubmit = async () => {
    if (!selectedRole) {
      Toast.show({
        type: 'warning',
        text1: t('pleaseSelectRole'),
      });
      return;
    }

    await AsyncStorage.setItem('currentRole', selectedRole);

    Toast.show({
      type: 'success',
      text1: `${t('currentRoleSetTo')}: ${rolesListFa[selectedRole] || selectedRole}`,
    });

    setShowChooseRoleModal(false);
    router.replace('/(tabs)/home');
  };

  return (
    <View className="p-4">
      <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
        {t('chooseRole')}
      </Text>

      <View className="space-y-2">
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
                {rolesListFa[role] || role}
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