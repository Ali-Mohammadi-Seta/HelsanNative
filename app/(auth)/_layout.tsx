// app/(auth)/_layout.tsx
import { useTheme } from '@/styles/theme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="health-ministry-callback" />
    </Stack>
  );
}
