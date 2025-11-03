// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/styles/theme';
import { Header, CategoryCard, Button } from '@/components';
import { styled } from "nativewind";

// Create styled components for NativeWind compatibility
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);
const StyledLinearGradient = styled(LinearGradient);
const StyledButton = styled(Button); // Assuming Button is a custom component that accepts a `className` prop

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();

  const isRTL = i18n.language === 'fa';

  const categories: Array<{
    key: string;
    title: string;
    icon: any;
    url?: string;
    gradientColors: [string, string, ...string[]];
  }> =  [
    { key: 'places', title: t('header.places'), icon: require('@/assets/images/clinic.gif'), url: '/medical-centers', gradientColors: ['#ff512f', '#dd2476'], },
    { key: 'drugstore', title: t('drugstore'), icon: require('@/assets/images/drugs.gif'), url: '/pharmacies', gradientColors: ['#6a5acd', '#c54b8c', '#b284be'], },
    { key: 'paraclinic', title: t('paraclinic'), icon: require('@/assets/images/paraclinic.gif'), gradientColors: ['#cd5700', '#fd9600', '#bfdd50'], },
    { key: 'healthcareCompanies', title: t('healthcareCompanies'), icon: require('@/assets/images/healthcareCompanies.gif'), url: '/healthcare-companies', gradientColors: ['#000080', '#00bfff'], },
    { key: 'doctorsAndCounselingPsychologist', title: t('doctorsAndCounselingPsychologist'), icon: require('@/assets/images/doctorsAndCounselingPsychologist.gif'), gradientColors: ['#228b22', '#32cd32'], },
    { key: 'taghziye', title: t('taghziye'), icon: require('@/assets/images/taghziye.gif'), gradientColors: ['#4169ff', '#89cff0'], },
    { key: 'healthRoom', title: t('healthRoom'), icon: require('@/assets/images/tea.gif'), gradientColors: ['#09610a', '#67f588'], },
    { key: 'insurance', title: t('insurance'), icon: require('@/assets/images/insurance.gif'), gradientColors: ['#e056fd', '#000000'], },
    { key: 'healthTourism', title: t('healthTourism'), icon: require('@/assets/images/healthTourism.gif'), gradientColors: ['#4169ff', '#89cff0'], },
    { key: 'exercise', title: t('exercise'), icon: require('@/assets/images/running.gif'), gradientColors: ['#ff6677', '#f48e5f', '#ff5047'], },
    { key: 'transportation', title: t('transportation'), icon: require('@/assets/images/ambulance.gif'), gradientColors: ['#e34234', '#ff3800'], },
    { key: 'homeNursingCare', title: t('homeNursingCare'), icon: require('@/assets/images/homeNursingCare.gif'), gradientColors: ['#3bb78f', '#0bab64'], },
    { key: 'locator', title: t('locator'), icon: require('@/assets/images/mapLocator.gif'), gradientColors: ['#f7971e', '#ffd200'], },
    { key: 'creditPayment', title: t('creditPayment'), icon: require('@/assets/images/creditPayment.gif'), gradientColors: ['#63d471', '#233329'], },
    { key: 'shops', title: t('shops'), icon: require('@/assets/images/shop.gif'), gradientColors: ['#cd1c18', '#66023c'], },
    { key: 'volunteeringCampaign', title: t('volunteeringCampaign'), icon: require('@/assets/images/volunteeringCampaign.gif'), gradientColors: ['#F6C324', '#F17E7E'], },
    { key: 'education', title: t('education'), icon: require('@/assets/images/education.gif'), gradientColors: ['#8CA6DB', '#B993D6'], },
    { key: 'awareness', title: t('awareness'), icon: require('@/assets/images/awareness.gif'), gradientColors: ['#f83600', '#fe8c00'], },
  ];

  const firstRowCategories = categories.slice(0, 7);
  const secondRowCategories = categories.slice(7, 14);
  const thirdRowCategories = categories.slice(14);

  // Render 3 items per row
  const renderCategoryRows = (cats: typeof categories) => {
    const rows = [];
    for (let i = 0; i < cats.length; i += 3) {
      const rowItems = cats.slice(i, i + 3);
      rows.push(
        <StyledView key={i} className={`mb-1 flex-row justify-start ${isRTL ? 'flex-row-reverse' : ''}`}>
          {rowItems.map((category) => (
            <CategoryCard
              key={category.key}
              title={category.title}
              icon={category.icon}
              url={category.url}
              gradientColors={category.gradientColors}
            />
          ))}
        </StyledView>
      );
    }
    return rows;
  };

  return (
    <StyledView className="flex-1">
      <Header />

      <StyledScrollView
        className="flex-1"
        style={{ backgroundColor: isDark ? colors.background : '#f9fafb' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Wrapper replaces contentContainerClassName */}
        <StyledView className="p-4 pb-8">
          {/* Consultation Banner */}
          <StyledLinearGradient
            colors={['#fee2e2', '#fecaca']}
            className="rounded-2xl p-5 mb-5 shadow-lg shadow-black/10"
          >
            <StyledView className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <StyledView className={`flex-1 pr-4 ${isRTL ? 'items-end' : ''}`}>
                <StyledText className={`text-lg font-['IRANSans-Bold'] text-gray-800 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('homePage.consultationBannerTitle')}
                </StyledText>
                <StyledText className={`text-sm font-['IRANSans'] ml-4 text-gray-600 mb-3 leading-5 ${isRTL ? 'text-right' : ''}`}>
                  {t('homePage.consultationBannerDesc')}
                </StyledText>
                <StyledButton type="primary" size="small" className={`mt-2 ${isRTL ? 'self-end' : 'self-start'}`}>
                  {t('homePage.consultationBannerButton')}
                </StyledButton>
              </StyledView>
              <StyledImage
                source={require('@/assets/images/5 (1).png')}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
            </StyledView>
          </StyledLinearGradient>

          {/* First Row Categories */}
          <StyledView className="my-[10px]">
            {renderCategoryRows(firstRowCategories)}
          </StyledView>

          {/* Main Banner */}
          <StyledLinearGradient
            colors={['#fecaca', '#ecdccf', '#fecaca']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-5 my-5 shadow-lg shadow-black/10 "
          >
            <StyledView className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <StyledImage
                source={require('@/assets/images/3333.png')}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
              <StyledView className={`flex-1 px-3 ${isRTL ? 'items-end' : ''}`}>
                <StyledImage
                  source={require('@/assets/images/sepehrsalamat.png')}
                  className="w-10 h-10 mb-2"
                  resizeMode="contain"
                />
                <StyledText className={`text-base font-['IRANSans-Bold'] text-orange-900 mb-2 ${isRTL ? 'text-start' : ''}`}>
                  {t('homePage.mainBannerTitle')}
                </StyledText>
                <StyledText className={`text-sm font-['IRANSans'] text-orange-900 ${isRTL ? 'text-right' : ''}`}>
                  {t('homePage.mainBannerDesc')}
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledLinearGradient>

          {/* Second Row Categories */}
          <StyledView className="my-[10px]">
            {renderCategoryRows(secondRowCategories)}
          </StyledView>

          {/* Shop Banner */}
          <StyledView
              className="rounded-2xl my-5 overflow-hidden shadow-lg shadow-black/10"
              style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
          >
            <StyledView className={`flex-row ${isRTL ? 'flex-row-reverse' : ''}`}>
              <StyledView className={`flex-1 p-5 justify-center ${isRTL ? 'items-end' : ''}`}>
                <StyledText className={`text-base font-['IRANSans-Bold'] text-gray-800 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('homePage.shopBannerTitle')}
                </StyledText>
                <StyledText className={`text-sm font-['IRANSans'] text-gray-600 mb-3 ${isRTL ? 'text-right' : ''}`}>
                  {t('homePage.shopBannerDesc')}
                </StyledText>
                <StyledButton type="primary" size="small" className="self-start">
                  {t('homePage.shopBannerButton')}
                </StyledButton>
              </StyledView>
              <StyledView className="w-[130px] bg-[#149CBF] justify-center items-center p-4">
                <StyledImage
                  source={require('@/assets/images/3.webp')}
                  className="w-[90px] h-[90px]"
                  resizeMode="contain"
                />
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Third Row Categories */}
          <StyledView className="my-[10px]">
            {renderCategoryRows(thirdRowCategories)}
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}