import { Button, CategoryCard, Header } from '@/components';
import { useUserProfile } from '@/lib/api/useAuth';
import { useDirection } from '@/lib/hooks/useDirection';
import { RootState } from '@/redux/store';
import { gradients, shadows, useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Category = {
  key: string;
  title: string;
  icon: any;
  url?: string;
  gradientColors: [string, string, ...string[]];
};

type BannerProps = {
  children: React.ReactNode;
  gradientColors: [string, string, ...string[]];
  onPress?: () => void;
  delay?: number;
  style?: object;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const chunk = <T,>(items: T[], size: number) => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
};

function BannerCard({ children, gradientColors, onPress, delay = 0, style }: BannerProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(360).springify().damping(18)}
      style={style}
    >
      <AnimatedPressable
        onPress={onPress}
        disabled={!onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 15, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 220 });
        }}
        style={[animStyle, shadows.lg]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          {children}
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}

function SectionTitle({
  title,
  delay = 0,
}: {
  title: string;
  delay?: number;
}) {
  const { colors } = useTheme();
  const direction = useDirection();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(260)}
      style={[styles.sectionTitle, direction.startItems]}
    >
      <View style={[styles.sectionTitleRow, direction.row]}>
        <View style={[styles.sectionBar, { backgroundColor: colors.primary }]} />
        <Text
          style={[
            styles.sectionTitleText,
            { color: colors.text },
            direction.text,
          ]}
        >
          {title}
        </Text>
      </View>
    </Animated.View>
  );
}

function HeroAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 13, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 13, stiffness: 220 });
      }}
      style={[
        animStyle,
        styles.heroAction,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.72)',
          borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.88)',
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text
        numberOfLines={1}
        style={[
          styles.heroActionText,
          { color: colors.text },
          direction.text,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

function HomeHero({
  compact,
  displayName,
}: {
  compact: boolean;
  displayName?: string;
}) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  return (
    <Animated.View entering={FadeInDown.duration(360).springify().damping(18)}>
      <LinearGradient
        colors={isDark ? gradients.heroBanner.dark : gradients.heroBanner.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.hero,
          {
            borderColor: isDark ? colors.glassBorder : '#ffffff',
            minHeight: compact ? 164 : 178,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.22)',
            },
          ]}
        />

        <View style={styles.heroContent}>
          <View style={[styles.heroTextColumn, direction.startItems]}>
            <Text
              style={[
                styles.heroEyebrow,
                { color: colors.primary },
                direction.text,
              ]}
            >
              {t('footer.text3')}
            </Text>
            <Text
              style={[
                styles.heroTitle,
                { color: colors.text },
                direction.text,
              ]}
            >
              {displayName
                ? `${direction.isRTL ? 'سلام' : 'Hello'} ${displayName}`
                : t('homePage.consultationBannerTitle')}
            </Text>
            <Animated.Text
              entering={FadeInDown.delay(70).duration(260)}
              style={[
                styles.heroDescription,
                { color: colors.textSecondary },
                direction.text,
              ]}
            >
              {t('homePage.consultationBannerDesc')}
            </Animated.Text>

            <View className={`w-full flex  ${direction.isRTL ? 'justify-end' : 'justify-start'} `} style={[styles.heroActions, direction.row]}>
              <HeroAction
                icon="videocam-outline"
                label={t('homePage.consultationBannerButton')}
                onPress={() => router.push('/(consultation)/panel/home')}
              />
            </View>
          </View>

        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const { width } = useWindowDimensions();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { data: userProfile } = useUserProfile(isLoggedIn);

  const compact = width < 420;
  const tablet = width >= 700;
  const contentPadding = compact ? 14 : tablet ? 24 : 16;
  const contentWidth = Math.min(width - contentPadding * 2, 820);
  const columns = tablet ? 5 : width >= 520 ? 4 : 3;
  const cardGap = compact ? 9 : 12;
  const cardSize = Math.floor((contentWidth - cardGap * (columns - 1)) / columns);
  const bannerImageSize = compact ? 78 : tablet ? 126 : 98;
  const shopImageWidth = compact ? 94 : tablet ? 154 : 122;
  const displayName = isLoggedIn
    ? [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ') || userProfile?.phone
    : undefined;

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
      title: t('healthMonitoring'),
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
    {
      key: 'customersClub',
      title: t('customersClub'),
      icon: require('@/assets/images/usersmanage.png'),
      url: '/customers-club',
      gradientColors: ['#0284c7', '#38bdf8'],
    },
    {
      key: 'healthSocietyClub',
      title: t('healthSocietyClub'),
      icon: require('@/assets/images/1.png'),
      url: '/health-society-club',
      gradientColors: ['#15803d', '#4ade80'],
    },
    {
      key: 'bylaws',
      title: t('header.termsAndConditions'),
      icon: require('@/assets/images/article.png'),
      url: '/bylaws',
      gradientColors: ['#6d28d9', '#a78bfa'],
    },
  ];

  const renderCategoryGrid = (items: Category[], baseDelay: number = 0) => (
    <View style={styles.grid}>
      {chunk(items, columns).map((row, rowIndex) => (
        <Animated.View
          key={row.map((item) => item.key).join('-')}
          entering={FadeInDown.delay(baseDelay + rowIndex * 55).duration(280).springify().damping(18)}
          style={[
            direction.row,
            styles.gridRow,
            {
              columnGap: cardGap,
              justifyContent: 'flex-start',
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
        </Animated.View>
      ))}
    </View>
  );

  const firstRowCategories = categories.slice(0, 8);
  const secondRowCategories = categories.slice(8, 14);
  const thirdRowCategories = categories.slice(14);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header showHomeActions />

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 34 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      >
        <View
          style={{
            width: contentWidth,
            alignSelf: 'center',
            paddingTop: 16,
          }}
        >
          <HomeHero compact={compact} displayName={displayName} />

          <View style={styles.section}>
            <SectionTitle
              delay={120}
              title={t('homePage.sections.medical', { defaultValue: t('medicalServices') })}
            />
            {renderCategoryGrid(firstRowCategories, 160)}
          </View>

          <BannerCard
            gradientColors={isDark ? gradients.warm.dark : gradients.warm.light}
            delay={240}
            style={styles.bannerSpacing}
          >
            <View
              style={[
                styles.mainBanner,
                direction.row,
                { padding: compact ? 14 : 18 },
              ]}
            >
              <Image
                source={require('@/assets/images/3333.jpg')}
                style={[
                  styles.mainBannerPhoto,
                  {
                    width: bannerImageSize + 12,
                    height: compact ? 92 : 116,
                  },
                ]}
                resizeMode="cover"
              />
              <View style={[styles.bannerTextBlock, direction.startItems]}>
                <Image
                  source={require('@/assets/images/sepehrsalamat.png')}
                  style={styles.systemLogo}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.bannerTitle,
                    { color: isDark ? '#fed7aa' : '#7c2d12' },
                    direction.text,
                  ]}
                >
                  {t('homePage.mainBannerTitle')}
                </Text>
                <Text
                  style={[
                    styles.bannerDescription,
                    { color: isDark ? '#fdba74' : '#7c2d12' },
                    direction.text,
                  ]}
                >
                  {t('homePage.mainBannerDesc')}
                </Text>
              </View>
            </View>
          </BannerCard>

          <View style={styles.section}>
            <SectionTitle
              delay={280}
              title={t('homePage.sections.support', { defaultValue: t('healthcareCompaniesList') })}
            />
            {renderCategoryGrid(secondRowCategories, 320)}
          </View>

          <BannerCard
            gradientColors={isDark ? gradients.card.dark : gradients.card.light}
            onPress={() => router.push('/pharmacies')}
            delay={380}
            style={styles.bannerSpacing}
          >
            <View
              style={[
                styles.shopBanner,
                direction.row,
                { minHeight: compact ? 140 : 158 },
              ]}
            >
              <View
                style={[
                  styles.shopCopy,
                  direction.startItems,
                  { padding: compact ? 16 : 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bannerTitle,
                    { color: colors.text },
                    direction.text,
                  ]}
                >
                  {t('homePage.shopBannerTitle')}
                </Text>
                <Text
                  style={[
                    styles.bannerDescription,
                    { color: colors.textSecondary },
                    direction.text,
                  ]}
                >
                  {t('homePage.shopBannerDesc')}
                </Text>
                <View className='w-full'>
                  <Button type="primary" className={` flex w-1/2 ${direction.isRTL ? 'justify-end' : 'justify-start'}`} size="small" onPress={() => router.push('/pharmacies')}>
                    {t('homePage.shopBannerButton')}
                  </Button>
                </View>
              </View>
              <View
                style={[
                  styles.shopImagePane,
                  {
                    width: shopImageWidth,
                    borderTopLeftRadius: direction.isRTL ? 22 : 0,
                    borderBottomLeftRadius: direction.isRTL ? 22 : 0,
                    borderTopRightRadius: direction.isRTL ? 0 : 22,
                    borderBottomRightRadius: direction.isRTL ? 0 : 22,
                  },
                ]}
              >
                <Image
                  source={require('@/assets/images/3.webp')}
                  style={{ width: shopImageWidth - 34, height: shopImageWidth - 34 }}
                  resizeMode="contain"
                />
                <Image
                  source={require('@/assets/images/2.png')}
                  style={[
                    styles.shopFiller,
                    direction.isRTL ? { left: 6 } : { right: 6 },
                  ]}
                  resizeMode="contain"
                />
              </View>
            </View>
          </BannerCard>

          <View style={styles.section}>
            <SectionTitle
              delay={420}
              title={t('homePage.sections.more', { defaultValue: t('explore') })}
            />
            {renderCategoryGrid(thirdRowCategories, 460)}
          </View>
        </View>
        <View className='h-24! '></View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  afterHero: {
    marginTop: 14,
  },
  bannerDescription: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 13,
  },
  bannerGradient: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  bannerSpacing: {
    marginTop: 10,
    marginBottom: 8,
  },
  bannerTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  bannerTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 6,
  },
  consultationBanner: {
    alignItems: 'center',
    gap: 14,
  },
  grid: {
    marginTop: 2,
  },
  gridRow: {
    marginBottom: 2,
  },
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroAction: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
  },
  heroActionText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
    maxWidth: 142,
  },
  heroActions: {
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  heroBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  heroDescription: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 420,
  },
  heroEyebrow: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
    lineHeight: 18,
    marginBottom: 4,
  },
  heroLine: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  heroLineText: {
    fontFamily: 'IRANSans-Medium',
    fontSize: 12,
    lineHeight: 20,
  },
  heroTextColumn: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  heroTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 21,
    lineHeight: 30,
  },
  mainBanner: {
    alignItems: 'center',
    gap: 14,
  },
  mainBannerPhoto: {
    borderRadius: 18,
  },
  section: {
    marginTop: 18,
  },
  sectionBar: {
    borderRadius: 2,
    height: 18,
    width: 3,
  },
  sectionTitle: {
    marginBottom: 10,
    marginTop: 2,
  },
  sectionTitleRow: {
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 15,
  },
  shopBanner: {
    overflow: 'hidden',
  },
  shopCopy: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  shopFiller: {
    bottom: 6,
    height: 34,
    opacity: 0.35,
    position: 'absolute',
    width: 34,
  },
  shopImagePane: {
    alignItems: 'center',
    backgroundColor: '#149CBF',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  systemLogo: {
    height: 34,
    marginBottom: 7,
    width: 34,
  },
});
