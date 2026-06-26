import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Linking, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';
import { formatCOP } from '../utils/format';

export default function StationDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { station } = route.params;

  const isFree = station.pricePerKWh === 0;
  const availColor = station.available ? colors.green : colors.red;
  const availLabel = station.available ? 'Disponible ahora' : 'Ocupada';

  const openNavigation = () => {
    const { latitude, longitude, name } = station;
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    const mapsUrl = Platform.OS === 'ios'
      ? `maps:?daddr=${latitude},${longitude}&q=${encodeURIComponent(name)}`
      : `https://maps.google.com/maps?daddr=${latitude},${longitude}&q=${encodeURIComponent(name)}`;
    Linking.canOpenURL(wazeUrl)
      .then((supported) => Linking.openURL(supported ? wazeUrl : mapsUrl))
      .catch(() => Linking.openURL(mapsUrl));
  };

  const handleBook = () => {
    if (!station.available) {
      Alert.alert('Estación ocupada', 'Esta estación no está disponible ahora. Intenta de nuevo más tarde o elige otra.');
      return;
    }
    navigation.navigate('Booking', { station });
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{station.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Photo placeholder / availability banner */}
        <LinearGradient
          colors={station.available
            ? ['rgba(0,186,255,0.12)', 'rgba(0,255,140,0.06)']
            : ['rgba(255,59,48,0.12)', 'rgba(255,59,48,0.04)']}
          style={s.photoBanner}
        >
          <Ionicons name="flash" size={42} color={station.available ? colors.cyan : colors.red} />
          <View style={[s.availBadge, { backgroundColor: availColor + '22', borderColor: availColor + '55' }]}>
            <View style={[s.availDot, { backgroundColor: availColor }]} />
            <Text style={[s.availText, { color: availColor }]}>{availLabel}</Text>
          </View>
        </LinearGradient>

        {/* Name + rating */}
        <View style={s.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.stationName}>{station.name}</Text>
            <Text style={s.stationAddress}>{station.address}</Text>
          </View>
          <View style={s.ratingBox}>
            <Ionicons name="star" size={14} color="#FFD60A" />
            <Text style={s.ratingNum}>{station.rating?.toFixed(1) ?? '–'}</Text>
            <Text style={s.ratingCount}>({station.numRatings ?? 0})</Text>
          </View>
        </View>

        {/* Navigate button */}
        <TouchableOpacity style={s.navBtn} onPress={openNavigation} activeOpacity={0.8}>
          <Ionicons name="navigate-outline" size={16} color={colors.cyan} />
          <Text style={s.navBtnText}>Cómo llegar · Waze / Google Maps</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Host card */}
        <View style={s.hostCard}>
          <View style={s.hostAvatar}>
            <Text style={s.hostAvatarText}>{station.hostName?.charAt(0) ?? '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.hostNameRow}>
              <Text style={s.hostName}>{station.hostName}</Text>
              {station.hostVerified && (
                <View style={s.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.cyan} />
                  <Text style={s.verifiedText}>Verificado</Text>
                </View>
              )}
            </View>
            <Text style={s.hostSessions}>{station.hostSessions ?? 0} sesiones completadas</Text>
          </View>
          <Ionicons name="person-outline" size={18} color={colors.textMuted} />
        </View>

        {/* Specs grid */}
        <Text style={s.sectionLabel}>DETALLES TÉCNICOS</Text>
        <View style={s.specsGrid}>
          <SpecCell icon="flash-outline" label="Potencia" value={station.power} color={colors.cyan} />
          <SpecCell
            icon="cash-outline"
            label="Precio"
            value={isFree ? 'Gratis' : `${formatCOP(station.pricePerKWh)}/kWh`}
            color={isFree ? colors.green : colors.textPrimary}
          />
          <SpecCell
            icon="time-outline"
            label="Horario"
            value={station.hours ? `${station.hours.open} – ${station.hours.close}` : 'Sin info'}
            color={colors.textPrimary}
          />
          <SpecCell
            icon="calendar-outline"
            label="Días"
            value={station.hours?.days ?? 'Lun–Dom'}
            color={colors.textPrimary}
          />
        </View>

        {/* Connectors */}
        <Text style={s.sectionLabel}>CONECTORES DISPONIBLES</Text>
        <View style={s.connectorRow}>
          {station.connectors?.map((c) => (
            <View key={c} style={s.connChip}>
              <Ionicons name="flash-outline" size={12} color={colors.cyan} />
              <Text style={s.connChipText}>{c}</Text>
            </View>
          ))}
        </View>

        {/* Access instructions */}
        {station.accessInfo && (
          <>
            <Text style={s.sectionLabel}>INSTRUCCIONES DE ACCESO</Text>
            <View style={s.accessCard}>
              <Ionicons name="key-outline" size={16} color={colors.cyan} style={{ marginTop: 1 }} />
              <Text style={s.accessText}>{station.accessInfo}</Text>
            </View>
          </>
        )}

        {/* Reviews */}
        {station.reviews?.length > 0 && (
          <>
            <Text style={s.sectionLabel}>RESEÑAS</Text>
            {station.reviews.map((r, i) => (
              <View key={i} style={s.reviewCard}>
                <View style={s.reviewTop}>
                  <View style={s.reviewAvatar}>
                    <Text style={s.reviewAvatarText}>{r.user.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.reviewUser}>{r.user}</Text>
                    <View style={s.reviewStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= r.rating ? 'star' : 'star-outline'}
                          size={11}
                          color={star <= r.rating ? '#FFD60A' : colors.textMuted}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={s.reviewDate}>{r.date}</Text>
                </View>
                <Text style={s.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GradientButton
          label={station.available ? 'Reservar esta estación' : 'No disponible ahora'}
          onPress={handleBook}
          disabled={!station.available}
          icon={
            <Ionicons
              name={station.available ? 'flash' : 'time-outline'}
              size={18}
              color={station.available ? '#050A15' : colors.textMuted}
            />
          }
        />
      </View>
    </View>
  );
}

function SpecCell({ icon, label, value, color }) {
  return (
    <View style={s.specCell}>
      <View style={s.specIcon}>
        <Ionicons name={icon} size={14} color={colors.cyan} />
      </View>
      <Text style={s.specLabel}>{label}</Text>
      <Text style={[s.specValue, { color }]}>{value}</Text>
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
  headerTitle: {
    fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary,
    flex: 1, textAlign: 'center',
  },

  scroll: { paddingHorizontal: 20 },

  photoBanner: {
    height: 140, borderRadius: radius['2xl'],
    alignItems: 'center', justifyContent: 'center', gap: 12,
    marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  availBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1,
  },
  availDot: { width: 7, height: 7, borderRadius: 3.5 },
  availText: { fontSize: 12, fontWeight: weights.semibold },

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stationName: { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 2 },
  stationAddress: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  ratingNum: { fontSize: 14, fontWeight: weights.bold, color: colors.textPrimary },
  ratingCount: { fontSize: 12, color: colors.textMuted },

  navBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(0,186,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
    borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 16,
  },
  navBtnText: { flex: 1, fontSize: 13, color: colors.cyan, fontWeight: weights.medium },

  hostCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 20,
  },
  hostAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,186,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(0,186,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  hostAvatarText: { fontSize: 18, fontWeight: weights.bold, color: colors.cyan },
  hostNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  hostName: { fontSize: 15, fontWeight: weights.bold, color: colors.textPrimary },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,186,255,0.1)',
    borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, color: colors.cyan, fontWeight: weights.semibold },
  hostSessions: { fontSize: 12, color: colors.textMuted },

  sectionLabel: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold,
    letterSpacing: 1, marginBottom: 10,
  },

  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  specCell: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg, padding: 12, gap: 4,
  },
  specIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  specLabel: { fontSize: 10, color: colors.textMuted, fontWeight: weights.medium },
  specValue: { fontSize: 14, fontWeight: weights.bold },

  connectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  connChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,186,255,0.1)',
    borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.25)',
  },
  connChipText: { fontSize: 13, color: colors.cyan, fontWeight: weights.semibold },

  accessCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg, padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  accessText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.xl, padding: 14, marginBottom: 10, gap: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  reviewAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontSize: 13, fontWeight: weights.bold, color: colors.textPrimary },
  reviewUser: { fontSize: 13, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 3 },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  reviewComment: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  footer: { paddingHorizontal: 20, paddingTop: 12 },
});
