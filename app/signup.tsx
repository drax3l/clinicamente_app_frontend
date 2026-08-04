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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function SignupScreen() {
  const router = useRouter();

  // Form states
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Styling & interactions
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) newErrors.nombre = 'El nombre completo es requerido';
    
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (telefono.trim().length < 8) {
      newErrors.telefono = 'Ingresa un teléfono válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Save profile details to Firestore in the 'users' collection
        await setDoc(doc(db, 'users', uid), {
          nombre,
          email,
          telefono,
          role: 'patient',
          createdAt: new Date().toISOString(),
        });

        setLoading(false);
        setShowSuccessModal(true);
      } catch (error: any) {
        console.error('Error during registration:', error);
        let errorMessage = 'Ocurrió un error al registrar tu cuenta. Inténtalo de nuevo.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Este correo electrónico ya está registrado.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'El correo electrónico no es válido.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
        }
        Alert.alert('Error de Registro', errorMessage);
        setLoading(false);
      }
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
            {/* Nombre Completo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre Completo *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'nombre' && styles.inputFocused,
                  errors.nombre && styles.inputError,
                ]}
                placeholder="Ej. Sofía Martínez"
                placeholderTextColor="#A3B8B4"
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (errors.nombre) setErrors({ ...errors, nombre: '' });
                }}
                onFocus={() => setFocusedField('nombre')}
                onBlur={() => setFocusedField(null)}
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            {/* Correo Electrónico */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'email' && styles.inputFocused,
                  errors.email && styles.inputError,
                ]}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#A3B8B4"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Teléfono */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono de Contacto *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'telefono' && styles.inputFocused,
                  errors.telefono && styles.inputError,
                ]}
                placeholder="Ej. +52 55 1234 5678"
                placeholderTextColor="#A3B8B4"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={(text) => {
                  setTelefono(text);
                  if (errors.telefono) setErrors({ ...errors, telefono: '' });
                }}
                onFocus={() => setFocusedField('telefono')}
                onBlur={() => setFocusedField(null)}
              />
              {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
            </View>

            {/* Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña *</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    focusedField === 'password' && styles.inputFocused,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#A3B8B4"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d={showPassword 
                        ? "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" 
                        : "M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"}
                      stroke="#657B76"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
                    errors.confirmPassword && styles.inputError,
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
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d={showConfirmPassword 
                        ? "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" 
                        : "M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"}
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
                <ActivityIndicator color="#FFFFFF" />
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
              onPress={() => router.push('/login' as any)}
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
                router.replace('/(tabs)' as any);
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
