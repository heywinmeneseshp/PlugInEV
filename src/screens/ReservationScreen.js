import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';
import { formatCOP } from '../utils/format';

const { width } = Dimensions.get('window');

const VEHICLE_CAPACITY_KWH = 75; // Tesla Model 3
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

function BatterySlider({ value, onChange, color, label }) {
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <View style={s.sliderWrap}>
      <View style={s.sliderHeader}>
        <Text style={s.sliderLabel}>{label}</Text>
        <Text style={[s.sliderValue, { color }]}>{value}%</Text>
      </View>
      {/* Track */}
      <View style={s.sliderTrack}>
        <View style={[s.sliderFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      {/* Step buttons */}
      <View style={s.sliderSteps}>
        {steps.map((step) => (
          <TouchableOpacity
            key={step}
            style={[s.stepBtn, value === step && { backgroundColor: color }]}
            onPress={() => onChange(step)}
          >
            <Text style={[s.stepText, value === step && { color: '#050A15' }]}>
              {step}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function ReservationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { station } = route.params;
  const { user, updateWallet } = useAuth();

  const walletBalance = user?.walletBalance || 25000;
  const [selectedHour, setSelectedHour] = useState(null);
  const [batteryNow, setBatteryNow] = useState(25);
  const [batteryTarget, setBatteryTarget] = useState(80);

  const math = useMemo(() => {
    const needed = Math.max(0, batteryTarget - batteryNow);
    const energyKWh = (needed / 100) * VEHICLE_CAPACITY_KWH;
    const powerKW = parseFloat(station.power) || 50;
    const timeHours = energyKWh / powerKW;
    const timeMin = Math.round(timeHours * 60);
    const totalCost = energyKWh * station.pricePerKWh;
    const canAfford = station.pricePerKWh === 0 || walletBalance >= totalCost;
    return { energyKWh, timeMin, totalCost, canAfford };
  }, [batteryNow, batteryTarget, station, walletBalance]);

  const handleConfirm = () => {
    if (!selectedHour) {
      Alert.alert('Selecciona un horario', 'Elige una hora para tu reserva');
      return;
    }
    if (!math.canAfford) {
      Alert.alert('Saldo insuficiente', `Tu saldo: ${formatCOP(walletBalance)}\nCosto estimado: ${formatCOP(math.totalCost)}`);
      return;
    }
    Alert.alert(
      '¿Confirmar turno?',
      `${station.name}\nHoy ${selectedHour}\n\nEnergía estimada: ${math.energyKWh.toFixed(1)} kWh\nTiempo estimado: ${math.timeMin} min\nCosto total: ${station.pricePerKWh === 0 ? 'Gratis' : formatCOP(math.totalCost)}`,
      [
        { text: 'Rechazar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => navigation.navigate('ChargingSession', { station, reservationId: 'res-' + Date.now() }),
        },
      ]
    );
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Motor Matemático</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Station card */}
        <View style={s.stationCard}>
          <View style={s.stationCardLeft}>
            <View style={s.stationCardAvatar}>
              <Text style={s.stationCardEmoji}>⚡</Text>
            </View>
            <View style={s.stationCardInfo}>
              <Text style={s.stationName}>{station.name}</Text>
              <View style={s.ratingRow}>
                <Text style={s.ratingText}>⭐ {station.rating}</Text>
                <Text style={s.ratingCount}>(122)</Text>
                <Text style={s.verifiedText}>✓ Anfitrión verificado</Text>
              </View>
              <View style={s.connectorRow}>
                {station.connectors?.map((c, i) => (
                  <View key={i} style={s.connectorTag}>
                    <Text style={s.connectorTagText}>{c}</Text>
                  </View>
                ))}
                <Text style={s.powerText}>{station.power}</Text>
              </View>
            </View>
          </View>
          <Text style={s.stationPrice}>
            {station.pricePerKWh === 0 ? 'Gratis' : `${formatCOP(station.pricePerKWh)}/kWh`}
          </Text>
        </View>

        {/* Motor Matemático */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Batería actual</Text>
          <BatterySlider
            value={batteryNow}
            onChange={setBatteryNow}
            color={colors.red}
            label="Nivel actual"
          />

          <Text style={[s.sectionTitle, { marginTop: 20 }]}>Objetivo de carga</Text>
          <BatterySlider
            value={batteryTarget}
            onChange={setBatteryTarget}
            color={colors.green}
            label="Meta"
          />
        </View>

        {/* Resultado del motor */}
        <View style={s.mathResultCard}>
          <Text style={s.mathTitle}>Estimación de carga</Text>
          <View style={s.mathRow}>
            <View style={s.mathItem}>
              <Text style={s.mathValue}>{Math.floor(math.timeMin / 60)}h {math.timeMin % 60}m</Text>
              <Text style={s.mathLabel}>Tiempo estimado</Text>
            </View>
            <View style={s.mathDivider} />
            <View style={s.mathItem}>
              <Text style={s.mathValue}>{math.energyKWh.toFixed(1)} kWh</Text>
              <Text style={s.mathLabel}>Energía requerida</Text>
            </View>
          </View>
          <View style={s.mathCostRow}>
            <Text style={s.mathCostLabel}>Costo total estimado</Text>
            <Text style={s.mathCostValue}>
              {station.pricePerKWh === 0 ? 'Gratis' : formatCOP(math.totalCost)}
            </Text>
          </View>
          {station.pricePerKWh > 0 && (
            <View style={[s.affordRow, { borderTopColor: math.canAfford ? colors.greenDim : colors.redDim }]}>
              <Text style={[s.affordLabel, { color: math.canAfford ? colors.green : colors.red }]}>
                {math.canAfford ? '✓ Saldo suficiente' : '✗ Saldo insuficiente'}
              </Text>
              <Text style={s.affordBalance}>Tu saldo: {formatCOP(walletBalance)}</Text>
            </View>
          )}
        </View>

        {/* Horario */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Selecciona tu turno</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hoursScroll}>
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[s.chip, selectedHour === h && s.chipActive]}
                onPress={() => setSelectedHour(h)}
              >
                <Text style={[s.chipText, selectedHour === h && s.chipTextActive]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Confirm button */}
        <GradientButton
          label="Confirmar Turno"
          onPress={handleConfirm}
          disabled={!math.canAfford}
          style={{ marginTop: 8 }}
        />

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: colors.textPrimary },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  stationCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius['2xl'],
    padding: 16,
    marginBottom: 20,
  },
  stationCardLeft: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  stationCardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.cyanDim,
    borderWidth: 1,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationCardEmoji: { fontSize: 22 },
  stationCardInfo: { flex: 1 },
  stationName: { fontSize: 15, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  ratingText: { fontSize: 12, color: colors.yellow },
  ratingCount: { fontSize: 12, color: colors.textMuted },
  verifiedText: { fontSize: 11, color: colors.green },
  connectorRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', alignItems: 'center' },
  connectorTag: {
    backgroundColor: colors.cyanDim,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.3)',
  },
  connectorTagText: { fontSize: 10, color: colors.cyan, fontWeight: weights.semibold },
  powerText: { fontSize: 11, color: colors.textMuted, fontWeight: weights.medium },
  stationPrice: { fontSize: 14, fontWeight: weights.bold, color: colors.green, textAlign: 'right' },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  sliderWrap: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    marginBottom: 4,
  },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sliderLabel: { fontSize: 13, color: colors.textSecondary },
  sliderValue: { fontSize: 18, fontWeight: weights.bold },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.trackBg,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sliderFill: { height: 6, borderRadius: 3 },
  sliderSteps: { flexDirection: 'row', justifyContent: 'space-between' },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: 8, color: colors.textMuted, fontWeight: weights.medium },

  mathResultCard: {
    backgroundColor: 'rgba(0,186,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.2)',
    borderRadius: radius['2xl'],
    padding: 20,
    marginBottom: 20,
  },
  mathTitle: { fontSize: 12, color: colors.cyan, fontWeight: weights.semibold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 16 },
  mathRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  mathItem: { flex: 1, alignItems: 'center' },
  mathValue: { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  mathLabel: { fontSize: 11, color: colors.textMuted },
  mathDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.08)' },
  mathCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  mathCostLabel: { fontSize: 13, color: colors.textSecondary },
  mathCostValue: { fontSize: 20, fontWeight: weights.bold, color: colors.green },
  affordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  affordLabel: { fontSize: 13, fontWeight: weights.semibold },
  affordBalance: { fontSize: 12, color: colors.textMuted },

  hoursScroll: { marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.greenDim,
    borderColor: colors.green,
  },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium },
  chipTextActive: { color: colors.green, fontWeight: weights.bold },

  confirmButton: {
    height: 54,
    borderRadius: radius['2xl'],
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
  },
  confirmText: { fontSize: 16, fontWeight: weights.bold, color: '#050A15', letterSpacing: 0.3 },
});
