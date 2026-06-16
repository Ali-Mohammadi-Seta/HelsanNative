import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function TransportationScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('transportation')} icon="car-outline" accent="#ef4444" />;
}
