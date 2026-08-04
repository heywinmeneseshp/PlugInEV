import { getDb } from './db';

export const listarEstaciones = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT data FROM estaciones');
  return rows.map(r => JSON.parse(r.data));
};

export const encontrarEstacion = async (id) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT data FROM estaciones WHERE id = ?', [id]);
  return row ? JSON.parse(row.data) : null;
};

export const buscarEstacionesPorHost = async (hostId) => {
  if (!hostId) return [];
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT data FROM estaciones');
  return rows.map(r => JSON.parse(r.data)).filter(s => s.host_id === hostId);
};

export const crearEstacion = async (data) => {
  const db = await getDb();
  const id = 'st-' + Date.now();
  const station = { id, online: true, ...data, sessions_count: 0, rating: 0, num_ratings: 0 };
  await db.runAsync('INSERT INTO estaciones (id, data) VALUES (?, ?)', [id, JSON.stringify(station)]);
  return station;
};

export const actualizarEstacion = async (id, patch) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT data FROM estaciones WHERE id = ?', [id]);
  if (!row) throw new Error('Estación no encontrada');
  const updated = { ...JSON.parse(row.data), ...patch };
  await db.runAsync('UPDATE estaciones SET data = ? WHERE id = ?', [JSON.stringify(updated), id]);
  return updated;
};
