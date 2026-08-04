import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { iniciarSesion, registrar, verificarEmail, switchMode as switchModeApi } from '../services/api/auth';
import { setToken, setUnauthorizedCallback } from '../services/api';
import { obtenerPerfil } from '../services/api/perfil';
import { buscarEstacionesPorHost } from '../services/api/estaciones';

const TOKEN_KEY = 'pluginev_auth_token';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isReady: false,   // true cuando terminó de verificar sesión guardada
  hostStation: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, isLoading: true };
    case 'REGISTER_SUCCESS':
      return { ...state, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false };
    case 'SET_USER':
      return { ...state, user: { ...(state.user || {}), ...action.payload } };
    case 'SET_HOST_STATION':
      return { ...state, hostStation: action.payload };
    case 'UPDATE_WALLET':
      return {
        ...state,
        user: state.user ? { ...state.user, walletBalance: action.payload } : null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        isReady: true,
      };
    case 'SET_READY':
      return { ...state, isReady: true };
    case 'LOGOUT':
      return { ...initialState, isReady: true };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const registerTokenRef = useRef(null);

  // Recupera la estación local del anfitrión (SQLite) para que sobreviva
  // reinicios de la app, ya que hoy solo vive en memoria (SET_HOST_STATION)
  const loadHostStation = useCallback(async (hostId) => {
    if (!hostId) return;
    try {
      const stations = await buscarEstacionesPorHost(hostId);
      if (stations.length > 0) {
        const s = stations[0];
        dispatch({
          type: 'SET_HOST_STATION',
          payload: { ...s, pricePerKWh: s.price_per_kwh, available: s.online },
        });
      }
    } catch (_) {}
  }, []);

  // Restaurar sesión al abrir la app
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (savedToken) {
          setToken(savedToken);
          const perfil = await obtenerPerfil();
          if (perfil) {
            dispatch({
              type: 'RESTORE_SESSION',
              payload: {
                token: savedToken,
                user: {
                  email: perfil.email,
                  name: perfil.name,
                  phone: perfil.phone_number,
                  role: perfil.active_mode === 'host' ? 'anfitrion' : 'conductor',
                  activeMode: perfil.active_mode,
                  walletBalance: perfil.wallet_balance || 0,
                  driverProfile: perfil.driver_profile || {},
                  paymentMethods: perfil.payment_methods || [],
                },
              },
            });
            loadHostStation(perfil.email);
            return;
          }
        }
      } catch (_) {}
      dispatch({ type: 'SET_READY' });
    })();
  }, [loadHostStation]);

  // Wire the 401 interceptor so expired-token responses auto-logout
  const logoutRef = useRef(null);
  useEffect(() => {
    setUnauthorizedCallback(() => {
      if (logoutRef.current) logoutRef.current();
    });
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'START' });
    try {
      const data = await iniciarSesion(email, password);
      setToken(data.access_token);
      await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
      const role = data.active_mode === 'host' ? 'anfitrion' : 'conductor';
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: { email, role, activeMode: data.active_mode },
          token: data.access_token,
        },
      });
      obtenerPerfil().then(perfil => {
        if (perfil) {
          dispatch({ type: 'SET_USER', payload: {
            name: perfil.name,
            phone: perfil.phone_number,
            walletBalance: perfil.wallet_balance || 0,
            driverProfile: perfil.driver_profile || {},
            paymentMethods: perfil.payment_methods || [],
          }});
        }
      }).catch(() => {});
      loadHostStation(email);
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw err;
    }
  }, [loadHostStation]);

  const register = useCallback(async (formData) => {
    dispatch({ type: 'START' });
    try {
      const data = await registrar(formData);
      setToken(data.access_token);
      await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
      registerTokenRef.current = { token: data.access_token, refreshToken: data.refresh_token };
      // Datos optimistas mientras se completa la verificación por OTP;
      // verifyOTP los sobrescribe con la respuesta autoritativa del servidor
      dispatch({
        type: 'SET_USER',
        payload: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone_number,
          role: 'conductor',
          activeMode: 'driver',
          email_verified: false,
        },
      });
      dispatch({ type: 'REGISTER_SUCCESS' });
      return data;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw err;
    }
  }, []);

  const verifyOTP = useCallback(async (email, code) => {
    const data = await verificarEmail(email, code);
    const role = data.roles?.includes('host') ? 'anfitrion' : 'conductor';
    dispatch({
      type: 'SET_USER',
      payload: { ...data, role, email_verified: true },
    });
    return data;
  }, []);

  const finishRegistration = useCallback((roleOverride) => {
    const tk = registerTokenRef.current;
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        // roleOverride evita depender de state.user desactualizado justo
        // después de un dispatch de setRole/switchRole en el mismo tick
        user: roleOverride ? { ...state.user, role: roleOverride } : state.user,
        token: tk?.token || null,
      },
    });
    registerTokenRef.current = null;
  }, [state.user]);

  const switchRole = useCallback(async (role) => {
    const mode = role === 'anfitrion' ? 'host' : 'driver';
    const data = await switchModeApi(mode);
    const userRole = data.active_mode === 'host' ? 'anfitrion' : 'conductor';
    dispatch({ type: 'SET_USER', payload: { role: userRole, activeMode: data.active_mode } });
    return data;
  }, []);

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_USER', payload: { role } });
  }, []);

  const setHostStation = useCallback((station) => {
    dispatch({ type: 'SET_HOST_STATION', payload: station });
  }, []);

  const updateWallet = useCallback((amount) => {
    dispatch({ type: 'UPDATE_WALLET', payload: amount });
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    registerTokenRef.current = null;
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Keep logoutRef in sync so the interceptor always calls the latest version
  useEffect(() => { logoutRef.current = logout; }, [logout]);

  const value = {
    ...state,
    login,
    register,
    verifyOTP,
    finishRegistration,
    switchRole,
    setRole,
    setHostStation,
    updateWallet,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
