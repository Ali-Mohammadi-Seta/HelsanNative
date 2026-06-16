// src/config/index.ts
import Constants from 'expo-constants';

const extra = (Constants?.expoConfig?.extra as any) || {};

const apiUrlFromExtra = extra?.apiUrl || 'http://192.168.31.169:8080/api';

const config = {
  apiUrl: apiUrlFromExtra,
  pharmacyDomain: (path: string) => `https://inhs.isikato.ir/pharmacy/${path}/login`,
  behdashtCallbackUrl: extra?.behdashtCallbackUrl || 'salam://health-ministry-callback',
  consultationSsoUrl:
    extra?.consultationSsoUrl ||
    'https://sso.inhso.ir/oidc/auth?client_id=client_1754117598828_b4e0885381f0f549&redirect_uri=https://consultation.inhso.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir',
  sepehrSalamatSsoUrl:
    extra?.sepehrSalamatSsoUrl ||
    'https://sso.inhso.ir/oidc/auth?client_id=client_1753181661291_29ef29cc769b9291&redirect_uri=https://inhs.isikato.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir',
  ssoLogoutUrl: extra?.ssoLogoutUrl || 'https://sso.inhso.ir/auth/logout',
  healthMinistryAuthorizeUrl: 'https://ssocore.behdasht.gov.ir/oauth2/authorize',
  healthMinistryClientId: 'salamhealth.ir',
  clientId: 'fronted-inhs-5561as5c1as5csd8vsd',
  clientSecret: 'pinal[cm[axlmc;ac54sd5c4as9q78sd45[ofmwepoi8r94-$%DDS@pdd,vlw;sSa[prk2rfc,ds@16515c31',
  recaptchaSiteKey: '6LcIOlUaAAAAANu6EItcOK1C1UGAht5NF9hZ_VUk',
  userAccessToken: 'inhs_access_token',
  userRefreshToken: 'inhs_refresh_token',
  userIsikatoToken: 'access_token',
  frontToken: 'token',
};

export default config;
