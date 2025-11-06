// src/config/index.ts
import Constants from 'expo-constants';

const apiUrlFromExtra =
  (Constants?.expoConfig?.extra as any)?.apiUrl ||
  'http://192.168.1.69:8080/api';

const config = {
  apiUrl: apiUrlFromExtra, // ← now taken from app.json
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
