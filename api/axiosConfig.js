import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Función auxiliar cross-platform para obtener el token guardado
 */
export const getStoredToken = async () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  }
  return await SecureStore.getItemAsync('jwt_token');
};

/**
 * Cliente HTTP personalizado con Axios para la comunicación con el backend Spring Boot.
 */
const api = axios.create({
  baseURL: 'https://clinicamente.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones asíncrono para adjuntar el JWT token de forma segura según la plataforma
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al recuperar el token de sesión:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
