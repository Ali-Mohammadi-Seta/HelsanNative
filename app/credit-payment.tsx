import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function CreditPaymentScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('creditPayment')} icon="card-outline" accent="#10b981" />;
}
