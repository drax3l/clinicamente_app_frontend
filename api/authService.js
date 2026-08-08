import api from './axiosConfig';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Guarda el token de sesión de forma segura según la plataforma (localStorage en Web, SecureStore en Android/iOS).
 * 
 * @param {string} token - Token JWT de autenticación.
 */
export const setStoredToken = async (token) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  } else {
    await SecureStore.setItemAsync('jwt_token', token);
  }
};

export const setStoredRole = async (role) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', role);
    }
  } else {
    await SecureStore.setItemAsync('user_role', role);
  }
};

export const getStoredRole = async () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  }
  return await SecureStore.getItemAsync('user_role');
};

/**
 * Elimina el token y rol de sesión según la plataforma.
 */
export const removeStoredToken = async () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role');
    }
  } else {
    await SecureStore.deleteItemAsync('jwt_token');
    await SecureStore.deleteItemAsync('user_role');
  }
};

/**
 * Inicia sesión enviando las credenciales al backend y almacena el JWT token devuelto.
 * 
 * @param {string} correo - Correo electrónico del usuario.
 * @param {string} contrasena - Contraseña del usuario.
 * @returns {Promise<{token: string}>} Respuesta del backend con el token JWT.
 */
export const login = async (correo, contrasena) => {
  try {
    const payload = { correo, contrasena };
    console.log("Payload a enviar en login:", payload);

    const response = await api.post('/auth/login', payload);
    const { token } = response.data;

    if (token) {
      await setStoredToken(token);
    }

    return response.data;
  } catch (error) {
    console.error('Error en authService.login:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Registra un nuevo usuario en el sistema y guarda el token JWT si la respuesta lo incluye.
 * 
 * @param {Object} userData - Objeto JSON según el contrato RegisterRequest (nombre, apePaterno, apeMaterno, correo, contrasena).
 * @returns {Promise<{token: string}>} Respuesta del backend con el token JWT.
 */
export const register = async (userData) => {
  try {
    console.log("Payload a enviar en register:", userData);

    const response = await api.post('/auth/register', userData);
    const { token } = response.data;

    if (token) {
      await setStoredToken(token);
    }

    return response.data;
  } catch (error) {
    console.error('Error en authService.register:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cierra la sesión eliminando el token de almacenamiento.
 */
export const logout = async () => {
  try {
    await removeStoredToken();
  } catch (error) {
    console.error('Error en authService.logout:', error);
  }
};
