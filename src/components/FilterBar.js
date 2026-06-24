import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, weights } from '../styles/theme';

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'free', label: 'Gratis' },
  { key: 'paid', label: 'Pago' },
  { key: 'available', label: 'Disponibles ahora' },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <View style={styles.row}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
    gap: 6,
  },
  chip: {
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 27, 46, 0.92)',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: fonts.md,
    fontWeight: weights.semibold,
    color: colors.white,
  },
  chipTextActive: {
    color: colors.bg,
  },
});
