import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface MenuOptionItemProps {
  /** Nombre del icono de Ionicons a mostrar */
  icono: keyof typeof Ionicons.glyphMap;
  /** Texto principal del ítem */
  titulo: string;
  /** Texto secundario descriptivo */
  subtitulo: string;
  /** Callback al presionar la fila */
  onPress: () => void;
  /** Si true, muestra la fila sin borde inferior (último elemento) */
  isLast?: boolean;
  /** Variante de color: 'default' (teal) o 'danger' (rojo para logout) */
  variante?: 'default' | 'danger';
}

// ─── Componente ───────────────────────────────────────────────────────────────
/**
 * MenuOptionItem
 *
 * Fila reutilizable del menú de opciones en la tarjeta blanca del perfil.
 * Acepta dos variantes:
 *  - 'default': icono sobre fondo verde claro, título oscuro (opciones normales)
 *  - 'danger':  icono sobre fondo rojo claro, título en rojo (Cerrar Sesión)
 */
export default function MenuOptionItem({
  icono,
  titulo,
  subtitulo,
  onPress,
  isLast = false,
  variante = 'default',
}: MenuOptionItemProps) {
  const isDanger = variante === 'danger';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress}
    >
      {/* Icono con fondo coloreado */}
      <View style={[styles.iconBox, isDanger && styles.iconBoxDanger]}>
        <Ionicons
          name={icono}
          size={22}
          color={isDanger ? '#EF4444' : '#4E6E6B'}
        />
      </View>

      {/* Textos */}
      <View style={styles.textContainer}>
        <Text style={[styles.titulo, isDanger && styles.tituloDanger]}>
          {titulo}
        </Text>
        <Text style={[styles.subtitulo, isDanger && styles.subtituloDanger]}>
          {subtitulo}
        </Text>
      </View>

      {/* Flecha de navegación */}
      <Ionicons
        name="chevron-forward"
        size={17}
        color={isDanger ? '#FCA5A5' : '#C4D5D1'}
      />
    </TouchableOpacity>
  );
}

// ─── Estilos (preservados 100% del original) ──────────────────────────────────
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F2',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EBF4F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconBoxDanger: {
    backgroundColor: '#FEE2E2',
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 2,
  },
  tituloDanger: {
    color: '#EF4444',
  },
  subtitulo: {
    fontSize: 12,
    color: '#8EA7A2',
    fontWeight: '400',
  },
  subtituloDanger: {
    color: '#F87171',
  },
});
