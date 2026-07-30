import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatCOP } from '../utils/format';
import { obtenerDashboard } from '../services/api/anfitrion';

export default function HostConfigScreen() {
  const navigation = useNavigation();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stationToggles, setStationToggles] = useState({});

  useEffect(() => {
    obtenerDashboard()
      .then(data => {
        setDashboard(data);
        // Initialize toggle state from station data
        if (data?.stations) {
          const toggles = {};
          data.stations.forEach(s => {
            toggles[s.id || s._id] = s.online ?? true;
          });
          setStationToggles(toggles);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleOnline = (id) => {
    setStationToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stations = dashboard?.stations || [];
  const pendingReservations = dashboard?.recentReservations || [];
  const totalSessions = dashboard?.totalSessions ?? 0;
  const totalKwh = dashboard?.totalKwh ?? 0;
  const onlineStations = dashboard?.onlineStations ?? 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00BAFF" />
      </View>
    );
  }

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
        {stations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Sin estaciones registradas</Text>
          </View>
        ) : (
          stations.map((station) => {
            const id = station.id || station._id;
            const isOnline = stationToggles[id] ?? station.online ?? true;
            return (
              <View key={id} style={styles.stationCard}>
                <View style={styles.stationInfo}>
                  <Text style={styles.stationName}>{station.name}</Text>
                  <Text style={styles.stationAddress}>{station.address}</Text>
                  <View style={styles.tagRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{formatCOP(station.pricePerKWh || station.price_per_kwh || 0)}/kWh</Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{station.power}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.toggleCol}>
                  <Text style={[styles.statusText, isOnline && styles.statusOnline]}>
                    {isOnline ? 'Activo' : 'Inactivo'}
                  </Text>
                  <Switch
                    value={isOnline}
                    onValueChange={() => toggleOnline(id)}
                    trackColor={{ false: '#334155', true: '#00E5FF' }}
                    thumbColor={isOnline ? '#FFFFFF' : '#64748B'}
                  />
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.sectionTitle}>Reservas pendientes</Text>
        {pendingReservations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Sin reservas pendientes</Text>
          </View>
        ) : (
          pendingReservations.map((res) => (
            <View key={res.id || res._id} style={styles.reservationCard}>
              <View style={styles.resLeft}>
                <Text style={styles.resUser}>{res.user || res.driver_name || res.driver || 'Conductor'}</Text>
                <Text style={styles.resDetail}>
                  {res.date || res.scheduled_date || 'Hoy'} · {res.time || res.scheduled_time || '-'} · {res.duration || res.estimated_duration || '-'}
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
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalKwh} kWh</Text>
            <Text style={styles.statLabel}>Energía total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{onlineStations}</Text>
            <Text style={styles.statLabel}>Estaciones online</Text>
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
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
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
