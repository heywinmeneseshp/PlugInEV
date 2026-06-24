import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, weights, radius } from '../styles/theme';

const CONNECTOR_TYPES = ['CCS', 'CHAdeMO', 'Type 2', 'GB/T'];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [modeloCarro, setModeloCarro] = useState('');
  const [connector, setConnector] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!nombre || !apellido || !correo || !celular || !modeloCarro || !connector || !password || !confirmPassword) {
      Alert.alert('Campos requeridos', 'Completa todos los campos');
      return;
    }
    if (!validateEmail(correo)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden', 'Verifica que las contraseñas sean iguales');
      return;
    }

    setLoading(true);
    try {
      await register({ nombre, apellido, correo, celular, modeloCarro, connector, password });
      navigation.navigate('OTP', { email: correo });
    } catch {
      // handled by auth context
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Crear cuenta</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={colors.textHint}
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor={colors.textHint}
            value={apellido}
            onChangeText={setApellido}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@correo.com"
            placeholderTextColor={colors.textHint}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Celular</Text>
          <TextInput
            style={styles.input}
            placeholder="+57 300 000 0000"
            placeholderTextColor={colors.textHint}
            value={celular}
            onChangeText={setCelular}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Modelo de carro</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Tesla Model 3"
            placeholderTextColor={colors.textHint}
            value={modeloCarro}
            onChangeText={setModeloCarro}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tipo de conector</Text>
          <View style={styles.chipRow}>
            {CONNECTOR_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, connector === type && styles.chipActive]}
                onPress={() => setConnector(type)}
              >
                <Text style={[styles.chipText, connector === type && styles.chipTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={colors.textHint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite la contraseña"
            placeholderTextColor={colors.textHint}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creando cuenta...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: weights.medium,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fonts.xl,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    fontWeight: weights.medium,
  },
  chipTextActive: {
    color: colors.bg,
    fontWeight: weights.bold,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
});
