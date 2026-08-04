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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatCOP } from '../utils/format';
import { obtenerDashboard, toggleOnline as toggleOnlineAPI } from '../services/api/anfitrion';
import { useAuth } from '../context/AuthContext';
import DemoBadge from '../components/DemoBadge';
import { colors, weights, radius } from '../styles/theme';

export default function HostConfigScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stationToggles, setStationToggles] = useState({});

  useEffect(() => {
    obtenerDashboard(user?.email)
      .then(data => {
        setDashboard(data);
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
  }, [user]);

  const toggleOnline = async (id) => {
    const next = !stationToggles[id];
    setStationToggles((prev) => ({ ...prev, [id]: next }));
    try {
      await toggleOnlineAPI(id, next);
    } catch {
      setStationToggles((prev) => ({ ...prev, [id]: !next }));
    }
  };

  const stations = dashboard?.stations || [];
  const pendingReservations = dashboard?.recentReservations || [];
  const totalSessions = dashboard?.totalSessions ?? 0;
  const totalKwh = dashboard?.totalKwh ?? 0;
  const onlineStations = dashboard?.onlineStations ?? 0;

  if (loading) {
    return (
      <View style={[s.container, s.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.cyan} />
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={s.headerTitle}>Configuración</Text>
          <DemoBadge />
        </View>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 32 }]}
      >
        <Text style={s.sectionTitle}>Tus estaciones</Text>
        {stations.length === 0 ? (
          <View style={s.emptyCard}>
            <Ionicons name="flash-outline" size={24} color={colors.textMuted} style={{ marginBottom: 8 }} />
            <Text style={s.emptyText}>Sin estaciones registradas</Text>
          </View>
        ) : (
          stations.map((station) => {
            const id = station.id || station._id;
            const isOnline = stationToggles[id] ?? station.online ?? true;
            return (
              <View key={id} style={s.stationCard}>
                <View style={s.stationInfo}>
                  <Text style={s.stationName}>{station.name}</Text>
                  <Text style={s.stationAddress}>{station.address}</Text>
                  <View style={s.tagRow}>
                    <View style={s.tag}>
                      <Text style={s.tagText}>{formatCOP(station.pricePerKWh || station.price_per_kwh || 0)}/kWh</Text>
                    </View>
                    <View style={s.tag}>
                      <Text style={s.tagText}>{station.power}</Text>
                    </View>
                  </View>
                </View>
                <View style={s.toggleCol}>
                  <Text style={[s.statusText, isOnline && s.statusOnline]}>
                    {isOnline ? 'Activo' : 'Inactivo'}
                  </Text>
                  <Switch
                    value={isOnline}
                    onValueChange={() => toggleOnline(id)}
                    trackColor={{ false: colors.trackBg, true: 'rgba(0,186,255,0.4)' }}
                    thumbColor={isOnline ? colors.cyan : colors.textMuted}
                    ios_backgroundColor={colors.trackBg}
                  />
                </View>
              </View>
            );
          })
        )}

        <Text style={s.sectionTitle}>Reservas pendientes</Text>
        {pendingReservations.length === 0 ? (
          <View style={s.emptyCard}>
            <Ionicons name="calendar-outline" size={24} color={colors.textMuted} style={{ marginBottom: 8 }} />
            <Text style={s.emptyText}>Sin reservas pendientes</Text>
          </View>
        ) : (
          pendingReservations.map((res) => (
            <View key={res.id || res._id} style={s.reservationCard}>
              <View style={s.resLeft}>
                <Text style={s.resUser}>{res.user || res.driver_name || res.driver || 'Conductor'}</Text>
                <Text style={s.resDetail}>
                  {res.date || res.scheduled_date || 'Hoy'} · {res.time || res.scheduled_time || '-'} · {res.duration || res.estimated_duration || '-'}
                </Text>
              </View>
              <View style={s.resBadge}>
                <Text style={s.resBadgeText}>Pendiente</Text>
              </View>
            </View>
          ))
        )}

        <Text style={s.sectionTitle}>Estadísticas rápidas</Text>
        <View style={s.statsRow}>
          <StatMini label="Sesiones"   value={String(totalSessions)} />
          <StatMini label="Energía"    value={`${totalKwh} kWh`}     />
          <StatMini label="Online"     value={String(onlineStations)} />
        </View>
      </ScrollView>
    </View>
  );
}

function StatMini({ label, value }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.bg },
  centered:   { alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },
  headerSpacer: { width: 40 },

  scrollContent: { paddingHorizontal: 20 },

  sectionTitle: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold,
    letterSpacing: 1, marginTop: 24, marginBottom: 12, marginLeft: 2,
  },

  stationCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.xl, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 10,
  },
  stationInfo: { flex: 1, marginRight: 12 },
  stationName: { fontSize: 15, fontWeight: weights.semibold, color: colors.textPrimary, marginBottom: 2 },
  stationAddress: { fontSize: 12, color: colors.textMuted, marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 6 },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  tagText: { fontSize: 11, color: colors.textSecondary, fontWeight: weights.medium },
  toggleCol: { alignItems: 'center', gap: 4 },
  statusText: { fontSize: 11, color: colors.textMuted, fontWeight: weights.semibold },
  statusOnline: { color: colors.cyan },

  reservationCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.xl, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 8,
  },
  resLeft: { flex: 1, marginRight: 12 },
  resUser: { fontSize: 14, fontWeight: weights.semibold, color: colors.textPrimary, marginBottom: 4 },
  resDetail: { fontSize: 12, color: colors.textMuted },
  resBadge: {
    backgroundColor: 'rgba(0,186,255,0.1)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.3)',
  },
  resBadgeText: { fontSize: 11, color: colors.cyan, fontWeight: weights.semibold },

  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.xl, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: { fontSize: 13, color: colors.textMuted },

  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.xl, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  statValue: { fontSize: 20, fontWeight: weights.extrabold, color: colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
});
