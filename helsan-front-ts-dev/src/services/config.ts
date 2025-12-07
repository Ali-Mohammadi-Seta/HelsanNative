const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    pharmacyDomain:(path:string)=> `https://inhs.isikato.ir/pharmacy/${path}/login`,
    clientId: 'fronted-inhs-5561as5c1as5csd8vsd',
    clientSecret:
        'pinal[cm[axlmc;ac54sd5c4as9q78sd45[ofmwepoi8r94-$%DDS@pdd,vlw;sSa[prk2rfc,ds@16515c31',
    recaptchaSiteKey: '6LcIOlUaAAAAANu6EItcOK1C1UGAht5NF9hZ_VUk',
    userAccessToken: 'inhs_access_token',
    userRefreshToken: 'inhs_refresh_token',
    userIsikatoToken: 'access_token',
    frontToken: 'token',
};
// if (import.meta.env.DEV) {
//     const { VITE_API_URL } = import.meta.env;
//     if (!VITE_API_URL) {
//         console.error(
//             'Please set VITE_API_URL environment variable to use in development mode',
//         );
//         process.exit(0);
//     }
//     config.apiUrl = VITE_API_URL;
// }

export default config;
