import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'IRANSans': require('@/assets/fonts/IRANSansWeb.ttf'),
    'IRANSans-Bold': require('@/assets/fonts/IRANSansWeb_Bold.ttf'),
    'IRANSans-Medium': require('@/assets/fonts/IRANSansWeb_Medium.ttf'),
    'IRANSans-Light': require('@/assets/fonts/IRANSansWeb_Light.ttf'),
  });
};