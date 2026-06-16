import { BackHeader, Button, Modal } from '@/components';
import {
  getDeliveredPrescriptionsApi,
  getEmrAdviceApi,
  getMyPrescriptionsApi,
  getPrescriptionDetailsApi,
} from '@/lib/api/apiService';
import { useGetQuestionnaireStatus } from '@/lib/hooks/emr/useGetQuestionnaireStatus';
import { useGetUserHealthInfo } from '@/lib/hooks/emr/useGetUserHealthInfo';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import Questionnaire from '@/components/EMR/Questionnaire';
import MyHealthInfo from '@/components/EMR/MyHealthInfo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type EmrTab = 'health-record' | 'my-prescription' | 'delivered-prescription' | 'my-advices';

type Prescription = {
  _id?: string;
  prescHead?: string;
  eid?: string;
  createdAt?: string;
  prescriptionType?: string;
  insuranceCompany?: string;
  nezamPezeshki?: string;
  description?: string;
  services?: any[];
  [key: string]: any;
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const getPrescriptionKey = (item: Prescription, index: number) =>
  item._id || item.prescHead || item.eid || String(index);

export default function MyEmrScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [activeTab, setActiveTab] = useState<EmrTab>('health-record');
  const { questionnaireStatus, isLoading: isLoadingStatus } = useGetQuestionnaireStatus();
  const { isLoading: isLoadingHealth } = useGetUserHealthInfo();
  const status = questionnaireStatus as { selfExpressionFilledBefore?: boolean } | undefined;
  const isHealthLoading = isLoadingStatus || isLoadingHealth;

  const tabs: { key: EmrTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    {
      key: 'health-record',
      label: t('healthRec', { defaultValue: direction.isRTL ? 'اطلاعات سلامت' : 'Health record' }),
      icon: 'pulse-outline',
    },
    {
      key: 'my-prescription',
      label: t('myPrescs', { defaultValue: direction.isRTL ? 'نسخه‌های صادرشده' : 'My prescriptions' }),
      icon: 'document-text-outline',
    },
    {
      key: 'delivered-prescription',
      label: t('deliveredPrescs', { defaultValue: direction.isRTL ? 'نسخه‌های دریافت‌شده' : 'Delivered prescriptions' }),
      icon: 'file-tray-full-outline',
    },
    {
      key: 'my-advices',
      label: t('myAdvices', { defaultValue: direction.isRTL ? 'مشاوره‌های من' : 'My advices' }),
      icon: 'chatbubbles-outline',
    },
  ];

  const renderContent = () => {
    if (activeTab === 'health-record') {
      if (isHealthLoading) {
        return (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
      }
      return !status?.selfExpressionFilledBefore ? <Questionnaire /> : <MyHealthInfo />;
    }

    if (activeTab === 'my-advices') {
      return <AdviceList />;
    }

    return <PrescriptionList mode={activeTab === 'delivered-prescription' ? 'delivered' : 'issued'} />;
  };

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      <BackHeader title={t('myDoc', { defaultValue: direction.isRTL ? 'پرونده من' : 'My medical file' })} />

      <View style={{ backgroundColor: colors.background }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
            flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className="rounded-full px-4 py-2.5"
                style={{
                  backgroundColor: active ? colors.primary : isDark ? colors.card : '#ffffff',
                  borderWidth: active ? 0 : 1,
                  borderColor: isDark ? colors.border : '#e5e7eb',
                }}
              >
                <View className="items-center gap-2" style={direction.row}>
                  <Ionicons name={tab.icon} size={16} color={active ? '#ffffff' : colors.primary} />
                  <Text
                    style={{
                      color: active ? '#ffffff' : colors.text,
                      fontFamily: 'IRANSans-Bold',
                      fontSize: 12,
                      writingDirection: direction.dir,
                    }}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-1">
        {renderContent()}
      </View>
    </View>
  );
}

function PrescriptionList({ mode }: { mode: 'issued' | 'delivered' }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const isDelivered = mode === 'delivered';

  const prescriptionsQuery = useQuery({
    queryKey: [isDelivered ? 'deliveredPrescriptions' : 'myPrescriptions'],
    queryFn: () => (isDelivered ? getDeliveredPrescriptionsApi({}, 1, 20) : getMyPrescriptionsApi({}, 1, 20)),
  });

  const detailsQuery = useQuery({
    queryKey: ['prescriptionDetails', selectedPrescription?.prescHead],
    queryFn: () => getPrescriptionDetailsApi(selectedPrescription?.prescHead || ''),
    enabled: !!selectedPrescription?.prescHead && !isDelivered,
  });

  const prescriptions: Prescription[] = useMemo(() => {
    const data = prescriptionsQuery.data as any;
    return data?.docs ?? data?.data?.docs ?? [];
  }, [prescriptionsQuery.data]);

  const detailPrescription = (detailsQuery.data as any) || selectedPrescription;
  const services = detailPrescription?.services ?? [];

  const emptyText = t('NoData', { defaultValue: direction.isRTL ? 'موردی یافت نشد' : 'No items found' });

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {prescriptionsQuery.isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : prescriptions.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="document-text-outline" size={46} color={colors.primary} />
          <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', marginTop: 10, ...direction.centeredText }}>
            {emptyText}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {prescriptions.map((item, index) => (
            <TouchableOpacity
              key={getPrescriptionKey(item, index)}
              className="rounded-2xl p-4 mb-3"
              style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
              activeOpacity={0.75}
              onPress={() => setSelectedPrescription(item)}
            >
              <View className="items-start" style={direction.row}>
                <View className="w-12 h-12 rounded-2xl items-center justify-center bg-primary/15">
                  <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                </View>
                <View className="flex-1 mx-3" style={direction.startItems}>
                  <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 15, ...direction.text }}>
                    {t('presc', { defaultValue: direction.isRTL ? 'نسخه' : 'Prescription' })}
                    {' '}
                    {item.prescHead || item.eid || '-'}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, marginTop: 4, ...direction.text }}>
                    {formatDate(item.createdAt)} · {item.prescriptionType || t('visit', { defaultValue: direction.isRTL ? 'ویزیت' : 'Visit' })}
                  </Text>
                </View>
                <Ionicons name={direction.isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        open={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        title={t('viewPresc', { defaultValue: direction.isRTL ? 'مشاهده نسخه' : 'View prescription' })}
        size="xl"
      >
        {detailsQuery.isLoading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View>
            <PrescriptionDetailRow label={t('prescriptionCode', { defaultValue: direction.isRTL ? 'کد نسخه' : 'Prescription code' })} value={detailPrescription?.prescHead || detailPrescription?.eid || '-'} />
            <PrescriptionDetailRow label={t('medicalId', { defaultValue: direction.isRTL ? 'کد نظام پزشکی' : 'Medical ID' })} value={detailPrescription?.nezamPezeshki || '-'} />
            <PrescriptionDetailRow label={t('date', { defaultValue: direction.isRTL ? 'تاریخ' : 'Date' })} value={formatDate(detailPrescription?.createdAt)} />
            {detailPrescription?.description && (
              <PrescriptionDetailRow label={t('desc', { defaultValue: direction.isRTL ? 'توضیحات' : 'Description' })} value={detailPrescription.description} />
            )}

            <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 15, marginBottom: 10, ...direction.text }}>
              {direction.isRTL ? 'خدمات' : 'Services'}
            </Text>
            {services.length ? (
              services.map((service: any, index: number) => (
                <View
                  key={service._id || service.srvCode || index}
                  className="rounded-xl p-3 mb-2"
                  style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}
                >
                  <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 13, ...direction.text }}>
                    {service.srvName || service.service?.srvName || service.label || '-'}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, marginTop: 4, ...direction.text }}>
                    {t('count', { defaultValue: direction.isRTL ? 'تعداد' : 'Count' })}: {service.quantity ?? service.srvQty ?? service.requestCount ?? '-'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', ...direction.centeredText }}>
                {emptyText}
              </Text>
            )}
          </View>
        )}
      </Modal>
    </View>
  );
}

function PrescriptionDetailRow({ label, value }: { label: string; value: string }) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  return (
    <View
      className="rounded-xl p-3 mb-2"
      style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}
    >
      <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, ...direction.text }}>
        {label}
      </Text>
      <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 14, marginTop: 3, ...direction.text }}>
        {value}
      </Text>
    </View>
  );
}

function AdviceList() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const adviceQuery = useQuery({
    queryKey: ['emrAdvice'],
    queryFn: getEmrAdviceApi,
  });

  const advices = useMemo(() => {
    const record = adviceQuery.data as any;
    return [...(record?.advices ?? [])].sort(
      (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
    );
  }, [adviceQuery.data]);

  if (adviceQuery.isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!advices.length) {
    return (
      <View className="flex-1 justify-center items-center p-8" style={{ backgroundColor: colors.background }}>
        <Ionicons name="chatbubbles-outline" size={46} color={colors.primary} />
        <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', marginTop: 10, ...direction.centeredText }}>
          {t('NoData', { defaultValue: direction.isRTL ? 'موردی یافت نشد' : 'No items found' })}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {advices.map((item: any) => (
        <View key={item._id || `${item.fullName}-${item.date}`} className="rounded-2xl p-4 mb-3" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="items-start" style={direction.row}>
            <View className="w-12 h-12 rounded-2xl items-center justify-center bg-emerald-500/15">
              <Ionicons name="person-outline" size={24} color="#16a34a" />
            </View>
            <View className="flex-1 mx-3" style={direction.startItems}>
              <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 15, ...direction.text }}>
                {item.fullName || '-'}
              </Text>
              <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, marginTop: 4, ...direction.text }}>
                {formatDate(item.date)} · {t('medicalId', { defaultValue: direction.isRTL ? 'کد نظام پزشکی' : 'Medical ID' })}: {item.nezamPezeshki || '-'}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.text, fontFamily: 'IRANSans', fontSize: 13, lineHeight: 23, marginTop: 12, ...direction.text }}>
            {item.advice || '-'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
