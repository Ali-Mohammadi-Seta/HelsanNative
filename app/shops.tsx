import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function ShopsScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('shops')} icon="storefront-outline" accent="#dc2626" />;
}
