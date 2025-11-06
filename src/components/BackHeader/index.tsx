import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/styles/theme';

interface BackHeaderProps {
  title?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightElement,
}) => {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isRTL = i18n.language === 'fa';

  const handleBackPress = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View className={`border-b ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-200'}`} style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between px-4 py-3 min-h-[56px]">
        <View className="flex-1">
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} className="flex-row items-center py-1 px-1" activeOpacity={0.7}>
              <Ionicons
                name={isRTL ? 'arrow-forward' : 'arrow-back'}
                size={24}
                color={isDark ? colors.text : '#000000'}
              />
              <Text className={`text-base ml-1 mr-1 ${isDark ? 'text-white' : 'text-black'}`}>
                {t('return')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-[2] items-center justify-center">
          {title && (
            <Text className={`text-lg font-bold text-center ${isDark ? 'text-white' : 'text-black'}`} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        <View className="flex-1 items-end">{rightElement}</View>
      </View>
    </View>
  );
};

export default BackHeader;
