import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
} from '@expo-google-fonts/jost';

import { AuthProvider, useAuth, useIsAuthenticated } from '@/features/auth/AuthProvider';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Redirects between the auth flow and the app based on session state.
 * Keeps routing logic in one place so screens stay declarative.
 */
function useAuthGate() {
  const { initializing } = useAuth();
  const isAuthed = useIsAuthenticated();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthed && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (isAuthed && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [initializing, isAuthed, segments, router]);
}

function RootNavigator() {
  const { initializing } = useAuth();
  useAuthGate();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="session/create"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="session/[id]/index" />
      <Stack.Screen
        name="session/[id]/vote"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="session/[id]/reveal"
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_500Medium,
    PlayfairDisplay_500Medium_Italic,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
