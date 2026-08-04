import * as SQLite from 'expo-sqlite';

let _db = null;

export async function getDb() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('pluginev.db');
  await _setup(_db);
  return _db;
}

async function _setup(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS perfil (
      id   TEXT PRIMARY KEY DEFAULT 'me',
      data TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS estaciones (
      id     TEXT PRIMARY KEY,
      data   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservas (
      id     TEXT PRIMARY KEY,
      data   TEXT NOT NULL
    );
  `);

  const { n } = await db.getFirstAsync('SELECT COUNT(*) AS n FROM estaciones');
  if (n === 0) await _seed(db);
}

async function _seed(db) {
  const stations = [
    {
      id: 'st-001',
      name: 'PlugIn Buenavista',
      address: 'C.C. Buenavista, Cra 53 #98-99, Barranquilla',
      latitude: 10.9878, longitude: -74.8191,
      price_per_kwh: 825, power: '150kW DC',
      online: true, host_name: 'PlugIn EV',
      hours: { open: '08:00', close: '22:00', days: 'Lun–Dom' },
      rating: 4.8, num_ratings: 124, sessions_count: 340,
      connectors: [{ code: 'CCS2', name: 'CCS2', power_type: 'DC' }, { code: 'CHADEMO', name: 'CHAdeMO', power_type: 'DC' }],
    },
    {
      id: 'st-002',
      name: 'PlugIn Portal del Prado',
      address: 'C.C. Portal del Prado, Cra 58 #74-50, Barranquilla',
      latitude: 10.9939, longitude: -74.8074,
      price_per_kwh: 780, power: '50kW DC',
      online: true, host_name: 'Carlos M.',
      hours: { open: '09:00', close: '21:00', days: 'Lun–Sáb' },
      rating: 4.5, num_ratings: 67, sessions_count: 190,
      connectors: [{ code: 'TYPE2', name: 'Type 2', power_type: 'AC' }, { code: 'CCS2', name: 'CCS2', power_type: 'DC' }],
    },
    {
      id: 'st-003',
      name: 'PlugIn Viva Barranquilla',
      address: 'C.C. Viva Barranquilla, Cra 35 #7-30, Barranquilla',
      latitude: 10.9665, longitude: -74.8086,
      price_per_kwh: 0, power: '22kW AC',
      online: true, host_name: 'Viva Malls',
      hours: { open: '10:00', close: '21:00', days: 'Todos los días' },
      rating: 4.2, num_ratings: 43, sessions_count: 98,
      connectors: [{ code: 'TYPE2', name: 'Type 2', power_type: 'AC' }],
    },
    {
      id: 'st-004',
      name: 'PlugIn El Prado',
      address: 'Cra 54 #72-23, El Prado, Barranquilla',
      latitude: 11.0052, longitude: -74.8252,
      price_per_kwh: 900, power: '150kW DC',
      online: false, host_name: 'Ana R.',
      hours: { open: '07:00', close: '23:00', days: 'Todos los días' },
      rating: 4.7, num_ratings: 89, sessions_count: 215,
      connectors: [{ code: 'CCS2', name: 'CCS2', power_type: 'DC' }, { code: 'CHADEMO', name: 'CHAdeMO', power_type: 'DC' }, { code: 'TYPE2', name: 'Type 2', power_type: 'AC' }],
    },
    {
      id: 'st-005',
      name: 'PlugIn Malecón',
      address: 'Malecón del Río, Cl 1 #45-05, Barranquilla',
      latitude: 10.9959, longitude: -74.7887,
      price_per_kwh: 825, power: '50kW DC',
      online: true, host_name: 'Puerto Turístico',
      hours: { open: '06:00', close: '23:59', days: 'Todos los días' },
      rating: 4.9, num_ratings: 210, sessions_count: 560,
      connectors: [{ code: 'CCS2', name: 'CCS2', power_type: 'DC' }, { code: 'TYPE2', name: 'Type 2', power_type: 'AC' }],
    },
    {
      id: 'st-006',
      name: 'PlugIn Ciudad Jardín',
      address: 'Cra 79b #98-30, Ciudad Jardín, Barranquilla',
      latitude: 11.0169, longitude: -74.8204,
      price_per_kwh: 750, power: '22kW AC',
      online: true, host_name: 'Jorge P.',
      hours: { open: '00:00', close: '23:59', days: 'Todos los días' },
      rating: 4.3, num_ratings: 31, sessions_count: 77,
      connectors: [{ code: 'TYPE2', name: 'Type 2', power_type: 'AC' }],
    },
    {
      id: 'st-007',
      name: 'PlugIn Soledad',
      address: 'Cra 19 #18-50, Soledad, Atlántico',
      latitude: 10.9165, longitude: -74.7660,
      price_per_kwh: 0, power: '7kW AC',
      online: true, host_name: 'Municipio de Soledad',
      hours: { open: '06:00', close: '22:00', days: 'Lun–Vie' },
      rating: 3.9, num_ratings: 18, sessions_count: 44,
      connectors: [{ code: 'TYPE2', name: 'Type 2', power_type: 'AC' }],
    },
    {
      id: 'st-008',
      name: 'PlugIn Puerto Colombia',
      address: 'Cl 3 #3-50, Puerto Colombia, Atlántico',
      latitude: 11.0000, longitude: -74.9635,
      price_per_kwh: 870, power: '50kW DC',
      online: true, host_name: 'Hotel Pradomar',
      hours: { open: '08:00', close: '20:00', days: 'Todos los días' },
      rating: 4.6, num_ratings: 55, sessions_count: 130,
      connectors: [{ code: 'CCS2', name: 'CCS2', power_type: 'DC' }, { code: 'TYPE2', name: 'Type 2', power_type: 'AC' }],
    },
  ];

  for (const s of stations) {
    await db.runAsync(
      'INSERT INTO estaciones (id, data) VALUES (?, ?)',
      [s.id, JSON.stringify(s)],
    );
  }
}
