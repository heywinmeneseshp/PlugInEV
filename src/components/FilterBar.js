import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, weights } from '../styles/theme';

const FILTERS = [
  { key: 'all',       label: 'Todas' },
  { key: 'available', label: 'Disponibles' },
  { key: 'free',      label: 'Gratis' },
  { key: 'paid',      label: 'Pago' },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onFilterChange(f.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(13,22,38,0.92)',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  chipActive: {
    backgroundColor: colors.cyanDim,
    borderColor: colors.cyan,
  },
  chipText: {
    fontSize: 12,
    fontWeight: weights.semibold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.cyan,
  },
});
