import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { logout } from '../../api/authService';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar tu sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (screen: string) => {
    Alert.alert('Navegación', `Redirigiendo a: ${screen}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4E6E6B" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Section */}
        <View style={styles.header}>
          {/* Subtle design circles inside header */}
          <View style={styles.headerBgCircle1} />
          <View style={styles.headerBgCircle2} />

          <SafeAreaView edges={['top']}>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            
            <View style={styles.profileContainer}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200' }}
                  style={styles.avatar}
                />
                <TouchableOpacity 
                  style={styles.editBadge}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert('Editar Foto', 'Función para cambiar foto de perfil.')}
                >
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>

              <Text style={styles.name}>Carlos Rodríguez</Text>
              <Text style={styles.email}>carlos@email.com</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Content Section */}
        <View style={styles.body}>
          {/* Card containing menu options */}
          <View style={styles.menuCard}>
            
            {/* ITEM 1: Editar Datos */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Editar Datos')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF5F3' }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    stroke="#4E6E6B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="#4E6E6B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Editar Datos</Text>
                <Text style={styles.menuSubtitle}>Nombre, foto, contacto</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
                <Path d="M9 5L16 12L9 19" stroke="#C4CFCB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* ITEM 2: Mis Citas */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Mis Citas')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF5F3' }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M16 2v4M8 2v4M3 10h18" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Mis Citas</Text>
                <Text style={styles.menuSubtitle}>Historial y próximas sesiones</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
                <Path d="M9 5L16 12L9 19" stroke="#C4CFCB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* ITEM 3: Mis Documentos */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Mis Documentos')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF5F3' }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Mis Documentos</Text>
                <Text style={styles.menuSubtitle}>Comprobantes y reportes</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
                <Path d="M9 5L16 12L9 19" stroke="#C4CFCB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* ITEM 4: Privacidad y Seguridad */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Privacidad y Seguridad')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF5F3' }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Privacidad y Seguridad</Text>
                <Text style={styles.menuSubtitle}>Contraseña y 2FA</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
                <Path d="M9 5L16 12L9 19" stroke="#C4CFCB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* ITEM 5: Soporte */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Soporte')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF5F3' }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke="#4E6E6B" strokeWidth="2" />
                  <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Soporte</Text>
                <Text style={styles.menuSubtitle}>Centro de ayuda</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
                <Path d="M9 5L16 12L9 19" stroke="#C4CFCB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* ITEM 6: Términos y Condiciones */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleItemPress('Términos y Condiciones')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF5F3' }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#4E6E6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Términos y Condiciones</Text>
                <Text style={styles.menuSubtitle}>Política de privacidad</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.chevron}>
                <Path d="M9 5L16 12L9 19" stroke="#C4CFCB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#4E6E6B',
    paddingBottom: 35,
    paddingTop: Platform.OS === 'ios' ? 20 : 35,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  headerBgCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#ffffff',
    opacity: 0.04,
    right: -80,
    top: -50,
  },
  headerBgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    opacity: 0.05,
    left: -70,
    bottom: -60,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F3B43F',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4E6E6B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  email: {
    fontSize: 14,
    color: '#CDE0DC',
    fontWeight: '400',
  },
  body: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C2E2B',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#7F9390',
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F6F5',
    marginLeft: 56,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFD1D1',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FFD1D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F24E4E',
  },
});
