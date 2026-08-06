import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditarPerfilScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('Carlos');
  const [apePaterno, setApePaterno] = useState('Rodríguez');
  const [apeMaterno, setApeMaterno] = useState('Mendoza');
  const [correo, setCorreo] = useState('carlos@email.com');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Éxito', 'Tus datos han sido actualizados correctamente.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Back */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1C2E2B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholderTextColor="#A3B8B4"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido Paterno</Text>
            <TextInput
              style={styles.input}
              value={apePaterno}
              onChangeText={setApePaterno}
              placeholderTextColor="#A3B8B4"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido Materno</Text>
            <TextInput
              style={styles.input}
              value={apeMaterno}
              onChangeText={setApeMaterno}
              placeholderTextColor="#A3B8B4"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#A3B8B4"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 24 : 8,
    paddingBottom: 16,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B5B57',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1C2E2B',
  },
  saveButton: {
    backgroundColor: '#4E6E6B',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
