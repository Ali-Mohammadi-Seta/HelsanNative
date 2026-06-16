import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function VolunteeringScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('volunteeringCampaign')} icon="heart-circle-outline" accent="#f59e0b" />;
}
