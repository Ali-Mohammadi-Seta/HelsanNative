import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function AwarenessScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('awareness')} icon="bulb-outline" accent="#f97316" />;
}
