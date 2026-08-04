import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth-context';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Svg, { Path } from 'react-native-svg';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  specialistId: string;
  specialistName: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

export default function MyAppointmentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const list: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Appointment);
      });

      // Sort by date (nearest first)
      list.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${convertTimeTo24h(a.time)}`);
        const dateTimeB = new Date(`${b.date}T${convertTimeTo24h(b.time)}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });
      
      setAppointments(list);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'No se pudieron cargar tus citas.');
    } finally {
      setLoading(false);
    }
  };

  const convertTimeTo24h = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}:00`;
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = async (id: string, specialistName: string) => {
    Alert.alert(
      'Cancelar Cita',
      `¿Estás seguro de que deseas cancelar tu sesión con ${specialistName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const docRef = doc(db, 'appointments', id);
              await updateDoc(docRef, { status: 'cancelled' });
              
              Alert.alert('Cita Cancelada', 'Tu sesión ha sido cancelada correctamente.');
              fetchAppointments();
            } catch (err) {
              console.error('Error cancelling appointment:', err);
              Alert.alert('Error', 'No se pudo cancelar la cita. Inténtalo de nuevo.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
        <View style={styles.centerContent}>
          <View style={styles.lockIconBox}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 15V17M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11M5 11H19C20.1046 11 21 11.8954 21 13V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V13C3 11.8954 3.89543 11 5 11Z"
                stroke="#4E6E6B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.noUserTitle}>Inicia Sesión</Text>
          <Text style={styles.noUserDesc}>
            Debes iniciar sesión para ver tus citas agendadas e ingresar a tus videoconsultas.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={() => router.push('/login' as any)}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activeAppointments = appointments.filter(app => app.status !== 'cancelled');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)' as any)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 19L8 12L15 5"
              stroke="#1C2E2B"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Citas</Text>
        <TouchableOpacity 
          onPress={fetchAppointments} 
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.57.57"
              stroke="#4E6E6B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4E6E6B" />
          <Text style={styles.loadingText}>Buscando tus citas...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeAppointments.length > 0 ? (
            activeAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                {/* Doctor details */}
                <View style={styles.cardHeader}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarLetter}>
                      {appointment.specialistName.replace('Dra. ', '').replace('Dr. ', '')[0]}
                    </Text>
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{appointment.specialistName}</Text>
                    <Text style={styles.sessionType}>Videoconsulta de 50 min</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Confirmada</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Schedule details */}
                <View style={styles.scheduleRow}>
                  <View style={styles.scheduleItem}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.scheduleIcon}>
                      <Path
                        d="M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V17C3 18.1046 3.89543 19 5 19Z"
                        stroke="#657B76"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text style={styles.scheduleText}>{formatDisplayDate(appointment.date)}</Text>
                  </View>

                  <View style={styles.scheduleItem}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.scheduleIcon}>
                      <Path
                        d="M12 8V12L15 15M21 12C21 16.9706 17.0294 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C17.0294 3 21 7.02944 21 12Z"
                        stroke="#657B76"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text style={styles.scheduleText}>{appointment.time}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                    onPress={() => handleCancelAppointment(appointment.id, appointment.specialistName)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.joinButton}
                    activeOpacity={0.85}
                    onPress={() =>
                      Alert.alert(
                        'Iniciar Videollamada',
                        'El enlace de videollamada se habilitará 5 minutos antes de la hora acordada.',
                        [{ text: 'Entendido', style: 'default' }]
                      )
                    }
                  >
                    <Text style={styles.joinButtonText}>Entrar a sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.calendarIconBox}>
                <Svg width={50} height={50} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V17C3 18.1046 3.89543 19 5 19Z"
                    stroke="#8A9F9A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.emptyTitle}>Sin citas activas</Text>
              <Text style={styles.emptyDesc}>
                No tienes ninguna sesión agendada actualmente. Encuentra un terapeuta que se adapte a ti.
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                activeOpacity={0.8}
                onPress={() => router.push('/explore' as any)}
              >
                <Text style={styles.exploreButtonText}>Explorar Terapeutas</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
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
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(78, 110, 107, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  lockIconBox: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: 'rgba(78, 110, 107, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  noUserTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 10,
  },
  noUserDesc: {
    fontSize: 14,
    color: '#657B76',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  loginButton: {
    backgroundColor: '#4E6E6B',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 12,
    color: '#657B76',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(78, 110, 107, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4E6E6B',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  sessionType: {
    fontSize: 12,
    color: '#8A9F9A',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(78, 110, 107, 0.06)',
    marginVertical: 14,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIcon: {
    marginRight: 6,
  },
  scheduleText: {
    fontSize: 13,
    color: '#657B76',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D28585',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#D28585',
    fontSize: 14,
    fontWeight: '700',
  },
  joinButton: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  calendarIconBox: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: 'rgba(138, 159, 154, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#657B76',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#4E6E6B',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
