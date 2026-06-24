import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export default function LocationButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.targetOuter}>
        <View style={styles.targetRing} />
        <View style={styles.targetCrossV} />
        <View style={styles.targetCrossH} />
        <View style={styles.targetDot} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 27, 46, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  targetOuter: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.accent,
    position: 'absolute',
  },
  targetCrossV: {
    width: 1.5,
    height: 12,
    backgroundColor: colors.accent,
    position: 'absolute',
    borderRadius: 1,
  },
  targetCrossH: {
    width: 12,
    height: 1.5,
    backgroundColor: colors.accent,
    position: 'absolute',
    borderRadius: 1,
  },
  targetDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
