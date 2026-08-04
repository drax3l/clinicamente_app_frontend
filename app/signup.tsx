import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { register } from '../api/authService';

export default function SignupScreen() {
  const router = useRouter();

  // Estados independientes para cada campo exigido por RegisterRequest en el backend
  const [nombre, setNombre] = useState('');
  const [apePaterno, setApePaterno] = useState('');
  const [apeMaterno, setApeMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Interacciones visuales y UX
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!apePaterno.trim()) {
      newErrors.apePaterno = 'El apellido paterno es requerido';
    }
    
    if (!correo.trim()) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(correo.trim())) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (contrasena !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    // Construcción del objeto JSON exacto esperado por el backend Spring Boot (RegisterRequest.java)
    const userData: {
      nombre: string;
      apePaterno: string;
      apeMaterno?: string;
      correo: string;
      contrasena: string;
    } = {
      nombre: nombre.trim(),
      apePaterno: apePaterno.trim(),
      correo: correo.trim().toLowerCase(),
      contrasena: contrasena,
    };

    if (apeMaterno.trim()) {
      userData.apeMaterno = apeMaterno.trim();
    }

    // Log de depuración en consola antes de enviar la petición
    console.log("Payload a enviar:", userData);

    setLoading(true);
    try {
      // Petición POST a /auth/register
      await register(userData);

      setLoading(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      setLoading(false);
      
      // Captura y extracción detallada de los errores del backend (error.response?.data)
      let mensajeError = 'No se pudo completar el registro. Verifica los datos o tu conexión.';

      if (error.response?.data) {
        const backendData = error.response.data;
        if (backendData.message) {
          mensajeError = backendData.message;
        } else if (backendData.errors) {
          if (Array.isArray(backendData.errors)) {
            mensajeError = backendData.errors.join('\n');
          } else if (typeof backendData.errors === 'object') {
            mensajeError = Object.entries(backendData.errors)
              .map(([campo, razon]) => `• ${campo}: ${razon}`)
              .join('\n');
          }
        } else if (typeof backendData === 'string') {
          mensajeError = backendData;
        } else if (typeof backendData === 'object') {
          mensajeError = Object.entries(backendData)
            .map(([campo, razon]) => `• ${campo}: ${razon}`)
            .join('\n');
        }
      }

      Alert.alert('Error al Registrar (400 Bad Request)', mensajeError);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Comienza tu camino</Text>
            <Text style={styles.subtitle}>
              Crea una cuenta para agendar sesiones con los mejores terapeutas del país.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Nombre */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'nombre' && styles.inputFocused,
                  errors.nombre ? styles.inputError : null,
                ]}
                placeholder="Ej. Sofía"
                placeholderTextColor="#A3B8B4"
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (errors.nombre) setErrors({ ...errors, nombre: '' });
                }}
                onFocus={() => setFocusedField('nombre')}
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            {/* Apellido Paterno */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido Paterno *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'apePaterno' && styles.inputFocused,
                  errors.apePaterno ? styles.inputError : null,
                ]}
                placeholder="Ej. Martínez"
                placeholderTextColor="#A3B8B4"
                value={apePaterno}
                onChangeText={(text) => {
                  setApePaterno(text);
                  if (errors.apePaterno) setErrors({ ...errors, apePaterno: '' });
                }}
                onFocus={() => setFocusedField('apePaterno')}
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
              {errors.apePaterno && <Text style={styles.errorText}>{errors.apePaterno}</Text>}
            </View>

            {/* Apellido Materno (Opcional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido Materno (Opcional)</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'apeMaterno' && styles.inputFocused,
                ]}
                placeholder="Ej. Ramos"
                placeholderTextColor="#A3B8B4"
                value={apeMaterno}
                onChangeText={(text) => setApeMaterno(text)}
                onFocus={() => setFocusedField('apeMaterno')}
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
            </View>

            {/* Correo Electrónico */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'correo' && styles.inputFocused,
                  errors.correo ? styles.inputError : null,
                ]}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#A3B8B4"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={(text) => {
                  setCorreo(text);
                  if (errors.correo) setErrors({ ...errors, correo: '' });
                }}
                onFocus={() => setFocusedField('correo')}
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
              {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
            </View>

            {/* Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña *</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    focusedField === 'contrasena' && styles.inputFocused,
                    errors.contrasena ? styles.inputError : null,
                  ]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#A3B8B4"
                  secureTextEntry={!showPassword}
                  value={contrasena}
                  onChangeText={(text) => {
                    setContrasena(text);
                    if (errors.contrasena) setErrors({ ...errors, contrasena: '' });
                  }}
                  onFocus={() => setFocusedField('contrasena')}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d={
                        showPassword 
                          ? "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" 
                          : "M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"
                      }
                      stroke="#657B76"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              {errors.contrasena && <Text style={styles.errorText}>{errors.contrasena}</Text>}
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    focusedField === 'confirmPassword' && styles.inputFocused,
                    errors.confirmPassword ? styles.inputError : null,
                  ]}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor="#A3B8B4"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d={
                        showConfirmPassword 
                          ? "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" 
                          : "M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"
                      }
                      stroke="#657B76"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Términos y Condiciones */}
            <TouchableOpacity
              style={styles.termsContainer}
              activeOpacity={0.8}
              onPress={() => {
                setAcceptTerms(!acceptTerms);
                if (errors.terms) setErrors({ ...errors, terms: '' });
              }}
              disabled={loading}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
              <Text style={styles.termsText}>
                Acepto los <Text style={styles.termsLink}>Términos de Servicio</Text> y la{' '}
                <Text style={styles.termsLink}>Política de Privacidad</Text> de ClinicaMente.
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={[styles.errorText, { marginTop: -4 }]}>{errors.terms}</Text>}

            {/* Registrar Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/login')}
              disabled={loading}
            >
              <Text style={styles.footerLinkText}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Success Icon */}
            <View style={styles.successIconBox}>
              <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                <Path
                  d="M8 12.5L11 15.5L16 9.5"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <Text style={styles.modalTitle}>¡Cuenta Creada!</Text>
            <Text style={styles.modalDescription}>
              Tu cuenta de paciente ha sido registrada correctamente. Ahora puedes comenzar a agendar tus sesiones.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.modalButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#657B76',
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
  inputFocused: {
    borderColor: '#4E6E6B',
  },
  inputError: {
    borderColor: '#D28585',
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#A3B8B4',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4E6E6B',
    borderColor: '#4E6E6B',
  },
  termsText: {
    fontSize: 13,
    color: '#657B76',
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: '#3B5B57',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#C05C5C',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4E6E6B',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 46, 43, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  successIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#657B76',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#EFF5F3',
    borderColor: '#4E6E6B',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#4E6E6B',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: '#657B76',
  },
  footerLinkText: {
    fontSize: 14,
    color: '#3B5B57',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
