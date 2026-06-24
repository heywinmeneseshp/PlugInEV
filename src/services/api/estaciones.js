import { api, endPoints } from './index';

export const listarEstaciones = async (params = {}) => {
  const response = await api.get(endPoints.estaciones.listar, { params });
  return response.data;
};

export const encontrarEstacion = async (id) => {
  const response = await api.get(endPoints.estaciones.encontrar(id));
  return response.data;
};
