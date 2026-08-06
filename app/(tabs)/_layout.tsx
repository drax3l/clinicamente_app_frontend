import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// ─── Layout de las Tabs Internas de ClinicaMente ──────────────────────────────
// La tab bar nativa de Expo está oculta (display: 'none') porque cada pantalla
// implementa su propia barra inferior personalizada con el diseño de la app
// (paleta teal, dot indicator, tipografía, etc.).
// ─────────────────────────────────────────────────────────────────────────────

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Tab bar personalizada en cada pantalla
      }}
    >
      {/* Pestaña: Inicio (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Buscar (buscar.tsx) */}
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Citas (citas.tsx) */}
      <Tabs.Screen
        name="citas"
        options={{
          title: 'Citas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña: Mi Perfil (profile.tsx) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Ocultar explore del menú de tabs nativo (se conserva el archivo) */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // No aparece en la tab bar
        }}
      />
    </Tabs>
  );
}
