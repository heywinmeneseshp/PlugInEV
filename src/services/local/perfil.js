import { getDb } from './db';

const DEFAULT_PERFIL = {
  id: 'me',
  email: '',
  name: '',
  phone_country_code: '+57',
  phone_number: '',
  profile_type: 'natural_person',
  active_mode: 'driver',
  wallet_balance: 250000,
  driver_profile: {},
  payment_methods: [],
  roles: ['driver'],
};

export const obtenerPerfil = async () => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT data FROM perfil WHERE id = ?', ['me']);
  if (!row) return null;
  return { ...DEFAULT_PERFIL, ...JSON.parse(row.data) };
};

export const guardarPerfil = async (data) => {
  const db = await getDb();
  const existing = await db.getFirstAsync('SELECT data FROM perfil WHERE id = ?', ['me']);
  if (existing) {
    const merged = { ...JSON.parse(existing.data), ...data };
    await db.runAsync('UPDATE perfil SET data = ? WHERE id = ?', [JSON.stringify(merged), 'me']);
    return { ...DEFAULT_PERFIL, ...merged };
  } else {
    const payload = { ...data };
    await db.runAsync('INSERT INTO perfil (id, data) VALUES (?, ?)', ['me', JSON.stringify(payload)]);
    return { ...DEFAULT_PERFIL, ...payload };
  }
};

export const actualizarPerfil = async (patch) => {
  return guardarPerfil(patch);
};
