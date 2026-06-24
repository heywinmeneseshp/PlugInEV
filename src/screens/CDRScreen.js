import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatCOP } from '../utils/format';
import { colors, weights, radius } from '../styles/theme';

function formatDateTime() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function StarRating({ rating, onRate }) {
  return (
    <View style={s.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onRate(i)} activeOpacity={0.7}>
          <Text style={[s.star, i <= rating && s.starActive]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function InfoRow({ label, value, valueColor, large }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={[s.infoValue, large && s.infoValueLarge, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

export default function CDRScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { station, telemetry, reservationId } = route.params;

  const [rating, setRating] = useState(0);

  const invoiceId = `#INV-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;

  const goToMap = () => navigation.navigate('ConductorHome', { screen: 'Mapa' });

  const handleFinish = () => {
    if (rating === 0) {
      Alert.alert('Califica la sesión', 'Por favor califica tu experiencia para continuar.');
      return;
    }
    goToMap();
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={goToMap}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Recibo Final</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Success badge */}
        <View style={s.successSection}>
          <View style={s.successOrb}>
            <Text style={s.successEmoji}>✓</Text>
          </View>
          <Text style={s.successTitle}>Carga Finalizada</Text>
          <Text style={s.successSub}>Exitosamente</Text>
        </View>

        {/* Station */}
        <View style={s.stationCard}>
          <Text style={s.stationName}>{station.name}</Text>
          <Text style={s.stationAddress}>{station.address}</Text>
        </View>

        {/* Main metrics */}
        <View style={s.metricsRow}>
          <View style={s.metricCard}>
            <Text style={s.metricEmoji}>⚡</Text>
            <Text style={s.metricValue}>{telemetry.energy.toFixed(2)}</Text>
            <Text style={s.metricUnit}>kWh</Text>
            <Text style={s.metricLabel}>Energía Total</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricEmoji}>🕒</Text>
            <Text style={s.metricValue}>{formatDuration(telemetry.duration)}</Text>
            <Text style={s.metricUnit}>h:m:s</Text>
            <Text style={s.metricLabel}>Duración</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricEmoji}>⚙️</Text>
            <Text style={s.metricValue}>{telemetry.power.toFixed(1)}</Text>
            <Text style={s.metricUnit}>kW</Text>
            <Text style={s.metricLabel}>Potencia Prom.</Text>
          </View>
        </View>

        {/* Cost breakdown */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Desglose de cobro</Text>
          <InfoRow label="Energía (85%)" value={formatCOP(telemetry.cost * 0.85)} />
          <View style={s.divider} />
          <InfoRow label="Servicio (15%)" value={formatCOP(telemetry.cost * 0.15)} />
          <View style={s.divider} />
          <InfoRow
            label="Costo Final"
            value={formatCOP(telemetry.cost)}
            valueColor={colors.green}
            large
          />
        </View>

        {/* Invoice details */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Factura</Text>
          <InfoRow label="Fecha" value={formatDateTime()} />
          <View style={s.divider} />
          <InfoRow label="Factura" value={invoiceId} valueColor={colors.cyan} />
          <View style={s.divider} />
          <InfoRow label="Sesión" value={reservationId?.slice(-10) || '-'} />
        </View>

        {/* Rating */}
        <View style={s.ratingCard}>
          <Text style={s.ratingTitle}>Califica tu experiencia</Text>
          <Text style={s.ratingSubtitle}>con el anfitrión</Text>
          <StarRating rating={rating} onRate={setRating} />
          {rating > 0 && (
            <Text style={s.ratingThankText}>
              {rating === 5 ? '¡Gracias por tu opinión!' : rating >= 3 ? 'Gracias por calificar' : 'Lamentamos la experiencia'}
            </Text>
          )}
        </View>

        {/* Finish button */}
        <TouchableOpacity
          style={s.finishButton}
          onPress={handleFinish}
          activeOpacity={0.85}
        >
          <Text style={s.finishButtonText}>Finalizar</Text>
        </TouchableOpacity>

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
  scroll: { paddingHorizontal: 16, paddingTop: 24 },

  successSection: { alignItems: 'center', marginBottom: 24 },
  successOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.greenDim,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  successEmoji: { fontSize: 32, color: colors.green, fontWeight: weights.bold },
  successTitle: { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary },
  successSub: { fontSize: 14, color: colors.green, fontWeight: weights.medium },

  stationCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius['2xl'],
    padding: 16,
    marginBottom: 16,
  },
  stationName: { fontSize: 15, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  stationAddress: { fontSize: 13, color: colors.textSecondary },

  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.lg,
    padding: 12,
    alignItems: 'center',
  },
  metricEmoji: { fontSize: 16, marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: weights.bold, color: colors.cyan },
  metricUnit: { fontSize: 9, color: colors.textMuted, marginBottom: 2 },
  metricLabel: { fontSize: 9, color: colors.textMuted, textAlign: 'center' },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius['2xl'],
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: { fontSize: 14, color: colors.textMuted },
  infoValue: { fontSize: 14, fontWeight: weights.semibold, color: colors.textPrimary },
  infoValueLarge: { fontSize: 18, fontWeight: weights.bold },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },

  ratingCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius['2xl'],
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingTitle: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  ratingSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  starsRow: { flexDirection: 'row', gap: 10 },
  star: { fontSize: 36, color: colors.trackBg },
  starActive: { color: colors.yellow },
  ratingThankText: { fontSize: 13, color: colors.green, marginTop: 12, fontWeight: weights.medium },

  finishButton: {
    height: 54,
    borderRadius: radius['2xl'],
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  finishButtonText: { fontSize: 16, fontWeight: weights.bold, color: '#050A15', letterSpacing: 0.3 },
});
