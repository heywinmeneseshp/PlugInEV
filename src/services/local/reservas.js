import { getDb } from './db';

export const crearReserva = async (data) => {
  const db = await getDb();
  const id = 'res-' + Date.now();
  const reserva = {
    energy_kwh: 0,
    total_cost: 0,
    ...data,
    id,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  await db.runAsync('INSERT INTO reservas (id, data) VALUES (?, ?)', [id, JSON.stringify(reserva)]);
  return reserva;
};

export const listarReservas = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT data FROM reservas ORDER BY rowid DESC');
  return rows.map(r => JSON.parse(r.data));
};

export const obtenerReserva = async (id) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT data FROM reservas WHERE id = ?', [id]);
  return row ? JSON.parse(row.data) : null;
};

const _update = async (id, patch) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT data FROM reservas WHERE id = ?', [id]);
  if (!row) throw new Error('Reserva no encontrada');
  const updated = { ...JSON.parse(row.data), ...patch };
  await db.runAsync('UPDATE reservas SET data = ? WHERE id = ?', [JSON.stringify(updated), id]);
  return updated;
};

// Estados: pending -> confirmed (escrow) -> active (cargando) -> completed
export const escrowHold     = (id) => _update(id, { status: 'confirmed' });
export const iniciarCarga   = (id) => _update(id, { status: 'active', actual_start_time: new Date().toISOString() });
export const detenerCarga   = (id) => _update(id, { status: 'completed', end_time: new Date().toISOString() });
export const calificarReserva = (id, rating, comment = '') => _update(id, { rating, comment });

export const obtenerTelemetria = async (id) => ({
  reservation_id: id,
  energy_kwh: parseFloat((Math.random() * 30).toFixed(2)),
  power_kw: parseFloat((Math.random() * 50 + 10).toFixed(1)),
  voltage_v: 400,
  current_a: parseFloat((Math.random() * 100 + 20).toFixed(1)),
  soc_percent: Math.floor(Math.random() * 60 + 20),
  elapsed_minutes: Math.floor(Math.random() * 45 + 5),
});

export const guardarCDR = async (data) => {
  return _update(data.reservation_id, { cdr: data, status: 'completed' });
};
