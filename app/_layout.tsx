import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* ─── Flujo de Autenticación ─── */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signup-psicologo" options={{ headerShown: false }} />

        {/* ─── Zona Autenticada (Tabs) ─── */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs-psicologo)" options={{ headerShown: false }} />

        {/* ─── Sub-pantallas del Perfil ─── */}
        <Stack.Screen name="profile/editar" options={{ headerShown: false }} />
        <Stack.Screen name="profile/citas" options={{ headerShown: false }} />

        {/* ─── Flujo de Reservas ─── */}
        <Stack.Screen name="reservar/[id]" options={{ headerShown: false }} />

        {/* ─── Otras Pantallas ─── */}
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="upload-docs" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
