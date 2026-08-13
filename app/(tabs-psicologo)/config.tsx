import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  StatusBar,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout } from '../../api/authService';

export default function PsicologoConfigScreen() {
  const router = useRouter();

  // Estados de automatización y consulta
  const [mensajeAutomatico, setMensajeAutomatico] = useState(true);
  const [mensajeTexto, setMensajeTexto] = useState(
    'Hola, bienvenido/a a mi consulta. Para coordinar el pago, envíame el comprobante al chat antes de la sesión. El enlace de videollamada te llegará 10 min'
  );
  const [aceptarCitasAuto, setAceptarCitasAuto] = useState(true);
  const [perfilPublicoVisible, setPerfilPublicoVisible] = useState(true);

  // Estado modal/vista de horarios
  const [mostrarHorarios, setMostrarHorarios] = useState(false);

  // Estado de horarios por día
  const [horarios, setHorarios] = useState([
    { id: '1', nombre: 'Lunes', active: true, inicio: '09:00', fin: '18:00' },
    { id: '2', nombre: 'Martes', active: true, inicio: '09:00', fin: '18:00' },
    { id: '3', nombre: 'Miércoles', active: false, inicio: '09:00', fin: '18:00' },
    { id: '4', nombre: 'Jueves', active: true, inicio: '10:00', fin: '19:00' },
    { id: '5', nombre: 'Viernes', active: true, inicio: '09:00', fin: '15:00' },
    { id: '6', nombre: 'Sábado', active: false, inicio: '09:00', fin: '13:00' },
    { id: '7', nombre: 'Domingo', active: false, inicio: '09:00', fin: '13:00' },
  ]);

  const toggleDia = (id: string) => {
    setHorarios((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const updateHora = (id: string, field: 'inicio' | 'fin', text: string) => {
    setHorarios((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: text } : item))
    );
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir de tu cuenta de especialista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4E6E6B" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ─── Encabezado Principal Verde Pizarra ─── */}
        <View style={styles.headerBanner}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Configuración</Text>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Información del Doctor */}
          <View style={styles.doctorInfoRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop',
              }}
              style={styles.doctorAvatar}
            />
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>Dr. Alejandro Torres</Text>
              <Text style={styles.doctorSpecialty}>Psicoterapeuta · Madrid</Text>
              <View style={styles.premiumBadge}>
                <View style={styles.greenBadgeDot} />
                <Text style={styles.premiumBadgeText}>Plan Premium</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─── Sección 1: AUTOMATIZACIÓN ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionCategoryTitle}>AUTOMATIZACIÓN</Text>

          <View style={styles.card}>
            {/* Item 1: Mensaje automático de bienvenida */}
            <View style={styles.cardItem}>
              <View style={styles.switchRow}>
                <Text style={styles.itemTitle}>Mensaje automático de bienvenida</Text>
                <Switch
                  value={mensajeAutomatico}
                  onValueChange={setMensajeAutomatico}
                  trackColor={{ false: '#E2ECE8', true: '#4E6E6B' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E2ECE8"
                />
              </View>
              <Text style={styles.itemSubtext}>Incluye instrucciones de pago y coordinación</Text>

              {mensajeAutomatico && (
                <View style={styles.messageBoxContainer}>
                  <TextInput
                    style={styles.messageTextInput}
                    value={mensajeTexto}
                    onChangeText={setMensajeTexto}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              )}

              <Text style={styles.itemFootnote}>
                Este mensaje se enviará automáticamente al aceptar una cita
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Item 2: Gestión de enlaces */}
            <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Ionicons name="videocam-outline" size={20} color="#4E6E6B" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Gestión de enlaces</Text>
                <Text style={styles.optionSubtext}>Zoom · Google Meet · Teams</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Sección 2: CONSULTA ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionCategoryTitle}>CONSULTA</Text>

          <View style={styles.card}>
            {/* Item 1: Aceptar citas automáticamente */}
            <View style={styles.cardItem}>
              <View style={styles.switchRow}>
                <Text style={styles.itemTitle}>Aceptar citas automáticamente</Text>
                <Switch
                  value={aceptarCitasAuto}
                  onValueChange={setAceptarCitasAuto}
                  trackColor={{ false: '#E2ECE8', true: '#4E6E6B' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E2ECE8"
                />
              </View>
              <Text style={styles.itemSubtext}>Sin revisión manual previa</Text>
            </View>

            <View style={styles.divider} />

            {/* Item 2: Perfil público visible */}
            <View style={styles.cardItem}>
              <View style={styles.switchRow}>
                <Text style={styles.itemTitle}>Perfil público visible</Text>
                <Switch
                  value={perfilPublicoVisible}
                  onValueChange={setPerfilPublicoVisible}
                  trackColor={{ false: '#E2ECE8', true: '#4E6E6B' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E2ECE8"
                />
              </View>
              <Text style={styles.itemSubtext}>Apareces en búsquedas de pacientes</Text>
            </View>

            <View style={styles.divider} />

            {/* Item 3: Mi Disponibilidad Semanal */}
            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => setMostrarHorarios(!mostrarHorarios)}
            >
              <View style={styles.iconBox}>
                <Ionicons name="time-outline" size={20} color="#4E6E6B" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Mi Disponibilidad Semanal</Text>
                <Text style={styles.optionSubtext}>Configurar horario de atención</Text>
              </View>
              <Ionicons
                name={mostrarHorarios ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="#C4D5D0"
              />
            </TouchableOpacity>

            {/* Desplegable de Horarios si el usuario hace click */}
            {mostrarHorarios && (
              <View style={styles.horariosAccordion}>
                {horarios.map((h) => (
                  <View key={h.id} style={styles.horarioRow}>
                    <View style={styles.horarioHeader}>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: h.active ? '#10B981' : '#CBD5E1' },
                        ]}
                      />
                      <Text style={[styles.horarioDia, !h.active && styles.textMuted]}>
                        {h.nombre}
                      </Text>
                      <Switch
                        value={h.active}
                        onValueChange={() => toggleDia(h.id)}
                        trackColor={{ false: '#E2ECE8', true: '#4E6E6B' }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                    {h.active && (
                      <View style={styles.timeInputsContainer}>
                        <Text style={styles.timeLabel}>Desde</Text>
                        <TextInput
                          style={styles.timeBox}
                          value={h.inicio}
                          onChangeText={(t) => updateHora(h.id, 'inicio', t)}
                        />
                        <Text style={styles.timeLabel}>Hasta</Text>
                        <TextInput
                          style={styles.timeBox}
                          value={h.fin}
                          onChangeText={(t) => updateHora(h.id, 'fin', t)}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ─── Sección 3: CUENTA ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionCategoryTitle}>CUENTA</Text>

          <View style={styles.card}>
            {/* Seguridad y Contraseña */}
            <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Ionicons name="lock-closed-outline" size={20} color="#4E6E6B" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Seguridad y Contraseña</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Suscripción Pro · Premium */}
            <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Ionicons name="star-outline" size={20} color="#4E6E6B" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Suscripción Pro · Premium</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Soporte y Ayuda */}
            <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Ionicons name="help-circle-outline" size={20} color="#4E6E6B" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Soporte y Ayuda</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Botón Cerrar Sesión ─── */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ─── Header Banner ───
  headerBanner: {
    backgroundColor: '#4E6E6B',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  doctorAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#D4E5E1',
    fontWeight: '500',
    marginBottom: 6,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  greenBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ─── Secciones ───
  sectionContainer: {
    paddingHorizontal: 18,
    marginTop: 22,
  },
  sectionCategoryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8EA7A2',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },

  // ─── Tarjeta Blanca ───
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EAF0EE',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardItem: {
    paddingVertical: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
    flex: 1,
    paddingRight: 10,
  },
  itemSubtext: {
    fontSize: 12,
    color: '#657B76',
    lineHeight: 18,
  },
  itemFootnote: {
    fontSize: 11,
    color: '#8EA7A2',
    marginTop: 8,
  },

  // Box de mensaje automático
  messageBoxContainer: {
    marginTop: 10,
    backgroundColor: '#F7FAFA',
    borderWidth: 1,
    borderColor: '#E2ECE8',
    borderRadius: 12,
    padding: 12,
  },
  messageTextInput: {
    fontSize: 13,
    color: '#1C2E2B',
    lineHeight: 19,
    minHeight: 70,
    textAlignVertical: 'top',
  },

  // Filas de opciones
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF6F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  optionSubtext: {
    fontSize: 12,
    color: '#657B76',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F4F2',
  },

  // Desplegable Horarios
  horariosAccordion: {
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  horarioRow: {
    backgroundColor: '#F7FAFA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2ECE8',
  },
  horarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  horarioDia: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C2E2B',
    flex: 1,
  },
  textMuted: {
    color: '#97A9A6',
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#657B76',
  },
  timeBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECE8',
    borderRadius: 8,
    height: 36,
    width: 70,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#1C2E2B',
  },

  // ─── Botón Cerrar Sesión ───
  logoutButton: {
    marginTop: 26,
    marginHorizontal: 18,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E53E3E',
  },
});
