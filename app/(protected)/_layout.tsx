// app/(protected)/_layout.tsx
import { useTheme } from '@/styles/theme';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="my-emr" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="support" />
    </Stack>
  );
}
