import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const insets = useSafeAreaInsets();

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
      <View
        className="items-center justify-between px-4 py-3 min-h-[56px]"
        style={direction.row}
      >
        <View className="flex-1" style={direction.startItems}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="items-center py-1 px-1"
              style={direction.row}
              activeOpacity={0.7}
            >
              <Ionicons
                name={direction.isRTL ? 'arrow-forward' : 'arrow-back'}
                size={24}
                color={isDark ? colors.text : '#000000'}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 4,
                  marginRight: 4,
                  fontFamily: 'IRANSans',
                  color: isDark ? colors.text : '#000000',
                  writingDirection: direction.dir,
                }}
              >
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
                writingDirection: direction.dir,
                color: isDark ? colors.text : '#000000',
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        <View className="flex-1" style={direction.endItems}>
          {rightElement}
        </View>
      </View>
    </View>
  );
};

export default BackHeader;
