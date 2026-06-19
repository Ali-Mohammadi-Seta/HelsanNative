import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function CustomersClubScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('customersClub')} icon="people-outline" accent="#0ea5e9" />;
}
