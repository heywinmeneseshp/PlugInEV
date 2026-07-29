import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import PluginLogo from '../components/PluginLogo';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');
const LOGO_U = require('../../assets/logo_u.png');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try { await login(email, password); }
    catch (e) { setLoading(false); Alert.alert('Error', e.message || 'No se pudo conectar con el servidor'); }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Glows estáticos de fondo */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.isotipoHalo}>
            <LinearGradient
              colors={['rgba(0,186,255,0.18)', 'rgba(0,255,140,0.14)']}
              style={styles.isotipoGlow}
            >
              <Image source={LOGO_U} style={styles.isotipoImg} resizeMode="contain" />
            </LinearGradient>
          </View>
          <PluginLogo variant="wordmark" size={0.62} />
          <Text style={styles.tagline}>Carga inteligente para tu EV</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Iniciar sesión</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              placeholderTextColor={colors.textHint}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textHint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <GradientButton
            label={loading ? 'Ingresando...' : 'Entrar'}
            onPress={handleLogin}
            disabled={loading}
            style={{ marginTop: 8 }}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.registerAccent}>Crear cuenta</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  /* Glows de ambiente */
  glowTop: {
    position: 'absolute',
    top: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0,186,255,0.09)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0,255,140,0.06)',
  },

  /* Hero */
  hero: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 28,
    gap: 12,
  },
  isotipoHalo: {
    marginBottom: 4,
  },
  isotipoGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,255,140,0.2)',
  },
  isotipoImg: {
    width: 62,
    height: 62,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: weights.medium,
    marginTop: -4,
  },

  /* Form */
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius['2xl'],
    padding: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: weights.bold,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: weights.medium,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerAccent: {
    color: colors.cyan,
    fontWeight: weights.semibold,
  },
});
