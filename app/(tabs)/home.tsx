import { Button, CategoryCard, Header } from '@/components';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type Category = {
  key: string;
  title: string;
  icon: any;
  url?: string;
  gradientColors: [string, string, ...string[]];
};

const chunk = <T,>(items: T[], size: number) => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const { width } = useWindowDimensions();
  const contentPadding = width < 380 ? 14 : 16;
  const cardGap = width < 380 ? 8 : 12;
  const cardSize = Math.floor((width - contentPadding * 2 - cardGap * 2) / 3);
  const bannerImageSize = width < 380 ? 86 : 104;
  const shopImageWidth = width < 380 ? 100 : 130;

  const openConsultation = () => router.push('/doctors-consultation');

  const categories: Category[] = [
    {
      key: 'places',
      title: t('header.places'),
      icon: require('@/assets/images/clinic.gif'),
      url: '/medical-centers',
      gradientColors: ['#ff512f', '#dd2476'],
    },
    {
      key: 'drugstore',
      title: t('drugstore'),
      icon: require('@/assets/images/drugs.gif'),
      url: '/pharmacies',
      gradientColors: ['#6a5acd', '#c54b8c', '#b284be'],
    },
    {
      key: 'healthcareCompanies',
      title: t('healthcareCompanies'),
      icon: require('@/assets/images/healthcareCompanies.gif'),
      url: '/healthcare-companies',
      gradientColors: ['#000080', '#00bfff'],
    },
    {
      key: 'doctorsDirectory',
      title: t('doctors'),
      icon: require('@/assets/images/doctordir.gif'),
      url: '/doctors',
      gradientColors: ['#0ea5e9', '#14b8a6'],
    },
    {
      key: 'psychologistsDirectory',
      title: t('psychologists'),
      icon: require('@/assets/images/consultdir.gif'),
      url: '/psychologists',
      gradientColors: ['#7c3aed', '#ec4899'],
    },
    {
      key: 'healthMonitoring',
      title: t('healthMonitoring', { defaultValue: 'Health monitoring' }),
      icon: require('@/assets/images/volunteeringCampaign.gif'),
      url: '/health-monitoring',
      gradientColors: ['#F6C324', '#F17E7E'],
    },
    {
      key: 'taghziye',
      title: t('taghziye'),
      icon: require('@/assets/images/taghziye.gif'),
      url: '/nutrition',
      gradientColors: ['#4169ff', '#89cff0'],
    },
    {
      key: 'healthRoom',
      title: t('healthRoom'),
      icon: require('@/assets/images/tea.gif'),
      url: '/health-room',
      gradientColors: ['#09610a', '#67f588'],
    },
    {
      key: 'paraclinic',
      title: t('paraclinic'),
      icon: require('@/assets/images/paraclinic.gif'),
      url: '/paraclinic',
      gradientColors: ['#cd5700', '#fd9600', '#bfdd50'],
    },
    {
      key: 'insurance',
      title: t('insurance'),
      icon: require('@/assets/images/insurance.gif'),
      url: '/insurances',
      gradientColors: ['#e056fd', '#000000'],
    },
    {
      key: 'healthTourism',
      title: t('healthTourism'),
      icon: require('@/assets/images/healthTourism.gif'),
      url: '/health-tourism',
      gradientColors: ['#4169ff', '#89cff0'],
    },
    {
      key: 'exercise',
      title: t('exercise'),
      icon: require('@/assets/images/running.gif'),
      url: '/exercise',
      gradientColors: ['#ff6677', '#f48e5f', '#ff5047'],
    },
    {
      key: 'transportation',
      title: t('transportation'),
      icon: require('@/assets/images/ambulance.gif'),
      url: '/transportation',
      gradientColors: ['#e34234', '#ff3800'],
    },
    {
      key: 'homeNursingCare',
      title: t('homeNursingCare'),
      icon: require('@/assets/images/homeNursingCare.gif'),
      url: '/home-nursing',
      gradientColors: ['#3bb78f', '#0bab64'],
    },
    {
      key: 'locator',
      title: t('locator'),
      icon: require('@/assets/images/mapLocator.gif'),
      url: '/(tabs)/map',
      gradientColors: ['#f7971e', '#ffd200'],
    },
    {
      key: 'creditPayment',
      title: t('creditPayment'),
      icon: require('@/assets/images/creditPayment.gif'),
      url: '/credit-payment',
      gradientColors: ['#63d471', '#233329'],
    },
    {
      key: 'shops',
      title: t('shops'),
      icon: require('@/assets/images/shop.gif'),
      url: '/shops',
      gradientColors: ['#cd1c18', '#66023c'],
    },
    {
      key: 'volunteeringCampaign',
      title: t('volunteeringCampaign'),
      icon: require('@/assets/images/volunteeringCampaign.gif'),
      url: '/volunteering',
      gradientColors: ['#F6C324', '#F17E7E'],
    },
    {
      key: 'education',
      title: t('education'),
      icon: require('@/assets/images/education.gif'),
      url: '/education',
      gradientColors: ['#8CA6DB', '#B993D6'],
    },
    {
      key: 'awareness',
      title: t('awareness'),
      icon: require('@/assets/images/awareness.gif'),
      url: '/awareness',
      gradientColors: ['#f83600', '#fe8c00'],
    },
  ];

  const renderCategoryGrid = (items: Category[]) => (
    <View className="my-2">
      {chunk(items, 3).map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            direction.row,
            {
              justifyContent: row.length === 3 ? 'space-between' : 'flex-start',
              columnGap: cardGap,
              marginBottom: 2,
            },
          ]}
        >
          {row.map((category) => (
            <CategoryCard
              key={category.key}
              title={category.title}
              icon={category.icon}
              url={category.url}
              gradientColors={category.gradientColors}
              size={cardSize}
            />
          ))}
        </View>
      ))}
    </View>
  );

  const firstRowCategories = categories.slice(0, 8);
  const secondRowCategories = categories.slice(8, 14);
  const thirdRowCategories = categories.slice(14);

  return (
    <View className="flex-1">
      <Header />

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: contentPadding, paddingTop: 16, paddingBottom: 28 }}>
          <LinearGradient
            colors={isDark ? ['#4a2c2c', '#5c3a3a'] : ['#fff1f2', '#fecaca']}
            className="rounded-2xl p-5 mb-5 shadow-lg shadow-black/10 overflow-hidden"
          >
            <View className="items-center" style={direction.row}>
              <View
                className="flex-1"
                style={[
                  direction.startItems,
                  direction.isRTL ? { paddingLeft: 12 } : { paddingRight: 12 },
                ]}
              >
                <Text
                  className="text-lg mb-2"
                  style={{
                    fontFamily: 'IRANSans-Bold',
                    color: isDark ? '#fecaca' : '#1f2937',
                    ...direction.text,
                  }}
                >
                  {t('homePage.consultationBannerTitle')}
                </Text>
                <Text
                  className="text-sm mb-3 leading-5"
                  style={{
                    fontFamily: 'IRANSans',
                    color: isDark ? '#fca5a5' : '#4b5563',
                    ...direction.text,
                  }}
                >
                  {t('homePage.consultationBannerDesc')}
                </Text>
                <Button type="primary" size="small" onPress={openConsultation}>
                  {t('homePage.consultationBannerButton')}
                </Button>
              </View>
              <Image
                source={require('@/assets/images/5 (1).png')}
                style={{ width: bannerImageSize, height: bannerImageSize }}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>

          {renderCategoryGrid(firstRowCategories)}

          <LinearGradient
            colors={isDark ? ['#3d2a20', '#4a3830', '#3d2a20'] : ['#fecaca', '#ecdccf', '#fecaca']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-5 my-5 shadow-lg shadow-black/10 overflow-hidden"
          >
            <View className="items-center" style={direction.row}>
              <Image
                source={require('@/assets/images/3333.jpg')}
                style={{ width: bannerImageSize + 4, height: bannerImageSize + 4, borderRadius: 14 }}
                resizeMode="cover"
              />
              <View className="flex-1 px-3" style={direction.startItems}>
                <Image
                  source={require('@/assets/images/sepehrsalamat.png')}
                  className="w-10 h-10 mb-2"
                  resizeMode="contain"
                />
                <Text
                  className="text-base mb-2"
                  style={{
                    fontFamily: 'IRANSans-Bold',
                    color: isDark ? '#fed7aa' : '#7c2d12',
                    ...direction.text,
                  }}
                >
                  {t('homePage.mainBannerTitle')}
                </Text>
                <Text
                  className="text-sm leading-5"
                  style={{
                    fontFamily: 'IRANSans',
                    color: isDark ? '#fdba74' : '#7c2d12',
                    ...direction.text,
                  }}
                >
                  {t('homePage.mainBannerDesc')}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {renderCategoryGrid(secondRowCategories)}

          <View
            className="rounded-2xl my-5 overflow-hidden shadow-lg shadow-black/10"
            style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
          >
            <View style={direction.row}>
              <View className="flex-1 p-5 justify-center" style={direction.startItems}>
                <Text
                  className="text-base mb-2"
                  style={{
                    fontFamily: 'IRANSans-Bold',
                    color: isDark ? colors.text : '#1f2937',
                    ...direction.text,
                  }}
                >
                  {t('homePage.shopBannerTitle')}
                </Text>
                <Text
                  className="text-sm mb-3 leading-5"
                  style={{
                    fontFamily: 'IRANSans',
                    color: isDark ? colors.textSecondary : '#4b5563',
                    ...direction.text,
                  }}
                >
                  {t('homePage.shopBannerDesc')}
                </Text>
                <Button type="primary" size="small" onPress={() => router.push('/pharmacies')}>
                  {t('homePage.shopBannerButton')}
                </Button>
              </View>
              <View
                className="bg-[#149CBF] justify-center items-center p-4"
                style={{ width: shopImageWidth }}
              >
                <Image
                  source={require('@/assets/images/3.webp')}
                  style={{ width: shopImageWidth - 36, height: shopImageWidth - 36 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {renderCategoryGrid(thirdRowCategories)}
        </View>
      </ScrollView>
    </View>
  );
}
