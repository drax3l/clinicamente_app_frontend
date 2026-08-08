import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PacientesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const pacientes = [
    {
      id: '1',
      nombre: 'María García',
      ultimaCita: '15 Jul 2026',
      totalSesiones: 8,
      diagnostico: 'Ansiedad Generalizada',
    },
    {
      id: '2',
      nombre: 'Roberto López',
      ultimaCita: '18 Jul 2026',
      totalSesiones: 4,
      diagnostico: 'Estrés laboral',
    },
    {
      id: '3',
      nombre: 'Ana Fernández',
      ultimaCita: '12 Jul 2026',
      totalSesiones: 12,
      diagnostico: 'Terapia de Aceptación',
    },
    {
      id: '4',
      nombre: 'Pedro Sánchez',
      ultimaCita: '08 Jul 2026',
      totalSesiones: 3,
      diagnostico: 'Evaluación inicial',
    },
  ];

  const filtered = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Lista de Pacientes</Text>
          <Text style={styles.subtitle}>48 pacientes registrados a tu cargo</Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#657B76" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre de paciente..."
            placeholderTextColor="#A3B8B4"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#97A9A6" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Lista */}
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <TouchableOpacity key={item.id} style={styles.patientCard} activeOpacity={0.75}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.nombre.charAt(0)}</Text>
              </View>

              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>{item.nombre}</Text>
                <Text style={styles.diagnosticoText}>{item.diagnostico}</Text>

                <View style={styles.statsRow}>
                  <Text style={styles.statLabel}>Última cita: <Text style={styles.statValue}>{item.ultimaCita}</Text></Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.statLabel}>{item.totalSesiones} sesiones</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C2E2B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#657B76',
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2ECE8',
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C2E2B',
  },
  listContainer: {
    gap: 12,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  diagnosticoText: {
    fontSize: 13,
    color: '#4E6E6B',
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#8EA7A2',
  },
  statValue: {
    color: '#3B5B57',
    fontWeight: '600',
  },
  dot: {
    fontSize: 12,
    color: '#A3B8B4',
  },
});
