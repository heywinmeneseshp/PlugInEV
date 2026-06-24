import { api, endPoints } from './index';

export const registrarEstacion = async (data) => {
  const response = await api.post(endPoints.anfitrion.registrarEstacion, data);
  return response.data;
};

export const actualizarEstacion = async (id, data) => {
  const response = await api.patch(endPoints.anfitrion.actualizarEstacion(id), data);
  return response.data;
};


export const obtenerDashboard = async () => {
  const response = await api.get(endPoints.anfitrion.dashboard);
  return response.data;
};

export const toggleOnline = async (stationId, online) => {
  const response = await api.patch(`/anfitrion/estaciones/${stationId}`, { online });
  return response.data;
};

export const obtenerEstadisticas = async () => {
  const response = await api.get('/anfitrion/estadisticas');
  return response.data;
};

export const obtenerReservasPendientes = async () => {
  const response = await api.get('/anfitrion/reservas-pendientes');
  return response.data;
};
