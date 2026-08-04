import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientButton from './GradientButton';
import { colors, fonts, weights } from '../styles/theme';
import { formatCOP } from '../utils/format';

export default function StationBottomSheet({
  station,
  visible,
  onReserve,
  userRole = 'conductor',
}) {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(220)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 220,
      useNativeDriver: true,
      tension: 70,
      friction: 12,
    }).start();
  }, [visible, slideAnim]);

  if (!station && !visible) return null;

  const handleViewDetail = () => {
    navigation.navigate('StationDetail', { station });
  };

  const isFree = station?.pricePerKWh === 0;
  const markerColor = !station?.available
    ? colors.red
    : isFree
    ? colors.green
    : colors.cyan;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.card}>
        {/* Handle */}
        <View style={styles.handle} />

        <View style={styles.row}>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{station?.name}</Text>
              {isFree && (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>Gratis</Text>
                </View>
              )}
            </View>

            <Text style={styles.address} numberOfLines={1}>{station?.address}</Text>

            <View style={styles.tagsRow}>
              <View style={[styles.dot, { backgroundColor: markerColor }]} />
              <Text style={styles.tag}>
                {station?.available ? 'Disponible' : 'Ocupado'}
              </Text>
              <View style={styles.sep} />
              <Text style={styles.tag}>
                {station?.pricePerKWh === 0 ? 'Gratis' : `${formatCOP(station?.pricePerKWh ?? 0)}/kWh`}
              </Text>
              {station?.power ? (
                <>
                  <View style={styles.sep} />
                  <Text style={styles.tag}>{station.power}</Text>
                </>
              ) : null}
              {station?.rating ? (
                <>
                  <View style={styles.sep} />
                  <Text style={styles.tag}>{'★'} {station.rating}</Text>
                </>
              ) : null}
            </View>

            {station?.connectors?.length > 0 && (
              <View style={styles.connectorRow}>
                {station.connectors.map((c, i) => (
                  <View key={i} style={styles.connectorChip}>
                    <Text style={styles.connectorText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {userRole === 'conductor' && (
            <GradientButton
              label="Ver detalles"
              onPress={handleViewDetail}
              height={52}
              style={{ width: 120 }}
              icon={<Ionicons name="arrow-forward" size={15} color="#050A15" />}
            />
          )}
        </View>

        {userRole === 'conductor' && (
          <TouchableOpacity
            onPress={() => onReserve && onReserve(station)}
            activeOpacity={0.8}
            style={[styles.reserveBtn, !station?.available && styles.reserveBtnDisabled]}
            disabled={!station?.available}
          >
            <Ionicons
              name="flash-outline"
              size={15}
              color={station?.available ? colors.cyan : colors.textMuted}
            />
            <Text style={[styles.reserveBtnText, !station?.available && styles.reserveBtnTextDisabled]}>
              {station?.available ? 'Reserva inteligente' : 'Estación ocupada'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
  },
  card: {
    backgroundColor: '#0A1525',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.white,
    flexShrink: 1,
  },
  freeBadge: {
    backgroundColor: colors.greenDim,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,255,140,0.3)',
  },
  freeText: {
    fontSize: fonts.base,
    fontWeight: weights.bold,
    color: colors.green,
  },
  address: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  tag: {
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  sep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
    marginHorizontal: 4,
  },
  connectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  connectorChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  connectorText: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    fontWeight: weights.medium,
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.4)',
    backgroundColor: 'rgba(0,186,255,0.07)',
  },
  reserveBtnDisabled: {
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  reserveBtnText: {
    fontSize: fonts.md,
    fontWeight: weights.semibold,
    color: colors.cyan,
  },
  reserveBtnTextDisabled: {
    color: colors.textMuted,
  },
});
