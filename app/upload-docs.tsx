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
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

type DocumentKey = 'cedula' | 'cv' | 'idDoc';

interface UploadState {
  status: 'idle' | 'uploading' | 'success';
  progress: number;
  fileName: string;
}

export default function UploadDocsScreen() {
  const router = useRouter();

  // Basic info states
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [numeroCedula, setNumeroCedula] = useState('');

  // Styling & focus
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Document states
  const [uploads, setUploads] = useState<{ [key in DocumentKey]: UploadState }>({
    cedula: { status: 'idle', progress: 0, fileName: '' },
    cv: { status: 'idle', progress: 0, fileName: '' },
    idDoc: { status: 'idle', progress: 0, fileName: '' },
  });

  const startSimulatedUpload = (key: DocumentKey, defaultName: string) => {
    // If already uploading, don't start again
    if (uploads[key].status === 'uploading') return;

    setUploads((prev) => ({
      ...prev,
      [key]: { status: 'uploading', progress: 0, fileName: defaultName },
    }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploads((prev) => ({
          ...prev,
          [key]: { status: 'success', progress: 100, fileName: defaultName },
        }));
      } else {
        setUploads((prev) => ({
          ...prev,
          [key]: { ...prev[key], progress: currentProgress },
        }));
      }
    }, 120);
  };

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
    }

    if (!numeroCedula.trim()) {
      newErrors.numeroCedula = 'El número de cédula es requerido';
    }

    // Check if all docs are uploaded
    if (
      uploads.cedula.status !== 'success' ||
      uploads.cv.status !== 'success' ||
      uploads.idDoc.status !== 'success'
    ) {
      newErrors.docs = 'Debes subir todos los documentos requeridos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowSuccessModal(true);
      }, 1500);
    }
  };

  const isAllDocsUploaded =
    uploads.cedula.status === 'success' &&
    uploads.cv.status === 'success' &&
    uploads.idDoc.status === 'success';

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
            <Text style={styles.title}>Postulación de Especialista</Text>
            <Text style={styles.subtitle}>
              Completa tus datos profesionales y sube la documentación requerida para activar tu perfil en ClinicaMente.
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
                placeholder="Ej. Dr. Carlos Mendoza"
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
                placeholder="correo@profesional.com"
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

            {/* Teléfono y Número Cédula en Fila (Fila en pantallas grandes) */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'telefono' && styles.inputFocused,
                    errors.telefono && styles.inputError,
                  ]}
                  placeholder="Ej. 5512345678"
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

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Número de Cédula *</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'numeroCedula' && styles.inputFocused,
                    errors.numeroCedula && styles.inputError,
                  ]}
                  placeholder="Número de Registro"
                  placeholderTextColor="#A3B8B4"
                  value={numeroCedula}
                  onChangeText={(text) => {
                    setNumeroCedula(text);
                    if (errors.numeroCedula) setErrors({ ...errors, numeroCedula: '' });
                  }}
                  onFocus={() => setFocusedField('numeroCedula')}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.numeroCedula && <Text style={styles.errorText}>{errors.numeroCedula}</Text>}
              </View>
            </View>

            {/* Document Upload Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.sectionTitle}>Documentos Requeridos</Text>
              <Text style={styles.sectionSubtitle}>
                Sube copias legibles en formato PDF o Imagen (Máx. 10MB por archivo).
              </Text>

              {errors.docs && <Text style={[styles.errorText, { marginBottom: 12 }]}>{errors.docs}</Text>}

              <View style={styles.docsList}>
                {/* 1. Cédula Profesional */}
                <DocumentRow
                  title="Cédula Profesional Escaneada"
                  description="Por ambas caras en un solo PDF"
                  state={uploads.cedula}
                  onPress={() => startSimulatedUpload('cedula', 'cedula_profesional.pdf')}
                />

                {/* 2. Currículum Vitae */}
                <DocumentRow
                  title="Currículum Vitae (CV) Actualizado"
                  description="Historial laboral y académico completo"
                  state={uploads.cv}
                  onPress={() => startSimulatedUpload('cv', 'cv_carlos_mendoza.pdf')}
                />

                {/* 3. Identificación Oficial */}
                <DocumentRow
                  title="Identificación Oficial (INE / Pasaporte)"
                  description="Frente y vuelta legibles"
                  state={uploads.idDoc}
                  onPress={() => startSimulatedUpload('idDoc', 'identificacion_oficial.pdf')}
                />
              </View>
            </View>

            {/* Enviar Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isAllDocsUploaded || loading) && styles.submitButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={!isAllDocsUploaded || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Solicitud Profesional</Text>
              )}
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

            <Text style={styles.modalTitle}>¡Documentación Enviada!</Text>
            <Text style={styles.modalDescription}>
              Hemos recibido tu postulación. Nuestro equipo validará tus credenciales dentro de las próximas 24-48 horas hábiles. Te notificaremos al correo registrado.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(tabs)' as any);
              }}
            >
              <Text style={styles.modalButtonText}>Volver al Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Subcomponent for each document row
interface DocumentRowProps {
  title: string;
  description: string;
  state: UploadState;
  onPress: () => void;
}

function DocumentRow({ title, description, state, onPress }: DocumentRowProps) {
  return (
    <View
      style={[
        styles.docCard,
        state.status === 'uploading' && styles.docCardUploading,
        state.status === 'success' && styles.docCardSuccess,
      ]}
    >
      <View style={styles.docInfo}>
        <Text style={styles.docTitle}>{title}</Text>
        <Text style={styles.docDesc}>
          {state.status === 'success' ? state.fileName : description}
        </Text>
        {state.status === 'uploading' && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${state.progress}%` }]} />
            <Text style={styles.progressPct}>{state.progress}%</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.uploadBtn,
          state.status === 'uploading' && styles.uploadBtnDisabled,
          state.status === 'success' && styles.uploadBtnSuccess,
        ]}
        onPress={onPress}
        disabled={state.status === 'uploading'}
        activeOpacity={0.7}
      >
        {state.status === 'idle' && (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke="#4E6E6B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
        {state.status === 'uploading' && <ActivityIndicator size="small" color="#4E6E6B" />}
        {state.status === 'success' && (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17L4 12"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>
    </View>
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
    marginBottom: 26,
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
  row: {
    flexDirection: 'row',
    gap: 12,
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
  errorText: {
    color: '#C05C5C',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  uploadSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#657B76',
    marginBottom: 16,
  },
  docsList: {
    gap: 12,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2ECE8',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  docCardUploading: {
    borderColor: '#B4D4CD',
  },
  docCardSuccess: {
    borderColor: '#4E6E6B',
    backgroundColor: '#F3FAF7',
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C2E2B',
    marginBottom: 4,
  },
  docDesc: {
    fontSize: 12,
    color: '#657B76',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4E6E6B',
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4E6E6B',
  },
  uploadBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF5F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5E6E1',
  },
  uploadBtnDisabled: {
    opacity: 0.6,
  },
  uploadBtnSuccess: {
    backgroundColor: '#4E6E6B',
    borderColor: '#4E6E6B',
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
    backgroundColor: '#C4DAD4',
    shadowOpacity: 0,
    elevation: 0,
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
    textAlign: 'center',
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
});
