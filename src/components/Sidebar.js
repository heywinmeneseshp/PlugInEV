import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Animated, Dimensions, TouchableWithoutFeedback, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import PluginLogo from './PluginLogo';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;
const LOGO_U = require('../../assets/logo_u.png');

/* Solo items que NO están en el tab bar */
const MENU_ITEMS = [
  { icon: 'headset-outline',     label: 'Soporte Técnico',  screen: null },
  { icon: 'help-circle-outline', label: 'Ayuda & FAQ',      screen: null },
  { icon: 'shield-outline',      label: 'Privacidad',       screen: null },
];

export default function Sidebar({ visible, onClose }) {
  const insets    = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout, switchRole } = useAuth();
  const slideAnim   = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [hostMode, setHostMode] = React.useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: visible ? 0 : -DRAWER_WIDTH,
        useNativeDriver: true, damping: 22, stiffness: 220,
      }),
      Animated.timing(overlayAnim, {
        toValue: visible ? 1 : 0, duration: 220, useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const handleNav = (screen) => {
    onClose();
    if (screen) setTimeout(() => navigation.navigate(screen), 250);
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 100, elevation: 100 }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[
        styles.drawer,
        { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 20 },
      ]}>

        {/* ── Logo ── */}
        <View style={styles.logoRow}>
          <PluginLogo variant="wordmark" size={0.38} />
        </View>

        {/* ── Perfil ── */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#00BAFF', '#00FF8C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.nombre?.charAt(0)?.toUpperCase() || 'U'}</Text>
            </View>
          </LinearGradient>

          <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={11} color={colors.green} />
            <Text style={styles.verifiedText}> Verificado</Text>
          </View>
        </View>

        {/* ── Modo Anfitrión ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONFIGURACIÓN</Text>

          <View style={styles.glassCard}>
            <View style={styles.toggleRow}>
              <LinearGradient
                colors={['rgba(0,186,255,0.2)', 'rgba(0,255,140,0.2)']}
                style={styles.iconPill}
              >
                <Image source={LOGO_U} style={styles.isotipoSmall} resizeMode="contain" />
              </LinearGradient>
              <Text style={styles.toggleLabel}>Modo Anfitrión</Text>
              <Switch
                value={hostMode}
                onValueChange={(val) => { setHostMode(val); if (val) { onClose(); setTimeout(() => switchRole('anfitrion'), 300); } }}
                trackColor={{ false: colors.trackBg, true: 'rgba(0,186,255,0.4)' }}
                thumbColor={hostMode ? colors.cyan : colors.textMuted}
                ios_backgroundColor={colors.trackBg}
                style={{ marginLeft: 'auto' }}
              />
            </View>
          </View>

          {/* Tipo de conector */}
          <View style={[styles.glassCard, { marginTop: 8 }]}>
            <View style={styles.toggleRow}>
              <View style={styles.iconPillDim}>
                <Ionicons name="flash-outline" size={14} color={colors.cyan} />
              </View>
              <View>
                <Text style={styles.connectorMeta}>Tipo de conector</Text>
                <Text style={styles.connectorValue}>Tipo 2 — Mennekes</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
            </View>
          </View>
        </View>

        {/* ── Menu items ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AYUDA</Text>
          <View style={styles.glassCard}>
            {MENU_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuDivider]}
                onPress={() => handleNav(item.screen)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={18} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* ── Cerrar sesión ── */}
        <TouchableOpacity
          style={[styles.logoutBtn, { marginBottom: insets.bottom + 20 }]}
          onPress={() => { onClose(); setTimeout(logout, 300); }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.red} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  drawer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#070E1C',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 18,
  },

  /* Logo */
  logoRow: {
    marginBottom: 24,
  },

  /* Profile card */
  profileCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 20,
    gap: 6,
  },
  avatarRing: {
    width: 64, height: 64, borderRadius: 32,
    padding: 2.5,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 59, height: 59, borderRadius: 29.5,
    backgroundColor: '#0D1A2D',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: weights.bold, color: colors.green },
  userName: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,255,140,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(0,255,140,0.3)',
  },
  verifiedText: { fontSize: 10, color: colors.green, fontWeight: weights.semibold },
  userEmail: { fontSize: 12, color: colors.textMuted },

  /* Sections */
  section: { marginBottom: 16 },
  sectionLabel: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold,
    letterSpacing: 1, marginBottom: 8, marginLeft: 4,
  },

  /* Glass card */
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  iconPill: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  iconPillDim: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(0,186,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  isotipoSmall: { width: 18, height: 18 },
  toggleLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: weights.medium },
  connectorMeta: { fontSize: 10, color: colors.textMuted },
  connectorValue: { fontSize: 13, color: colors.textPrimary, fontWeight: weights.medium },

  /* Menu rows */
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  menuLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: weights.medium },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.25)',
    borderRadius: radius.xl,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  logoutText: { fontSize: 14, color: colors.red, fontWeight: weights.semibold },
});
