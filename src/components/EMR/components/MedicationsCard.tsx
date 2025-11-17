import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import InfoSection from './InfoSection';

interface MedicationsCardProps {
  medications: any;
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ medications }) => {
  const { t } = useTranslation();

  const medicationData = medications?.drugs?.map((item: any) => ({
    name: item.drugName || item.name,
    dosage: item.dosage || '',
    frequency: item.frequency || '',
    duration: item.duration || '',
    prescribedBy: item.doctorName || '',
    startDate: item.startDate || '',
  }));

  return (
    <InfoSection
      title={t('medications')}
      data={medicationData}
      emptyMessage={t('noMedications')}
      renderItem={(item) => (
        <View className="py-3 border-b border-divider last:border-b-0">
          <Text className="text-foreground font-medium">{item.name}</Text>

          <View className="mt-2 space-y-1">
            {item.dosage && (
              <View className="flex-row">
                <Text className="text-foreground-secondary text-sm w-24">
                  {t('dosage')}:
                </Text>
                <Text className="text-foreground text-sm flex-1">
                  {item.dosage}
                </Text>
              </View>
            )}

            {item.frequency && (
              <View className="flex-row">
                <Text className="text-foreground-secondary text-sm w-24">
                  {t('frequency')}:
                </Text>
                <Text className="text-foreground text-sm flex-1">
                  {item.frequency}
                </Text>
              </View>
            )}

            {item.duration && (
              <View className="flex-row">
                <Text className="text-foreground-secondary text-sm w-24">
                  {t('duration')}:
                </Text>
                <Text className="text-foreground text-sm flex-1">
                  {item.duration}
                </Text>
              </View>
            )}
          </View>

          {(item.prescribedBy || item.startDate) && (
            <View className="flex-row justify-between mt-2">
              {item.prescribedBy && (
                <Text className="text-foreground-tertiary text-xs">
                  {t('prescribedBy')}: {item.prescribedBy}
                </Text>
              )}
              {item.startDate && (
                <Text className="text-foreground-tertiary text-xs">
                  {item.startDate}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    />
  );
};

export default MedicationsCard;