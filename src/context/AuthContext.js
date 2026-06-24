import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  hostStation: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
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
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_HOST_STATION':
      return { ...state, hostStation: action.payload };
    case 'UPDATE_WALLET':
      return {
        ...state,
        user: state.user ? { ...state.user, walletBalance: action.payload } : null,
      };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    // Mock: acepta cualquier email con contraseña de 6+ caracteres
    await new Promise((r) => setTimeout(r, 500));
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: {
          id: '1',
          nombre: 'Heywin',
          email,
          role: 'conductor',
          vehiculo: 'Tesla Model 3',
          placa: 'ABC-123',
          metodoPago: 'Visa •••• 4242',
          reservasActivas: 1,
          walletBalance: 25000,
        },
        token: 'mock-token',
      },
    });
  }, []);

  const register = useCallback(async (_data) => {
    dispatch({ type: 'LOGIN_START' });
    await new Promise((r) => setTimeout(r, 300));
    dispatch({ type: 'LOGIN_FAILURE' });
    return { success: true };
  }, []);

  const verifyOTP = useCallback(async (_otp) => {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true };
  }, []);

  const selectRole = useCallback(async (role) => {
    await new Promise((r) => setTimeout(r, 200));
    dispatch({ type: 'SET_USER', payload: { role } });
  }, []);

  const finishRegistration = useCallback((userData, token) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user: userData, token },
    });
  }, []);

  const setHostStation = useCallback((station) => {
    dispatch({ type: 'SET_HOST_STATION', payload: station });
  }, []);

  const updateWallet = useCallback((amount) => {
    dispatch({ type: 'UPDATE_WALLET', payload: amount });
  }, []);

  const switchRole = useCallback((role) => {
    dispatch({ type: 'SET_USER', payload: { role } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    ...state,
    login,
    register,
    verifyOTP,
    selectRole,
    finishRegistration,
    setHostStation,
    updateWallet,
    switchRole,
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
