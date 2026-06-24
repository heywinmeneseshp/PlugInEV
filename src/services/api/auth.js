import { api, endPoints } from './index';

export const iniciarSesion = async (email, password) => {
  const response = await api.post(endPoints.auth.login, { email, password });
  return response.data;
};

export const registrar = async (data) => {
  const response = await api.post(endPoints.auth.register, data);
  return response.data;
};

export const verificarOTP = async (otp) => {
  const response = await api.post('/auth/verify-otp', { otp });
  return response.data;
};

export const reenviarOTP = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};

export const seleccionarRol = async (role) => {
  const response = await api.post('/auth/select-role', { role });
  return response.data;
};
