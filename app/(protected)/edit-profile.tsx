// app/(protected)/edit-profile.tsx
import { BackHeader, Button, FloatingInput, FloatingSelect, Modal } from '@/components';
import { upgradeUserRoleApi } from '@/lib/api/apiService';
import { usePotentialRoles, useUserProfile } from '@/lib/api/useAuth';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

type UpgradeRole = 'doctor' | 'psychologist';

const onlyDigits = (value: string) => value.replace(/[^\d]/g, '');

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading } = useUserProfile(true);
  const { data: potentialRoles } = usePotentialRoles();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UpgradeRole>('doctor');
  const [medicalCode, setMedicalCode] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [field, setField] = useState('');
  const [educationDegree, setEducationDegree] = useState('کارشناسی');
  const [educationDegreeId, setEducationDegreeId] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [expireDate, setExpireDate] = useState('');

  const text = {
    profile: t('myProfile', { defaultValue: direction.isRTL ? 'پروفایل من' : 'My profile' }),
    firstName: t('firstName', { defaultValue: direction.isRTL ? 'نام' : 'First name' }),
    lastName: t('lastName', { defaultValue: direction.isRTL ? 'نام خانوادگی' : 'Last name' }),
    mobile: t('mobileNumber', { defaultValue: direction.isRTL ? 'شماره موبایل' : 'Mobile number' }),
    nationalId: t('nationalId', { defaultValue: direction.isRTL ? 'کد ملی' : 'National ID' }),
    role: t('selectRole', { defaultValue: direction.isRTL ? 'انتخاب نقش' : 'Select role' }),
    currentRole: direction.isRTL ? 'نقش فعلی' : 'Current role',
    upgrade: t('upgradeAccount', { defaultValue: direction.isRTL ? 'ارتقا سطح کاربری' : 'Upgrade account' }),
    upgradeSub: direction.isRTL
      ? 'برای فعال‌سازی نقش پزشک یا روانشناس، اطلاعات تخصصی خود را ثبت کنید.'
      : 'Submit your professional details to enable doctor or psychologist access.',
    doctor: t('roles.Doctor', { defaultValue: direction.isRTL ? 'پزشک' : 'Doctor' }),
    psychologist: t('roles.Psychologist', { defaultValue: direction.isRTL ? 'روانشناس' : 'Psychologist' }),
    medicalCode: t('medicalCodeInputLabel', { defaultValue: direction.isRTL ? 'کد نظام پزشکی' : 'Medical code' }),
    licenseNumber: t('licenseNumber', { defaultValue: direction.isRTL ? 'شماره پروانه' : 'License number' }),
    field: t('psychologistField', { defaultValue: direction.isRTL ? 'رشته' : 'Field' }),
    degree: t('educationDegree', { defaultValue: direction.isRTL ? 'مدرک تحصیلی' : 'Education degree' }),
    degreeId: t('educationDegreeId', { defaultValue: direction.isRTL ? 'شناسه مدرک تحصیلی' : 'Education degree ID' }),
    province: t('province', { defaultValue: direction.isRTL ? 'استان' : 'Province' }),
    city: t('city', { defaultValue: direction.isRTL ? 'شهر' : 'City' }),
    expireDate: t('expireDate', { defaultValue: direction.isRTL ? 'تاریخ اعتبار' : 'Expiration date' }),
    submit: t('sabteDarkhast', { defaultValue: direction.isRTL ? 'ثبت درخواست' : 'Submit request' }),
    required: t('requiredField', { defaultValue: direction.isRTL ? 'همه فیلدهای لازم را کامل کنید.' : 'Please complete required fields.' }),
    success: direction.isRTL ? 'درخواست ارتقای نقش ثبت شد.' : 'Role upgrade request submitted.',
    failed: direction.isRTL ? 'ثبت درخواست انجام نشد.' : 'Could not submit request.',
    citizen: t('roles.Citizen', { defaultValue: direction.isRTL ? 'شهروند' : 'Citizen' }),
  };

  const availableRoles = useMemo(() => {
    const raw = potentialRoles as any;
    const items = Array.isArray(raw) ? raw : raw?.roles ?? raw?.data ?? [];
    const roleValues = items
      .map((item: any) => String(item?.name ?? item?.value ?? item?.role ?? item).toLowerCase())
      .filter(Boolean);

    const fallback: UpgradeRole[] = ['doctor', 'psychologist'];
    const fromApi = fallback.filter((role) => roleValues.includes(role));
    return fromApi.length ? fromApi : fallback;
  }, [potentialRoles]);

  const roleOptions = availableRoles.map((role) => ({
    value: role,
    label: role === 'doctor' ? text.doctor : text.psychologist,
  }));

  const degreeOptions = [
    { value: 'کارشناسی', label: t('bachelorDegree', { defaultValue: direction.isRTL ? 'کارشناسی' : 'Bachelor' }) },
    { value: 'کارشناسی ارشد', label: t('masterDegree', { defaultValue: direction.isRTL ? 'کارشناسی ارشد' : 'Master' }) },
    { value: 'دکتری', label: t('doctorateDegree', { defaultValue: direction.isRTL ? 'دکتری' : 'Doctorate' }) },
  ];

  const upgradeMutation = useMutation({
    mutationFn: ({ role, payload }: { role: UpgradeRole; payload: Record<string, string> }) =>
      upgradeUserRoleApi(role, payload),
    onSuccess: () => {
      setUpgradeOpen(false);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      Toast.show({ type: 'success', text1: text.success });
    },
    onError: () => Toast.show({ type: 'error', text1: text.failed }),
  });

  const profileFields = [
    { label: text.firstName, value: userProfile?.firstName || '-', icon: 'person-outline' },
    { label: text.lastName, value: userProfile?.lastName || '-', icon: 'person-outline' },
    { label: text.mobile, value: userProfile?.phone || '-', icon: 'call-outline' },
    { label: text.nationalId, value: userProfile?.nationalId || '-', icon: 'card-outline' },
    { label: text.currentRole, value: userProfile?.currentRole || userProfile?.role || text.citizen, icon: 'shield-checkmark-outline' },
  ];

  const handleSubmitUpgrade = () => {
    if (selectedRole === 'doctor') {
      const code = onlyDigits(medicalCode);
      if (!code) {
        Toast.show({ type: 'error', text1: text.required });
        return;
      }
      upgradeMutation.mutate({ role: selectedRole, payload: { medicalCode: code } });
      return;
    }

    if (!licenseNumber || !field || !educationDegree || !educationDegreeId || !province || !city || !expireDate) {
      Toast.show({ type: 'error', text1: text.required });
      return;
    }

    upgradeMutation.mutate({
      role: selectedRole,
      payload: {
        licenseNumber: onlyDigits(licenseNumber),
        field: field.trim(),
        educationDegree,
        educationDegreeId: educationDegreeId.trim(),
        province: province.trim(),
        city: city.trim(),
        expireDate: expireDate.trim(),
      },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1">
        <BackHeader title={text.profile} />
        <View className={`flex-1 justify-center items-center ${isDark ? 'bg-background' : 'bg-white'}`}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <BackHeader title={text.profile} />

      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center p-5">
          <View className="w-24 h-24 rounded-3xl justify-center items-center bg-primary/15">
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
        </View>

        {profileFields.map((fieldItem, index) => (
          <View
            key={`${fieldItem.label}-${index}`}
            className="rounded-2xl p-4 mb-3"
            style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
          >
            <View className="items-center" style={direction.row}>
              <View className="w-11 h-11 rounded-xl justify-center items-center bg-primary/15">
                <Ionicons name={fieldItem.icon as any} size={20} color={colors.primary} />
              </View>
              <View className="flex-1 mx-3" style={direction.startItems}>
                <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, ...direction.text }}>
                  {fieldItem.label}
                </Text>
                <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 15, marginTop: 3, ...direction.text }}>
                  {fieldItem.value}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View className="rounded-2xl p-4 mt-3" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
          <View className="items-center mb-3" style={direction.row}>
            <View className="w-11 h-11 rounded-xl justify-center items-center bg-emerald-500/15">
              <Ionicons name="trending-up-outline" size={22} color="#16a34a" />
            </View>
            <View className="flex-1 mx-3" style={direction.startItems}>
              <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 16, ...direction.text }}>
                {text.upgrade}
              </Text>
              <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 12, lineHeight: 20, ...direction.text }}>
                {text.upgradeSub}
              </Text>
            </View>
          </View>
          <Button type="primary" fullWidth onPress={() => setUpgradeOpen(true)}>
            {text.upgrade}
          </Button>
        </View>
      </ScrollView>

      <Modal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        title={text.upgrade}
        size="xl"
      >
        <FloatingSelect
          label={text.role}
          value={selectedRole}
          options={roleOptions}
          onChange={(value) => setSelectedRole(value as UpgradeRole)}
        />

        {selectedRole === 'doctor' ? (
          <FloatingInput
            label={text.medicalCode}
            value={medicalCode}
            onChangeText={setMedicalCode}
            type="number"
            dir="ltr"
          />
        ) : (
          <>
            <FloatingInput label={text.licenseNumber} value={licenseNumber} onChangeText={setLicenseNumber} type="number" dir="ltr" />
            <FloatingInput label={text.field} value={field} onChangeText={setField} />
            <FloatingSelect label={text.degree} value={educationDegree} options={degreeOptions} onChange={(value) => setEducationDegree(String(value))} />
            <FloatingInput label={text.degreeId} value={educationDegreeId} onChangeText={setEducationDegreeId} />
            <FloatingInput label={text.province} value={province} onChangeText={setProvince} />
            <FloatingInput label={text.city} value={city} onChangeText={setCity} />
            <FloatingInput label={text.expireDate} value={expireDate} onChangeText={setExpireDate} placeholder="1405/12/29" dir="ltr" />
          </>
        )}

        <Button
          type="primary"
          fullWidth
          loading={upgradeMutation.isPending}
          onPress={handleSubmitUpgrade}
        >
          {text.submit}
        </Button>
      </Modal>
    </View>
  );
}
