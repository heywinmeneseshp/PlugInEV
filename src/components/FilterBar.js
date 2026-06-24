import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      style={styles.scroll}
    >
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.key;
        if (isActive) {
          return (
            <TouchableOpacity key={f.key} onPress={() => onFilterChange(f.key)} activeOpacity={0.8}>
              <LinearGradient
                colors={['#00BAFF', '#00FF8C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chipActive}
              >
                <Text style={styles.chipTextActive}>{f.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={f.key}
            style={styles.chip}
            onPress={() => onFilterChange(f.key)}
            activeOpacity={0.75}
          >
            <Text style={styles.chipText}>{f.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(13,22,38,0.92)',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  chipActive: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: weights.semibold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    fontSize: 12,
    fontWeight: weights.bold,
    color: '#050A15',
  },
});
