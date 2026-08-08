import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout } from '../../api/authService';

export default function ConfigScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir de tu cuenta?', [
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

  const renderOption = (icon: keyof typeof Ionicons.glyphMap, title: string, subtitle: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.optionRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={20} color="#4E6E6B" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#C4D5D0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>Gestiona tu perfil profesional y preferencias</Text>
        </View>

        {/* Tarjeta de Perfil Profesional */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop',
            }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>Dr. Alejandro Torres</Text>
            <Text style={styles.doctorEspecialidad}>Psicología Clínica y Terapias</Text>
            <View style={styles.badgeColegiatura}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.colegiaturaText}>Colegiatura Verificada: CMP-12345</Text>
            </View>
          </View>
        </View>

        {/* Grupo 1: Perfil y Agenda */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>PROFESIONAL</Text>
          {renderOption('person-outline', 'Editar Perfil', 'Modifica tu presentación y bio')}
          {renderOption('time-outline', 'Horarios de Atención', 'Configura tu disponibilidad semanal')}
          {renderOption('videocam-outline', 'Enlace de Videollamada', 'Google Meet / Zoom para sesiones virtuales')}
        </View>

        {/* Grupo 2: Cuenta y Ajustes */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>CUENTA Y SEGURIDAD</Text>
          {renderOption('lock-closed-outline', 'Cambiar Contraseña', 'Actualiza tus credenciales de acceso')}
          {renderOption('notifications-outline', 'Notificaciones', 'Recordatorios de citas y avisos')}
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 50,
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4E6E6B',
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C2E2B',
  },
  doctorEspecialidad: {
    fontSize: 13,
    color: '#657B76',
    marginTop: 2,
  },
  badgeColegiatura: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  colegiaturaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8EA7A2',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  optionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#657B76',
    marginTop: 1,
  },
  logoutButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FED7D7',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E53E3E',
  },
});
