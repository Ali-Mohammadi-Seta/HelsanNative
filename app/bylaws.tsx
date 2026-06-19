import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function BylawsScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('header.termsAndConditions')} icon="document-text-outline" accent="#8b5cf6" />;
}
