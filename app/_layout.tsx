import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
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
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
