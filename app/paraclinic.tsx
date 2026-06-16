import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function ParaclinicScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('paraclinic')} icon="flask-outline" accent="#f97316" />;
}
