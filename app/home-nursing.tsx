import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function HomeNursingScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('homeNursingCare')} icon="home-outline" accent="#16a34a" />;
}
