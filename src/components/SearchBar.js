import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, weights } from '../styles/theme';

export default function SearchBar({ value, onChangeText, onFocus, onLocationPress, placeholder }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || '¿A dónde quieres cargar?'}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.locationBtn} onPress={onLocationPress}>
        <Ionicons name="navigate-outline" size={18} color={colors.cyan} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(13,22,38,0.95)',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    height: '100%',
    paddingVertical: 0,
    fontWeight: weights.medium,
  },
  locationBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
