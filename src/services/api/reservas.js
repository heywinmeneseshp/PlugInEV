import { api, endPoints } from './index';

export const crearReserva = async (data) => {
  const response = await api.post(endPoints.reservas.crear, data);
  return response.data;
};

export const listarReservas = async () => {
  const response = await api.get(endPoints.reservas.listar);
  return response.data;
};

export const escrowHold = async (reservationId) => {
  const response = await api.post(`/reservas/${reservationId}/escrow`);
  return response.data;
};

export const iniciarCarga = async (reservationId) => {
  const response = await api.post(`/reservas/${reservationId}/iniciar`);
  return response.data;
};

export const detenerCarga = async (reservationId) => {
  const response = await api.post(`/reservas/${reservationId}/detener`);
  return response.data;
};

export const obtenerTelemetria = async (reservationId) => {
  const response = await api.get(`/reservas/${reservationId}/telemetria`);
  return response.data;
};

export const guardarCDR = async (data) => {
  const response = await api.post('/reservas/cdr', data);
  return response.data;
};
