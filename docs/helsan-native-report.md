# Helsan Native App Technical Report

Report date: 2026-06-01  
Project: `helsan-native`  
Root: `HelsanNative`

## Executive Summary

Helsan Native is a React Native mobile application built with Expo and Expo Router. It is the mobile client for a wider health-services platform. The native app mirrors the main React web product conceptually: a landing/home experience with health-service categories, authentication, user profile, EMR/health-record access, location/map discovery, pharmacy links, and a consultation entry point.

The consultation section is treated as a separate web application and is integrated through an in-app WebView. Authentication is designed to support phone/national-id OTP login, registration, Health Ministry OAuth, token persistence, backend authorization checks, role selection, and SSO handoff into consultation.

The current app is structured around:

- Expo Router file-based navigation.
- TypeScript + React Native functional components.
- Redux Toolkit for app state that must survive across screens.
- TanStack React Query for server-state caching and mutations.
- Axios as the centralized API client.
- NativeWind/Tailwind-style utility classes plus a custom theme layer.
- i18next/react-i18next for Persian/English translation and RTL/LTR support.
- React Native WebView for consultation and map rendering.

## Repository And File Layout

Important project-level files:

- `package.json`: project identity, scripts, runtime dependencies, dev dependencies.
- `app.json`: Expo application configuration, app scheme, native identifiers, permissions, plugins, and runtime `extra` config.
- `tsconfig.json`: TypeScript configuration and path aliases.
- `tailwind.config.js`: NativeWind/Tailwind theme tokens and content paths.
- `babel.config.js`, `metro.config.js`, `postcss.config.mjs`: build and styling integration.
- `nativewind-env.d.ts`: TypeScript augmentation for `className` on React Native components.
- `expo-env.d.ts`: Expo environment type support.
- `nginx-proxy/`: local proxy support files.

Main route files:

- `app/_layout.tsx`: root provider composition, RTL forcing, status bar, toast outlet.
- `app/index.tsx`: initial route entry.
- `app/(tabs)/_layout.tsx`: bottom tab navigation.
- `app/(tabs)/home.tsx`: main landing page and category grid.
- `app/(tabs)/explore.tsx`: search/explore placeholder.
- `app/(tabs)/map.tsx`: location discovery and map/list UI.
- `app/(tabs)/profile.tsx`: login prompt, profile, EMR/settings/logout actions.
- `app/(auth)/index.tsx`: login/register/reset-password shell.
- `app/(auth)/verification.tsx`: OTP verification, auth finalization, SSO role handling.
- `app/(auth)/health-ministry-callback.tsx`: deep-link callback route for Health Ministry auth.
- `app/(protected)/_layout.tsx`: protected stack group.
- `app/(protected)/edit-profile.tsx`: profile editing route.
- `app/(protected)/my-emr.tsx`: EMR questionnaire/health-info route.
- `app/doctors-consultation.tsx`: in-app WebView wrapper for consultation.
- `app/medical-centers.tsx`, `app/pharmacies.tsx`, `app/health-monitoring.tsx`, `app/nutrition.tsx`, `app/paraclinic.tsx`, `app/insurances.tsx`, `app/health-tourism.tsx`, `app/exercise.tsx`, `app/transportation.tsx`, `app/home-nursing.tsx`, `app/shops.tsx`, `app/volunteering.tsx`, `app/education.tsx`, `app/awareness.tsx`, `app/credit-payment.tsx`, `app/health-room.tsx`, `app/healthcare-companies.tsx`, `app/doctors.tsx`: category/detail routes.

Main source layers:

- `src/config/index.ts`: runtime config and SSO/OAuth URLs.
- `src/config/endpoints.ts`: backend endpoint names.
- `src/lib/api/apiClient.ts`: Axios instance, request auth header, refresh-token queue, logout redirect on auth failure.
- `src/lib/api/apiService.ts`: typed-ish API service functions.
- `src/lib/api/useAuth.ts`: React Query auth hooks.
- `src/lib/auth/tokenStorage.ts`: token persistence and cleanup.
- `src/lib/auth/sso.ts`: SSO helpers, Health Ministry OAuth helpers, role normalization, auth-response application.
- `src/lib/hooks/auth/*`: feature-specific auth/query hooks.
- `src/lib/hooks/emr/*`: EMR data hooks.
- `src/redux/store.ts`: Redux store.
- `src/redux/slices/authSlice.ts`: login state, tokens, roles, auth lifecycle.
- `src/redux/slices/userSlice.ts`: user profile and login/register form values.
- `src/redux/slices/themeSlice.ts`: light/dark mode persistence.
- `src/providers/AppProviders.tsx`: Redux, theme, query, i18n, font loading, splash orchestration.
- `src/providers/ThemeProvider.tsx`: NativeWind CSS variable theme provider.
- `src/translations/i18n.ts`: i18next initialization, default language, language persistence.
- `src/translations/fa.json`, `src/translations/en.json`: translation dictionaries.
- `src/styles/theme.ts`: light/dark color tokens, spacing, typography, radius.
- `src/components/*`: reusable UI components.
- `src/components/Map/LeafletMap.tsx`: Leaflet-in-WebView map implementation.
- `src/components/EMR/*`: questionnaire and health-record display components.

Consultation app note:

- `tsconfig.json` excludes `salam-consultation-front-dev`, meaning the native app is configured to keep the embedded/adjacent consultation web project out of native TypeScript compilation.
- In the current working tree, the local `salam-consultation-front-dev` folder is not present, so this report documents the native integration point and SSO/WebView contract, not the internal source of the consultation web app.

## Languages And Platforms

Languages and formats:

- TypeScript: primary application language.
- TSX: React Native screens and components.
- JavaScript: config files such as `tailwind.config.js`.
- JSON: app config, package metadata, translations.
- CSS: `src/styles/global.css` for NativeWind/global styling.
- HTML/JavaScript string: Leaflet map HTML inside `src/components/Map/LeafletMap.tsx`.

Runtime platforms:

- Android: configured through Expo with package `com.salam.app`.
- iOS: configured through Expo with bundle identifier `com.salam.app`.
- Web: partially supported through Expo web config and `react-native-web`, but the app is primarily mobile-first.
- In-app browser/WebView: consultation and map features use WebView behavior.

Native permissions:

- iOS permissions are declared in `app.json` for camera, microphone, and location.
- Android permissions are declared for camera, audio recording, audio settings, fine location, and coarse location.
- These are important for consultation video/voice sessions and location-based discovery.

## Package And Dependency Overview

Core runtime:

- `expo ^56.0.8`: Expo runtime and build ecosystem.
- `react 19.2.3`, `react-dom 19.2.3`: React runtime.
- `react-native 0.85.3`: native rendering runtime.
- `expo-router ^56.2.8`: file-based routing.
- `@react-navigation/native ^7.1.19`: navigation foundation.
- `react-native-screens 4.25.2`, `react-native-safe-area-context ~5.7.0`: native navigation/safe-area support.

State and server data:

- `@reduxjs/toolkit ^2.9.2`: Redux slices and store.
- `react-redux ^9.2.0`: React bindings for Redux.
- `@tanstack/react-query ^5.90.6`: async server state and caching.
- `@tanstack/react-query-devtools ^5.90.2`: query debugging tooling.
- `axios ^1.13.1`: HTTP client.

Storage and auth/session helpers:

- `@react-native-async-storage/async-storage ^2.2.0`: token, theme, language, role, and SSO pending-state persistence.
- `expo-secure-store ~56.0.4`: installed and available, but current token storage uses AsyncStorage.
- `expo-web-browser ~56.0.5`: OAuth sessions and external browser fallback.
- `expo-linking ^56.0.13`: deep-link parsing and app scheme callbacks.
- `expo-constants ^56.0.16`: runtime config access.

UI and styling:

- `nativewind ^5.0.0-preview.2`: Tailwind-like styling for React Native.
- `tailwindcss ^4.1.16`: styling engine.
- `expo-linear-gradient ~56.0.4`: gradients for home banners and category cards.
- `@expo/vector-icons ^15.0.3`: iconography.
- `react-native-toast-message ^2.3.3`: toast notifications.
- `expo-font ~56.0.5`: custom IRANSans font loading.
- `expo-status-bar ~56.0.4`, `expo-system-ui ~56.0.5`: system UI styling.

Localization and dates:

- `i18next ^25.6.0`, `react-i18next ^16.2.3`: translations and runtime language switching.
- `expo-localization ~56.0.6`: localization support.
- `moment-jalaali ^0.10.4`, `@hassanmojab/react-modern-calendar-datepicker ^3.1.7`, `react-native-date-picker ^5.0.13`: Persian/Jalali date support and date picking.

WebView and web compatibility:

- `react-native-webview 13.16.1`: consultation and Leaflet map WebViews.
- `react-native-web ^0.21.0`: web runtime support.

Animation/worklets:

- `react-native-reanimated 4.3.1`
- `react-native-worklets 0.8.3`

Development:

- `typescript ~6.0.3`
- `react-test-renderer 19.2.3`
- `@types/react ~19.2.14`
- `@types/moment-jalaali ^0.7.9`
- `@babel/runtime ^7.28.4`
- `postcss ^8.5.6`

## Architecture And Design Patterns

### File-Based Routing

The application uses Expo Router. Routes are filesystem entries under `app/`.

Patterns:

- `(tabs)` groups the main authenticated/guest tab shell.
- `(auth)` groups login, registration, verification, and OAuth callback screens.
- `(protected)` groups screens intended for logged-in users.
- Standalone category screens live directly under `app/`.

This keeps navigation discoverable and makes page ownership clear. Adding a new category is usually a matter of adding a route file and linking it from `app/(tabs)/home.tsx`.

### Provider Composition

`app/_layout.tsx` wraps the app with:

- `AppProviders`
- `SafeAreaProvider`
- `StatusBar`
- `Toast`

`src/providers/AppProviders.tsx` loads fonts, restores theme, restores auth session, configures React Query, initializes i18n, and controls the splash screen. This is a classic root bootstrap pattern.

### State Pattern

The app separates state into:

- Client/app state in Redux: auth, user form/profile state, theme.
- Server state in React Query: profile, auth checks, EMR, doctors, places.
- Durable local state in AsyncStorage: tokens, theme, language, current role, pending SSO redirect.

This separation is a strong scalable pattern because not every API response is copied into Redux. React Query owns cache invalidation and retry behavior, while Redux owns state that affects routing and global UI.

### API Service Pattern

`src/lib/api/apiClient.ts` creates one Axios client with:

- `baseURL` from `config.apiUrl`.
- 30-second timeout.
- `Content-Type: application/json`.
- `X-App-Client: phone`.
- request interceptor that attaches `Authorization: Bearer <accessToken>`.
- response interceptor that refreshes tokens on 401/403.
- queueing for concurrent requests during refresh.

`src/lib/api/apiService.ts` exposes domain functions like `login`, `register`, `verifyLogin`, `getUserProfile`, `getNearbyPlaces`, and EMR functions.

### Hook Pattern

Feature hooks wrap API calls:

- `src/lib/api/useAuth.ts`
- `src/lib/hooks/auth/*`
- `src/lib/hooks/emr/*`

This gives screens simple loading/error/data/mutate objects and keeps HTTP details outside UI components.

### Component Pattern

Reusable UI components live in `src/components/`, including:

- `Button`
- `FloatingInput`
- `OtpInput`
- `FloatingSelect`
- `Modal`
- `Header`
- `BackHeader`
- `CategoryCard`
- EMR cards and sections
- `LeafletMap`

Screens compose these components instead of building every control from scratch.

### Theme Pattern

Theme is handled in two layers:

- `src/styles/theme.ts` provides JS-accessible color tokens.
- `src/providers/ThemeProvider.tsx` maps theme mode to NativeWind CSS variables.

This allows both inline style decisions and class-based utility styling.

### WebView Adapter Pattern

Consultation is integrated using an adapter wrapper in `app/doctors-consultation.tsx`. This screen adds:

- a native header with back, reload, current host, progress, and external-open action.
- an injected JavaScript bridge to catch `window.open`, `_blank`, downloads, `tel:`, `mailto:`, `blob:` links.
- WebView settings for cookies, third-party cookies, media playback, geolocation, file access, and fullscreen video.
- fallback behavior for external/custom URL schemes.

This is the correct direction for embedding a separate web app while still making it feel native.

## UI And UX Choices

Visual direction:

- Health-oriented green primary color: `#16a34a`.
- Secondary teal/blue accents.
- Rounded cards, soft shadows, and large touch targets.
- Persian-first typography with IRANSans.
- Category grid mirrors the web landing concept with colorful icon cards.
- Consultation is promoted on the home page with a prominent banner.
- Bottom tabs provide persistent primary navigation.

RTL/LTR:

- Persian is the default language.
- Root layout forces RTL through `I18nManager`.
- Many screens derive `isRTL` from `i18n.language === 'fa'`.
- Tab layout flips tab direction for RTL.
- Text alignment is explicitly adjusted in key screens.

Dark mode:

- Theme state is stored in Redux and persisted in AsyncStorage.
- NativeWind variables and JS color tokens both support dark mode.
- Cards, text, borders, and surfaces adapt through `useTheme()`.

Mobile ergonomics:

- Home categories use three-column cards sized from device width.
- Buttons use explicit heights and touchable opacity.
- Auth screens use `KeyboardAvoidingView`.
- Profile and EMR screens use scroll views.
- Consultation WebView includes a native browser-style toolbar to prevent the user from feeling trapped.

## Backend Connection

Backend base URL:

- Defined in `app.json` under `expo.extra.apiUrl`.
- Read by `src/config/index.ts`.
- Used by `src/lib/api/apiClient.ts`.

Current configured API shape:

- Auth:
  - `POST /user`
  - `POST /user/otp`
  - `POST /user/login`
  - `POST /user/validate-login-otp`
  - `GET /user/logout`
  - `GET /user/usersStatus`
  - `POST /auth/token`
  - `POST /user/oauth-register-user`
- User:
  - `GET /user/userInfo`
  - `GET /user/get-all-potential-roles`
  - dynamic `upgradeUser(role)` endpoint
- Doctors:
  - `GET /user/doctors`
- EMR:
  - `GET /emr/temp/self`
  - `GET /emr/temp/cachedInfo`
  - `POST /emr/temp/self`
  - `GET /emrServer/userHealthInfo`
  - `GET /emrServer/prescriptions/userPrimaryServices`
- Location:
  - `GET /location`

Request lifecycle:

1. A screen or hook calls `apiService`.
2. `apiService` uses `apiClient`.
3. `apiClient` reads the access token from storage.
4. If present, it attaches `Authorization: Bearer <token>`.
5. The backend responds.
6. On 401/403, `apiClient` tries `/auth/token` using the refresh token.
7. During refresh, additional failed requests wait in a queue.
8. On refresh success, the new access token is saved and failed requests replay.
9. On refresh failure, tokens are removed and the app routes to `/(auth)`.

## Authentication Flow

### Standard Login Flow

Files:

- `src/screens/Auth/LoginScreen.tsx`
- `src/lib/hooks/auth/useLogin.ts`
- `app/(auth)/verification.tsx`
- `src/lib/hooks/auth/useVerifyLogin.ts`
- `src/lib/auth/sso.ts`
- `src/redux/slices/authSlice.ts`
- `src/lib/auth/tokenStorage.ts`

Flow:

1. User enters phone and national ID.
2. `LoginScreen` validates phone length 11 and national ID length 10.
3. `useLogin` calls `POST /user/login`.
4. On success, login form values are saved in Redux.
5. App navigates to `/(auth)/verification?type=login`.
6. User enters 6-digit OTP.
7. `useVerifyLogin` calls `POST /user/validate-login-otp`.
8. `finishVerification` in `app/(auth)/verification.tsx` applies the auth response.
9. `applyAuthResponse` extracts tokens, saves them, updates Redux, calls `checkAuthorizeApi`, and normalizes roles.
10. If no SSO redirect is returned, user goes to `/(tabs)/home`.
11. If an SSO redirect is returned, the consultation flow starts.

### Registration Flow

Files:

- `src/screens/Auth/RegisterScreen.tsx`
- `src/components/DatePicker/DatePickerJalali.tsx`
- `src/lib/hooks/auth/useRegister.ts`
- `app/(auth)/verification.tsx`
- `src/lib/hooks/auth/useVerifyRegister.ts`

Flow:

1. User enters phone, national ID, and birth date.
2. Birth date is selected with a Jalali date picker.
3. `useRegister` calls `POST /user`.
4. App navigates to OTP verification.
5. `useVerifyRegister` calls `POST /user/otp`.
6. Auth response is processed the same way as login.

### Health Ministry OAuth Flow

Files:

- `src/lib/auth/sso.ts`
- `src/screens/Auth/LoginScreen.tsx`
- `src/screens/Auth/RegisterScreen.tsx`
- `app/(auth)/health-ministry-callback.tsx`
- `app.json`

Config:

- App scheme: `salam`
- Callback URL: `salam://health-ministry-callback`
- Authorization URL: `https://ssocore.behdasht.gov.ir/oauth2/authorize`
- Client ID: configured as `salamhealth.ir`

Flow:

1. User taps Health Ministry login/register.
2. `startHealthMinistryAuth()` opens an OAuth session with `expo-web-browser`.
3. The external auth page redirects to `salam://health-ministry-callback?code=...`.
4. Expo Linking parses the callback.
5. `submitHealthMinistryCode(code)` posts the code to `POST /user/oauth-register-user`.
6. Backend returns app tokens, roles, and optionally an SSO redirect URL.
7. `applyAuthResponse` saves tokens and updates Redux.
8. User lands on home or consultation depending on redirect response.

### Role Selection Flow

Files:

- `app/(auth)/verification.tsx`
- `src/components/Auth/ChooseCurrentRole.tsx`
- `src/lib/auth/sso.ts`

Flow:

1. Auth response is checked for roles.
2. If one role exists, it is stored as `currentRole`.
3. If multiple roles exist, a role modal opens.
4. If there is a pending SSO redirect, it is stored as `pendingSsoRedirectUrl`.
5. After role selection, the app consumes the pending redirect and opens consultation.

### Logout Flow

Files:

- `app/(tabs)/profile.tsx`
- `src/lib/api/useAuth.ts`
- `src/lib/auth/tokenStorage.ts`
- `src/redux/slices/authSlice.ts`

Flow:

1. User taps logout.
2. App confirms through `Alert`.
3. `GET /user/logout` is attempted.
4. Tokens and role/SSO state are removed locally.
5. Redux login state becomes false.
6. App routes to `/(tabs)/home`.

## SSO And Consultation Integration

Files:

- `app/doctors-consultation.tsx`
- `src/config/index.ts`
- `app.json`
- `src/lib/auth/sso.ts`
- `app/(auth)/verification.tsx`
- `src/screens/Auth/LoginScreen.tsx`
- `src/screens/Auth/RegisterScreen.tsx`

Config:

- `consultationSsoUrl`: SSO URL with consultation redirect target.
- `sepehrSalamatSsoUrl`: SSO URL with Sepehr Salamat redirect target.
- `ssoLogoutUrl`: SSO logout endpoint.

Entry points:

- Home consultation banner.
- Home consultation category card.
- Auth response with `ssoRedirectUrl`.
- Direct route `/doctors-consultation`.

Flow from native auth to consultation:

1. User completes login/register/OAuth.
2. Backend may return `ssoRedirectUrl`.
3. Native app stores tokens and roles.
4. If role selection is needed, user selects a role.
5. Native app opens `/doctors-consultation` with `url=<ssoRedirectUrl>`.
6. `DoctorsConsultationScreen` loads the URL in a WebView.
7. The web SSO endpoint logs the user into the consultation web app.
8. Consultation continues inside the native shell.

WebView compatibility behaviors:

- `window.open` becomes a native bridge message.
- `_blank` links open inside the WebView instead of spawning uncontrolled windows.
- Downloads are handed to `expo-web-browser`.
- `tel:`, `mailto:`, and custom schemes are handed to the OS via `Linking`.
- Cookies and third-party cookies are enabled for SSO/session continuity.
- Media playback and fullscreen video are enabled.
- Camera, microphone, and location permissions are declared at native config level.
- A fallback external-open button is provided in the native toolbar.

## Main Functional Capabilities

### Landing/Home

File: `app/(tabs)/home.tsx`

Capabilities:

- Displays the main Helsan service landing page.
- Shows a consultation banner.
- Shows category grid with health services.
- Routes to consultation, pharmacies, medical centers, health monitoring, and other service pages.
- Uses GIF/image assets and gradient cards to visually match the original React app direction.

### Consultation

File: `app/doctors-consultation.tsx`

Capabilities:

- Loads consultation SSO or direct passed URL.
- Keeps consultation inside the native app.
- Provides browser-style controls: back, reload, current domain, open externally.
- Supports video/audio consultation needs through WebView and native permissions.

### Auth And Account

Files:

- `app/(auth)/index.tsx`
- `src/screens/Auth/LoginScreen.tsx`
- `src/screens/Auth/RegisterScreen.tsx`
- `app/(auth)/verification.tsx`
- `app/(tabs)/profile.tsx`

Capabilities:

- Login with phone/national ID.
- Register with phone/national ID/birth date.
- OTP verification and resend.
- Forgot-password/reset-password shell.
- Health Ministry OAuth.
- Profile display for logged-in users.
- Logout and token cleanup.

### EMR / Health Record

Files:

- `app/(protected)/my-emr.tsx`
- `src/components/EMR/Questionnaire.tsx`
- `src/components/EMR/MyHealthInfo.tsx`
- `src/components/EMR/components/*`
- `src/lib/hooks/emr/*`

Capabilities:

- Checks whether self-expression questionnaire was filled.
- Shows questionnaire if not filled.
- Shows health summary and EMR sections if data exists.
- Calls EMR backend endpoints for status, cached info, save, health info, and services.

### Map / Nearby Places

Files:

- `app/(tabs)/map.tsx`
- `src/components/Map/LeafletMap.tsx`

Capabilities:

- Shows medical places on a Leaflet map embedded in WebView.
- Requests nearby places when map bounds change.
- Provides filters for hospital, pharmacy, clinic, and all.
- Includes fallback mock places.
- Includes fallback UI when WebView native module is unavailable.

### Pharmacy

File: `app/pharmacies.tsx`

Capabilities:

- Shows pharmacy-related service cards.
- Opens external pharmacy URLs through `Linking.openURL`.

### Category Pages

Files:

- `app/medical-centers.tsx`
- `app/health-monitoring.tsx`
- other service pages under `app/`

Capabilities:

- Provide mobile route coverage for the React app service categories.
- Some pages currently use mock/static data or coming-soon placeholders.
- They establish navigation and design structure for future backend integration.

## Security Model

Current strengths:

- Access token is attached centrally by Axios interceptor.
- Refresh token flow is centralized.
- Concurrent refresh attempts are queued to avoid multiple refresh storms.
- Tokens are removed on refresh failure/logout.
- SSO pending redirect and current role are explicitly cleared on logout.
- OAuth uses app deep links and `expo-web-browser` auth sessions.

Important caveats:

- Tokens are currently stored in AsyncStorage via `src/lib/auth/tokenStorage.ts`. `expo-secure-store` is installed and would be stronger for access/refresh tokens.
- `src/config/index.ts` contains client config including sensitive-looking values. Secrets in a mobile bundle are not truly secret; any client secret should be moved server-side or treated as public.
- Protected route group exists, but route-level auth guarding is not strongly enforced in `app/(protected)/_layout.tsx`. Current protection relies mostly on navigation decisions.
- Debug API logs in `src/lib/api/apiClient.ts` print headers/body in development. This is useful during development but should be reviewed before release.

## Scalability

The app is scalable because:

- File-based routing makes feature growth straightforward.
- Reusable components reduce duplicate UI work.
- API calls are centralized behind `apiService`.
- Auth/token refresh is centralized and not repeated per screen.
- React Query avoids overusing Redux for server data.
- i18n is already integrated, so adding languages is structurally easy.
- The theme layer allows broad visual updates without rewriting every component.
- WebView adapter isolates consultation complexity from the rest of the native app.

Recommended scalability improvements:

- Move tokens to `expo-secure-store`.
- Add explicit route guards in `app/(protected)/_layout.tsx`.
- Add typed DTOs for all API responses instead of `any`.
- Split category screens into feature folders as they grow.
- Add automated unit tests for auth helpers and API interceptors.
- Add E2E tests for login, role selection, and consultation SSO.
- Move environment-specific URLs to EAS env/config profiles.
- Add CI scripts for `typecheck`, `lint`, and tests.
- Optimize large GIF/static image assets to reduce bundle size and memory pressure.

## Performance Characteristics

Startup:

- Fonts load before splash is hidden.
- Theme and auth session are restored before rendering.
- This creates a cleaner startup but can delay first paint if storage/font loading is slow.

Network:

- Axios timeout is 30 seconds.
- React Query default retry is 1.
- Query stale time defaults to 5 minutes in `AppProviders`.
- Token refresh queue prevents duplicate refresh calls during burst failures.

WebView:

- Consultation WebView uses cache, cookies, third-party cookies, DOM storage, and media support.
- This improves SSO/session continuity but increases memory usage compared with pure native screens.
- Video consultation depends on native permission availability and WebView media support.

Map:

- Leaflet map runs inside a WebView and loads tiles/scripts from public CDN URLs.
- If network is weak or CDN unavailable, map rendering may degrade.
- The component includes a fallback for missing WebView native module.

Assets:

- Home uses many GIFs and images.
- Visual quality is high, but many animated assets can affect app size, memory, and low-end device performance.

Platform behavior:

- Android: permissions are declared for media/location; WebView behavior is generally compatible with camera/mic prompts.
- iOS: Info.plist descriptions are declared; iOS WebView permissions are stricter and should be tested on a physical device.
- Expo Go: some WebView/native behaviors may not match production; development builds are more accurate.
- Web: partial support exists but not all native/WebView flows should be assumed production-ready.

## Current Local Validation Results

These commands were run locally on 2026-06-01.

| Check | Command | Result | Notes |
| --- | --- | --- | --- |
| Expo config JSON parse | `Get-Content app.json | ConvertFrom-Json | Out-Null` | Pass | `app.json` is valid JSON. |
| Available npm scripts | `npm run` | Pass | Scripts available: `start`, `android`, `ios`, `web`. No `test`, `lint`, or `typecheck` script exists. |
| TypeScript strict check | `npx tsc --noEmit` | Fail | TypeScript 6 reports TS5101: `baseUrl` is deprecated unless `ignoreDeprecations: "6.0"` is set. |
| TypeScript after deprecation override | `npx tsc --noEmit --ignoreDeprecations 6.0` | Fail | TS2304 in `src/translations/i18n.ts:34`: `global` type is not found. |
| Consultation app local folder check | `Test-Path salam-consultation-front-dev/package.json` | Not present | Folder is not currently in this working tree, so its own build/test could not be run. |

Interpretation:

- The app config is syntactically healthy.
- The project currently lacks formal test/lint/typecheck npm scripts.
- TypeScript failures are configuration/type-environment issues, not necessarily runtime app logic failures.
- To make typecheck green under TypeScript 6, add `ignoreDeprecations: "6.0"` or migrate away from `baseUrl`, and replace or type the `global` reference in `src/translations/i18n.ts`.

## Mocked QA Test Plan And Expected Results

The following test matrix is written as mock QA scenarios based on current code paths. These are accurate expected results for mocked services, but they were not all executed on a device in this session.

### Startup And Bootstrap

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| BOOT-01 | Cold launch with no tokens | AsyncStorage has no access/refresh token | Splash hides after fonts/theme/auth restore; user lands in tabs/home as guest | Expected pass |
| BOOT-02 | Cold launch with valid stored tokens | AsyncStorage contains both tokens | `restoreAuthSession` sets `isLoggedIn=true`; profile tab shows logged-in UI after profile query | Expected pass |
| BOOT-03 | Stored dark theme | AsyncStorage `@app_theme=dark` | App renders dark theme variables and dark status bar style | Expected pass |
| BOOT-04 | Stored English language | AsyncStorage `@app_language=en` | i18n switches from default `fa` to `en` after load | Expected pass |

### Navigation

| ID | Scenario | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| NAV-01 | Home category navigation | Tap medical centers card | Navigates to `/medical-centers` | Expected pass |
| NAV-02 | Consultation banner | Tap consultation CTA | Navigates to `/doctors-consultation` and loads default SSO URL | Expected pass |
| NAV-03 | Bottom tabs RTL | Language `fa` | Tab bar direction is row-reverse; labels use Persian strings | Expected pass |
| NAV-04 | Profile guest route | Guest taps profile tab | Login prompt appears with login button | Expected pass |
| NAV-05 | Protected route direct access | Guest navigates directly to `/my-emr` | Current code does not enforce route guard at layout level | Expected gap |

### Standard Auth

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| AUTH-01 | Invalid login phone | Phone length less than 11 | Validation error, no API call | Expected pass |
| AUTH-02 | Invalid national ID | National ID length less than 10 | Validation error, no API call | Expected pass |
| AUTH-03 | Login OTP request success | `/user/login` returns success | Form values stored, route to verification | Expected pass |
| AUTH-04 | Previous OTP still valid | `/user/login` returns `PREVIOUS_OTP_STILL_VALID` | App still routes to verification | Expected pass |
| AUTH-05 | OTP success with tokens | `/user/validate-login-otp` returns access/refresh token | Tokens saved, Redux logged in, auth status checked | Expected pass |
| AUTH-06 | OTP failure | backend returns error | Toast error, OTP code cleared | Expected pass |
| AUTH-07 | Register missing birth date | Empty birth date | Validation error, no API call | Expected pass |
| AUTH-08 | Register OTP success | `/user/otp` returns tokens | Tokens saved and route continues based on roles/SSO | Expected pass |

### Health Ministry OAuth And SSO

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| SSO-01 | OAuth cancelled | `openAuthSessionAsync` returns non-success | Loading stops; user remains on auth screen | Expected pass |
| SSO-02 | OAuth success no SSO redirect | Backend returns tokens, no `ssoRedirectUrl` | Tokens saved; route to home | Expected pass |
| SSO-03 | OAuth success with SSO redirect | Backend returns `ssoRedirectUrl` | App opens `/doctors-consultation?url=...` | Expected pass |
| SSO-04 | OTP auth with one role and SSO | roles array has one item | Role stored; consultation opens | Expected pass |
| SSO-05 | OTP auth with multiple roles and SSO | roles array has two or more items | Pending SSO URL stored; role modal opens; consultation opens after role selection | Expected pass |
| SSO-06 | Stored current role exists | AsyncStorage has `currentRole` | Role modal skipped; consultation opens directly | Expected pass |

### Token Refresh

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| TOK-01 | Access token attached | Stored access token exists | Request includes `Authorization: Bearer <token>` | Expected pass |
| TOK-02 | Single 401 | API returns 401; refresh succeeds | `/auth/token` called; new access token saved; original request retries | Expected pass |
| TOK-03 | Concurrent 401s | Three requests fail during refresh | One refresh call; queued requests replay with new token | Expected pass |
| TOK-04 | Refresh token missing | Access expired, no refresh token | Tokens cleared; route to `/(auth)` | Expected pass |
| TOK-05 | Refresh fails | `/auth/token` fails | Queue rejected; tokens cleared; route to `/(auth)` | Expected pass |

### Consultation WebView

| ID | Scenario | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| WEBV-01 | Default consultation open | Open `/doctors-consultation` without params | Loads `config.consultationSsoUrl` | Expected pass |
| WEBV-02 | Auth handoff URL | Open route with `url` param | WebView loads the passed SSO redirect URL | Expected pass |
| WEBV-03 | Back button inside WebView | WebView has history | Native toolbar back calls `goBack()` | Expected pass |
| WEBV-04 | Reload | Tap reload | WebView reloads and error state clears | Expected pass |
| WEBV-05 | External open | Tap external icon | Current URL opens in system browser/auth session browser | Expected pass |
| WEBV-06 | `_blank` consultation link | Web page clicks `_blank` link | Injected bridge posts `OPEN_URL`; native WebView navigates internally | Expected pass |
| WEBV-07 | `window.open` call | Web app calls `window.open(url)` | Injected override catches and opens inside WebView | Expected pass |
| WEBV-08 | Download link | Web app clicks download/blob link | Native opens URL through `expo-web-browser` | Expected pass |
| WEBV-09 | Telephone link | Web app opens `tel:` | Native opens OS dialer via `Linking` | Expected pass |
| WEBV-10 | Email link | Web app opens `mailto:` | Native opens mail client via `Linking` | Expected pass |
| WEBV-11 | Video call page | Consultation requests camera/mic | Native permission prompt can be shown because permissions are declared | Needs device test |
| WEBV-12 | Network failure | WebView load fails | Error state appears with retry button | Expected pass |

### EMR

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| EMR-01 | Questionnaire not filled | status `selfExpressionFilledBefore=false` | `Questionnaire` renders | Expected pass |
| EMR-02 | Questionnaire filled | status `selfExpressionFilledBefore=true` | `MyHealthInfo` renders | Expected pass |
| EMR-03 | Loading state | status or health query pending | Activity indicator shows | Expected pass |
| EMR-04 | Save questionnaire | backend accepts POST `/emr/temp/self` | Questionnaire data saved and health info can be refetched | Expected pass if hook handles invalidation |

### Map And Location

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| MAP-01 | WebView map available | WebView module loads | Leaflet HTML renders map | Expected pass in dev build |
| MAP-02 | WebView map unavailable | WebView require fails | Fallback message is shown | Expected pass |
| MAP-03 | Map bounds changed | Leaflet sends `moveend` | App calls `/location` with top-left and bottom-right bounds | Expected pass |
| MAP-04 | Location API error | `/location` fails | Error logs; mock places remain visible | Expected pass |
| MAP-05 | Filter pharmacy | User taps pharmacy filter | List/map data filters to pharmacy items | Expected pass |

### Profile And Logout

| ID | Scenario | Mock setup | Expected result | Status |
| --- | --- | --- | --- | --- |
| PROF-01 | Guest profile | `isLoggedIn=false` | Login prompt shown | Expected pass |
| PROF-02 | Logged-in profile | profile query returns first/last name | Profile card shows display name and phone | Expected pass |
| PROF-03 | Logout success | `/user/logout` succeeds | Tokens removed, query cache cleared, route home | Expected pass |
| PROF-04 | Logout backend fails | `/user/logout` fails | Local tokens still removed; route home | Expected pass |

### UI, RTL, And Theme

| ID | Scenario | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| UI-01 | Persian default | Fresh install | Language starts as `fa`, RTL layout is used | Expected pass |
| UI-02 | Dark home | Theme dark | Home cards/banners use dark colors where coded | Expected pass |
| UI-03 | Auth keyboard | Focus auth input on iOS/Android | KeyboardAvoidingView keeps fields usable | Expected pass |
| UI-04 | Long category labels | Persian text wraps to two lines | `CategoryCard` title uses `numberOfLines={2}` | Expected pass |
| UI-05 | Toast feedback | Login/register success or error | Toast displays backend message or translated fallback | Expected pass |

### Platform Scenarios

| ID | Scenario | Expected behavior | Risk |
| --- | --- | --- | --- |
| PLAT-01 | Android physical device | Auth, WebView, map, media permissions work with native modules | Needs full device QA |
| PLAT-02 | iOS physical device | OAuth callback, WebView media permissions, safe areas work | Needs full device QA |
| PLAT-03 | Expo Go | Some native WebView/media behavior may differ | Use dev build for accurate QA |
| PLAT-04 | Slow network | API waits up to 30s; React Query retries once | Some screens need richer error UI |
| PLAT-05 | Offline | Cached React Query data may remain; new requests fail | No global offline state except map/consultation-specific behavior |

## Strengths

- Clear mobile-first architecture with Expo Router.
- Good separation between UI, API service, hooks, auth helpers, and Redux state.
- Persian-first UX with RTL handling and IRANSans fonts.
- Centralized auth/token refresh logic.
- Consultation is isolated as a WebView integration rather than being partially reimplemented.
- WebView wrapper handles modern mobile app concerns: popups, downloads, cookies, media, geolocation, custom schemes.
- React Query gives scalable server-state caching.
- NativeWind plus theme tokens makes UI evolution easier.
- Home page closely follows the React app's service-category concept.
- App has a practical path for both native features and external/web-backed services.

## Current Gaps And Risks

- No formal `test`, `lint`, or `typecheck` npm script is defined.
- Current `npx tsc --noEmit` fails under TypeScript 6 because of `baseUrl` deprecation.
- After overriding that deprecation, TypeScript still fails on `global` in `src/translations/i18n.ts`.
- Token storage currently uses AsyncStorage rather than SecureStore.
- Protected route group does not yet enforce auth at layout level.
- Several category pages still use mock/static/placeholder data.
- Consultation web app source is not currently present in the workspace, so its internal compatibility/build could not be verified in this report.
- Map depends on external Leaflet CDN and OpenStreetMap tiles.
- Large GIF/image usage can increase bundle size and memory usage.
- Some strings in source fallback literals appear encoding-corrupted in the current file view; translation JSON should be treated as the source of truth.

## Recommended Next Steps

1. Add scripts:
   - `typecheck`: `tsc --noEmit`
   - `test`: unit tests
   - `lint`: ESLint
2. Fix TypeScript 6 issues:
   - add `ignoreDeprecations: "6.0"` or migrate away from deprecated `baseUrl`.
   - replace `typeof global !== 'undefined'` with a typed-safe global check, or add the correct ambient type.
3. Move tokens from AsyncStorage to `expo-secure-store`.
4. Add auth guard logic to `app/(protected)/_layout.tsx`.
5. Add unit tests for:
   - `src/lib/auth/sso.ts`
   - `src/lib/auth/tokenStorage.ts`
   - `src/lib/api/apiClient.ts`
6. Add integration tests for:
   - OTP auth.
   - token refresh queue.
   - role selection with pending SSO redirect.
   - consultation WebView bridge messages.
7. Add device QA for:
   - Android camera/microphone WebView permissions.
   - iOS camera/microphone WebView permissions.
   - Health Ministry deep link callback.
   - consultation SSO handoff.
8. Bring the consultation web app back into the workspace when needed and run its own install/build/WebView compatibility sweep.
9. Replace static category data with backend-backed hooks as endpoints become available.
10. Optimize images/GIFs and audit bundle size before production release.

## Final Assessment

Helsan Native is a solid mobile foundation for the Helsan health-services ecosystem. Its strongest architectural decisions are the file-based route structure, centralized API/auth handling, reusable component set, Persian-first RTL design, and WebView-based consultation integration. The app already supports the most important product flow: users can enter the native app, authenticate through OTP or Health Ministry OAuth, resolve roles, and enter consultation through SSO inside a native wrapper.

The main production-readiness work is around hardening: secure token storage, typecheck cleanup, route guards, automated tests, real device QA for WebView media permissions, and replacing remaining static/mock service pages with backend-backed implementations.
