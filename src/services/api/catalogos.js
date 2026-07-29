import { api, endPoints } from './index';

export const listarMarcasVehiculos = async () => {
  const response = await api.get(endPoints.catalogos.vehicleBrands);
  return response.data;
};

export const listarConectores = async () => {
  const response = await api.get(endPoints.catalogos.connectors);
  return response.data;
};
