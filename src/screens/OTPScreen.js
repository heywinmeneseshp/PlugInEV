import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { reenviarOTP } from '../services/api/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '../components/GradientButton';
import { colors, fonts, weights, radius } from '../styles/theme';

const OTP_LENGTH = 6;
const RESEND_DELAY = 60;

export default function OTPScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { verifyOTP } = useAuth();
  const email = route.params?.email || '';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
    setCanResend(true);
  }, [timer]);

  const handleChange = useCallback((text, index) => {
    const digit = text.replace(/[^0-9]/g, '');
    if (!digit && text.length > 0) return;
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit.slice(-1);
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }, []);

  const handleKeyPress = useCallback((e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleResend = async () => {
    try {
      await reenviarOTP(email, 'email_verification');
      Alert.alert('Código reenviado', 'Revisa tu correo (incluida la carpeta de spam).');
    } catch (err) {
      Alert.alert('No se pudo reenviar', err.message || 'Intenta de nuevo');
    }
    setTimer(RESEND_DELAY);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;
    setLoading(true);
    try {
      await verifyOTP(email, code);
      navigation.navigate('RolSelection');
    } catch (err) {
      Alert.alert('Código incorrecto', err.message || 'Verifica el código e intenta de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== '');
  const displayEmail = email.length > 30 ? email.slice(0, 27) + '...' : email;
  const formatTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificar código</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.body}>
        <Text style={styles.description}>
          Ingresa el código de {OTP_LENGTH} dígitos enviado a {displayEmail}
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {canResend ? (
          <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
            <Text style={styles.resendText}>Reenviar código</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>Reenviar en {formatTimer(timer)}</Text>
        )}

        <GradientButton
          label={loading ? 'Verificando...' : 'Verificar'}
          onPress={handleVerify}
          disabled={!isComplete || loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' },
  description: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 6,
    marginBottom: 32,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: colors.textPrimary,
    fontSize: fonts['5xl'],
    fontWeight: weights.bold,
    textAlign: 'center',
  },
  otpInputFilled: { borderColor: colors.cyan },
  resendButton: { paddingVertical: 12, paddingHorizontal: 24, marginBottom: 24 },
  resendText: { fontSize: fonts.lg, color: colors.cyan, fontWeight: weights.semibold },
  timerText: { fontSize: fonts.md, color: colors.textMuted, marginBottom: 24 },
});
