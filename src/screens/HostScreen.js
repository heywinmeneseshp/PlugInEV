import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, Switch,
  TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { formatCOP } from '../utils/format';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function HostScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, hostStation, logout, switchRole } = useAuth();
  const station = hostStation;
  const [online, setOnline] = useState(station?.available ?? true);

  const stats = useMemo(() => {
    if (!station) return null;
    const p = station.pricePerKWh || 800;
    const chargesToday = 8;
    const chargesWeek  = 47;
    const kwhToday     = 124;
    const kwhWeek      = 680;
    return {
      chargesToday, chargesWeek,
      earningsToday: chargesToday * p * 2.5,
      earningsWeek:  chargesWeek  * p * 2.3,
      kwhToday, kwhWeek,
    };
  }, [station]);

  const barHeights = useMemo(() =>
    DAYS.map(() => Math.floor(Math.random() * 60 + 20)), []);

  /* ── Sin estación ── */
  if (!station) {
    return (
      <View style={[s.container, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={logout} style={s.headerBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Anfitrión</Text>
          <View style={s.headerBtn} />
        </View>
        <View style={s.emptyState}>
          <LinearGradient colors={['rgba(0,186,255,0.15)','rgba(0,255,140,0.15)']} style={s.emptyOrb}>
            <Ionicons name="flash-outline" size={40} color={colors.cyan} />
          </LinearGradient>
          <Text style={s.emptyTitle}>Sin estaciones</Text>
          <Text style={s.emptySub}>Registra tu primer punto de carga{'\n'}y empieza a recibir conductores</Text>
          <GradientButton
            label="Registrar estación"
            onPress={() => navigation.navigate('HostSetup')}
            icon={<Ionicons name="add-circle-outline" size={18} color="#050A15" />}
            style={{ width: width - 80, marginTop: 8 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => switchRole('conductor')} style={s.headerBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Dashboard</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('HostSetup')}>
            <Ionicons name="add-outline" size={20} color={colors.cyan} />
          </TouchableOpacity>
          <TouchableOpacity style={s.avatarBtn} onPress={() => navigation.navigate('HostConfig')}>
            <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.avatarGrad}>
              <Text style={s.avatarText}>{user?.nombre?.slice(0,2).toUpperCase() || 'HE'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Tarjeta estación ── */}
        <View style={s.stationCard}>
          <View style={s.stationTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.stationName}>{station.name}</Text>
              <Text style={s.stationAddr}>{station.address}</Text>
            </View>
            <View style={s.toggleWrap}>
              <Text style={[s.onlineLabel, online && s.onlineLabelActive]}>
                {online ? 'Activo' : 'Inactivo'}
              </Text>
              <Switch
                value={online}
                onValueChange={setOnline}
                trackColor={{ false: colors.trackBg, true: 'rgba(0,186,255,0.4)' }}
                thumbColor={online ? colors.cyan : colors.textMuted}
                ios_backgroundColor={colors.trackBg}
              />
            </View>
          </View>

          <View style={s.tagRow}>
            {[
              `${formatCOP(station.pricePerKWh)}/kWh`,
              station.power,
              ...(station.connectors || []),
            ].map((t, i) => (
              <View key={i} style={s.tag}>
                <Text style={s.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Indicador online */}
          {online && (
            <LinearGradient
              colors={['rgba(0,186,255,0.12)','rgba(0,255,140,0.12)']}
              start={{x:0,y:0}} end={{x:1,y:0}}
              style={s.onlineBanner}
            >
              <View style={s.onlineDot} />
              <Text style={s.onlineBannerText}>Tu estación está recibiendo reservas</Text>
            </LinearGradient>
          )}
        </View>

        {/* ── Stats hoy ── */}
        <Text style={s.sectionLabel}>HOY</Text>
        <View style={s.statsRow}>
          <StatCard
            icon="flash-outline"
            value={`${stats.chargesToday}`}
            label="Cargas"
            accent={colors.cyan}
          />
          <StatCard
            icon="trending-up-outline"
            value={formatCOP(stats.earningsToday)}
            label="Ganancias"
            accent={colors.green}
          />
          <StatCard
            icon="battery-charging-outline"
            value={`${stats.kwhToday} kWh`}
            label="Energía"
            accent="#00D4A0"
          />
        </View>

        {/* ── Stats semana ── */}
        <Text style={s.sectionLabel}>ESTA SEMANA</Text>
        <View style={s.statsRow}>
          <StatCard
            icon="calendar-outline"
            value={`${stats.chargesWeek}`}
            label="Cargas"
            accent={colors.cyan}
          />
          <StatCard
            icon="wallet-outline"
            value={formatCOP(stats.earningsWeek)}
            label="Ganancias"
            accent={colors.green}
          />
          <StatCard
            icon="leaf-outline"
            value={`${stats.kwhWeek} kWh`}
            label="Energía"
            accent="#00D4A0"
          />
        </View>

        {/* ── Gráfica barras ── */}
        <Text style={s.sectionLabel}>ACTIVIDAD</Text>
        <View style={s.chartCard}>
          <View style={s.barsWrap}>
            {DAYS.map((day, i) => {
              const isToday = i === 3;
              return (
                <View key={day} style={s.barCol}>
                  <Text style={s.barCount}>{barHeights[i] > 50 ? Math.floor(barHeights[i]/8) : ''}</Text>
                  {isToday ? (
                    <LinearGradient
                      colors={['#00BAFF','#00FF8C']}
                      style={[s.bar, { height: barHeights[i] }]}
                    />
                  ) : (
                    <View style={[s.bar, s.barInactive, { height: barHeights[i] }]} />
                  )}
                  <Text style={[s.barLabel, isToday && s.barLabelActive]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Configuración ── */}
        <Text style={s.sectionLabel}>CONFIGURACIÓN</Text>
        <View style={s.glassCard}>
          {[
            { icon: 'cash-outline',       label: 'Precio',          value: `${formatCOP(station.pricePerKWh)}/kWh` },
            { icon: 'speedometer-outline',label: 'Potencia',         value: station.power },
            { icon: 'card-outline',        label: 'Método de cobro', value: station.paymentMethod || 'Nequi' },
            { icon: 'flash-outline',       label: 'Conectores',      value: station.connectors?.join(', ') || '-' },
          ].map(({ icon, label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View style={s.configRow}>
                <View style={s.configLeft}>
                  <View style={s.configIconPill}>
                    <Ionicons name={icon} size={14} color={colors.cyan} />
                  </View>
                  <Text style={s.configLabel}>{label}</Text>
                </View>
                <Text style={s.configValue}>{value}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={s.footer}>
          Las ganancias se liquidan semanalmente a tu cuenta registrada
        </Text>

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, value, label, accent }) {
  return (
    <View style={[s.statCard, { borderColor: accent + '30' }]}>
      <View style={[s.statIcon, { backgroundColor: accent + '18' }]}>
        <Ionicons name={icon} size={16} color={accent} />
      </View>
      <Text style={[s.statValue, { color: accent }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(0,186,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBtn: { width: 40, height: 40 },
  avatarGrad: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: weights.bold, color: '#050A15' },

  scroll: { paddingHorizontal: 20 },

  /* Station card */
  stationCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'],
    padding: 18, marginBottom: 24, gap: 12,
  },
  stationTop: { flexDirection: 'row', alignItems: 'center' },
  stationName: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 3 },
  stationAddr: { fontSize: 12, color: colors.textMuted },
  toggleWrap: { alignItems: 'center', gap: 4 },
  onlineLabel: { fontSize: 11, fontWeight: weights.semibold, color: colors.textMuted },
  onlineLabelActive: { color: colors.cyan },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  tagText: { fontSize: 11, color: colors.textSecondary, fontWeight: weights.medium },
  onlineBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: radius.lg, paddingHorizontal: 12, paddingVertical: 8,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.green },
  onlineBannerText: { fontSize: 12, color: colors.green, fontWeight: weights.medium },

  /* Section label */
  sectionLabel: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold,
    letterSpacing: 1, marginBottom: 10, marginLeft: 2,
  },

  /* Stat cards */
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderRadius: radius.xl,
    paddingVertical: 14,
  },
  statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 13, fontWeight: weights.bold },
  statLabel: { fontSize: 10, color: colors.textMuted, fontWeight: weights.medium },

  /* Bar chart */
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius['2xl'],
    padding: 16, marginBottom: 24,
  },
  barsWrap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 },
  barCol: { alignItems: 'center', gap: 4, flex: 1 },
  bar: { width: 10, borderRadius: 5 },
  barInactive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  barCount: { fontSize: 8, color: colors.textMuted, height: 12 },
  barLabel: { fontSize: 9, color: colors.textMuted },
  barLabelActive: { color: colors.cyan, fontWeight: weights.bold },

  /* Config */
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'], marginBottom: 20, overflow: 'hidden',
  },
  configRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  configLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  configIconPill: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  configLabel: { fontSize: 14, color: colors.textSecondary },
  configValue: { fontSize: 13, fontWeight: weights.medium, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: 16 },

  footer: {
    fontSize: 11, color: colors.textMuted, textAlign: 'center',
    lineHeight: 16, marginBottom: 8,
  },

  /* Empty state */
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyOrb: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary },
  emptySub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
});
