import { Redirect } from 'expo-router';

// Redirect to tabs - home is the landing page
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}