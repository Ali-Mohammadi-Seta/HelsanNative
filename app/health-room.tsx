import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function HealthRoomScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('healthRoom')} icon="cafe-outline" accent="#16a34a" />;
}
