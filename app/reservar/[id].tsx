import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Datos MOCK de doctores según ID para demostración
const DOCTORES_DATA: { [key: string]: any } = {
  '1': {
    id: 1,
    nombre: 'Dra. Elena Martínez',
    especialidad: 'Psicóloga Clínica · 8 años exp.',
    calificacion: 4.9,
    resenasCount: 128,
    imagenUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
  },
  '2': {
    id: 2,
    nombre: 'Dr. Carlos Vega',
    especialidad: 'Psicoterapeuta · 6 años exp.',
    calificacion: 4.8,
    resenasCount: 94,
    imagenUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
  },
  '3': {
    id: 3,
    nombre: 'Dra. Ana Ramos',
    especialidad: 'Psic. Cognitiva · 10 años exp.',
    calificacion: 4.7,
    resenasCount: 76,
    imagenUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?q=80&w=300&auto=format&fit=crop',
  },
};

const DIAS_SEMANA = [
  { dia: 'LUN', numero: 13, tieneCitas: true },
  { dia: 'MAR', numero: 14, tieneCitas: false },
  { dia: 'MIÉ', numero: 15, tieneCitas: true },
  { dia: 'JUE', numero: 16, tieneCitas: true },
  { dia: 'VIE', numero: 17, tieneCitas: false },
  { dia: 'SÁB', numero: 18, tieneCitas: true },
  { dia: 'DOM', numero: 19, tieneCitas: false },
];

const HORAS_DISPONIBLES = ['09:00', '10:00', '11:30', '14:00', '16:30', '18:00'];

export default function ReservarCitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Buscar doctor por ID o fallback al primer doctor
  const doctorId = typeof id === 'string' ? id : '1';
  const doctor = DOCTORES_DATA[doctorId] || DOCTORES_DATA['1'];

  // Estados de selección del formulario
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedHour, setSelectedHour] = useState('10:00');
  const [modalidad, setModalidad] = useState<'VIRTUAL' | 'PRESENCIAL'>('VIRTUAL');
  const [loading, setLoading] = useState(false);

  // Manejador del botón "Solicitar Cita"
  const handleSolicitarCita = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '¡Cita Solicitada!',
        `Has agendado con ${doctor.nombre} el día 15 de Julio de 2026 a las ${selectedHour} en modalidad ${modalidad}.`,
        [
          {
            text: 'Entendido',
            onPress: () => router.replace('/(tabs)' as any),
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />

      {/* Header con botón Back y Título */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#1C2E2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservar Cita</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta del Doctor Seleccionado */}
        <View style={styles.doctorSummaryCard}>
          <Image source={{ uri: doctor.imagenUrl }} style={styles.summaryImage} />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryName}>{doctor.nombre}</Text>
            <Text style={styles.summarySpecialty}>{doctor.especialidad}</Text>
            <View style={styles.summaryRatingRow}>
              <Ionicons name="star" size={15} color="#FBBF24" />
              <Text style={styles.summaryRatingText}>
                {doctor.calificacion} <Text style={styles.summaryReviews}>({doctor.resenasCount} reseñas)</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Tarjeta Selector de Fecha */}
        <View style={styles.cardSection}>
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>Julio 2026</Text>
            <View style={styles.monthArrows}>
              <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="chevron-back" size={16} color="#4E6E6B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="chevron-forward" size={16} color="#4E6E6B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Grilla de Días de la semana */}
          <View style={styles.daysRow}>
            {DIAS_SEMANA.map((item) => {
              const isSelected = selectedDay === item.numero;
              return (
                <TouchableOpacity
                  key={item.numero}
                  activeOpacity={0.75}
                  style={styles.dayCol}
                  onPress={() => setSelectedDay(item.numero)}
                >
                  <Text style={styles.dayLabel}>{item.dia}</Text>
                  <View
                    style={[
                      styles.dayNumberBox,
                      isSelected && styles.dayNumberBoxSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        isSelected && styles.dayNumberTextSelected,
                      ]}
                    >
                      {item.numero}
                    </Text>
                  </View>
                  {item.tieneCitas && (
                    <View
                      style={[
                        styles.dayDot,
                        isSelected && styles.dayDotSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sección: Hora Disponible */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hora disponible</Text>
          <View style={styles.hoursGrid}>
            {HORAS_DISPONIBLES.map((hora) => {
              const isSelected = selectedHour === hora;
              return (
                <TouchableOpacity
                  key={hora}
                  activeOpacity={0.8}
                  style={[
                    styles.hourChip,
                    isSelected ? styles.hourChipSelected : styles.hourChipInactive,
                  ]}
                  onPress={() => setSelectedHour(hora)}
                >
                  <Text
                    style={[
                      styles.hourText,
                      isSelected ? styles.hourTextSelected : styles.hourTextInactive,
                    ]}
                  >
                    {hora}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sección: Modalidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modalidad</Text>
          <View style={styles.modalityRow}>
            {/* Opción Virtual */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.modalityCard,
                modalidad === 'VIRTUAL' ? styles.modalityCardActive : styles.modalityCardInactive,
              ]}
              onPress={() => setModalidad('VIRTUAL')}
            >
              <View style={styles.radioOuter}>
                {modalidad === 'VIRTUAL' && <View style={styles.radioInner} />}
              </View>
              <Ionicons name="laptop-outline" size={20} color="#4E6E6B" style={{ marginLeft: 8 }} />
              <Text style={styles.modalityText}>Virtual</Text>
            </TouchableOpacity>

            {/* Opción Presencial */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.modalityCard,
                modalidad === 'PRESENCIAL' ? styles.modalityCardActive : styles.modalityCardInactive,
              ]}
              onPress={() => setModalidad('PRESENCIAL')}
            >
              <View style={styles.radioOuter}>
                {modalidad === 'PRESENCIAL' && <View style={styles.radioInner} />}
              </View>
              <Ionicons name="business-outline" size={20} color="#4E6E6B" style={{ marginLeft: 8 }} />
              <Text style={styles.modalityText}>Presencial</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Fijo */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          activeOpacity={0.88}
          onPress={handleSolicitarCita}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Solicitar Cita</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.legalText}>
          El costo y método de pago se acordarán directamente con el especialista
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  doctorSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E6E6B',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 14,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summarySpecialty: {
    fontSize: 13,
    color: '#E0ECE8',
    marginBottom: 6,
  },
  summaryRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryReviews: {
    fontWeight: '400',
    color: '#D2E3DE',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  monthArrows: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8EA7A2',
  },
  dayNumberBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumberBoxSelected: {
    backgroundColor: '#4E6E6B',
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  dayNumberTextSelected: {
    color: '#FFFFFF',
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4E6E6B',
  },
  dayDotSelected: {
    backgroundColor: '#4E6E6B',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 14,
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hourChip: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourChipSelected: {
    backgroundColor: '#4E6E6B',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  hourChipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
  },
  hourText: {
    fontSize: 14,
    fontWeight: '700',
  },
  hourTextSelected: {
    color: '#FFFFFF',
  },
  hourTextInactive: {
    color: '#4E6E6B',
  },
  modalityRow: {
    flexDirection: 'row',
    gap: 14,
  },
  modalityCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  modalityCardActive: {
    backgroundColor: '#EBF4F1',
    borderWidth: 2,
    borderColor: '#4E6E6B',
  },
  modalityCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4E6E6B',
  },
  modalityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C2E2B',
    marginLeft: 8,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: '#4E6E6B',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  legalText: {
    fontSize: 11,
    color: '#8EA7A2',
    textAlign: 'center',
    lineHeight: 16,
  },
});
