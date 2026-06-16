import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function EducationScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('education')} icon="school-outline" accent="#8b5cf6" />;
}
