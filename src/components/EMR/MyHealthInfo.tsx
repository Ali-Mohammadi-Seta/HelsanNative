import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useGetUserHealthInfo } from '@/lib/hooks/emr/useGetUserHealthInfo';
import DiagnosisCard from './components/DiagnosisCard';
import AllergiesCard from './components/AllergiesCard';
import MedicationsCard from './components/MedicationsCard';
import HealthSummary from './components/HealthSummary';
import VitalSignCard from './components/VitalSignCard';
import { useGetEmrServices } from '@/lib/hooks/auth/useGetEmrServices';

const MyHealthInfo: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { userHealthInfo, isLoading: isLoadingHealth } = useGetUserHealthInfo();
  const { userServices, isGettingServices } = useGetEmrServices();

  if (isLoadingHealth || isGettingServices) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4">
        {/* Patient Info Card */}
        <View className="bg-card rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-foreground text-lg font-bold mb-3">
            {t('patientInfo')}
          </Text>
          <PatientInfoRow
            label={t('name')}
            value={userHealthInfo?.data?.name || '-'}
          />
          <PatientInfoRow
            label={t('nationalId')}
            value={userHealthInfo?.data?.nationalId || '-'}
          />
          <PatientInfoRow
            label={t('age')}
            value={userHealthInfo?.data?.age || '-'}
          />
        </View>

        {/* Health Summary */}
        <HealthSummary patientInfo={userHealthInfo?.data} />

        {/* Vital Signs Grid */}
        <Text className="text-foreground text-lg font-bold mb-3">
          {t('vitalSigns')}
        </Text>
        <View className="flex-row flex-wrap justify-between mb-4">
          <VitalSignCard
            title={t('bloodPressure')}
            value={userHealthInfo?.data?.vitalSigns?.bloodPressure || '-'}
            icon="heart"
            unit="mmHg"
            className="w-[48%] mb-3"
          />
          <VitalSignCard
            title={t('temp')}
            value={userHealthInfo?.data?.vitalSigns?.temperature || '-'}
            icon="thermometer"
            unit="°C"
            className="w-[48%] mb-3"
          />
          <VitalSignCard
            title={t('heartBeats')}
            value={userHealthInfo?.data?.vitalSigns?.heartRate || '-'}
            icon="activity"
            unit="bpm"
            className="w-[48%] mb-3"
          />
          <VitalSignCard
            title={t('bloodsugar')}
            value={userHealthInfo?.data?.vitalSigns?.bloodSugar || '-'}
            icon="droplet"
            unit="mg/dl"
            className="w-[48%] mb-3"
          />
        </View>

        {/* Medical Info Sections */}
        <DiagnosisCard patientInfo={userHealthInfo?.data} />
        <AllergiesCard patientInfo={userHealthInfo?.data} />
        <MedicationsCard medications={userServices?.data} />
      </View>
    </ScrollView>
  );
};

const PatientInfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="flex-row justify-between py-2 border-b border-divider last:border-b-0">
    <Text className="text-foreground-secondary">{label}</Text>
    <Text className="text-foreground font-medium">{value}</Text>
  </View>
);

export default MyHealthInfo;