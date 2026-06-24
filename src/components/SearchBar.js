import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, weights } from '../styles/theme';

export default function SearchBar({ value, onChangeText, onFocus, onLocationPress, placeholder }) {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <View style={styles.magnifierCircle} />
        <View style={styles.magnifierHandle} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Buscar estaci\u00F3n o zona'}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.locationBtn} onPress={onLocationPress}>
        <View style={styles.targetOuter}>
          <View style={styles.targetInner} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magnifierCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  magnifierHandle: {
    width: 7,
    height: 1.5,
    backgroundColor: colors.textMuted,
    borderRadius: 1,
    position: 'absolute',
    bottom: 2,
    right: 1,
    transform: [{ rotate: '45deg' }],
  },
  input: {
    flex: 1,
    fontSize: fonts.xl,
    color: colors.white,
    height: '100%',
    paddingVertical: 0,
  },
  locationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  targetOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
});
