import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';

interface HealthSummaryProps {
  patientInfo: any;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const summaryItems = [
    {
      label: t('bloodGroup'),
      value: `${patientInfo?.bloodGroup || '-'} ${patientInfo?.bloodRH || ''}`,
    },
    {
      label: t('diabetes'),
      value: patientInfo?.diabetes === '1' ? t('yes') : patientInfo?.diabetes === '0' ? t('no') : '-',
    },
    {
      label: t('hypertension'),
      value: patientInfo?.hypertension === '1' ? t('yes') : patientInfo?.hypertension === '0' ? t('no') : '-',
    },
    {
      label: t('smoker'),
      value: patientInfo?.smoker === '1' ? t('yes') : patientInfo?.smoker === '0' ? t('no') : '-',
    },
  ];

  return (
    <View className="bg-card rounded-xl p-4 mb-4 shadow-sm">
      <Text className="text-foreground text-lg font-bold mb-3">
        {t('healthSummary')}
      </Text>

      <View className="flex-row flex-wrap">
        {summaryItems.map((item, index) => (
          <View key={index} className="w-1/2 pb-3">
            <Text className="text-foreground-secondary text-sm">
              {item.label}
            </Text>
            <Text className="text-foreground font-medium text-base mt-1">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HealthSummary;