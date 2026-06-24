import axios from 'axios';

const API = process.env.EXPO_PUBLIC_API_URL || 'https://api.plugin.app';
const VERSION = process.env.EXPO_PUBLIC_API_VERSION || 'v1';

const api = axios.create({
  baseURL: `${API}/api/${VERSION}`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || 'Error de conexión';
    return Promise.reject(new Error(msg));
  }
);

export function setToken(token) {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
}

const endPoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  estaciones: {
    listar: '/estaciones',
    encontrar: (id) => `/estaciones/${id}`,
  },
  reservas: {
    crear: '/reservas',
    listar: '/reservas',
  },
  anfitrion: {
    registrarEstacion: '/anfitrion/estaciones',
    actualizarEstacion: (id) => `/anfitrion/estaciones/${id}`,
    dashboard: '/anfitrion/dashboard',
  },
  perfil: {
    obtener: '/perfil',
    actualizar: '/perfil',
  },
};

export { api, endPoints };
export default endPoints;
