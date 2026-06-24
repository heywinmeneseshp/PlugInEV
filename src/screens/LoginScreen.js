import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background glow */}
      <View style={styles.glowTop} />

      {/* Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🔌</Text>
        </View>
        <Text style={styles.logoTitle}>plügin</Text>
        <Text style={styles.logoSub}>Carga inteligente para tu EV</Text>
      </View>

      {/* Form */}
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
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>{loading ? 'Ingresando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerButtonAccent}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: insets.bottom + 24 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0,186,255,0.08)',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.greenDim,
    borderWidth: 1.5,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  logoEmoji: { fontSize: 32 },
  logoTitle: {
    fontSize: 28,
    fontWeight: weights.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  logoSub: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: weights.medium,
  },
  formCard: {
    width: width - 32,
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
  loginButton: {
    height: 52,
    borderRadius: radius['2xl'],
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: weights.bold,
    color: '#050A15',
    letterSpacing: 0.3,
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  registerButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerButtonAccent: {
    color: colors.cyan,
    fontWeight: weights.semibold,
  },
});
