import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import InfoSection from './InfoSection';

interface DiagnosisCardProps {
  patientInfo: any;
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();

  const diagnosisData = patientInfo?.diagnosis?.map((item: any) => ({
    name: item.diagnosisName || item.name,
    description: item.description || '',
    date: item.date || item.createdAt,
    doctor: item.doctorName || '',
  }));

  return (
    <InfoSection
      title={t('diagnosis')}
      data={diagnosisData}
      emptyMessage={t('noDiagnosis')}
      renderItem={(item) => (
        <View className="py-3 border-b border-divider last:border-b-0">
          <Text className="text-foreground font-medium">{item.name}</Text>
          {item.description && (
            <Text className="text-foreground-secondary text-sm mt-1">
              {item.description}
            </Text>
          )}
          <View className="flex-row justify-between mt-2">
            {item.doctor && (
              <Text className="text-foreground-tertiary text-xs">
                {t('doctor')}: {item.doctor}
              </Text>
            )}
            {item.date && (
              <Text className="text-foreground-tertiary text-xs">
                {item.date}
              </Text>
            )}
          </View>
        </View>
      )}
    />
  );
};

export default DiagnosisCard;