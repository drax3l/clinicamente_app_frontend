import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/axiosConfig';
import { getStoredToken } from '../../api/axiosConfig';

// ─── Tipos (según API_CONTEXT.md) ────────────────────────────────────────────
interface CitaResponseDto {
  idCita: number;
  idPaciente: number;
  nombrePaciente?: string;
  idPsicologo: number;
  nombrePsicologo?: string;
  fechaCita: string;
  horaInicioCita: string;
  horaFinCita: string;
  modalidadCita: string;
  estadoCita: string;
}

// ─── Utilidad: Decodificar JWT ────────────────────────────────────────────────
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

// ─── Badge de estado de cita ─────────────────────────────────────────────────
function getBadgeConfig(estado: string): { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap } {
  switch (estado?.toUpperCase()) {
    case 'CONFIRMADA':  return { bg: '#EAF7F0', text: '#10B981', icon: 'checkmark-circle' };
    case 'PENDIENTE':   return { bg: '#FEF3C7', text: '#D97706', icon: 'time-outline' };
    case 'CANCELADA':   return { bg: '#FEE2E2', text: '#EF4444', icon: 'close-circle' };
    case 'COMPLETADA':  return { bg: '#E0E7FF', text: '#6366F1', icon: 'ribbon-outline' };
    default:            return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-circle-outline' };
  }
}

// ─── SCAFFOLD con integración a GET /api/citas/paciente/{id} ─────────────────
// Fase 2: Ya conecta con el backend. Si el endpoint devuelve array vacío o
// falla, muestra un estado vacío limpio con CTA para buscar especialista.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileCitasScreen() {
  const router = useRouter();

  const [citas, setCitas] = useState<CitaResponseDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [idPaciente, setIdPaciente] = useState<number | null>(null);

  // ─── Obtener idPaciente desde el JWT ────────────────────────────────────
  const obtenerIdPaciente = useCallback(async (): Promise<number | null> => {
    try {
      const token = await getStoredToken();
      if (!token) return null;
      const payload = decodeJwtPayload(token);
      // Spring Security puede incluir el id en claims custom `id` o `userId`
      // Si no existe, usamos un fallback de 1 para desarrollo local
      return payload?.id ?? payload?.userId ?? payload?.idUsuario ?? 1;
    } catch {
      return null;
    }
  }, []);

  // ─── Carga de citas desde el backend ────────────────────────────────────
  const fetchCitas = useCallback(async () => {
    setErrorMsg(null);
    try {
      const id = await obtenerIdPaciente();
      setIdPaciente(id);

      if (!id) {
        setErrorMsg('No se pudo identificar tu sesión. Intenta cerrar y abrir la app.');
        return;
      }

      // GET /api/citas/paciente/{idPaciente} — requiere JWT (incluido automáticamente por axiosConfig)
      const response = await api.get(`/api/citas/paciente/${id}`);

      if (Array.isArray(response.data)) {
        setCitas(response.data);
      } else {
        setCitas([]);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ??
        error.response?.data?.error ??
        'No se pudo cargar tus citas. Verifica tu conexión.';
      setErrorMsg(msg);
      console.warn('[ProfileCitasScreen] Error al cargar citas:', error.message);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  }, [obtenerIdPaciente]);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCitas();
  };

  // ─── Render: Cargando ────────────────────────────────────────────────────
  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#1C2E2B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Citas</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#4E6E6B" />
          <Text style={styles.loadingText}>Cargando tus citas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: Error ───────────────────────────────────────────────────────
  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#1C2E2B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Citas</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centeredContainer}>
          <Ionicons name="cloud-offline-outline" size={52} color="#A3B8B4" />
          <Text style={styles.emptyTitle}>Error al cargar</Text>
          <Text style={styles.emptySubtitle}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCitas} activeOpacity={0.85}>
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: Lista de citas ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1C2E2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Citas</Text>
        {/* Badge contador */}
        {citas.length > 0 && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>{citas.length}</Text>
          </View>
        )}
        {citas.length === 0 && <View style={{ width: 40 }} />}
      </View>

      {citas.length === 0 ? (
        /* ── Estado vacío ── */
        <View style={styles.centeredContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="calendar-outline" size={48} color="#A3B8B4" />
          </View>
          <Text style={styles.emptyTitle}>Sin citas programadas</Text>
          <Text style={styles.emptySubtitle}>
            Aún no tienes citas agendadas.{'\n'}
            Explora a nuestros especialistas y agenda tu primera sesión.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.push('/search' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="search-outline" size={18} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Buscar especialista</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── Lista de citas ── */
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4E6E6B']}
              tintColor="#4E6E6B"
            />
          }
        >
          {citas.map((cita) => {
            const badge = getBadgeConfig(cita.estadoCita);
            return (
              <View key={cita.idCita} style={styles.citaCard}>
                {/* Fila superior: doctor + estado */}
                <View style={styles.cardTopRow}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorAvatar}>
                      <Ionicons name="person" size={22} color="#4E6E6B" />
                    </View>
                    <View>
                      <Text style={styles.doctorName} numberOfLines={1}>
                        {cita.nombrePsicologo ?? `Especialista #${cita.idPsicologo}`}
                      </Text>
                      <Text style={styles.citaIdText}>Cita #{cita.idCita}</Text>
                    </View>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon} size={12} color={badge.text} />
                    <Text style={[styles.estadoBadgeText, { color: badge.text }]}>
                      {cita.estadoCita}
                    </Text>
                  </View>
                </View>

                {/* Divisor */}
                <View style={styles.cardDivider} />

                {/* Detalles */}
                <View style={styles.detalleRow}>
                  <Ionicons name="calendar-outline" size={15} color="#8EA7A2" />
                  <Text style={styles.detalleText}>
                    <Text style={styles.detalleLabel}>Fecha: </Text>
                    {cita.fechaCita}
                  </Text>
                </View>

                <View style={styles.detalleRow}>
                  <Ionicons name="time-outline" size={15} color="#8EA7A2" />
                  <Text style={styles.detalleText}>
                    <Text style={styles.detalleLabel}>Horario: </Text>
                    {cita.horaInicioCita?.substring(0, 5)} – {cita.horaFinCita?.substring(0, 5)}
                  </Text>
                </View>

                <View style={styles.detalleRow}>
                  <Ionicons
                    name={cita.modalidadCita === 'VIRTUAL' ? 'videocam-outline' : 'business-outline'}
                    size={15}
                    color="#8EA7A2"
                  />
                  <Text style={styles.detalleText}>
                    <Text style={styles.detalleLabel}>Modalidad: </Text>
                    {cita.modalidadCita}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 28 : 12,
    paddingBottom: 16,
    backgroundColor: '#EFF5F3',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECE8',
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  counterBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  // Centrado (loading / error / vacío)
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#657B76',
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E5F0EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#657B76',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4E6E6B',
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // Lista
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  // Tarjeta de Cita
  citaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  doctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EBF4F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
    maxWidth: 160,
  },
  citaIdText: {
    fontSize: 12,
    color: '#8EA7A2',
    marginTop: 1,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  estadoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F4F2',
    marginBottom: 12,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  detalleText: {
    fontSize: 13,
    color: '#657B76',
  },
  detalleLabel: {
    fontWeight: '600',
    color: '#3B5B57',
  },
});
