import axios from 'axios';

const API = process.env.EXPO_PUBLIC_API_URL || 'https://api.plugin.app';

const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

// Callback wired from AuthContext so the interceptor can call logout without a circular import
let _onUnauthorized = null;
export function setUnauthorizedCallback(fn) {
  _onUnauthorized = fn;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && _onUnauthorized) {
      _onUnauthorized();
    }
    const detail = error.response?.data?.detail;
    const msg =
      (typeof detail === 'string' ? detail : detail?.[0]?.msg) ||
      error.response?.data?.message ||
      error.message ||
      'Error de conexión';
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
  sistema: {
    health: '/health',
  },
  auth: {
    login: '/v1/auth/login',
    register: '/v1/auth/register',
    switchMode: '/v1/auth/switch-mode',
    refresh: '/v1/auth/refresh',
    forgotPassword: '/v1/auth/forgot-password',
    resetPassword: '/v1/auth/reset-password',
    verifyEmail: '/v1/auth/verify-email',
    resendOtp: '/v1/auth/resend-otp',
  },
  catalogos: {
    vehicleBrands: '/v1/catalogs/vehicle-brands',
    connectors: '/v1/catalogs/connectors',
  },
  estaciones: {
    listar: '/v1/estaciones',
    encontrar: (id) => `/v1/estaciones/${id}`,
  },
  reservas: {
    crear: '/v1/reservas',
    listar: '/v1/reservas',
    escrow: (id) => `/v1/reservas/${id}/escrow`,
    iniciarCarga: (id) => `/v1/reservas/${id}/iniciar`,
    detenerCarga: (id) => `/v1/reservas/${id}/detener`,
    telemetria: (id) => `/v1/reservas/${id}/telemetria`,
    cdr: '/v1/reservas/cdr',
    calificar: (id) => `/v1/reservas/${id}/rating`,
  },
  anfitrion: {
    registrarEstacion: '/v1/anfitrion/estaciones',
    actualizarEstacion: (id) => `/v1/anfitrion/estaciones/${id}`,
    dashboard: '/v1/anfitrion/dashboard',
    estadisticas: '/v1/anfitrion/estadisticas',
    reservasPendientes: '/v1/anfitrion/reservas-pendientes',
  },
  perfil: {
    obtener: '/v1/perfil',
    actualizar: '/v1/perfil',
  },
};

export { api, endPoints };
export default endPoints;
