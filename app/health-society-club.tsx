import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function HealthSocietyClubScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('healthSocietyClub')} icon="heart-circle-outline" accent="#16a34a" />;
}
