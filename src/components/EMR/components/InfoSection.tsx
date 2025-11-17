import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';

interface InfoSectionProps {
  title: string;
  data: any[] | null;
  emptyMessage: string;
  renderItem?: (item: any, index: number) => React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  emptyMessage,
  renderItem,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasData = data && data.length > 0;
  const displayData = isExpanded ? data : data?.slice(0, 3);

  return (
    <View className="bg-card rounded-xl p-4 mb-4 shadow-sm">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between mb-3"
      >
        <Text className="text-foreground text-lg font-bold">{title}</Text>
        {hasData && data.length > 3 && (
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.foreground}
          />
        )}
      </TouchableOpacity>

      {!hasData ? (
        <View className="py-4 items-center">
          <Ionicons
            name="document-text-outline"
            size={48}
            color={colors.textTertiary}
          />
          <Text className="text-foreground-tertiary text-sm mt-2">
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <View>
          {displayData?.map((item, index) =>
            renderItem ? (
              renderItem(item, index)
            ) : (
              <DefaultInfoItem key={index} item={item} index={index} />
            )
          )}

          {!isExpanded && data.length > 3 && (
            <TouchableOpacity
              onPress={() => setIsExpanded(true)}
              className="mt-2 py-2"
            >
              <Text className="text-primary text-center">
                {t('showMore')} ({data.length - 3})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const DefaultInfoItem: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  return (
    <View
      className="py-3 border-b border-divider last:border-b-0"
    >
      {typeof item === 'string' ? (
        <Text className="text-foreground">{item}</Text>
      ) : (
        <>
          {item.name && (
            <Text className="text-foreground font-medium">{item.name}</Text>
          )}
          {item.description && (
            <Text className="text-foreground-secondary text-sm mt-1">
              {item.description}
            </Text>
          )}
          {item.date && (
            <Text className="text-foreground-tertiary text-xs mt-1">
              {item.date}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default InfoSection;