import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { iniciarSesion, registrar, verificarEmail, switchMode as switchModeApi } from '../services/api/auth';
import { setToken } from '../services/api';
import { obtenerPerfil } from '../services/api/perfil';

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
            return;
          }
        }
      } catch (_) {}
      dispatch({ type: 'SET_READY' });
    })();
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
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    dispatch({ type: 'START' });
    try {
      const data = await registrar(formData);
      setToken(data.access_token);
      registerTokenRef.current = { token: data.access_token, refreshToken: data.refresh_token };
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

  const finishRegistration = useCallback(() => {
    const tk = registerTokenRef.current;
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: state.user,
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
