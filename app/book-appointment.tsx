import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function BookAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, userProfile } = useAuth();
  
  const specialistId = params.specialistId as string;
  const specialistName = params.specialistName as string;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate next 7 days starting from today
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  const days = getNext7Days();

  // Predefined time slots for appointment
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  const formatFullDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para agendar una cita.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Selecciona Fecha', 'Por favor selecciona un día para tu sesión.');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Selecciona Horario', 'Por favor selecciona una hora para tu sesión.');
      return;
    }

    setLoading(true);
    try {
      const appointmentDateStr = selectedDate.toISOString().split('T')[0];
      
      // Save appointment record in Firestore
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: userProfile?.nombre || user.email || 'Paciente',
        specialistId,
        specialistName,
        date: appointmentDateStr,
        time: selectedTime,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert(
        '¡Cita Agendada!',
        `Tu sesión con ${specialistName} ha sido reservada con éxito para el ${formatFullDate(selectedDate)} a las ${selectedTime}.`,
        [
          {
            text: 'Ver Mis Citas',
            onPress: () => router.replace('/(tabs)/my-appointments' as any),
          },
          {
            text: 'Inicio',
            onPress: () => router.replace('/(tabs)' as any),
          }
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Hubo un problema al agendar tu cita. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Summary */}
        <View style={styles.therapistCard}>
          <Text style={styles.therapistLabel}>Terapeuta seleccionado</Text>
          <Text style={styles.therapistName}>{specialistName}</Text>
          <Text style={styles.sessionDuration}>Duración de la sesión: 50 minutos</Text>
        </View>

        {/* Date Selector Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona el día</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
            {days.map((day, idx) => {
              const isSelected = selectedDate && selectedDate.toDateString() === day.toDateString();
              const isToday = new Date().toDateString() === day.toDateString();
              const weekday = day.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').toUpperCase();
              const dayNum = day.getDate();

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dayPill,
                    isSelected && styles.dayPillSelected,
                    isToday && !isSelected && styles.dayPillToday,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>{weekday}</Text>
                  <Text style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>{dayNum}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona la hora</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Summary Card */}
        {selectedDate && selectedTime && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de la Cita</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fecha:</Text>
              <Text style={styles.summaryVal}>{formatFullDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Horario:</Text>
              <Text style={styles.summaryVal}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Precio estimado:</Text>
              <Text style={styles.summaryVal}>Por confirmar (coordinado con terapeuta)</Text>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Confirmar y Agendar Cita</Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  therapistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  therapistLabel: {
    fontSize: 12,
    color: '#8A9F9A',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  therapistName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 6,
  },
  sessionDuration: {
    fontSize: 14,
    color: '#657B76',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  daysScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  dayPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 64,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dayPillSelected: {
    backgroundColor: '#4E6E6B',
    borderColor: '#4E6E6B',
  },
  dayPillToday: {
    borderColor: '#4E6E6B',
    borderWidth: 1.5,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A9F9A',
    marginBottom: 6,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    flexBasis: '48%',
    flexGrow: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
  },
  timeSlotSelected: {
    backgroundColor: '#4E6E6B',
    borderColor: '#4E6E6B',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4E6E6B',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: 'rgba(78, 110, 107, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(78, 110, 107, 0.1)',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#657B76',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C2E2B',
  },
  submitButton: {
    backgroundColor: '#4E6E6B',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
