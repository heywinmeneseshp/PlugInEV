import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

const ROLES = [
  {
    key: 'conductor',
    icon: 'car-outline',
    title: 'Conductor',
    desc: 'Busca y carga tu vehículo eléctrico',
    color: colors.green,
  },
  {
    key: 'anfitrion',
    icon: 'home-outline',
    title: 'Anfitrión',
    desc: 'Comparte tu cargador privado',
    color: colors.cyan,
  },
];

export default function RolSelectionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { selectRole, finishRegistration } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const scaleAnims = useRef(ROLES.map(() => new Animated.Value(1))).current;

  const handlePressIn = (i) => Animated.spring(scaleAnims[i], { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = (i) => Animated.spring(scaleAnims[i], { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }).start();

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
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.backButton} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Elige tu rol</Text>
        <Text style={styles.description}>Selecciona cómo quieres usar Plugin</Text>

        <View style={styles.cardsRow}>
          {ROLES.map((role, index) => {
            const isSelected = selectedRole === role.key;
            return (
              <Animated.View key={role.key} style={[styles.cardWrapper, { transform: [{ scale: scaleAnims[index] }] }]}>
                <TouchableOpacity
                  style={[styles.card, isSelected && { borderColor: role.color, borderWidth: 2 }]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedRole(role.key)}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                >
                  <View style={[styles.iconCircle, isSelected && { backgroundColor: role.color + '22', borderColor: role.color }]}>
                    <Ionicons name={role.icon} size={32} color={isSelected ? role.color : colors.textSecondary} />
                  </View>
                  <Text style={[styles.cardTitle, isSelected && { color: role.color }]}>{role.title}</Text>
                  <Text style={styles.cardDesc}>{role.desc}</Text>
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: role.color }]}>
                      <Ionicons name="checkmark" size={12} color="#050A15" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <GradientButton
          label={loading ? 'Guardando...' : 'Confirmar'}
          onPress={handleConfirm}
          disabled={!selectedRole || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: weights.bold, color: colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  description: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 40 },
  cardsRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  cardWrapper: { flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 12, color: colors.textMuted, textAlign: 'center', lineHeight: 17 },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
