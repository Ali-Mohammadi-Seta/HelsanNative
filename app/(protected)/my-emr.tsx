import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BackHeader } from '@/components';
import { useTheme } from '@/styles/theme';
import { useGetQuestionnaireStatus } from '@/lib/hooks/emr/useGetQuestionnaireStatus';
import { useGetUserHealthInfo } from '@/lib/hooks/emr/useGetUserHealthInfo';
import Questionnaire from '@/components/EMR/Questionnaire';
import MyHealthInfo from '@/components/EMR/MyHealthInfo';

export default function MyEmrScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { questionnaireStatus, isLoading: isLoadingStatus } = useGetQuestionnaireStatus();
  const { isLoading: isLoadingHealth } = useGetUserHealthInfo();

  const isLoading = isLoadingStatus || isLoadingHealth;

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      <BackHeader title={t('myDoc')} />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" className="text-primary" />
          </View>
        ) : !questionnaireStatus?.selfExpressionFilledBefore ? (
          <Questionnaire />
        ) : (
          <MyHealthInfo />
        )}
      </ScrollView>
    </View>
  );
}