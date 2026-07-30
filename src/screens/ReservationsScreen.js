import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import RatingModal from '../components/RatingModal';
import { formatCOP } from '../utils/format';
import { colors, weights, radius } from '../styles/theme';
import { listarReservas, calificarReserva } from '../services/api/reservas';

const TABS = ['Activas', 'Historial'];

const MOCK_RESERVATIONS = [
  {
    id: '1',
    stationName: 'ElectroCarga Norte',
    address:     'Cra. 65 #80-120, Barranquilla',
    date:  'Hoy',   time: '14:00', duration: '1h',
    cost:  20625,   connector: 'CCS', kwh: 25,
    status: 'active',
  },
  {
    id: '2',
    stationName: 'VoltStation El Prado',
    address:     'Cra. 54 #70-30, El Prado',
    date:  'Hoy',   time: '16:30', duration: '2h',
    cost:  16200,   connector: 'Type 2', kwh: 24,
    status: 'completed',
  },
  {
    id: '3',
    stationName: 'E-Charge Buenavista',
    address:     'Cra. 51B #88-22, Buenavista',
    date:  'Ayer',  time: '10:00', duration: '1h',
    cost:  32400,   connector: 'CHAdeMO', kwh: 30,
    status: 'completed',
  },
  {
    id: '4',
    stationName: 'PlugExpress Sur',
    address:     'Av. Murillo #55-200, Barranquilla',
    date:  '23/06', time: '08:00', duration: '3h',
    cost:  43200,   connector: 'CCS', kwh: 36,
    status: 'cancelled',
  },
];

const STATUS = {
  active:    { label: 'Activa',      color: colors.cyan,  bg: 'rgba(0,186,255,0.12)'  },
  completed: { label: 'Completada',  color: colors.green, bg: 'rgba(0,255,140,0.12)' },
  cancelled: { label: 'Cancelada',   color: colors.red,   bg: 'rgba(255,59,48,0.12)' },
};

export default function ReservationsScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();

  const [activeTab, setActiveTab]     = useState('Activas');
  const [ratingRes, setRatingRes]     = useState(null);
  const [rated, setRated]             = useState({});
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    listarReservas()
      .then(data => {
        const mapped = (Array.isArray(data) ? data : []).map(r => ({
          id: r._id || r.id,
          stationName: r.station_name || r.station?.name || 'Estación',
          address: r.station_address || r.station?.address || '',
          date: new Date(r.start_time || r.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }),
          time: new Date(r.start_time || r.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          duration: r.duration_minutes ? `${r.duration_minutes}min` : '—',
          cost: r.cost || 0,
          connector: r.connector_type || 'CCS',
          kwh: r.kwh_delivered || 0,
          status: r.status === 'active' ? 'active' : r.status === 'completed' ? 'completed' : r.status === 'cancelled' ? 'cancelled' : 'completed',
          reservationId: r._id || r.id,
          station: r.station,
        }));
        setAllReservations(mapped);
      })
      .catch(() => setAllReservations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'Activas'
    ? allReservations.filter((r) => r.status === 'active')
    : allReservations.filter((r) => r.status !== 'active');

  const handleRate = (res) => setRatingRes(res);

  const handleSubmitRating = ({ rating, comment }) => {
    setRated((prev) => ({ ...prev, [ratingRes.id]: rating }));
    if (ratingRes?.id || ratingRes?.reservationId) {
      calificarReserva(ratingRes.id || ratingRes.reservationId, rating).catch(() => {});
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Reservas</Text>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return active ? (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} activeOpacity={0.8} style={{ flex: 1 }}>
              <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.tabActive}>
                <Text style={s.tabTextActive}>{tab}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab} style={s.tab} onPress={() => setActiveTab(tab)} activeOpacity={0.75}>
              <Text style={s.tabText}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator color="#00BAFF" style={{ marginTop: 40 }} />
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {!loading && filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="calendar-outline" size={42} color={colors.textMuted} style={{ marginBottom: 12 }} />
            <Text style={s.emptyTitle}>{activeTab === 'Activas' ? 'Sin reservas activas' : 'Sin historial'}</Text>
            <Text style={s.emptyText}>
              {activeTab === 'Activas'
                ? 'Busca una estación en el mapa y haz tu primera reserva.'
                : 'Tus sesiones completadas aparecerán aquí.'}
            </Text>
          </View>
        ) : filtered.map((item) => {
          const st = STATUS[item.status];
          const isActive    = item.status === 'active';
          const isCompleted = item.status === 'completed';
          const alreadyRated = !!rated[item.id];

          return (
            <View key={item.id} style={s.card}>
              {/* Card header */}
              <View style={s.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.stationName} numberOfLines={1}>{item.stationName}</Text>
                  <Text style={s.address} numberOfLines={1}>{item.address}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[s.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>

              {/* Meta grid */}
              <View style={s.metaGrid}>
                <MetaCell icon="calendar-outline" label="Fecha"    value={item.date}      />
                <MetaCell icon="time-outline"     label="Hora"     value={item.time}      />
                <MetaCell icon="flash-outline"    label="Conector" value={item.connector} />
                <MetaCell icon="battery-charging-outline" label="Energía" value={`${item.kwh} kWh`} />
              </View>

              {/* Amount row */}
              <View style={[s.amountRow, { backgroundColor: isActive ? 'rgba(0,186,255,0.07)' : 'rgba(255,255,255,0.04)' }]}>
                <Text style={s.amountLabel}>
                  {isActive ? 'En escrow' : item.status === 'cancelled' ? 'Reembolsado' : 'Total pagado'}
                </Text>
                <Text style={[s.amountValue, { color: isActive ? colors.cyan : item.status === 'cancelled' ? colors.red : colors.green }]}>
                  {formatCOP(item.cost)}
                </Text>
              </View>

              {/* CTAs */}
              {isActive && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChargingSession', {
                    station: { name: item.stationName, address: item.address },
                    reservationId: item.id,
                  })}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#00BAFF', '#00FF8C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaBtn}>
                    <Ionicons name="flash" size={16} color="#050A15" />
                    <Text style={s.ctaBtnText}>Iniciar sesión</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {isCompleted && !alreadyRated && (
                <TouchableOpacity style={s.rateBtn} onPress={() => handleRate(item)} activeOpacity={0.8}>
                  <Ionicons name="star-outline" size={15} color="#FFD60A" />
                  <Text style={s.rateBtnText}>Calificar experiencia</Text>
                </TouchableOpacity>
              )}

              {isCompleted && alreadyRated && (
                <View style={s.ratedRow}>
                  <Ionicons name="checkmark-circle" size={15} color={colors.green} />
                  <Text style={s.ratedText}>Calificado con {rated[item.id]} estrella{rated[item.id] !== 1 ? 's' : ''}</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>

      <RatingModal
        visible={!!ratingRes}
        stationName={ratingRes?.stationName}
        onClose={() => setRatingRes(null)}
        onSubmit={handleSubmitRating}
      />
    </View>
  );
}

function MetaCell({ icon, label, value }) {
  return (
    <View style={s.metaCell}>
      <View style={s.metaIcon}>
        <Ionicons name={icon} size={12} color={colors.cyan} />
      </View>
      <Text style={s.metaLabel}>{label}</Text>
      <Text style={s.metaValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: weights.extrabold, color: colors.textPrimary },

  tabRow: {
    flexDirection: 'row', gap: 8,
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.xl, padding: 4,
  },
  tab: {
    flex: 1, height: 38, borderRadius: radius.lg - 4,
    alignItems: 'center', justifyContent: 'center',
  },
  tabActive: {
    flex: 1, height: 38, borderRadius: radius.lg - 4,
    alignItems: 'center', justifyContent: 'center',
  },
  tabText:       { fontSize: 14, fontWeight: weights.semibold, color: colors.textMuted },
  tabTextActive: { fontSize: 14, fontWeight: weights.bold, color: '#050A15' },

  scroll: { paddingHorizontal: 20, gap: 12 },

  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 8 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'], padding: 16, gap: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stationName: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 2 },
  address: { fontSize: 12, color: colors.textMuted },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, marginTop: 2, flexShrink: 0 },
  statusText: { fontSize: 11, fontWeight: weights.semibold },

  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaCell: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md, padding: 10, gap: 3,
  },
  metaIcon: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  metaLabel: { fontSize: 10, color: colors.textMuted, fontWeight: weights.medium },
  metaValue: { fontSize: 13, fontWeight: weights.semibold, color: colors.textPrimary },

  amountRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  amountLabel: { fontSize: 13, color: colors.textSecondary },
  amountValue: { fontSize: 15, fontWeight: weights.bold },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 44, borderRadius: 22,
  },
  ctaBtnText: { fontSize: 14, fontWeight: weights.bold, color: '#050A15' },

  rateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,214,10,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,214,10,0.2)',
  },
  rateBtnText: { fontSize: 13, fontWeight: weights.semibold, color: '#FFD60A' },

  ratedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8,
  },
  ratedText: { fontSize: 13, color: colors.green, fontWeight: weights.medium },
});
