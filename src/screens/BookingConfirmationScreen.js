import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Linking, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, weights, radius } from '../styles/theme';
import { formatCOP } from '../utils/format';

const ESCROW_STEPS = [
  {
    icon:  'lock-closed-outline',
    label: 'Pago retenido',
    sub:   'Tus fondos quedan bloqueados de forma segura',
    color: colors.cyan,
  },
  {
    icon:  'flash-outline',
    label: 'Sesión activa',
    sub:   'Llegas y el anfitrión confirma tu llegada',
    color: '#FFD60A',
  },
  {
    icon:  'checkmark-circle-outline',
    label: 'Pago liberado',
    sub:   'Los fondos llegan al anfitrión, sesión completa',
    color: colors.green,
  },
];

export default function BookingConfirmationScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const route      = useRoute();
  const { reservation } = route.params;
  const { station } = reservation;

  const openNavigation = () => {
    const { latitude, longitude, name } = station;
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    const mapsUrl = Platform.OS === 'ios'
      ? `maps:?daddr=${latitude},${longitude}`
      : `https://maps.google.com/maps?daddr=${latitude},${longitude}`;
    Linking.canOpenURL(wazeUrl)
      .then((s) => Linking.openURL(s ? wazeUrl : mapsUrl))
      .catch(() => Linking.openURL(mapsUrl));
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Success orb */}
        <LinearGradient colors={['rgba(0,255,140,0.18)', 'rgba(0,186,255,0.12)']} style={s.orb}>
          <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.orbInner}>
            <Ionicons name="checkmark" size={44} color="#050A15" />
          </LinearGradient>
        </LinearGradient>

        <Text style={s.title}>¡Reserva confirmada!</Text>
        <Text style={s.sub}>Tu sesión de carga está asegurada.{'\n'}Te notificaremos cuando el anfitrión confirme.</Text>

        {/* Reservation ID */}
        <View style={s.resIdCard}>
          <Ionicons name="receipt-outline" size={16} color={colors.textMuted} />
          <Text style={s.resIdLabel}>Número de reserva</Text>
          <Text style={s.resId}>{reservation.id}</Text>
        </View>

        {/* Summary */}
        <View style={s.summaryCard}>
          <Text style={s.sectionLabel}>RESUMEN</Text>
          <DetailRow icon="flash-outline"           label="Estación"         value={station.name}             accent={colors.cyan}  />
          <DetailRow icon="location-outline"         label="Dirección"        value={station.address}                                 />
          <DetailRow icon="calendar-outline"         label="Fecha"            value={reservation.date}                                />
          <DetailRow icon="time-outline"             label="Hora y duración"  value={`${reservation.time} · ${reservation.duration}`} />
          <DetailRow icon="battery-charging-outline" label="Energía estimada" value={`${reservation.kwh} kWh`} accent={colors.green} />
          <DetailRow icon="wallet-outline"           label="Método de pago"   value={reservation.paymentLabel}                        />
          <View style={s.divider} />
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total en escrow</Text>
            <Text style={s.totalValue}>
              {reservation.cost === 0 ? 'Gratis' : formatCOP(reservation.cost)}
            </Text>
          </View>
        </View>

        {/* Escrow timeline */}
        <Text style={s.sectionLabel2}>¿QUÉ PASA CON MI PAGO?</Text>
        <View style={s.escrowCard}>
          {ESCROW_STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <View style={s.escrowStep}>
                <View style={[s.escrowIcon, { backgroundColor: step.color + '22', borderColor: step.color + '44' }]}>
                  <Ionicons name={step.icon} size={18} color={step.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.escrowLabel, { color: step.color }]}>{step.label}</Text>
                  <Text style={s.escrowSub}>{step.sub}</Text>
                </View>
              </View>
              {i < ESCROW_STEPS.length - 1 && (
                <View style={s.escrowLineWrap}>
                  <View style={s.escrowLine} />
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Access instructions */}
        {reservation.accessInfo ? (
          <View style={s.accessCard}>
            <Ionicons name="key-outline" size={16} color={colors.cyan} style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={s.accessTitle}>Instrucciones de acceso</Text>
              <Text style={s.accessText}>{reservation.accessInfo}</Text>
            </View>
          </View>
        ) : null}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={s.navBtn} onPress={openNavigation} activeOpacity={0.8}>
          <Ionicons name="navigate-outline" size={18} color={colors.cyan} />
          <Text style={s.navBtnText}>Cómo llegar · Waze / Google Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ConductorHome', { screen: 'Reservas' })}
          activeOpacity={0.85}
          style={s.reservasWrap}
        >
          <LinearGradient colors={['#00BAFF', '#00FF8C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.reservasGrad}>
            <Ionicons name="calendar-outline" size={18} color="#050A15" />
            <Text style={s.reservasText}>Ver mis reservas</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value, accent = colors.textSecondary }) {
  return (
    <View style={s.detailRow}>
      <View style={[s.detailIcon, { backgroundColor: accent + '20' }]}>
        <Ionicons name={icon} size={13} color={accent} />
      </View>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, alignItems: 'center' },

  orb: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 24, marginBottom: 20,
  },
  orbInner: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },

  title: { fontSize: 26, fontWeight: weights.bold, color: colors.textPrimary, textAlign: 'center' },
  sub: {
    fontSize: 14, color: colors.textSecondary, textAlign: 'center',
    marginTop: 6, marginBottom: 20, lineHeight: 21,
  },

  resIdCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 16, alignSelf: 'stretch',
  },
  resIdLabel: { flex: 1, fontSize: 13, color: colors.textMuted },
  resId: { fontSize: 14, fontWeight: weights.bold, color: colors.cyan },

  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius['2xl'], padding: 16, gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 16, alignSelf: 'stretch',
  },
  sectionLabel: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold, letterSpacing: 1, marginBottom: 2,
  },
  sectionLabel2: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold, letterSpacing: 1,
    marginBottom: 10, alignSelf: 'flex-start',
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  detailLabel: { flex: 1, fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: weights.semibold, color: colors.textPrimary, textAlign: 'right', maxWidth: '55%' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: colors.textSecondary },
  totalValue: { fontSize: 20, fontWeight: weights.bold, color: colors.green },

  escrowCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius['2xl'], padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16, alignSelf: 'stretch',
  },
  escrowStep: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  escrowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  escrowLabel: { fontSize: 14, fontWeight: weights.bold, marginBottom: 2 },
  escrowSub: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  escrowLineWrap: { paddingLeft: 20, paddingVertical: 4 },
  escrowLine: { width: 2, height: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 },

  accessCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,186,255,0.07)',
    borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
    marginBottom: 16, alignSelf: 'stretch',
  },
  accessTitle: { fontSize: 12, color: colors.cyan, fontWeight: weights.semibold, marginBottom: 4 },
  accessText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(0,186,255,0.1)',
    borderRadius: radius.xl, height: 50,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.25)',
  },
  navBtnText: { fontSize: 15, fontWeight: weights.semibold, color: colors.cyan },
  reservasWrap: { borderRadius: 27 },
  reservasGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 54, borderRadius: 27,
  },
  reservasText: { fontSize: 16, fontWeight: weights.bold, color: '#050A15' },
});
