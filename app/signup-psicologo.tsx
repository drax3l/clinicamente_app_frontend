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
import { Ionicons } from '@expo/vector-icons';
import { register } from '../api/authService';

// Especialidades disponibles — se pueden sincronizar con el backend si se expone un endpoint
const ESPECIALIDADES = [
  'Psicología Clínica',
  'Psicoterapia',
  'Psicología Cognitivo-Conductual',
  'Psicoanálisis',
  'Psicología Infantil',
  'Terapia de Pareja',
  'Psicología Forense',
  'Neuropsicología',
];

export default function SignupPsicologoScreen() {
  const router = useRouter();

  // ─── Estado del formulario (según RegisterRequest en API_CONTEXT.md) ───
  const [nombre, setNombre] = useState('');
  const [apePaterno, setApePaterno] = useState('');
  const [apeMaterno, setApeMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  // ─── Datos adicionales del especialista ───
  const [numeroColegiatura, setNumeroColegiatura] = useState('');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [anosExperiencia, setAnosExperiencia] = useState('');

  // ─── UI State ───
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mostrarEspecialidades, setMostrarEspecialidades] = useState(false);

  // ─── Validación ───
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!apePaterno.trim()) newErrors.apePaterno = 'El apellido paterno es requerido';
    if (!correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(correo.trim())) {
      newErrors.correo = 'Ingresa un correo válido';
    }
    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (contrasena.length < 8) {
      newErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (contrasena !== confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }
    if (!numeroColegiatura.trim()) {
      newErrors.numeroColegiatura = 'El número de colegiatura es requerido';
    }
    if (!especialidadSeleccionada) {
      newErrors.especialidad = 'Selecciona tu especialidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Envío del formulario ───
  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // El backend recibe RegisterRequest con rol PSICOLOGO
      const userData = {
        nombre: nombre.trim(),
        apePaterno: apePaterno.trim(),
        apeMaterno: apeMaterno.trim() || null,
        correo: correo.trim(),
        contrasena,
        rol: 'PSICOLOGO',
        // Campos adicionales del especialista (si el backend los acepta)
        numeroColegiatura: numeroColegiatura.trim(),
        especialidad: especialidadSeleccionada,
        anosExperiencia: anosExperiencia ? parseInt(anosExperiencia, 10) : 0,
      };

      console.log('[signup-psicologo] Payload a enviar:', userData);

      await register(userData);

      Alert.alert(
        '¡Solicitud enviada!',
        'Tu cuenta como especialista ha sido creada. Nuestro equipo validará tu colegiatura y te notificará por correo cuando esté activa.',
        [
          {
            text: 'Ir al Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error: any) {
      let mensajeError =
        'No se pudo completar el registro. Verifica tu conexión e inténtalo de nuevo.';

      if (error.response?.data) {
        const data = error.response.data;
        if (data.message) {
          mensajeError = data.message;
        } else if (data.error) {
          mensajeError = data.error;
        } else if (typeof data === 'string') {
          mensajeError = data;
        }
      }

      Alert.alert('Error al Registrarse', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // ─── Helper para renderizar campos de texto ───
  const renderField = (
    label: string,
    value: string,
    onChangeText: (t: string) => void,
    fieldKey: string,
    options?: {
      placeholder?: string;
      keyboardType?: 'default' | 'email-address' | 'numeric';
      autoCapitalize?: 'none' | 'words' | 'sentences';
      secureTextEntry?: boolean;
      optional?: boolean;
      rightIcon?: React.ReactNode;
    }
  ) => (
    <View style={styles.inputContainer} key={fieldKey}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {options?.optional && <Text style={styles.optionalTag}>Opcional</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            focusedField === fieldKey && styles.inputFocused,
            errors[fieldKey] ? styles.inputError : null,
            options?.secureTextEntry ? styles.passwordInput : null,
          ]}
          placeholder={options?.placeholder ?? label}
          placeholderTextColor="#A3B8B4"
          value={value}
          onChangeText={(t) => {
            onChangeText(t);
            if (errors[fieldKey]) setErrors((prev) => ({ ...prev, [fieldKey]: '' }));
          }}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
          keyboardType={options?.keyboardType ?? 'default'}
          autoCapitalize={options?.autoCapitalize ?? 'sentences'}
          secureTextEntry={options?.secureTextEntry}
          editable={!loading}
        />
        {options?.rightIcon && (
          <View style={styles.inputRightIconWrapper}>{options.rightIcon}</View>
        )}
      </View>
      {errors[fieldKey] ? <Text style={styles.errorText}>{errors[fieldKey]}</Text> : null}
    </View>
  );

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
          {/* ─── Header con botón de regreso ─── */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={20} color="#4E6E6B" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Únete como Especialista</Text>
              <Text style={styles.subtitle}>
                Completa tu perfil profesional para conectar con pacientes en ClinicaMente.
              </Text>
            </View>
          </View>

          {/* ─── Sección 1: Datos Personales ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>1</Text>
              </View>
              <Text style={styles.sectionTitle}>Datos Personales</Text>
            </View>

            {renderField('Nombre(s)', nombre, setNombre, 'nombre', {
              placeholder: 'Tu nombre(s)',
              autoCapitalize: 'words',
            })}
            {renderField('Apellido Paterno', apePaterno, setApePaterno, 'apePaterno', {
              placeholder: 'Tu apellido paterno',
              autoCapitalize: 'words',
            })}
            {renderField('Apellido Materno', apeMaterno, setApeMaterno, 'apeMaterno', {
              placeholder: 'Tu apellido materno',
              autoCapitalize: 'words',
              optional: true,
            })}
            {renderField('Correo Electrónico', correo, setCorreo, 'correo', {
              placeholder: 'especialista@email.com',
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}
          </View>

          {/* ─── Sección 2: Credenciales ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>2</Text>
              </View>
              <Text style={styles.sectionTitle}>Credenciales de Acceso</Text>
            </View>

            {renderField('Contraseña', contrasena, setContrasena, 'contrasena', {
              placeholder: 'Mínimo 8 caracteres',
              secureTextEntry: !showPassword,
              rightIcon: (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#657B76"
                  />
                </TouchableOpacity>
              ),
            })}
            {renderField(
              'Confirmar Contraseña',
              confirmarContrasena,
              setConfirmarContrasena,
              'confirmarContrasena',
              {
                placeholder: 'Repite tu contraseña',
                secureTextEntry: !showConfirmPassword,
                rightIcon: (
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#657B76"
                    />
                  </TouchableOpacity>
                ),
              }
            )}
          </View>

          {/* ─── Sección 3: Datos Profesionales ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>3</Text>
              </View>
              <Text style={styles.sectionTitle}>Información Profesional</Text>
            </View>

            {/* Número de Colegiatura */}
            {renderField(
              'Número de Colegiatura / Cédula',
              numeroColegiatura,
              setNumeroColegiatura,
              'numeroColegiatura',
              {
                placeholder: 'Ej. 12345678',
                keyboardType: 'default',
              }
            )}

            {/* Selector de Especialidad */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Especialidad Principal</Text>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  focusedField === 'especialidad' && styles.inputFocused,
                  errors.especialidad ? styles.inputError : null,
                ]}
                onPress={() => {
                  setMostrarEspecialidades(!mostrarEspecialidades);
                  setFocusedField('especialidad');
                }}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.selectorText,
                    !especialidadSeleccionada && styles.selectorPlaceholder,
                  ]}
                >
                  {especialidadSeleccionada || 'Selecciona tu especialidad'}
                </Text>
                <Ionicons
                  name={mostrarEspecialidades ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#657B76"
                />
              </TouchableOpacity>
              {errors.especialidad ? (
                <Text style={styles.errorText}>{errors.especialidad}</Text>
              ) : null}

              {mostrarEspecialidades && (
                <View style={styles.dropdownContainer}>
                  {ESPECIALIDADES.map((esp) => (
                    <TouchableOpacity
                      key={esp}
                      style={[
                        styles.dropdownItem,
                        especialidadSeleccionada === esp && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setEspecialidadSeleccionada(esp);
                        setMostrarEspecialidades(false);
                        setFocusedField(null);
                        if (errors.especialidad) setErrors((prev) => ({ ...prev, especialidad: '' }));
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          especialidadSeleccionada === esp && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {esp}
                      </Text>
                      {especialidadSeleccionada === esp && (
                        <Ionicons name="checkmark" size={16} color="#4E6E6B" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Años de Experiencia */}
            {renderField(
              'Años de Experiencia',
              anosExperiencia,
              setAnosExperiencia,
              'anosExperiencia',
              {
                placeholder: 'Ej. 5',
                keyboardType: 'numeric',
                optional: true,
              }
            )}
          </View>

          {/* ─── Aviso Legal ─── */}
          <View style={styles.legalContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#8EA7A2" />
            <Text style={styles.legalText}>
              Tu número de colegiatura será verificado por nuestro equipo antes de activar tu perfil. Recibirás una notificación por correo.
            </Text>
          </View>

          {/* ─── Botón de Registro ─── */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Enviar Solicitud como Psicólogo</Text>
              </>
            )}
          </TouchableOpacity>

          {/* ─── Link para volver al Login ─── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace('/login')}
              disabled={loading}
            >
              <Text style={styles.footerLinkText}>Iniciar Sesión</Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 50,
  },

  // ─── Header ───
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    marginBottom: 20,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C2E2B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#657B76',
    textAlign: 'center',
  },

  // ─── Secciones ───
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2ECE8',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },

  // ─── Campos de formulario ───
  inputContainer: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B5B57',
  },
  optionalTag: {
    fontSize: 11,
    color: '#A3B8B4',
    backgroundColor: '#F0F8F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: '#F6FAF8',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1C2E2B',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 48,
  },
  inputFocused: {
    borderColor: '#4E6E6B',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#D28585',
  },
  inputRightIconWrapper: {
    position: 'absolute',
    right: 14,
    top: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#C05C5C',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },

  // ─── Selector Dropdown ───
  selectorButton: {
    backgroundColor: '#F6FAF8',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize: 15,
    color: '#1C2E2B',
  },
  selectorPlaceholder: {
    color: '#A3B8B4',
  },
  dropdownContainer: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    overflow: 'hidden',
    shadowColor: '#12201D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F2',
  },
  dropdownItemSelected: {
    backgroundColor: '#EBF4F1',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#3B5B57',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#4E6E6B',
    fontWeight: '700',
  },

  // ─── Aviso Legal ───
  legalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0F8F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4EBE3',
  },
  legalText: {
    flex: 1,
    fontSize: 12,
    color: '#657B76',
    lineHeight: 18,
  },

  // ─── Botón Submit ───
  submitButton: {
    backgroundColor: '#4E6E6B',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // ─── Footer ───
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
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
