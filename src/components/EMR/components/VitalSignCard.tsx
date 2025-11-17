import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/theme';

interface VitalSignCardProps {
  title: string;
  value: string | number;
  icon?: string;
  unit?: string;
  className?: string;
}

const VitalSignCard: React.FC<VitalSignCardProps> = ({
  title,
  value,
  icon,
  unit,
  className = '',
}) => {
  const { colors, isDark } = useTheme();

  const getIconName = (): any => {
    switch (icon) {
      case 'heart':
        return 'heart-outline';
      case 'thermometer':
        return 'thermometer-outline';
      case 'activity':
        return 'pulse-outline';
      case 'droplet':
        return 'water-outline';
      default:
        return 'medical-outline';
    }
  };

  return (
    <View className={`bg-card rounded-xl p-4 shadow-sm ${className}`}>
      <View className="flex-row items-center mb-2">
        <Ionicons
          name={getIconName()}
          size={20}
          color={colors.primary}
        />
        <Text className="text-foreground-secondary text-sm ml-2 flex-1">
          {title}
        </Text>
      </View>

      <Text className="text-foreground text-xl font-bold">
        {value}
        {unit && (
          <Text className="text-foreground-secondary text-sm font-normal">
            {' '}{unit}
          </Text>
        )}
      </Text>
    </View>
  );
};

export default VitalSignCard;