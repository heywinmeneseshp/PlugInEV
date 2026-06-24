import { api, endPoints } from './index';

export const obtenerPerfil = async () => {
  const response = await api.get(endPoints.perfil.obtener);
  return response.data;
};

export const actualizarPerfil = async (data) => {
  const response = await api.patch(endPoints.perfil.actualizar, data);
  return response.data;
};
