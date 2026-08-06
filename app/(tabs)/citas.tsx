import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Rect, Path } from 'react-native-svg';

export default function AppointmentsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#4E6E6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M16 2v4M8 2v4M3 10h18" stroke="#4E6E6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>Aquí se mostrarán tus próximas sesiones de terapia y tu historial de consultas.</Text>
        
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push('/search' as any)}
        >
          <Text style={styles.primaryButtonText}>Buscar un especialista</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#657B76',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#4E6E6B',
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
