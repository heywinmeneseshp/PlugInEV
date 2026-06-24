import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');
const LOGO_U = require('../../assets/logo_u.png');

export default function ProfileScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const initials = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : 'HE';
  const role     = user?.role || 'conductor';

  const INFO_ROWS = [
    { icon: 'car-outline',      label: 'Vehículo',         value: user?.vehiculo    || 'Tesla Model 3' },
    { icon: 'document-outline', label: 'Placa',            value: user?.placa       || 'ABC-123' },
    { icon: 'card-outline',     label: 'Método de pago',   value: user?.metodoPago  || 'Visa •••• 4242' },
    { icon: 'calendar-outline', label: 'Reservas activas', value: String(user?.reservasActivas ?? 1) },
  ];

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Perfil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Hero avatar ── */}
        <View style={s.heroSection}>
          {/* Glow de fondo */}
          <View style={s.avatarGlow} />

          {/* Avatar con halo gradiente */}
          <LinearGradient
            colors={['#00BAFF', '#00FF8C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.avatarRing}
          >
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
          </LinearGradient>

          <Text style={s.name}>{user?.nombre || 'Heywin'}</Text>
          <Text style={s.email}>{user?.email || 'heywin@correo.com'}</Text>

          {/* Badge de rol con gradiente */}
          <LinearGradient
            colors={['rgba(0,186,255,0.2)', 'rgba(0,255,140,0.2)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.roleBadge}
          >
            <Ionicons
              name={role === 'anfitrion' ? 'home-outline' : 'car-outline'}
              size={12} color={colors.cyan}
            />
            <Text style={s.roleText}>{role === 'anfitrion' ? 'Anfitrión' : 'Conductor'}</Text>
          </LinearGradient>
        </View>

        {/* ── Información ── */}
        <Text style={s.sectionLabel}>INFORMACIÓN</Text>
        <View style={s.glassCard}>
          {INFO_ROWS.map(({ icon, label, value }, i) => (
            <React.Fragment key={label}>
              <View style={s.infoRow}>
                <View style={s.iconPill}>
                  <Ionicons name={icon} size={14} color={colors.cyan} />
                </View>
                <Text style={s.infoLabel}>{label}</Text>
                <Text style={s.infoValue}>{value}</Text>
              </View>
              {i < INFO_ROWS.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Modo anfitrión ── */}
        <Text style={s.sectionLabel}>CUENTA</Text>
        {role === 'anfitrion' ? (
          <GradientButton
            label="Dashboard anfitrión"
            onPress={() => navigation.navigate('AnfitrionStack')}
            icon={<Ionicons name="grid-outline" size={16} color="#050A15" />}
            style={{ marginBottom: 28 }}
          />
        ) : (
          <TouchableOpacity style={s.hostBtn} onPress={() => navigation.navigate('AnfitrionStack')} activeOpacity={0.8}>
            <View style={s.hostBtnLeft}>
              <LinearGradient
                colors={['rgba(0,186,255,0.2)', 'rgba(0,255,140,0.2)']}
                style={s.hostIconPill}
              >
                <Image source={LOGO_U} style={s.hostIsotipo} resizeMode="contain" />
              </LinearGradient>
              <Text style={s.hostBtnText}>Modo Anfitrión</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* ── Cerrar sesión ── */}
        <TouchableOpacity style={s.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={colors.red} />
          <Text style={s.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },

  scroll: { paddingHorizontal: 20 },

  /* Hero */
  heroSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  avatarGlow: {
    position: 'absolute',
    top: -20,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(0,186,255,0.07)',
  },
  avatarRing: {
    width: 88, height: 88, borderRadius: 44,
    padding: 2.5,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 83, height: 83, borderRadius: 41.5,
    backgroundColor: '#0D1A2D',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: weights.bold, color: colors.green },
  name:  { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  email: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.3)',
  },
  roleText: { fontSize: 12, color: colors.cyan, fontWeight: weights.semibold },

  /* Section label */
  sectionLabel: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold,
    letterSpacing: 1, marginBottom: 8, marginLeft: 2,
  },

  /* Glass card */
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  iconPill: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: weights.medium, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: 16 },

  /* Host button */
  hostBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius['2xl'],
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 28,
  },
  hostBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hostIconPill: {
    width: 36, height: 36, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  hostIsotipo: { width: 20, height: 20 },
  hostBtnText: { fontSize: 15, fontWeight: weights.semibold, color: colors.textPrimary },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.25)',
    borderRadius: radius['2xl'],
    paddingVertical: 15,
  },
  logoutText: { fontSize: 15, fontWeight: weights.semibold, color: colors.red },
});
