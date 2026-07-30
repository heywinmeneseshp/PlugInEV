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
  const response = await api.post(endPoints.reservas.escrow(reservationId));
  return response.data;
};

export const iniciarCarga = async (reservationId) => {
  const response = await api.post(endPoints.reservas.iniciarCarga(reservationId));
  return response.data;
};

export const detenerCarga = async (reservationId) => {
  const response = await api.post(endPoints.reservas.detenerCarga(reservationId));
  return response.data;
};

export const obtenerTelemetria = async (reservationId) => {
  const response = await api.get(endPoints.reservas.telemetria(reservationId));
  return response.data;
};

export const guardarCDR = async (data) => {
  const response = await api.post(endPoints.reservas.cdr, data);
  return response.data;
};

export const calificarReserva = async (reservationId, rating, comment = '') => {
  const response = await api.post(`/v1/reservas/${reservationId}/rating`, { rating, comment });
  return response.data;
};
