import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ─── Componentes de src/ ──────────────────────────────────────────────────────
import AvatarHeader from '../../src/components/profile/AvatarHeader';
import MenuOptionItem, { MenuOptionItemProps } from '../../src/components/profile/MenuOptionItem';

// ─── Servicios ────────────────────────────────────────────────────────────────
import { logout } from '../../api/authService';
import { getStoredToken } from '../../api/axiosConfig';

// ─── Tipos locales ────────────────────────────────────────────────────────────
interface UsuarioPerfil {
  nombre: string;
  apePaterno: string;
  apeMaterno: string;
  correo: string;
  iniciales: string;
}

// ─── Configuración del Menú ───────────────────────────────────────────────────
// Definir el menú como datos, no como JSX duplicado.
// Cada ítem declara su ruta de destino para router.push().
interface MenuConfig {
  id: string;
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  subtitulo: string;
  ruta: string;
}

const MENU_CONFIG: MenuConfig[] = [
  {
    id: 'editar',
    icono: 'create-outline',
    titulo: 'Editar Datos',
    subtitulo: 'Nombre, foto, contacto',
    ruta: '/profile/editar',
  },
  {
    id: 'citas',
    icono: 'calendar-outline',
    titulo: 'Mis Citas',
    subtitulo: 'Historial y próximas sesiones',
    ruta: '/profile/citas',
  },
  {
    id: 'documentos',
    icono: 'document-text-outline',
    titulo: 'Mis Documentos',
    subtitulo: 'Comprobantes y reportes',
    ruta: '/upload-docs',
  },
  {
    id: 'privacidad',
    icono: 'lock-closed-outline',
    titulo: 'Privacidad y Seguridad',
    subtitulo: 'Contraseña y ajustes de cuenta',
    ruta: '/profile/editar',
  },
  {
    id: 'soporte',
    icono: 'help-circle-outline',
    titulo: 'Soporte',
    subtitulo: 'Centro de ayuda y contacto',
    ruta: '/profile/editar',
  },
  {
    id: 'terminos',
    icono: 'document-outline',
    titulo: 'Términos y Condiciones',
    subtitulo: 'Política de privacidad',
    ruta: '/profile/editar',
  },
];

// ─── Utilidades ───────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#4E6E6B', '#6B8E8B', '#3B5B57', '#5A7A77', '#2D4744'];

function getAvatarColor(inicial: string): string {
  const idx = (inicial.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function generarIniciales(nombre: string, apePaterno: string): string {
  const n = nombre?.charAt(0)?.toUpperCase() ?? '';
  const a = apePaterno?.charAt(0)?.toUpperCase() ?? '';
  return `${n}${a}` || '?';
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();

  // ── Estado ──────────────────────────────────────────────────────────────────
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Inicio' | 'Buscar' | 'Citas' | 'Perfil'>('Perfil');

  // ── Carga de perfil desde JWT ────────────────────────────────────────────────
  const cargarPerfil = useCallback(async () => {
    try {
      const token = await getStoredToken();
      if (!token) { router.replace('/login'); return; }

      const payload = decodeJwtPayload(token);
      if (!payload) { router.replace('/login'); return; }

      const correo: string = payload.sub ?? payload.email ?? 'usuario@clinicamente.com';
      const parteLocal = correo.split('@')[0] ?? 'usuario';
      const segmentos = parteLocal.split(/[._-]/);

      const nombre = segmentos[0]
        ? segmentos[0].charAt(0).toUpperCase() + segmentos[0].slice(1)
        : 'Usuario';
      const apePaterno = segmentos[1]
        ? segmentos[1].charAt(0).toUpperCase() + segmentos[1].slice(1)
        : '';
      const apeMaterno = segmentos[2]
        ? segmentos[2].charAt(0).toUpperCase() + segmentos[2].slice(1)
        : '';

      setUsuario({
        nombre,
        apePaterno,
        apeMaterno,
        correo,
        iniciales: generarIniciales(nombre, apePaterno),
      });
    } catch (error) {
      console.error('[ProfileScreen] Error al cargar perfil:', error);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { cargarPerfil(); }, [cargarPerfil]);

  useFocusEffect(useCallback(() => { setRefreshing(false); }, []));

  // ── Logout ───────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de ClinicaMente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch {
              router.replace('/login');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  // ── Render: Cargando ─────────────────────────────────────────────────────────
  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4E6E6B" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E6E6B" />
          <Text style={styles.loadingText}>Cargando tu perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Derivados visuales ───────────────────────────────────────────────────────
  const avatarColor = getAvatarColor(usuario?.iniciales?.[0] ?? 'U');
  const nombreCompleto = [usuario?.nombre, usuario?.apePaterno, usuario?.apeMaterno]
    .filter(Boolean)
    .join(' ');

  // ── Render Principal ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4E6E6B" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); cargarPerfil(); }}
            tintColor="#FFFFFF"
            colors={['#4E6E6B']}
          />
        }
      >
        {/* ── Componente: Header verde con avatar ──────────────────────────── */}
        <AvatarHeader
          nombreCompleto={nombreCompleto}
          correo={usuario?.correo ?? ''}
          iniciales={usuario?.iniciales ?? '?'}
          avatarColor={avatarColor}
          onPressEditar={() => router.push('/profile/editar' as any)}
        />

        {/* ── Tarjeta blanca del menú ──────────────────────────────────────── */}
        <View style={styles.menuCard}>
          {/* Componente: Ítems del menú (loop sobre datos) */}
          {MENU_CONFIG.map((item, index) => (
            <MenuOptionItem
              key={item.id}
              icono={item.icono}
              titulo={item.titulo}
              subtitulo={item.subtitulo}
              onPress={() => router.push(item.ruta as any)}
              isLast={false}
            />
          ))}

          {/* Separador visual */}
          <View style={styles.sectionDivider} />

          {/* Componente: Cerrar Sesión (variante danger) */}
          <MenuOptionItem
            icono="log-out-outline"
            titulo="Cerrar Sesión"
            subtitulo="Finalizar sesión activa"
            onPress={handleLogout}
            isLast
            variante="danger"
          />
        </View>
      </ScrollView>

      {/* ── Tab Bar Inferior Personalizada ──────────────────────────────────── */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => { setActiveTab('Inicio'); router.replace('/(tabs)' as any); }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Inicio' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'Inicio' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Inicio' && styles.tabLabelActive]}>
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => { setActiveTab('Buscar'); router.push('/search' as any); }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Buscar' ? 'search' : 'search-outline'}
            size={22}
            color={activeTab === 'Buscar' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Buscar' && styles.tabLabelActive]}>
            Buscar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => { setActiveTab('Citas'); router.push('/profile/citas' as any); }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Citas' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'Citas' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Citas' && styles.tabLabelActive]}>
            Citas
          </Text>
        </TouchableOpacity>

        {/* Perfil — activo */}
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="person" size={22} color="#4E6E6B" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Perfil</Text>
          <View style={styles.tabActiveDot} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos del contenedor (layout, no del diseño de sub-componentes) ─────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    color: '#657B76',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 28,
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 420,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F0F4F2',
    marginVertical: 10,
  },
  // ─── Tab Bar ────────────────────────────────────────────────────────────────
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 82 : 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8F0ED',
    paddingBottom: Platform.OS === 'ios' ? 16 : 0,
    elevation: 12,
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#8EA7A2',
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#4E6E6B',
    fontWeight: '700',
  },
  tabActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4E6E6B',
    marginTop: 2,
  },
});
