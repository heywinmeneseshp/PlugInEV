import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, weights, radius } from '../styles/theme';
import { obtenerReservasPendientes } from '../services/api/anfitrion';

const { width } = Dimensions.get('window');

function mapReservation(r) {
  return {
    id: r._id || r.id || String(Math.random()),
    driver: r.driver_name || r.driver || r.user_name || 'Conductor',
    vehicle: r.vehicle || r.vehicle_model || '-',
    connector: r.connector || r.connector_type || '-',
    date: r.date || r.scheduled_date || 'Hoy',
    time: r.time || r.scheduled_time || '-',
    duration: r.duration || r.estimated_duration || '-',
    kwh: r.kwh || r.estimated_kwh || 0,
    amount: r.amount || r.estimated_amount || 0,
    status: r.status || 'pending',
    stationName: r.station_name || r.stationName || '',
  };
}

const STATUS = {
  pending:   { label: 'Pendiente',  color: '#FFD60A', bg: 'rgba(255,214,10,0.12)'  },
  confirmed: { label: 'Confirmada', color: colors.cyan, bg: 'rgba(0,186,255,0.12)' },
  completed: { label: 'Completada', color: colors.green, bg: 'rgba(0,255,140,0.12)'},
};

export default function HostReservationsScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const [filter, setFilter] = useState('all');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerReservasPendientes()
      .then(data => setReservations(Array.isArray(data) ? data.map(mapReservation) : []))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filter);

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;

  const handleConfirmArrival = (res) => {
    Alert.alert(
      'Confirmar llegada',
      `¿Confirmas que el conductor llegó a ${res.stationName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // TODO: llamar API de confirmación cuando esté disponible
            Alert.alert('Llegada confirmada', 'El conductor fue notificado.');
          },
        },
      ]
    );
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Reservas</Text>
        {pendingCount > 0 && (
          <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.badge}>
            <Text style={s.badgeText}>{pendingCount}</Text>
          </LinearGradient>
        )}
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
        style={s.filterScroll}
      >
        {[
          { key: 'all',       label: 'Todas' },
          { key: 'pending',   label: 'Pendientes' },
          { key: 'confirmed', label: 'Confirmadas' },
          { key: 'completed', label: 'Completadas' },
        ].map((f) => {
          const active = filter === f.key;
          if (active) {
            return (
              <TouchableOpacity key={f.key} onPress={() => setFilter(f.key)} activeOpacity={0.8}>
                <LinearGradient colors={['#00BAFF','#00FF8C']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.chipActive}>
                  <Text style={s.chipTextActive}>{f.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity key={f.key} style={s.chip} onPress={() => setFilter(f.key)} activeOpacity={0.75}>
              <Text style={s.chipText}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={colors.cyan} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {filtered.map((res) => {
            const st = STATUS[res.status] || STATUS.pending;
            const isPending = res.status === 'pending';
            return (
              <View key={res.id} style={s.card}>
                {/* Top row */}
                <View style={s.cardTop}>
                  <View style={s.driverInfo}>
                    <View style={s.driverAvatar}>
                      <Text style={s.driverAvatarText}>{res.driver.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={s.driverName}>{res.driver}</Text>
                      <Text style={s.driverVehicle}>{res.vehicle}</Text>
                    </View>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[s.statusText, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={s.detailGrid}>
                  <DetailCell icon="calendar-outline" label="Fecha"    value={res.date} />
                  <DetailCell icon="time-outline"     label="Hora"     value={res.time} />
                  <DetailCell icon="flash-outline"    label="Conector" value={res.connector} />
                  <DetailCell icon="battery-charging-outline" label="Energía" value={`${res.kwh} kWh`} />
                </View>

                {/* Amount */}
                <View style={s.amountRow}>
                  <Text style={s.amountLabel}>Ingreso estimado</Text>
                  <Text style={s.amountValue}>
                    ${res.amount.toLocaleString('es-CO')}
                  </Text>
                </View>

                {/* Actions */}
                {isPending && (
                  <TouchableOpacity
                    onPress={() => handleConfirmArrival(res)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#00BAFF','#00FF8C']}
                      start={{x:0,y:0}} end={{x:1,y:0}}
                      style={s.matchBtn}
                    >
                      <Ionicons name="flash" size={16} color="#050A15" />
                      <Text style={s.matchBtnText}>Confirmar llegada</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
          {filtered.length === 0 && (
            <View style={s.emptyWrap}>
              <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
              <Text style={s.emptyText}>No hay reservas</Text>
            </View>
          )}
          <View style={{ height: insets.bottom + 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

function DetailCell({ icon, label, value }) {
  return (
    <View style={s.detailCell}>
      <View style={s.detailIcon}>
        <Ionicons name={icon} size={13} color={colors.cyan} />
      </View>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary },
  badge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 11, fontWeight: weights.bold, color: '#050A15' },

  filterScroll: { flexGrow: 0, marginBottom: 16 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8 },
  chip: {
    height: 32, borderRadius: 16, paddingHorizontal: 16,
    backgroundColor: 'rgba(13,22,38,0.92)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
  },
  chipActive: { height: 32, borderRadius: 16, paddingHorizontal: 16, justifyContent: 'center' },
  chipText: { fontSize: 12, fontWeight: weights.semibold, color: colors.textSecondary },
  chipTextActive: { fontSize: 12, fontWeight: weights.bold, color: '#050A15' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  scroll: { paddingHorizontal: 20, gap: 14 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'], padding: 16, gap: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,186,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  driverAvatarText: { fontSize: 16, fontWeight: weights.bold, color: colors.cyan },
  driverName: { fontSize: 15, fontWeight: weights.bold, color: colors.textPrimary },
  driverVehicle: { fontSize: 12, color: colors.textMuted },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: weights.semibold },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detailCell: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg, padding: 10, gap: 4,
  },
  detailIcon: {
    width: 24, height: 24, borderRadius: 7,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { fontSize: 10, color: colors.textMuted, fontWeight: weights.medium },
  detailValue: { fontSize: 13, fontWeight: weights.semibold, color: colors.textPrimary },

  amountRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(0,255,140,0.07)',
    borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(0,255,140,0.15)',
  },
  amountLabel: { fontSize: 13, color: colors.textSecondary },
  amountValue: { fontSize: 15, fontWeight: weights.bold, color: colors.green },

  matchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 44, borderRadius: 22,
  },
  matchBtnText: { fontSize: 14, fontWeight: weights.bold, color: '#050A15' },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: colors.textMuted },
});
