import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import InfoSection from './InfoSection';
import { useTheme } from '@/styles/theme';

interface AllergiesCardProps {
  patientInfo: any;
}

const AllergiesCard: React.FC<AllergiesCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const allergiesData = patientInfo?.allergies?.map((item: any) => ({
    name: item.allergyName || item.name,
    severity: item.severity || 'moderate',
    reaction: item.reaction || '',
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'text-error';
      case 'moderate':
      case 'medium':
        return 'text-warning';
      case 'mild':
      case 'low':
        return 'text-success';
      default:
        return 'text-foreground-secondary';
    }
  };

  return (
    <InfoSection
      title={t('allergies')}
      data={allergiesData}
      emptyMessage={t('noAllergies')}
      renderItem={(item) => (
        <View className="py-3 border-b border-divider last:border-b-0">
          <View className="flex-row items-center">
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.warning}
              style={{ marginRight: 8 }}
            />
            <Text className="text-foreground font-medium flex-1">
              {item.name}
            </Text>
          </View>
          {item.severity && (
            <Text className={`text-sm mt-1 ${getSeverityColor(item.severity)}`}>
              {t('severity')}: {t(item.severity)}
            </Text>
          )}
          {item.reaction && (
            <Text className="text-foreground-secondary text-sm mt-1">
              {t('reaction')}: {item.reaction}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default AllergiesCard;