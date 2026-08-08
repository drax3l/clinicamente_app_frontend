import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PsicologoHomeScreen() {
  const router = useRouter();

  // Lista de pacientes programados para hoy
  const pacientesHoy = [
    {
      id: '1',
      hora: '09:00',
      periodo: 'AM',
      nombre: 'María García',
      modalidad: 'Virtual',
      estado: 'Próxima',
      estadoColor: '#4E6E6B',
      lineaColor: '#4E6E6B',
    },
    {
      id: '2',
      hora: '10:30',
      periodo: 'AM',
      nombre: 'Roberto López',
      modalidad: 'Presencial',
      estado: 'Confirmada',
      estadoColor: '#10B981',
      lineaColor: '#10B981',
    },
    {
      id: '3',
      hora: '12:00',
      periodo: 'PM',
      nombre: 'Ana Fernández',
      modalidad: 'Virtual',
      estado: 'Confirmada',
      estadoColor: '#10B981',
      lineaColor: '#10B981',
    },
    {
      id: '4',
      hora: '16:00',
      periodo: 'PM',
      nombre: 'Pedro Sánchez',
      modalidad: 'Virtual',
      estado: 'Pendiente',
      estadoColor: '#F59E0B',
      lineaColor: '#F59E0B',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Encabezado ─── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateText}>Lunes, 19 Jul 2026</Text>
            <Text style={styles.doctorName}>Dr. Alejandro Torres</Text>
          </View>

          {/* Avatar del Psicólogo con badge */}
          <TouchableOpacity
            style={styles.profileContainer}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs-psicologo)/config' as any)}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── Grilla de Tarjetas de Métricas (2x2) ─── */}
        <View style={styles.gridContainer}>
          {/* Tarjeta 1: Solicitudes (Fondo Oscuro Slate Teal) */}
          <TouchableOpacity
            style={[styles.card, styles.cardSolicitudes]}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs-psicologo)/solicitudes' as any)}
          >
            <Text style={styles.cardTagDark}>SOLICITUDES</Text>
            <Text style={styles.cardValueDark}>3 nuevas</Text>
            <View style={styles.cardSubrow}>
              <Text style={styles.cardSubtextAmber}>↑ Pendientes</Text>
            </View>
          </TouchableOpacity>

          {/* Tarjeta 2: Citas Hoy */}
          <View style={[styles.card, styles.cardWhite]}>
            <Text style={styles.cardTagMuted}>CITAS HOY</Text>
            <Text style={styles.cardValueDarkText}>4 / 6</Text>
            {/* Barra de progreso */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '66%' }]} />
            </View>
          </View>

          {/* Tarjeta 3: Pacientes */}
          <TouchableOpacity
            style={[styles.card, styles.cardWhite]}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs-psicologo)/pacientes' as any)}
          >
            <Text style={styles.cardTagMuted}>PACIENTES</Text>
            <Text style={styles.cardValueDarkText}>48</Text>
            <Text style={styles.cardSubtextGreen}>+3 este mes</Text>
          </TouchableOpacity>

          {/* Tarjeta 4: Valoración */}
          <View style={[styles.card, styles.cardValoracion]}>
            <Text style={styles.cardTagWarm}>VALORACIÓN</Text>
            <Text style={styles.cardValueWarm}>4.9 ★</Text>
            <Text style={styles.cardSubtextWarm}>94 reseñas</Text>
          </View>
        </View>

        {/* ─── Sección: Pacientes de Hoy ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pacientes de Hoy</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.verAgendaText}>Ver agenda</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Pacientes */}
        <View style={styles.pacientesList}>
          {pacientesHoy.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.pacienteItemCard}
              activeOpacity={0.7}
            >
              {/* Hora y Periodo */}
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.hora}</Text>
                <Text style={styles.periodText}>{item.periodo}</Text>
              </View>

              {/* Línea vertical de acento de color */}
              <View style={[styles.verticalAccentLine, { backgroundColor: item.lineaColor }]} />

              {/* Información del Paciente */}
              <View style={styles.pacienteInfo}>
                <Text style={styles.pacienteNombre}>{item.nombre}</Text>
                <View style={styles.pacienteDetalleRow}>
                  <Text style={styles.pacienteModalidad}>{item.modalidad}</Text>
                  <Text style={styles.dotSeparator}>·</Text>
                  <Text style={[styles.pacienteEstadoText, { color: item.estadoColor }]}>
                    {item.estado}
                  </Text>
                </View>
              </View>

              {/* Chevron Flecha derecha */}
              <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ─── Botón Flotante de Acción (FAB +) ─── */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.85}
        onPress={() => {
          // Acción del FAB para agendar nueva cita o nota
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingBottom: 90,
  },

  // ─── Header ───
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: '#8EA7A2',
    fontWeight: '500',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C2E2B',
    letterSpacing: -0.3,
  },
  profileContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D97706',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // ─── Grilla 2x2 ───
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 28,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    height: 122,
    justifyContent: 'space-between',
  },

  // Tarjeta Solicitudes (Slate Dark Teal)
  cardSolicitudes: {
    backgroundColor: '#4E6E6B',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTagDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B3C8C4',
    letterSpacing: 0.5,
  },
  cardValueDark: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardSubrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtextAmber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
  },

  // Tarjeta Blanca Genérica
  cardWhite: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTagMuted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C938E',
    letterSpacing: 0.5,
  },
  cardValueDarkText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C2E2B',
  },

  // Barra de progreso
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5EFEA',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4E6E6B',
    borderRadius: 3,
  },

  // Subtexto verde
  cardSubtextGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22C55E',
  },

  // Tarjeta Valoración (Beige Cálido)
  cardValoracion: {
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  cardTagWarm: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  cardValueWarm: {
    fontSize: 24,
    fontWeight: '800',
    color: '#B45309',
  },
  cardSubtextWarm: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },

  // ─── Sección Pacientes ───
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C2E2B',
  },
  verAgendaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4E6E6B',
  },
  pacientesList: {
    gap: 12,
  },
  pacienteItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0ED',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  timeContainer: {
    alignItems: 'center',
    width: 52,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C2E2B',
  },
  periodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8EA7A2',
    marginTop: 1,
  },
  verticalAccentLine: {
    width: 3,
    height: 36,
    borderRadius: 2,
    marginHorizontal: 14,
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 3,
  },
  pacienteDetalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pacienteModalidad: {
    fontSize: 13,
    color: '#657B76',
  },
  dotSeparator: {
    fontSize: 14,
    color: '#A3B8B4',
    marginHorizontal: 6,
  },
  pacienteEstadoText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // ─── FAB Button ───
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
