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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, weights, radius } from '../styles/theme';

const OTP_LENGTH = 8;
const RESEND_DELAY = 60;

export default function OTPScreen() {
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

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback((e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleResend = () => {
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
      await verifyOTP(code);
      navigation.navigate('RolSelection');
    } catch {
      // handled by auth context
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== '');
  const displayEmail = email.length > 30 ? email.slice(0, 27) + '...' : email;

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificar código</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.body}>
        <Text style={styles.description}>
          Ingresa el código de 8 dígitos enviado a {displayEmail}
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

        <TouchableOpacity
          style={[styles.verifyButton, (!isComplete || loading) && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={!isComplete || loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verificando...' : 'Verificar'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: fonts['3xl'],
    fontWeight: weights.semibold,
    color: colors.white,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  description: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
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
    color: colors.white,
    fontSize: fonts['5xl'],
    fontWeight: weights.bold,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  otpInputFilled: {
    borderColor: colors.accent,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  resendText: {
    fontSize: fonts.lg,
    color: colors.accent,
    fontWeight: weights.semibold,
  },
  timerText: {
    fontSize: fonts.md,
    color: colors.textMuted,
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyButtonDisabled: {
    opacity: 0.4,
  },
  verifyButtonText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
});
