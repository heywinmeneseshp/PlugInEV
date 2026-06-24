import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatCOP } from '../utils/format';

const MOCK_STATIONS = [
  { id: '1', name: 'ElectroCarga Norte', address: 'Cra. 65 #80-120', online: true, pricePerKWh: 825, power: '150kW' },
  { id: '2', name: 'VoltStation Sur', address: 'Cl. 30 #20-15', online: false, pricePerKWh: 720, power: '100kW' },
];

const MOCK_PENDING = [
  { id: 'r1', user: 'Carlos M.', date: 'Hoy', time: '16:00', duration: '1h' },
  { id: 'r2', user: 'Ana G.', date: 'Mañana', time: '10:30', duration: '2h' },
  { id: 'r3', user: 'Pedro R.', date: '25/06', time: '14:00', duration: '1.5h' },
];

export default function HostConfigScreen() {
  const navigation = useNavigation();
  const [stations, setStations] = useState(MOCK_STATIONS);

  const toggleOnline = (id) => {
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, online: !s.online } : s))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Tus estaciones</Text>
        {stations.map((station) => (
          <View key={station.id} style={styles.stationCard}>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAddress}>{station.address}</Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{formatCOP(station.pricePerKWh)}/kWh</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{station.power}</Text>
                </View>
              </View>
            </View>
            <View style={styles.toggleCol}>
              <Text style={[styles.statusText, station.online && styles.statusOnline]}>
                {station.online ? 'Activo' : 'Inactivo'}
              </Text>
              <Switch
                value={station.online}
                onValueChange={() => toggleOnline(station.id)}
                trackColor={{ false: '#334155', true: '#00E5FF' }}
                thumbColor={station.online ? '#FFFFFF' : '#64748B'}
              />
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Reservas pendientes</Text>
        {MOCK_PENDING.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Sin reservas pendientes</Text>
          </View>
        ) : (
          MOCK_PENDING.map((res) => (
            <View key={res.id} style={styles.reservationCard}>
              <View style={styles.resLeft}>
                <Text style={styles.resUser}>{res.user}</Text>
                <Text style={styles.resDetail}>
                  {res.date} · {res.time} · {res.duration}
                </Text>
              </View>
              <View style={styles.resBadge}>
                <Text style={styles.resBadgeText}>Pendiente</Text>
              </View>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Estadísticas rápidas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Cargas hoy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {'\u2605'} 4.8
            </Text>
            <Text style={styles.statLabel}>Calificación</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCOP(36800)}</Text>
            <Text style={styles.statLabel}>Ganancias hoy</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  stationCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
    alignItems: 'center',
  },
  stationInfo: {
    flex: 1,
    marginRight: 12,
  },
  stationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  toggleCol: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statusOnline: {
    color: '#22C55E',
  },
  reservationCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
    alignItems: 'center',
  },
  resLeft: {
    flex: 1,
    marginRight: 12,
  },
  resUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resDetail: {
    fontSize: 13,
    color: '#64748B',
  },
  resBadge: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  resBadgeText: {
    fontSize: 11,
    color: '#00E5FF',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
