import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

export default function AppointmentsScreen() {
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
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  },
});
