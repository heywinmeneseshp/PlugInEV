import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const initials = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : 'HE';
  const role = user?.role || 'conductor';

  const rows = [
    { icon: 'car-outline',      label: 'Vehículo',        value: user?.vehiculo   || 'Tesla Model 3' },
    { icon: 'document-outline', label: 'Placa',           value: user?.placa      || 'ABC-123' },
    { icon: 'card-outline',     label: 'Método de pago',  value: user?.metodoPago || 'Visa •••• 4242' },
    { icon: 'calendar-outline', label: 'Reservas activas',value: String(user?.reservasActivas ?? 1) },
  ];

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <View style={{ width: 40 }} />
        <Text style={s.headerTitle}>Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatarRing}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={s.name}>{user?.nombre || 'Heywin'}</Text>
          <Text style={s.email}>{user?.email || 'heywin@correo.com'}</Text>
          <View style={s.roleBadge}>
            <Ionicons
              name={role === 'anfitrion' ? 'home-outline' : 'car-outline'}
              size={12}
              color={colors.green}
            />
            <Text style={s.roleText}>{role === 'anfitrion' ? 'Anfitrión' : 'Conductor'}</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={s.card}>
          {rows.map(({ icon, label, value }, i) => (
            <React.Fragment key={label}>
              <View style={s.row}>
                <View style={s.rowLeft}>
                  <Ionicons name={icon} size={16} color={colors.textMuted} style={{ marginRight: 10 }} />
                  <Text style={s.rowLabel}>{label}</Text>
                </View>
                <Text style={s.rowValue}>{value}</Text>
              </View>
              {i < rows.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Modo anfitrión / Dashboard */}
        {role === 'anfitrion' ? (
          <GradientButton
            label="Dashboard anfitrión"
            onPress={() => navigation.navigate('AnfitrionStack')}
            icon={<Ionicons name="grid-outline" size={16} color="#050A15" />}
            style={{ marginBottom: 12 }}
          />
        ) : (
          <TouchableOpacity style={s.hostButton} onPress={() => navigation.navigate('AnfitrionStack')}>
            <Ionicons name="home-outline" size={16} color={colors.cyan} />
            <Text style={s.hostButtonText}>Modo anfitrión</Text>
          </TouchableOpacity>
        )}

        {/* Logout */}
        <TouchableOpacity style={s.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.red} />
          <Text style={s.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: 20 },

  avatarSection: { alignItems: 'center', marginTop: 24, marginBottom: 28 },
  avatarRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 2, borderColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.greenDim,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: weights.bold, color: colors.green },
  name: { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  email: { fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.greenDim,
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.green,
  },
  roleText: { fontSize: 12, color: colors.green, fontWeight: weights.semibold },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius['2xl'],
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: colors.textSecondary },
  rowValue: { fontSize: 14, fontWeight: weights.medium, color: colors.textPrimary },

  hostButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: radius.xl,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1, borderColor: colors.cyan,
    backgroundColor: colors.cyanDim,
  },
  hostButtonText: { fontSize: 15, fontWeight: weights.semibold, color: colors.cyan },

  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.redDim,
    borderRadius: radius.xl,
    paddingVertical: 14,
    borderWidth: 1, borderColor: colors.red,
  },
  logoutText: { fontSize: 15, fontWeight: weights.semibold, color: colors.red },
});
