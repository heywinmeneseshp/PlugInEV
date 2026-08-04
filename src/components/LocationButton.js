import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LocationButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.outer}>
      <LinearGradient
        colors={['#19D4FF', '#37F26B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >
        <Ionicons name="locate" size={26} color="#071424" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    shadowColor: '#19D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 12,
    borderRadius: 28,
    // Anillo blanco sutil para destacar sobre el mapa
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
