import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <View
      style={{
        paddingTop: insets.top + 8,
        backgroundColor: isDark ? colors.card : '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? colors.border : '#e5e5e5',
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3 min-h-[56px]">
        <View className="flex-1">
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} className="flex-row items-center py-1 px-1" activeOpacity={0.7}>
              <Ionicons
                name={isRTL ? 'arrow-forward' : 'arrow-back'}
                size={24}
                color={isDark ? colors.text : '#000000'}
              />
              <Text style={{
                fontSize: 16,
                marginLeft: 4,
                marginRight: 4,
                fontFamily: 'IRANSans',
                color: isDark ? colors.text : '#000000'
              }}>
                {t('return')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-[2] items-center justify-center">
          {title && (
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'IRANSans-Bold',
                textAlign: 'center',
                color: isDark ? colors.text : '#000000'
              }}
              numberOfLines={1}
            >
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
