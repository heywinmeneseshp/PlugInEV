import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, Alert, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword, resetPassword } from '../services/api/auth';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) { Alert.alert('Campo requerido', 'Ingresa tu correo'); return; }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res?.otp) Alert.alert('Código OTP', `Modo debug: ${res.otp}`);
      Alert.alert('Código enviado', 'Revisa tu bandeja de entrada');
      setStep('reset');
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!code || !newPassword) { Alert.alert('Campos requeridos', 'Completa todos los campos'); return; }
    if (newPassword.length < 8) { Alert.alert('Contraseña muy corta', 'Mínimo 8 caracteres'); return; }
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      Alert.alert('Contraseña restablecida', 'Ahora puedes iniciar sesión con tu nueva contraseña');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Recuperar contraseña</Text>
        <View style={{ width: 40 }} />
      </View>

      {step === 'email' ? (
        <View style={s.form}>
          <Text style={s.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={s.sub}>Ingresa tu correo y te enviaremos un código de verificación.</Text>
          <Text style={s.label}>Correo electrónico</Text>
          <TextInput
            style={s.input}
            placeholder="tu@correo.com"
            placeholderTextColor={colors.textHint}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <GradientButton
            label={loading ? 'Enviando...' : 'Enviar código'}
            onPress={handleSendCode}
            disabled={loading}
            style={{ marginTop: 8 }}
          />
        </View>
      ) : (
        <View style={s.form}>
          <Text style={s.title}>Nueva contraseña</Text>
          <Text style={s.sub}>Ingresa el código que recibiste y tu nueva contraseña.</Text>
          <Text style={s.label}>Código de verificación</Text>
          <TextInput
            style={s.input}
            placeholder="000000"
            placeholderTextColor={colors.textHint}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Text style={s.label}>Nueva contraseña</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textHint}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <GradientButton
            label={loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            onPress={handleReset}
            disabled={loading}
            style={{ marginTop: 8 }}
          />
          <TouchableOpacity style={s.backLink} onPress={() => setStep('email')}>
            <Ionicons name="arrow-back" size={14} color={colors.cyan} />
            <Text style={s.backLinkText}>Volver al paso anterior</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },
  form: { paddingHorizontal: 20, gap: 12, marginTop: 24 },
  title: { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary },
  sub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: -4 },
  label: { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium, marginTop: 4 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: colors.textPrimary,
  },
  backLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12,
  },
  backLinkText: { fontSize: 14, color: colors.cyan, fontWeight: weights.medium },
});
