// app/(protected)/_layout.tsx
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="my-emr" />
    </Stack>
  );
}