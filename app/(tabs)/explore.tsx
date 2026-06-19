import ComingSoon from '@/components/ComingSoon';
import { useTranslation } from 'react-i18next';

export default function ExploreScreen() {
  const { t } = useTranslation();

  return (
    <ComingSoon
      title={t('search')}
      icon="search-outline"
      showBackButton={false}
      showReturnButton={false}
    />
  );
}
