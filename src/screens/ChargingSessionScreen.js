import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatCOP } from '../utils/format';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');

const STATES = {
  conectando: { label: 'Conectando al vehículo...', duration: 2000 },
  handshake: { label: 'Handshake eléctrico (IEC 61851)...', duration: 3000 },
  preparando: { label: 'Preparando carga...', duration: 2000 },
  cargando: { label: 'Sesión Activa', duration: null },
  detenido: { label: 'Sesión detenida', duration: null },
};

const TELEMETRY_INTERVAL = 2000;
const RING_SIZE = 200;

function RingChart({ percent, label }) {
  const radius_ = RING_SIZE / 2 - 12;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius_;
  const filled = (percent / 100) * circumference;

  return (
    <View style={ring.container}>
      {/* Outer glow ring simulation with Views */}
      <View style={[ring.outerRing, { borderColor: 'rgba(0,255,140,0.08)' }]} />
      <View style={[ring.middleRing, { borderColor: 'rgba(0,186,255,0.12)' }]} />

      {/* Inner circle with content */}
      <View style={ring.innerCircle}>
        <Text style={ring.percentText}>{percent.toFixed(0)}%</Text>
        <Text style={ring.percentLabel}>Batería actual</Text>
      </View>

      {/* Progress arc simulation — top/bottom half approach */}
      <View style={ring.trackRing} />
      <View
        style={[
          ring.fillArc,
          {
            borderColor: percent > 66 ? colors.green : percent > 33 ? colors.cyan : colors.red,
            opacity: 0.9,
          },
        ]}
      />
    </View>
  );
}

const ring = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  outerRing: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1,
    backgroundColor: 'rgba(0,255,140,0.03)',
  },
  middleRing: {
    position: 'absolute',
    width: RING_SIZE - 20,
    height: RING_SIZE - 20,
    borderRadius: (RING_SIZE - 20) / 2,
    borderWidth: 1,
  },
  trackRing: {
    position: 'absolute',
    width: RING_SIZE - 28,
    height: RING_SIZE - 28,
    borderRadius: (RING_SIZE - 28) / 2,
    borderWidth: 12,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  fillArc: {
    position: 'absolute',
    width: RING_SIZE - 28,
    height: RING_SIZE - 28,
    borderRadius: (RING_SIZE - 28) / 2,
    borderWidth: 12,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  innerCircle: {
    width: RING_SIZE - 56,
    height: RING_SIZE - 56,
    borderRadius: (RING_SIZE - 56) / 2,
    backgroundColor: 'rgba(0,186,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  percentText: {
    fontSize: 36,
    fontWeight: weights.extrabold,
    color: colors.textPrimary,
  },
  percentLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default function ChargingSessionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { station, reservationId } = route.params;

  const [phase, setPhase] = useState('conectando');
  const [telemetry, setTelemetry] = useState({
    voltage: 220,
    current: 30,
    power: 6.6,
    energy: 0,
    duration: 0,
    cost: 0,
    batteryPct: 25,
  });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tickRef = useRef(null);
  const phaseTimers = useRef([]);

  const clearPhaseTimers = useCallback(() => {
    phaseTimers.current.forEach((t) => clearTimeout(t));
    phaseTimers.current = [];
  }, []);

  const clearTick = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  useEffect(() => {
    const timers = phaseTimers.current;
    const t1 = setTimeout(() => setPhase('handshake'), STATES.conectando.duration);
    const t2 = setTimeout(() => setPhase('preparando'), STATES.conectando.duration + STATES.handshake.duration);
    const t3 = setTimeout(() => setPhase('cargando'), STATES.conectando.duration + STATES.handshake.duration + STATES.preparando.duration);
    timers.push(t1, t2, t3);
    return () => { clearPhaseTimers(); clearTick(); };
  }, [clearPhaseTimers, clearTick]);

  useEffect(() => {
    if (phase === 'cargando') {
      tickRef.current = setInterval(() => {
        setTelemetry((prev) => {
          const energyInc = 0.1 + Math.random() * 0.05;
          const newEnergy = prev.energy + energyInc;
          const newDuration = prev.duration + 2;
          const newBattery = Math.min(100, prev.batteryPct + 0.3);
          return {
            voltage: 220 + (Math.random() * 10 - 5),
            current: 30 + (Math.random() * 8 - 4),
            power: 6.6 + (Math.random() * 1.6 - 0.8),
            energy: newEnergy,
            duration: newDuration,
            cost: newEnergy * station.pricePerKWh,
            batteryPct: newBattery,
          };
        });
      }, TELEMETRY_INTERVAL);
    } else {
      clearTick();
    }
    return clearTick;
  }, [phase, station.pricePerKWh, clearTick]);

  useEffect(() => {
    if (phase === 'cargando') {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [phase, pulseAnim]);

  const handleStop = () => {
    clearPhaseTimers();
    clearTick();
    setPhase('detenido');
    setTimeout(() => navigation.navigate('CDR', { station, telemetry, reservationId }), 800);
  };

  const formatDuration = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isLoading = phase === 'conectando' || phase === 'handshake' || phase === 'preparando';

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          disabled={phase === 'cargando'}
        >
          <Text style={[s.backIcon, phase === 'cargando' && { opacity: 0.3 }]}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Cargando en</Text>
          <Text style={s.headerStation}>{station.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Session ID */}
      {phase === 'cargando' && (
        <View style={s.sessionBadge}>
          <Animated.View style={[s.sessionDot, { opacity: pulseAnim, backgroundColor: colors.green }]} />
          <Text style={s.sessionLabel}>• Sesión Activa · {reservationId?.slice(-8)}</Text>
        </View>
      )}

      <View style={s.body}>
        {/* Loading phases */}
        {isLoading && (
          <View style={s.loadingSection}>
            <View style={s.loadingOrb}>
              <Animated.View style={[s.loadingOrbInner, { opacity: pulseAnim }]}>
                <Text style={s.loadingEmoji}>🔌</Text>
              </Animated.View>
            </View>
            <Text style={s.loadingText}>{STATES[phase].label}</Text>
          </View>
        )}

        {/* Charging UI */}
        {phase === 'cargando' && (
          <>
            {/* Ring chart */}
            <RingChart percent={telemetry.batteryPct} />

            {/* Telemetry grid */}
            <View style={s.grid}>
              <View style={s.gridCard}>
                <Text style={s.gridLabel}>Energía</Text>
                <Text style={s.gridValue}>{telemetry.energy.toFixed(1)}</Text>
                <Text style={s.gridUnit}>kWh</Text>
              </View>
              <View style={s.gridCard}>
                <Text style={s.gridLabel}>Tiempo</Text>
                <Text style={s.gridValue}>{formatDuration(telemetry.duration)}</Text>
                <Text style={s.gridUnit}>h:m:s</Text>
              </View>
              <View style={s.gridCard}>
                <Text style={s.gridLabel}>Costo</Text>
                <Text style={[s.gridValue, { color: colors.green, fontSize: 16 }]}>
                  {formatCOP(telemetry.cost)}
                </Text>
                <Text style={s.gridUnit}>COP</Text>
              </View>
              <View style={s.gridCard}>
                <Text style={s.gridLabel}>Potencia</Text>
                <Text style={s.gridValue}>{telemetry.power.toFixed(1)}</Text>
                <Text style={s.gridUnit}>kW</Text>
              </View>
            </View>
          </>
        )}

        {phase === 'detenido' && (
          <View style={s.stoppedSection}>
            <Text style={s.stoppedEmoji}>⏹️</Text>
            <Text style={s.stoppedText}>Generando recibo digital...</Text>
          </View>
        )}
      </View>

      {/* Stop button */}
      {phase === 'cargando' && (
        <TouchableOpacity
          style={[s.stopButton, { marginBottom: insets.bottom + 16 }]}
          onPress={handleStop}
          activeOpacity={0.85}
        >
          <Text style={s.stopButtonText}>Finalizar Carga</Text>
        </TouchableOpacity>
      )}
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
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  headerStation: { fontSize: 15, fontWeight: weights.bold, color: colors.textPrimary },

  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: colors.greenDim,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,255,140,0.15)',
  },
  sessionDot: { width: 8, height: 8, borderRadius: 4 },
  sessionLabel: { fontSize: 12, color: colors.green, fontWeight: weights.medium },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 32, alignItems: 'center' },

  loadingSection: { alignItems: 'center', paddingTop: 40 },
  loadingOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,186,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingOrbInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cyanDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingEmoji: { fontSize: 36 },
  loadingText: { fontSize: 15, color: colors.textSecondary, fontWeight: weights.medium },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  gridCard: {
    width: (width - 32 - 12) / 2 - 0.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  gridValue: { fontSize: 20, fontWeight: weights.bold, color: colors.cyan },
  gridUnit: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  stoppedSection: { alignItems: 'center', paddingTop: 60 },
  stoppedEmoji: { fontSize: 48, marginBottom: 16 },
  stoppedText: { fontSize: 15, color: colors.textSecondary },

  stopButton: {
    marginHorizontal: 16,
    height: 54,
    borderRadius: radius['2xl'],
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  stopButtonText: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary, letterSpacing: 0.5 },
});
