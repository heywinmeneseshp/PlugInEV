import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, weights } from '../styles/theme';

const INITIALS = 'HE';

export default function FloatingHeader({ userName }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{INITIALS}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <Text style={styles.greeting}>
          {'\u00A1Hola, '}{userName || 'Heywin'}{'!'}
        </Text>
        <Text style={styles.subtitle}>
          {'\u00BFD\u00F3nde quieres cargar hoy?'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5,10,21,0.88)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  left: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: fonts['3xl'],
    fontWeight: weights.bold,
    color: '#050A15',
  },
  center: {
    flex: 1,
  },
  greeting: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.white,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
