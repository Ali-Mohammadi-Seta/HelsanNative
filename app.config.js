const SERVER_CONFIG = {
  apiUrl: 'https://inhso.ir/api',
  behdashtCallbackUrl: 'salam://health-ministry-callback',
  consultationSsoUrl: 'https://consultation.inhso.ir/launch',
  sepehrSalamatSsoUrl: 'https://inhs.isikato.ir/launch',
  ssoLogoutUrl: 'https://sso.inhso.ir/auth/logout',
};

const SERVER_BUILD_PROFILES = new Set(['preview', 'production', 'production-apk']);

module.exports = ({ config }) => {
  const extra = config.extra || {};
  const useServer =
    process.env.APP_ENV === 'production' ||
    SERVER_BUILD_PROFILES.has(process.env.EAS_BUILD_PROFILE);
  const defaults = useServer ? SERVER_CONFIG : extra;

  return {
    ...config,
    extra: {
      ...extra,
      apiUrl: process.env.EXPO_PUBLIC_API_URL || defaults.apiUrl,
      behdashtCallbackUrl:
        process.env.EXPO_PUBLIC_BEHDASHT_CALLBACK_URL || defaults.behdashtCallbackUrl,
      consultationSsoUrl:
        process.env.EXPO_PUBLIC_CONSULTATION_SSO_URL || defaults.consultationSsoUrl,
      sepehrSalamatSsoUrl:
        process.env.EXPO_PUBLIC_SEPEHR_SALAMAT_SSO_URL || defaults.sepehrSalamatSsoUrl,
      ssoLogoutUrl:
        process.env.EXPO_PUBLIC_SSO_LOGOUT_URL || defaults.ssoLogoutUrl,
    },
  };
};
