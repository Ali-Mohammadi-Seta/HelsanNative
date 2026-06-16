import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function HealthTourismScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('healthTourism')} icon="airplane-outline" accent="#0ea5e9" />;
}
