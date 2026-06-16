import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function ExerciseScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('exercise')} icon="walk-outline" accent="#ef4444" />;
}
