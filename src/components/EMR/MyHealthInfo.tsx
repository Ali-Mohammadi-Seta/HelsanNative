// src/components/EMR/MyHealthInfo.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
// import { MotiView } from 'moti';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { useGetUserHealthInfo } from '@/lib/hooks/emr/useGetUserHealthInfo';
import { useGetEmrServices } from '@/lib/hooks/auth/useGetEmrServices';
import { SkeletonList } from '@/components/Skeleton';

import PatientInfoCard from './components/PatientInfoCard';
import HealthSummaryCard from './components/HealthSummaryCard';
import VitalSignsSection from './components/VitalSignsSection';
import VitalChartModal from './components/VitalChartModal';
import DiagnosisCard from './components/DiagnosisCard';
import AllergiesCard from './components/AllergiesCard';
import MedicationsCard from './components/MedicationsCard';
import SurgeriesCard from './components/SurgeriesCard';
import VaccinationsCard from './components/VaccinationsCard';
import AddictionsCard from './components/AddictionsCard';
import FamilialDiseaseCard from './components/FamilialDiseaseCard';
import PregnanciesCard from './components/PregnanciesCard';
import ExaminesCard from './components/ExaminesCard';
import ParaServicesCard from './components/ParaServicesCard';
import { useGetUserProfile } from '@/lib/hooks/auth/useGetUserProfile';

export type ChartType =
  | 'bloodPressure'
  | 'temperature'
  | 'heartRate'
  | 'respiratory'
  | 'bloodSugar'
  | 'bmi';

const MyHealthInfo: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const {
    userHealthInfo,
    isLoading: isLoadingHealth,
    refetch: refetchHealth,
  } = useGetUserHealthInfo();

  const {
    userServices,
    isGettingServices,
    refetch: refetchServices,
  } = useGetEmrServices();

  // Fixed: useGetUserProfile now returns { userProfile, ... }
  const { data: userProfile } = useGetUserProfile();

  const [chartModal, setChartModal] = useState<{
    open: boolean;
    type: ChartType | null;
  }>({ open: false, type: null });

  const [refreshing, setRefreshing] = useState(false);

  const healthData =
    (userHealthInfo as any)?.data ?? (userHealthInfo as any) ?? {};
  const servicesData =
    (userServices as any)?.data ?? (userServices as any) ?? {};
  const vitalSigns: any[] = healthData?.vitalSigns ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchHealth(), refetchServices()]);
    } finally {
      setRefreshing(false);
    }
  };

  const openChart = (type: ChartType) =>
    setChartModal({ open: true, type });

  const closeChart = () =>
    setChartModal({ open: false, type: null });

  if (isLoadingHealth || isGettingServices) {
    return (
      <View
        style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
      >
        <SkeletonList count={6} rows={3} avatar />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: isDark ? colors.background : '#f4f7f4' }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Page title */}
        <Animated.View
          entering={FadeInDown.duration(280).springify().damping(18)}
          style={[
            styles.pageTitleRow,
            { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <View
            style={[
              styles.pageTitleBar,
              { backgroundColor: colors.primary },
            ]}
          />
          <Text
            style={[
              styles.pageTitle,
              { color: colors.text, writingDirection: direction.dir },
            ]}
          >
            {direction.isRTL ? 'اطلاعات پزشکی من' : 'My Medical Records'}
          </Text>
        </Animated.View>

        {/* Patient Info */}
        <PatientInfoCard
          patientInfo={healthData}
          userProfile={userProfile as any}
        />

        {/* Health Summary */}
        <HealthSummaryCard patientInfo={healthData} />

        {/* Vital Charts */}
        <VitalSignsSection
          vitalSigns={vitalSigns}
          onChartPress={openChart}
        />

        {/* Expandable sections — each has its own stagger delay */}
        <DiagnosisCard patientInfo={healthData} />
        <AllergiesCard patientInfo={healthData} />
        <MedicationsCard medications={servicesData} />
        <SurgeriesCard patientInfo={healthData} />
        <VaccinationsCard patientInfo={healthData} />
        <AddictionsCard patientInfo={healthData} />
        <FamilialDiseaseCard patientInfo={healthData} />
        <PregnanciesCard patientInfo={healthData} />
        <ExaminesCard services={servicesData} />
        <ParaServicesCard services={servicesData} />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Chart Modal */}
      <VitalChartModal
        open={chartModal.open}
        onClose={closeChart}
        chartType={chartModal.type}
        vitalSigns={vitalSigns}
      />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitleRow: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  pageTitleBar: {
    borderRadius: 2,
    height: 22,
    width: 4,
  },
  pageTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 18,
    lineHeight: 28,
  },
});

export default MyHealthInfo;