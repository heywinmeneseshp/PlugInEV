import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function HostMatchScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const route      = useRoute();
  const res        = route.params?.reservation;

  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => setConfirmed(true);
  const handleFinish  = () => navigation.navigate('AnfitrionHome', { screen: 'HostReservas' });

  if (!res) return null;

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Confirmar llegada</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.body}>

        {confirmed ? (
          /* ── Estado: Confirmado ── */
          <>
            <LinearGradient colors={['rgba(0,255,140,0.15)','rgba(0,186,255,0.15)']} style={s.successOrb}>
              <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.successCircle}>
                <Ionicons name="checkmark" size={44} color="#050A15" />
              </LinearGradient>
            </LinearGradient>

            <Text style={s.successTitle}>¡Match confirmado!</Text>
            <Text style={s.successSub}>
              La sesión de carga ha comenzado.{'\n'}
              El pago quedará en escrow hasta finalizar.
            </Text>

            <View style={s.sessionCard}>
              <SessionRow icon="flash-outline"    label="Conductor"  value={res.driver} accent={colors.cyan} />
              <SessionRow icon="car-outline"      label="Vehículo"   value={res.vehicle} />
              <SessionRow icon="time-outline"     label="Inicio"     value={res.time} />
              <SessionRow icon="battery-charging-outline" label="Energía estimada" value={`${res.kwh} kWh`} accent={colors.green} />
            </View>

            <TouchableOpacity style={s.finishBtn} onPress={handleFinish} activeOpacity={0.8}>
              <LinearGradient colors={['#00BAFF','#00FF8C']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.finishGrad}>
                <Text style={s.finishText}>Ver mis reservas</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          /* ── Estado: Pendiente de confirmar ── */
          <>
            {/* Avatar del conductor */}
            <View style={s.driverSection}>
              <LinearGradient colors={['rgba(0,186,255,0.2)','rgba(0,255,140,0.2)']} style={s.driverHalo}>
                <View style={s.driverAvatar}>
                  <Text style={s.driverAvatarText}>{res.driver.charAt(0)}</Text>
                </View>
              </LinearGradient>
              <Text style={s.driverName}>{res.driver}</Text>
              <Text style={s.driverVehicle}>{res.vehicle}</Text>
              <View style={s.onWayBadge}>
                <View style={s.onWayDot} />
                <Text style={s.onWayText}>En camino a tu estación</Text>
              </View>
            </View>

            {/* Detalles de la reserva */}
            <View style={s.detailCard}>
              <Text style={s.detailCardTitle}>Detalles de la reserva</Text>
              <DetailRow icon="calendar-outline" label="Fecha y hora"   value={`${res.date} · ${res.time}`} />
              <DetailRow icon="time-outline"     label="Duración"       value={res.duration} />
              <DetailRow icon="flash-outline"    label="Conector"       value={res.connector} />
              <DetailRow icon="battery-charging-outline" label="Energía" value={`${res.kwh} kWh`} />
              <View style={s.divider} />
              <View style={s.amountRow}>
                <Text style={s.amountLabel}>Ingreso en escrow</Text>
                <Text style={s.amountValue}>${res.amount.toLocaleString('es-CO')}</Text>
              </View>
            </View>

            {/* Instrucción */}
            <View style={s.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color={colors.cyan} />
              <Text style={s.infoText}>
                Cuando el conductor llegue y conecte su vehículo, presiona "Confirmar llegada" para iniciar la sesión y liberar el escrow.
              </Text>
            </View>

            {/* CTA */}
            <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85} style={s.confirmWrap}>
              <LinearGradient colors={['#00BAFF','#00FF8C']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.confirmBtn}>
                <Ionicons name="flash" size={22} color="#050A15" />
                <Text style={s.confirmText}>Confirmar llegada</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={s.cancelText}>Cancelar reserva</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={s.detailRow}>
      <View style={s.detailIcon}>
        <Ionicons name={icon} size={13} color={colors.cyan} />
      </View>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value}</Text>
    </View>
  );
}

function SessionRow({ icon, label, value, accent = colors.textSecondary }) {
  return (
    <View style={s.detailRow}>
      <View style={[s.detailIcon, { backgroundColor: accent + '20' }]}>
        <Ionicons name={icon} size={13} color={accent} />
      </View>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={[s.detailValue, { color: accent }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },

  body: { flex: 1, paddingHorizontal: 24, paddingTop: 8, gap: 20 },

  /* Driver section */
  driverSection: { alignItems: 'center', gap: 8 },
  driverHalo: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  driverAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#0D1A2D',
    alignItems: 'center', justifyContent: 'center',
  },
  driverAvatarText: { fontSize: 32, fontWeight: weights.bold, color: colors.cyan },
  driverName:    { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary },
  driverVehicle: { fontSize: 14, color: colors.textMuted },
  onWayBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(0,186,255,0.1)',
    borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.25)',
  },
  onWayDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.cyan },
  onWayText: { fontSize: 12, color: colors.cyan, fontWeight: weights.medium },

  /* Detail card */
  detailCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'], padding: 16, gap: 10,
  },
  detailCardTitle: { fontSize: 13, fontWeight: weights.semibold, color: colors.textMuted, marginBottom: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { flex: 1, fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: weights.semibold, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontSize: 14, color: colors.textSecondary },
  amountValue: { fontSize: 16, fontWeight: weights.bold, color: colors.green },

  /* Info box */
  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,186,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
    borderRadius: radius.lg, padding: 14,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  /* Confirm CTA */
  confirmWrap: { borderRadius: 30 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 58, borderRadius: 29,
  },
  confirmText: { fontSize: 17, fontWeight: weights.bold, color: '#050A15' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontSize: 14, color: colors.red, fontWeight: weights.medium },

  /* Success state */
  successOrb: {
    width: 160, height: 160, borderRadius: 80,
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
  },
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 24, fontWeight: weights.bold, color: colors.textPrimary, textAlign: 'center' },
  successSub:   { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  sessionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'], padding: 16, gap: 12,
  },
  finishBtn: { borderRadius: 27 },
  finishGrad: {
    height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
  },
  finishText: { fontSize: 16, fontWeight: weights.bold, color: '#050A15' },
});
