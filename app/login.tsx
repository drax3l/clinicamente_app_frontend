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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { login, setStoredRole } from '../api/authService';

export default function LoginScreen() {
  const router = useRouter();
  
  // Estado para capturar los inputs del formulario
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [userType, setUserType] = useState<'PACIENTE' | 'PSICOLOGO'>('PACIENTE');
  
  // Estados para UI y UX
  const [focusedField, setFocusedField] = useState<'correo' | 'contrasena' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ correo?: string; contrasena?: string }>({});

  // Validación de campos antes de la petición
  const validateForm = () => {
    const newErrors: { correo?: string; contrasena?: string } = {};
    
    if (!correo.trim()) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(correo.trim())) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador del inicio de sesión
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Llamada al servicio de autenticación
      const response: any = await login(correo.trim(), contrasena);

      const isPsicologo =
        userType === 'PSICOLOGO' ||
        response?.role === 'ROLE_PSICOLOGO' ||
        response?.rol === 'PSICOLOGO' ||
        correo.toLowerCase().includes('psicologo');

      if (isPsicologo) {
        await setStoredRole('ROLE_PSICOLOGO');
      } else {
        await setStoredRole('ROLE_PACIENTE');
      }

      Alert.alert('¡Bienvenido!', 'Sesión iniciada correctamente.', [
        {
          text: 'Continuar',
          onPress: () => {
            if (isPsicologo) {
              router.replace('/(tabs-psicologo)' as any);
            } else {
              router.replace('/(tabs)' as any);
            }
          },
        },
      ]);
    } catch (error: any) {
      let mensajeError = 'No se pudo iniciar sesión. Verifica tus credenciales o tu conexión a internet.';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (data.message) {
          mensajeError = data.message;
        } else if (data.errors) {
          if (Array.isArray(data.errors)) {
            mensajeError = data.errors.join('\n');
          } else if (typeof data.errors === 'object') {
            mensajeError = Object.entries(data.errors)
              .map(([campo, desc]) => `• ${campo}: ${desc}`)
              .join('\n');
          }
        } else if (typeof data === 'string') {
          mensajeError = data;
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        mensajeError = 'Correo electrónico o contraseña incorrectos.';
      }

      Alert.alert('Error de Autenticación', mensajeError);
    } finally {
      setLoading(false);
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
          {/* Cabecera / Logo */}
          <View style={styles.header}>
            <View style={styles.logoIcon}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 3.5C8.4 3.5 5.5 6.4 5.5 10C5.5 12.4 6.8 14.5 8.7 15.6L9.3 18C9.4 18.5 9.9 18.8 10.4 18.8H13.6C14.1 18.8 14.6 18.5 14.7 18L15.3 15.6C17.2 14.5 18.5 12.4 18.5 10C18.5 6.4 15.6 3.5 12 3.5Z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.title}>¡Hola de nuevo!</Text>
            <Text style={styles.subtitle}>
              Ingresa tus credenciales para continuar en ClinicaMente.
            </Text>

            {/* Selector de Tipo de Usuario */}
            <View style={styles.roleToggleContainer}>
              <TouchableOpacity
                style={[styles.roleToggleButton, userType === 'PACIENTE' && styles.roleToggleButtonActive]}
                onPress={() => setUserType('PACIENTE')}
                activeOpacity={0.85}
              >
                <Text style={[styles.roleToggleText, userType === 'PACIENTE' && styles.roleToggleTextActive]}>
                  Paciente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleToggleButton, userType === 'PSICOLOGO' && styles.roleToggleButtonActive]}
                onPress={() => setUserType('PSICOLOGO')}
                activeOpacity={0.85}
              >
                <Text style={[styles.roleToggleText, userType === 'PSICOLOGO' && styles.roleToggleTextActive]}>
                  Psicólogo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Campo: Correo Electrónico */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
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
                  if (errors.correo) setErrors({ ...errors, correo: undefined });
                }}
                onFocus={() => setFocusedField('correo')}
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
              {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
            </View>

            {/* Campo: Contraseña */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Contraseña</Text>
                <TouchableOpacity activeOpacity={0.6} disabled={loading}>
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    focusedField === 'contrasena' && styles.inputFocused,
                    errors.contrasena ? styles.inputError : null,
                  ]}
                  placeholder="Tu contraseña"
                  placeholderTextColor="#A3B8B4"
                  secureTextEntry={!showPassword}
                  value={contrasena}
                  onChangeText={(text) => {
                    setContrasena(text);
                    if (errors.contrasena) setErrors({ ...errors, contrasena: undefined });
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
                          ? 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'
                          : 'M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20'
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

            {/* Botón Iniciar Sesión */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ─── Footer de Registro ─── */}
          <View style={styles.footerContainer}>
            {/* Link 1: Registro como Paciente */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/signup')}
                disabled={loading}
              >
                <Text style={styles.footerLinkText}>Regístrate como Paciente</Text>
              </TouchableOpacity>
            </View>

            {/* Divisor visual */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link 2: Registro como Psicólogo */}
            <TouchableOpacity
              style={styles.psicologoButton}
              activeOpacity={0.8}
              onPress={() => router.push('/signup-psicologo')}
              disabled={loading}
            >
              <Text style={styles.psicologoButtonText}>¿Eres especialista? Únete como Psicólogo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#657B76',
    textAlign: 'center',
  },
  form: {
    gap: 22,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B5B57',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    color: '#4E6E6B',
    fontWeight: '600',
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
    width: '100%',
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
    marginTop: 10,
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
  footerContainer: {
    marginTop: 28,
    gap: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8E8E3',
  },
  dividerText: {
    fontSize: 13,
    color: '#A3B8B4',
    fontWeight: '500',
  },
  psicologoButton: {
    borderWidth: 1.5,
    borderColor: '#4E6E6B',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  psicologoButtonText: {
    fontSize: 14,
    color: '#4E6E6B',
    fontWeight: '700',
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2ECE8',
    borderRadius: 14,
    padding: 4,
    marginTop: 18,
    width: '100%',
  },
  roleToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  roleToggleButtonActive: {
    backgroundColor: '#4E6E6B',
  },
  roleToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#657B76',
  },
  roleToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
