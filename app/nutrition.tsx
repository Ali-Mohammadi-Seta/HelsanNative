import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function NutritionScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t('taghziye')} icon="nutrition-outline" accent="#0ea5e9" />;
}
