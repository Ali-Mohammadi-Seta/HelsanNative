import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;
const apiUrlFromExtra = extra?.apiUrl || 'http://192.168.31.169:8080/api';
const ipMatch = apiUrlFromExtra.match(/(http:\/\/[^:]+)/);
const consultationApiUrl = ipMatch ? `${ipMatch[1]}:8081/api` : 'http://192.168.31.169:8081/api';

// This file replicates the config from salam-consultation-front-dev
const config = {
  // Using the exact config from the React app
  apiUrl: consultationApiUrl, // Proxy via 8081
  unauthorizedCallbackUrl: process.env.EXPO_PUBLIC_UNAUTHORIZED_CALLBACK_URL || '',
  pharmacyDomain: (path: string) => `https://inhs.isikato.ir/pharmacy/${path}/login`,
  clientId: 'fronted-inhs-5561as5c1as5csd8vsd',
  clientSecret: 'pinal[cm[axlmc;ac54sd5c4as9q78sd45[ofmwepoi8r94-$%DDS@pdd,vlw;sSa[prk2rfc,ds@16515c31',
  recaptchaSiteKey: '6LcIOlUaAAAAANu6EItcOK1C1UGAht5NF9hZ_VUk',
  userAccessToken: 'inhs_access_token',
  userRefreshToken: 'inhs_refresh_token',
  userIsikatoToken: 'access_token',
  frontToken: 'token',
};

export default config;
