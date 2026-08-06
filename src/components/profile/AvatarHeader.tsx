import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface AvatarHeaderProps {
  /** Nombre completo del usuario para mostrar en el header */
  nombreCompleto: string;
  /** Correo electrónico del usuario */
  correo: string;
  /** Dos iniciales para el avatar (ej. "CR") */
  iniciales: string;
  /** Color de fondo del círculo de iniciales */
  avatarColor: string;
  /** Callback al presionar el botón de editar (lápiz amarillo) */
  onPressEditar: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
/**
 * AvatarHeader
 *
 * Sección superior de la pantalla Mi Perfil:
 *  - Fondo verde/teal con círculos decorativos
 *  - Avatar circular con iniciales dinámicas
 *  - Botón de editar (badge amarillo con lápiz)
 *  - Nombre completo y correo del usuario
 *  - Badge de sesión activa
 */
export default function AvatarHeader({
  nombreCompleto,
  correo,
  iniciales,
  avatarColor,
  onPressEditar,
}: AvatarHeaderProps) {
  return (
    <View style={styles.headerBackground}>
      {/* Círculos decorativos de fondo */}
      <View style={styles.decorativeCircleTop} />
      <View style={styles.decorativeCircleBottom} />

      <Text style={styles.headerTitle}>Mi Perfil</Text>

      {/* Avatar con iniciales + botón de editar */}
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatarInitials, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitialsText}>{iniciales}</Text>
        </View>
        <TouchableOpacity
          style={styles.editBadgeButton}
          activeOpacity={0.85}
          onPress={onPressEditar}
        >
          <Ionicons name="pencil" size={13} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Nombre y correo dinámicos */}
      <Text style={styles.userName} numberOfLines={1}>
        {nombreCompleto || 'Mi Cuenta'}
      </Text>
      <Text style={styles.userEmail} numberOfLines={1}>
        {correo}
      </Text>

      {/* Badge de sesión activa */}
      <View style={styles.activeBadge}>
        <View style={styles.activeDotGreen} />
        <Text style={styles.activeBadgeText}>Sesión activa</Text>
      </View>
    </View>
  );
}

// ─── Estilos (preservados 100% del original) ──────────────────────────────────
const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#4E6E6B',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 52,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircleTop: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorativeCircleBottom: {
    position: 'absolute',
    bottom: -40,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 22,
    letterSpacing: 0.2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarInitials: {
    width: 92,
    height: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarInitialsText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  editBadgeButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#4E6E6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
    marginBottom: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeDotGreen: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#4ADE80',
  },
  activeBadgeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
});
