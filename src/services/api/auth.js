import { api, endPoints } from './index';

export const iniciarSesion = async (email, password, mode = null) => {
  const body = { email, password };
  if (mode) body.mode = mode;
  const response = await api.post(endPoints.auth.login, body);
  return response.data;
};

export const registrar = async (data) => {
  const response = await api.post(endPoints.auth.register, data);
  return response.data;
};

export const verificarEmail = async (email, code) => {
  const response = await api.post(endPoints.auth.verifyEmail, { email, code });
  return response.data;
};

export const reenviarOTP = async (email, purpose) => {
  const response = await api.post(endPoints.auth.resendOtp, { email, purpose });
  return response.data;
};

export const switchMode = async (mode) => {
  const response = await api.post(endPoints.auth.switchMode, { mode });
  return response.data;
};

export const refreshTokens = async (refreshToken) => {
  const response = await api.post(endPoints.auth.refresh, { refresh_token: refreshToken });
  return response.data;
};

export const solicitarResetPassword = async (email) => {
  const response = await api.post(endPoints.auth.forgotPassword, { email });
  return response.data;
};

export const resetPassword = async (email, code, newPassword) => {
  const response = await api.post(endPoints.auth.resetPassword, { email, code, new_password: newPassword });
  return response.data;
};
