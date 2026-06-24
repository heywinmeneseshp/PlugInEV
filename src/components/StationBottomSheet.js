import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from './GradientButton';
import { colors, fonts, weights } from '../styles/theme';
import { formatCOP } from '../utils/format';

export default function StationBottomSheet({
  station,
  visible,
  onReserve,
  userRole = 'conductor',
}) {
  if (!station || !visible) return null;

  const isFree = station.pricePerKWh === 0;
  const markerColor = !station.available
    ? colors.red
    : isFree
    ? colors.green
    : colors.cyan;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{station.name}</Text>
              {isFree && (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>Gratis</Text>
                </View>
              )}
            </View>

            <Text style={styles.address} numberOfLines={1}>{station.address}</Text>

            <View style={styles.tagsRow}>
              <View style={[styles.dot, { backgroundColor: markerColor }]} />
              <Text style={styles.tag}>
                {station.available ? 'Disponible' : 'Ocupado'}
              </Text>
              <View style={styles.sep} />
              <Text style={styles.tag}>
                {station.pricePerKWh === 0 ? 'Gratis' : `${formatCOP(station.pricePerKWh)}/kWh`}
              </Text>
              <View style={styles.sep} />
              <Text style={styles.tag}>{station.power}</Text>
              <View style={styles.sep} />
              <Text style={styles.tag}>{'\u2605'} {station.rating}</Text>
            </View>

            <View style={styles.connectorRow}>
              {station.connectors.map((c, i) => (
                <View key={i} style={styles.connectorChip}>
                  <Text style={styles.connectorText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          {userRole === 'conductor' && (
            <GradientButton
              label={station.available ? 'Reservar' : 'No disponible'}
              onPress={() => station.available && onReserve(station)}
              disabled={!station.available}
              height={52}
              style={{ width: 120 }}
              icon={
                <Ionicons
                  name={station.available ? 'flash' : 'ban-outline'}
                  size={15}
                  color={station.available ? '#050A15' : colors.textMuted}
                />
              }
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#0A1525',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
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
    marginHorizontal: 6,
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
  },
  connectorText: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    fontWeight: weights.medium,
  },
  reserveBtn: {
    backgroundColor: colors.green,
    borderRadius: 18,
    height: 52,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  reserveBtnDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  reserveText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
});
