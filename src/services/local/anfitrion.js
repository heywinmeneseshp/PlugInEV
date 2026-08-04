import { getDb } from './db';
import { listarReservas } from './reservas';
import { crearEstacion, actualizarEstacion, buscarEstacionesPorHost } from './estaciones';

export { crearEstacion as registrarEstacion, actualizarEstacion };

export const toggleOnline = (id, online) => actualizarEstacion(id, { online });

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatFecha(iso) {
  if (!iso) return 'Hoy';
  const d = new Date(iso);
  if (isNaN(d)) return 'Hoy';
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function formatHora(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d)) return '-';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDuracion(mins) {
  if (!mins) return '-';
  if (mins < 60) return `${mins} min`;
  const h = mins / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)} ${h === 1 ? 'hora' : 'horas'}`;
}

function mapReservaDisplay(r) {
  return {
    ...r,
    driver_name: r.driver_name || 'Conductor',
    vehicle: r.vehicle || '-',
    connector: r.connector || '-',
    date: formatFecha(r.start_time),
    time: formatHora(r.start_time),
    duration: formatDuracion(r.duration_minutes),
    estimated_kwh: r.estimated_kwh || 0,
    estimated_amount: r.total_cost || 0,
    station_name: r.station_name || '',
  };
}

const isToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  return !isNaN(d) && d.toDateString() === new Date().toDateString();
};

const sum = (arr, field) => arr.reduce((s, r) => s + (r[field] || 0), 0);

async function reservasDelHost(hostId) {
  const stations = await buscarEstacionesPorHost(hostId);
  const stationIds = new Set(stations.map((s) => s.id));
  const reservas = (await listarReservas()).filter((r) => stationIds.has(r.station_id));
  return { stations, reservas };
}

export const obtenerDashboard = async (hostId) => {
  const { stations, reservas } = await reservasDelHost(hostId);
  const completadas = reservas.filter((r) => r.status === 'completed');
  const pendientes = reservas.filter((r) => r.status === 'pending');
  const completadasHoy = completadas.filter((r) => isToday(r.end_time || r.created_at));
  const totalKwh = Math.round(sum(completadas, 'energy_kwh') * 10) / 10;

  return {
    // Consumido por HostScreen
    sessions_today: completadasHoy.length,
    total_sessions: completadas.length,
    kwh_today: Math.round(sum(completadasHoy, 'energy_kwh') * 10) / 10,
    total_kwh: totalKwh,
    total_revenue: sum(completadas, 'total_cost'),
    active_stations: stations.filter((e) => e.online).length,
    total_stations: stations.length,
    pending_reservations: pendientes.length,
    // Consumido por HostConfigScreen
    stations: stations.map((e) => ({
      id: e.id, name: e.name, address: e.address,
      pricePerKWh: e.price_per_kwh, power: e.power, online: e.online,
    })),
    recentReservations: pendientes.slice(0, 5).map(mapReservaDisplay),
    totalSessions: completadas.length,
    totalKwh,
    onlineStations: stations.filter((e) => e.online).length,
  };
};

export const obtenerEstadisticas = async (hostId) => {
  const { reservas } = await reservasDelHost(hostId);
  const completadas = reservas.filter((r) => r.status === 'completed');
  const enCurso = reservas.filter((r) => ['confirmed', 'active', 'escrow_held', 'charging'].includes(r.status));
  return {
    total_earned: sum(completadas, 'total_cost'),
    pending_payout: sum(enCurso, 'total_cost'),
    total_sessions: completadas.length,
    next_payout: 'Próximo lunes',
  };
};

export const obtenerReservasPendientes = async (hostId) => {
  const { reservas } = await reservasDelHost(hostId);
  return reservas.map(mapReservaDisplay);
};
