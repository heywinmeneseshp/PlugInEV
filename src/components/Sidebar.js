import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import PluginLogo from './PluginLogo';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

const MENU_ITEMS = [
  { icon: 'map-outline',          label: 'Inicio',               screen: 'Mapa' },
  { icon: 'calendar-outline',     label: 'Mis Reservas',         screen: 'Reservas' },
  { icon: 'time-outline',         label: 'Historial de Sesiones',screen: 'Reservas' },
  { icon: 'wallet-outline',       label: 'Wallet & Pagos',       screen: 'Cartera' },
  { icon: 'headset-outline',      label: 'Soporte Técnico',      screen: null },
  { icon: 'help-circle-outline',  label: 'Ayuda y Preguntas',    screen: null },
];

export default function Sidebar({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const slideAnim   = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [hostMode, setHostMode] = React.useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }),
        Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim,   { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0,             duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, slideAnim, overlayAnim]);

  if (!visible && slideAnim._value === -DRAWER_WIDTH) return null;

  const handleNav = (screen) => {
    onClose();
    if (screen) setTimeout(() => navigation.navigate(screen), 250);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 100, elevation: 100 }]} pointerEvents={visible ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 16 }]}
      >
        {/* User info */}
        <View style={styles.userSection}>
          <PluginLogo variant="wordmark" size={0.38} />
          <View style={[styles.avatarRing, { marginTop: 16 }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.nombre?.charAt(0) || 'U'}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={colors.green} />
            <Text style={styles.verifiedText}> Verificado</Text>
          </View>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Host mode toggle */}
        <View style={styles.hostToggle}>
          <Ionicons name="home-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.hostToggleLabel}>Modo Anfitrión</Text>
          <Switch
            value={hostMode}
            onValueChange={setHostMode}
            trackColor={{ false: colors.trackBg, true: colors.cyanDim }}
            thumbColor={hostMode ? colors.cyan : colors.textMuted}
            ios_backgroundColor={colors.trackBg}
            style={{ marginLeft: 'auto' }}
          />
        </View>

        {/* Connector picker */}
        <View style={styles.connectorSection}>
          <Text style={styles.connectorLabel}>Tipo de conector</Text>
          <View style={styles.connectorPicker}>
            <Ionicons name="flash-outline" size={14} color={colors.cyan} />
            <Text style={styles.connectorValue}>  Tipo 2 (Mennekes)</Text>
            <Ionicons name="chevron-down-outline" size={14} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={() => handleNav(item.screen)} activeOpacity={0.7}>
              <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem, { marginBottom: insets.bottom + 16 }]}
          onPress={() => { onClose(); setTimeout(logout, 300); }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.red} />
          <Text style={[styles.menuLabel, styles.logoutLabel]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#0A1525',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
  },
  userSection: {
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  avatarRing: {
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 2, borderColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.greenDim,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: weights.bold, color: colors.green },
  userName:   { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.greenDim,
    borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3,
    marginBottom: 6,
    borderWidth: 1, borderColor: colors.green,
  },
  verifiedText: { fontSize: 11, color: colors.green, fontWeight: weights.semibold },
  userEmail:   { fontSize: 12, color: colors.textMuted },

  hostToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 12,
  },
  hostToggleLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: weights.medium },

  connectorSection: { marginBottom: 20 },
  connectorLabel: {
    fontSize: 11, color: colors.textMuted, fontWeight: weights.medium,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  connectorPicker: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14, paddingVertical: 11,
  },
  connectorValue: { fontSize: 14, color: colors.textPrimary },

  menuList: { flex: 1 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuLabel: { fontSize: 15, color: colors.textPrimary, fontWeight: weights.medium },
  logoutItem: { borderBottomWidth: 0, marginTop: 8 },
  logoutLabel: { color: colors.red },
});
