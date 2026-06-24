import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, weights, radius } from '../styles/theme';

const ROLES = [
  {
    key: 'conductor',
    icon: '\uD83D\uDE97',
    title: 'Conductor',
    desc: 'Busca y carga tu veh\u00EDculo el\u00E9ctrico',
    color: '#4CAF50',
  },
  {
    key: 'anfitrion',
    icon: '\uD83D\uDD0C',
    title: 'Anfitri\u00F3n',
    desc: 'Comparte tu cargador privado',
    color: '#FF9800',
  },
];

export default function RolSelectionScreen() {
  const navigation = useNavigation();
  const { selectRole, finishRegistration } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const scaleAnims = useRef(
    ROLES.map(() => new Animated.Value(1))
  ).current;

  const handlePressIn = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (key) => {
    setSelectedRole(key);
  };

  const handleConfirm = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await selectRole(selectedRole);
      const mockUser = {
        id: Date.now().toString(),
        nombre: 'Usuario',
        email: 'usuario@example.com',
        role: selectedRole,
      };
      finishRegistration(mockUser, 'mock-token-final');
      // Navigation switches automatically via auth state
    } catch {
      // handled by auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.backButton} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Elige tu rol</Text>
        <Text style={styles.description}>
          Selecciona c\u00F3mo quieres usar Plugin
        </Text>

        <View style={styles.cardsRow}>
          {ROLES.map((role, index) => {
            const isSelected = selectedRole === role.key;
            return (
              <Animated.View
                key={role.key}
                style={[
                  styles.cardWrapper,
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.card,
                    isSelected && { borderColor: role.color, borderWidth: 2 },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handleSelect(role.key)}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                >
                  <Text style={styles.cardIcon}>{role.icon}</Text>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardDesc}>{role.desc}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, (!selectedRole || loading) && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedRole || loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Guardando...' : 'Confirmar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: fonts['4xl'],
    color: colors.accent,
    fontWeight: weights.bold,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: fonts['5xl'],
    fontWeight: weights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: fonts['3xl'],
    fontWeight: weights.bold,
    color: colors.white,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: fonts.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
});
