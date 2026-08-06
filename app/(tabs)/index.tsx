import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Interface de TypeScript para los datos del Psicólogo
export interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
  calificacion: number;
  totalResenas: number;
  disponibilidad: string;
  imagenUrl: string;
}

// Datos MOCK de prueba basados en el diseño visual
const ESPECIALIDADES = ['Ansiedad', 'Depresión', 'Pareja', 'Trauma', 'Autoestima'];

const DOCTORES_MOCK: Doctor[] = [
  {
    id: 1,
    nombre: 'Dra. Elena Martínez',
    especialidad: 'Psicóloga Clínica',
    calificacion: 4.9,
    totalResenas: 128,
    disponibilidad: 'Hoy - 16:00',
    imagenUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Vega',
    especialidad: 'Psicoterapeuta',
    calificacion: 4.8,
    totalResenas: 94,
    disponibilidad: 'Hoy - 18:00',
    imagenUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 3,
    nombre: 'Dra. Ana Ramos',
    especialidad: 'Psic. Cognitiva',
    calificacion: 4.7,
    totalResenas: 76,
    disponibilidad: 'Hoy - 19:30',
    imagenUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?q=80&w=300&auto=format&fit=crop',
  },
];

export default function HomePacienteScreen() {
  const router = useRouter();

  // Estados locales para interactividad
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('Ansiedad');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Inicio');

  // Filtrado de doctores según búsqueda o especialidad
  const doctoresFiltrados = DOCTORES_MOCK.filter((doc) => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.especialidad.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Saludo y Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingSubtitle}>Bienvenido de nuevo</Text>
            <Text style={styles.greetingTitle}>Hola, Carlos 👋</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8EA7A2" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar especialista o área..."
            placeholderTextColor="#8EA7A2"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sección: Especialidades (Scroll Horizontal) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {ESPECIALIDADES.map((esp) => {
            const isSelected = selectedEspecialidad === esp;
            return (
              <TouchableOpacity
                key={esp}
                activeOpacity={0.8}
                style={[
                  styles.chip,
                  isSelected ? styles.chipActive : styles.chipInactive,
                ]}
                onPress={() => setSelectedEspecialidad(esp)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected ? styles.chipTextActive : styles.chipTextInactive,
                  ]}
                >
                  {esp}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sección: Disponibles Hoy */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Disponibles Hoy</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Doctores */}
        <View style={styles.doctorsList}>
          {doctoresFiltrados.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              activeOpacity={0.88}
              style={styles.doctorCard}
              onPress={() => router.push(`/reservar/${doctor.id}` as any)}
            >
              {/* Imagen del Doctor */}
              <Image source={{ uri: doctor.imagenUrl }} style={styles.doctorImage} />

              {/* Información */}
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.nombre}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.especialidad}</Text>

                {/* Rating */}
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={15} color="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {doctor.calificacion}{' '}
                    <Text style={styles.ratingReviews}>({doctor.totalResenas})</Text>
                  </Text>
                </View>

                {/* Availability Badge */}
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>{doctor.disponibilidad}</Text>
                </View>
              </View>

              {/* Flecha navegación */}
              <Ionicons name="chevron-forward" size={20} color="#A3B8B4" style={styles.chevronIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Tab Bar Inferior */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Inicio')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Inicio' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'Inicio' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'Inicio' && styles.tabLabelActive,
            ]}
          >
            Inicio
          </Text>
          {activeTab === 'Inicio' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Buscar')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Buscar' ? 'search' : 'search-outline'}
            size={22}
            color={activeTab === 'Buscar' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'Buscar' && styles.tabLabelActive,
            ]}
          >
            Buscar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Citas')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Citas' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'Citas' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'Citas' && styles.tabLabelActive,
            ]}
          >
            Citas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Perfil')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'Perfil' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'Perfil' ? '#4E6E6B' : '#8EA7A2'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'Perfil' && styles.tabLabelActive,
            ]}
          >
            Perfil
          </Text>
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
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#657B76',
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C2E2B',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C2E2B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#657B76',
  },
  chipsContainer: {
    gap: 10,
    paddingBottom: 24,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
  },
  chipActive: {
    backgroundColor: '#4E6E6B',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: '#4E6E6B',
  },
  doctorsList: {
    gap: 14,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  doctorImage: {
    width: 68,
    height: 68,
    borderRadius: 16,
    marginRight: 14,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#657B76',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  ratingReviews: {
    fontSize: 12,
    fontWeight: '400',
    color: '#657B76',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  chevronIcon: {
    marginLeft: 6,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2ECE8',
    paddingBottom: Platform.OS === 'ios' ? 14 : 0,
    elevation: 10,
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: '#8EA7A2',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#4E6E6B',
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4E6E6B',
    marginTop: 2,
  },
});
