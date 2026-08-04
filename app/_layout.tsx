import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/auth-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function InitialLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    // Auth route guarding logic
    if (!user && inTabsGroup && segments[1] === 'my-appointments') {
      // If not logged in and trying to go to my-appointments, redirect to login
      router.replace('/login' as any);
    } else if (user && (segments[0] === 'login' || segments[0] === 'signup')) {
      // If logged in and on login/signup pages, redirect to home tabs
      router.replace('/(tabs)' as any);
    }
  }, [user, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="login"
          options={{
            title: 'Iniciar Sesión',
            headerTintColor: '#4E6E6B',
            headerStyle: { backgroundColor: '#EFF5F3' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Crear Cuenta',
            headerTintColor: '#4E6E6B',
            headerStyle: { backgroundColor: '#EFF5F3' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="upload-docs"
          options={{
            title: 'Subir Documentación',
            headerTintColor: '#4E6E6B',
            headerStyle: { backgroundColor: '#EFF5F3' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="book-appointment"
          options={{
            title: 'Agendar Cita',
            headerTintColor: '#4E6E6B',
            headerStyle: { backgroundColor: '#EFF5F3' },
            headerShadowVisible: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
