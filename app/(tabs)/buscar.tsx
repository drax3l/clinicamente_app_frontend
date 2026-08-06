import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ─── SCAFFOLD — Fase 2 ────────────────────────────────────────────────────────
// Esta pantalla está lista para recibir la lógica de búsqueda de psicólogos
// en el siguiente prompt. El enrutamiento desde el Tab Bar y las otras pantallas
// ya funciona correctamente apuntando a esta ruta.
//
// Próximo paso: conectar con GET /api/psicologos y mostrar resultados con filtros.
// ─────────────────────────────────────────────────────────────────────────────

export default function BuscarScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Inicio' | 'Buscar' | 'Citas' | 'Perfil'>('Buscar');

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Especialistas</Text>
        <Text style={styles.headerSubtitle}>
          Encuentra al psicólogo ideal para ti
        </Text>

        {/* Campo de búsqueda */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8EA7A2" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o especialidad..."
            placeholderTextColor="#A3B8B4"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#A3B8B4" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Contenido Placeholder ── */}
      <View style={styles.placeholderContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="people-outline" size={46} color="#A3B8B4" />
        </View>
        <Text style={styles.placeholderTitle}>Explorar especialistas</Text>
        <Text style={styles.placeholderSubtitle}>
          Aquí aparecerán los psicólogos disponibles.{'\n'}
          La integración con el backend se implementará en la siguiente fase.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Ionicons name="arrow-back-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tab Bar Inferior ── */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace('/(tabs)' as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={22} color="#8EA7A2" />
          <Text style={styles.tabLabel}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="search" size={22} color="#4E6E6B" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Buscar</Text>
          <View style={styles.tabActiveDot} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/profile/citas' as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={22} color="#8EA7A2" />
          <Text style={styles.tabLabel}>Citas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/profile' as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={22} color="#8EA7A2" />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  header: {
    backgroundColor: '#4E6E6B',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C2E2B',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
    gap: 14,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E5F0EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2E2B',
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#657B76',
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4E6E6B',
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // Tab Bar
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
