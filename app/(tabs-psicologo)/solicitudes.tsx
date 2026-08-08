import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState([
    {
      id: '1',
      paciente: 'Carlos Mendoza',
      motivo: 'Consulta por Ansiedad y Estrés Laboral',
      modalidad: 'Virtual',
      fecha: 'Mañana, 10:00 AM',
      estado: 'Pendiente',
    },
    {
      id: '2',
      paciente: 'Lucía Fernández',
      motivo: 'Terapia de Pareja',
      modalidad: 'Presencial',
      fecha: 'Miércoles, 04:00 PM',
      estado: 'Pendiente',
    },
    {
      id: '3',
      paciente: 'Gabriel Torres',
      motivo: 'Evaluación Psicológica General',
      modalidad: 'Virtual',
      fecha: 'Jueves, 11:30 AM',
      estado: 'Pendiente',
    },
  ]);

  const handleAprobar = (id: string, nombre: string) => {
    Alert.alert('Solicitud Aceptada', `Has aceptado la cita de ${nombre}.`, [
      {
        text: 'OK',
        onPress: () => {
          setSolicitudes((prev) => prev.filter((s) => s.id !== id));
        },
      },
    ]);
  };

  const handleRechazar = (id: string, nombre: string) => {
    Alert.alert('Rechazar Solicitud', `¿Estás seguro de rechazar la solicitud de ${nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Rechazar',
        style: 'destructive',
        onPress: () => {
          setSolicitudes((prev) => prev.filter((s) => s.id !== id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Solicitudes de Citas</Text>
          <Text style={styles.subtitle}>
            Revisa y gestiona las solicitudes entrantes de nuevos pacientes.
          </Text>
        </View>

        {solicitudes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#4E6E6B" />
            <Text style={styles.emptyTitle}>¡Todo al día!</Text>
            <Text style={styles.emptySubtitle}>No tienes solicitudes pendientes por el momento.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {solicitudes.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.pacienteAvatar}>
                    <Text style={styles.avatarText}>{item.paciente.charAt(0)}</Text>
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.pacienteNombre}>{item.paciente}</Text>
                    <Text style={styles.fechaText}>{item.fecha}</Text>
                  </View>
                  <View style={styles.modalidadBadge}>
                    <Text style={styles.modalidadText}>{item.modalidad}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                  <Text style={styles.motivoLabel}>Motivo de consulta:</Text>
                  <Text style={styles.motivoText}>{item.motivo}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.btnRechazar}
                    activeOpacity={0.8}
                    onPress={() => handleRechazar(item.id, item.paciente)}
                  >
                    <Text style={styles.btnRechazarText}>Rechazar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnAceptar}
                    activeOpacity={0.85}
                    onPress={() => handleAprobar(item.id, item.paciente)}
                  >
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    <Text style={styles.btnAceptarText}>Aceptar Cita</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#E2ECE8',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#657B76',
    textAlign: 'center',
  },
  listContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pacienteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EBF4F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4E6E6B',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  fechaText: {
    fontSize: 13,
    color: '#657B76',
    marginTop: 2,
  },
  modalidadBadge: {
    backgroundColor: '#F0F8F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalidadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4E6E6B',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFF5F3',
    marginVertical: 14,
  },
  cardBody: {
    marginBottom: 16,
  },
  motivoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8EA7A2',
    marginBottom: 4,
  },
  motivoText: {
    fontSize: 14,
    color: '#1C2E2B',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnRechazar: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnRechazarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E53E3E',
  },
  btnAceptar: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4E6E6B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnAceptarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
