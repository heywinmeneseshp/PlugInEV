import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';
import { formatCOP } from '../utils/format';

const DATES = [
  { key: 'today',    label: 'Hoy',    sub: '25 Jun' },
  { key: 'tomorrow', label: 'Mañana', sub: '26 Jun' },
  { key: 'day3',     label: 'Pasado', sub: '27 Jun' },
];

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00',
];

const DURATIONS = [
  { key: '30min', label: '30 min',  hours: 0.5 },
  { key: '1h',    label: '1 hora',  hours: 1   },
  { key: '1.5h',  label: '1.5 h',   hours: 1.5 },
  { key: '2h',    label: '2 horas', hours: 2   },
  { key: '3h',    label: '3 horas', hours: 3   },
];

const PAYMENT_METHODS = [
  { id: 'nequi',       label: 'Nequi',           icon: 'phone-portrait-outline', sub: '300 123 4567' },
  { id: 'bancolombia', label: 'Bancolombia',      icon: 'business-outline',       sub: 'Ahorros ••• 4892' },
  { id: 'wallet',      label: 'Cartera PlugInEV', icon: 'wallet-outline',         sub: 'Saldo: $25.000' },
];

const STEPS = ['Fecha y hora', 'Duración', 'Pago'];

export default function BookingScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const route      = useRoute();
  const { station } = route.params;

  const [step, setStep]                 = useState(0);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDur, setSelectedDur]   = useState('');
  const [selectedPay, setSelectedPay]   = useState('wallet');

  const powerKW = parseFloat(station.power) || 22;
  const isFree  = station.pricePerKWh === 0;

  const calcCost = (durKey) => {
    const dur = DURATIONS.find((d) => d.key === (durKey ?? selectedDur));
    if (!dur) return { kwh: 0, cost: 0 };
    const kwh  = Math.round(powerKW * dur.hours);
    const cost = isFree ? 0 : Math.round(kwh * station.pricePerKWh);
    return { kwh, cost };
  };

  const canNext = () => {
    if (step === 0) return !!(selectedDate && selectedTime);
    if (step === 1) return !!selectedDur;
    if (step === 2) return !!selectedPay;
    return false;
  };

  const handleNext = () => {
    if (!canNext()) {
      Alert.alert('Campos requeridos', 'Selecciona todas las opciones antes de continuar.');
      return;
    }
    if (step < STEPS.length - 1) { setStep(step + 1); return; }

    const dur = DURATIONS.find((d) => d.key === selectedDur);
    const { kwh, cost } = calcCost();
    const dateLabel = DATES.find((d) => d.key === selectedDate)?.sub ?? '';
    navigation.navigate('BookingConfirmation', {
      reservation: {
        id:           `RES-${Math.floor(10000 + Math.random() * 90000)}`,
        station,
        date:         dateLabel,
        time:         selectedTime,
        duration:     dur?.label ?? '',
        kwh,
        cost,
        paymentLabel: PAYMENT_METHODS.find((p) => p.id === selectedPay)?.label ?? selectedPay,
        accessInfo:   station.accessInfo,
      },
    });
  };

  const { kwh, cost } = calcCost();

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Reservar</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Station mini banner */}
      <View style={s.stationMini}>
        <View style={s.stationMiniIcon}>
          <Ionicons name="flash" size={16} color={colors.cyan} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.stationMiniName} numberOfLines={1}>{station.name}</Text>
          <Text style={s.stationMiniAddr} numberOfLines={1}>{station.address}</Text>
        </View>
        <Text style={s.stationMiniPrice}>
          {isFree ? 'Gratis' : `${formatCOP(station.pricePerKWh)}/kWh`}
        </Text>
      </View>

      {/* Stepper */}
      <View style={s.stepper}>
        {STEPS.map((label, i) => {
          const done   = i < step;
          const active = i === step;
          return (
            <React.Fragment key={label}>
              <View style={s.stepItem}>
                {done ? (
                  <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.stepCircle}>
                    <Ionicons name="checkmark" size={14} color="#050A15" />
                  </LinearGradient>
                ) : active ? (
                  <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.stepCircle}>
                    <Text style={s.stepNum}>{i + 1}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[s.stepCircle, s.stepCircleInactive]}>
                    <Text style={s.stepNumInactive}>{i + 1}</Text>
                  </View>
                )}
                <Text style={[s.stepLabel, active && s.stepLabelActive]}>{label}</Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[s.stepLine, done && s.stepLineActive]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* ── Paso 0: Fecha y hora ── */}
        {step === 0 && (
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>¿Cuándo quieres cargar?</Text>
            <Text style={s.stepSub}>Selecciona el día y la hora de llegada a la estación.</Text>

            <Text style={s.fieldLabel}>Día</Text>
            <View style={s.dateRow}>
              {DATES.map((d) => {
                const active = selectedDate === d.key;
                return active ? (
                  <TouchableOpacity key={d.key} onPress={() => setSelectedDate(d.key)} activeOpacity={0.8} style={{ flex: 1 }}>
                    <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.dateChipActive}>
                      <Text style={s.dateChipLabelActive}>{d.label}</Text>
                      <Text style={s.dateChipSubActive}>{d.sub}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity key={d.key} style={[s.dateChip, { flex: 1 }]} onPress={() => setSelectedDate(d.key)} activeOpacity={0.75}>
                    <Text style={s.dateChipLabel}>{d.label}</Text>
                    <Text style={s.dateChipSub}>{d.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.fieldLabel}>Hora de llegada</Text>
            <View style={s.timeGrid}>
              {TIME_SLOTS.map((t) => {
                const active = selectedTime === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[s.timeSlot, active && { borderWidth: 0 }]}
                    onPress={() => setSelectedTime(t)}
                    activeOpacity={0.8}
                  >
                    {active ? (
                      <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.timeSlotGrad}>
                        <Text style={s.timeSlotTextActive}>{t}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={s.timeSlotText}>{t}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Paso 1: Duración ── */}
        {step === 1 && (
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>¿Cuánto tiempo necesitas?</Text>
            <Text style={s.stepSub}>Costo estimado según la potencia de la estación ({station.power}).</Text>

            {DURATIONS.map((d) => {
              const { kwh: estKwh, cost: estCost } = calcCost(d.key);
              const active = selectedDur === d.key;
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[s.durationCard, active && s.durationCardActive]}
                  onPress={() => setSelectedDur(d.key)}
                  activeOpacity={0.8}
                >
                  <View style={[s.durationIcon, active && s.durationIconActive]}>
                    <Ionicons name="time-outline" size={18} color={active ? '#050A15' : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.durationLabel, active && s.durationLabelActive]}>{d.label}</Text>
                    <Text style={s.durationEst}>~{estKwh} kWh estimados</Text>
                  </View>
                  <Text style={[s.durationCost, { color: isFree ? colors.green : (active ? colors.cyan : colors.textPrimary) }]}>
                    {isFree ? 'Gratis' : formatCOP(estCost)}
                  </Text>
                  {active && (
                    <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.durationCheck}>
                      <Ionicons name="checkmark" size={12} color="#050A15" />
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Paso 2: Pago ── */}
        {step === 2 && (
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>Método de pago</Text>
            <Text style={s.stepSub}>El pago queda en escrow hasta confirmar la sesión.</Text>

            {/* Summary card */}
            <LinearGradient colors={['rgba(0,186,255,0.12)', 'rgba(0,255,140,0.08)']} style={s.summaryCard}>
              <SummaryRow icon="flash-outline"    label="Energía estimada" value={`${kwh} kWh`} />
              <SummaryRow icon="time-outline"     label="Duración"         value={DURATIONS.find((d) => d.key === selectedDur)?.label ?? ''} />
              <SummaryRow icon="calendar-outline" label="Fecha y hora"     value={`${DATES.find((d) => d.key === selectedDate)?.sub} · ${selectedTime}`} />
              <View style={s.summaryDivider} />
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Total en escrow</Text>
                <Text style={s.totalValue}>{isFree ? 'Gratis' : formatCOP(cost)}</Text>
              </View>
            </LinearGradient>

            {/* Payment options */}
            {PAYMENT_METHODS.map((pm) => {
              const active = selectedPay === pm.id;
              return (
                <TouchableOpacity
                  key={pm.id}
                  style={[s.payCard, active && s.payCardActive]}
                  onPress={() => setSelectedPay(pm.id)}
                  activeOpacity={0.8}
                >
                  <View style={[s.payIcon, active && s.payIconActive]}>
                    <Ionicons name={pm.icon} size={20} color={active ? '#050A15' : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.payLabel, active && s.payLabelActive]}>{pm.label}</Text>
                    <Text style={s.paySub}>{pm.sub}</Text>
                  </View>
                  {active && (
                    <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.payCheck}>
                      <Ionicons name="checkmark" size={12} color="#050A15" />
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Escrow explanation */}
            <View style={s.escrowBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.cyan} />
              <Text style={s.escrowText}>
                Tu pago queda retenido en escrow hasta que confirmes que la sesión fue exitosa. Si el anfitrión no confirma tu llegada en 2 horas, recibes el reembolso automático.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GradientButton
          label={step < STEPS.length - 1 ? 'Siguiente' : 'Confirmar y pagar'}
          onPress={handleNext}
          disabled={!canNext()}
          icon={
            <Ionicons
              name={step < STEPS.length - 1 ? 'arrow-forward' : 'lock-closed'}
              size={18}
              color={canNext() ? '#050A15' : colors.textMuted}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <View style={s.summaryRow}>
      <View style={s.summaryIcon}>
        <Ionicons name={icon} size={13} color={colors.cyan} />
      </View>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={s.summaryValue}>{value}</Text>
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

  stationMini: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 10,
  },
  stationMiniIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  stationMiniName: { fontSize: 14, fontWeight: weights.bold, color: colors.textPrimary },
  stationMiniAddr: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  stationMiniPrice: { fontSize: 13, fontWeight: weights.bold, color: colors.cyan },

  stepper: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, marginBottom: 24,
  },
  stepItem: { alignItems: 'center', gap: 6 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepCircleInactive: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  stepNum: { fontSize: 13, fontWeight: weights.bold, color: '#050A15' },
  stepNumInactive: { fontSize: 13, fontWeight: weights.bold, color: colors.textMuted },
  stepLabel: { fontSize: 10, color: colors.textMuted, fontWeight: weights.medium },
  stepLabelActive: { color: colors.cyan },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 6, marginBottom: 18 },
  stepLineActive: { backgroundColor: colors.green },

  scroll: { paddingHorizontal: 20 },
  stepContent: { gap: 16 },
  stepTitle: { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary },
  stepSub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: -8 },
  fieldLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium, marginBottom: -6 },

  /* Date chips */
  dateRow: { flexDirection: 'row', gap: 8 },
  dateChip: {
    height: 58, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  dateChipActive: { height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dateChipLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: weights.semibold },
  dateChipLabelActive: { fontSize: 14, color: '#050A15', fontWeight: weights.bold },
  dateChipSub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  dateChipSubActive: { fontSize: 10, color: 'rgba(5,10,21,0.65)', marginTop: 2 },

  /* Time grid */
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeSlot: {
    width: '21%',
    borderRadius: 12, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
  },
  timeSlotGrad: { paddingVertical: 10, alignItems: 'center' },
  timeSlotText: { fontSize: 12, color: colors.textSecondary, fontWeight: weights.medium, textAlign: 'center', paddingVertical: 10 },
  timeSlotTextActive: { fontSize: 12, color: '#050A15', fontWeight: weights.bold },

  /* Duration cards */
  durationCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl, paddingHorizontal: 16, paddingVertical: 14,
  },
  durationCardActive: { borderColor: 'rgba(0,186,255,0.4)', backgroundColor: 'rgba(0,186,255,0.07)' },
  durationIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  durationIconActive: { backgroundColor: colors.cyan },
  durationLabel: { fontSize: 15, color: colors.textSecondary, fontWeight: weights.semibold },
  durationLabelActive: { color: colors.textPrimary },
  durationEst: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  durationCost: { fontSize: 15, fontWeight: weights.bold },
  durationCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  /* Summary */
  summaryCard: {
    borderRadius: radius['2xl'], padding: 16, gap: 10,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIcon: {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  summaryLabel: { flex: 1, fontSize: 13, color: colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: weights.semibold, color: colors.textPrimary },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: colors.textSecondary },
  totalValue: { fontSize: 22, fontWeight: weights.bold, color: colors.green },

  /* Payment */
  payCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl, paddingHorizontal: 16, paddingVertical: 14,
  },
  payCardActive: { borderColor: 'rgba(0,186,255,0.4)', backgroundColor: 'rgba(0,186,255,0.07)' },
  payIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  payIconActive: { backgroundColor: colors.cyan },
  payLabel: { fontSize: 15, color: colors.textSecondary, fontWeight: weights.semibold },
  payLabelActive: { color: colors.textPrimary },
  paySub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  payCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  escrowBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,186,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
    borderRadius: radius.lg, padding: 14,
  },
  escrowText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  footer: { paddingHorizontal: 20, paddingTop: 12 },
});
