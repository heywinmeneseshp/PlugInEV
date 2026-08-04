import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { listarMarcasVehiculos, listarConectores } from '../services/api/catalogos';
import GradientButton from '../components/GradientButton';
import { colors, fonts, weights, radius } from '../styles/theme';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [modeloCarro, setModeloCarro] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [marcas, setMarcas] = useState([]);
  const [conectores, setConectores] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [connectorId, setConnectorId] = useState(null);

  useEffect(() => {
    listarMarcasVehiculos().then(setMarcas).catch(() => {});
    listarConectores().then(setConectores).catch(() => {});
  }, []);

  // La API aún no tiene catálogo sembrado (arrays vacíos) — sección
  // de vehículo se oculta hasta que haya opciones reales que elegir
  const hasVehicleCatalog = marcas.length > 0 && conectores.length > 0;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const parsePhone = (phone) => {
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length > 10) return { code: `+${digits.slice(0, digits.length - 10)}`, number: digits.slice(-10) };
    return { code: '+57', number: digits };
  };

  const handleSubmit = async () => {
    if (!nombre || !apellido || !correo || !celular || !password || !confirmPassword) {
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
      const phone = parsePhone(celular);
      const payload = {
        email: correo,
        password,
        name: `${nombre} ${apellido}`.trim(),
        profile_type: 'natural_person',
        phone_country_code: phone.code,
        phone_number: phone.number,
        // Solo se envía "vehicle" cuando el usuario eligió marca y conector
        // reales del catálogo — la API exige UUID válidos, no texto libre
        ...(brandId && connectorId ? {
          vehicle: { brand_id: brandId, model: modeloCarro, connector_id: connectorId },
        } : {}),
      };
      await register(payload);
      navigation.navigate('OTP', { email: correo });
    } catch (err) {
      Alert.alert('No se pudo crear la cuenta', err.message || 'Intenta de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
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
        {[
          { label: 'Nombre', value: nombre, setter: setNombre, placeholder: 'Nombre', capitalize: 'words' },
          { label: 'Apellido', value: apellido, setter: setApellido, placeholder: 'Apellido', capitalize: 'words' },
          { label: 'Correo', value: correo, setter: setCorreo, placeholder: 'tu@correo.com', keyboard: 'email-address', capitalize: 'none' },
          { label: 'Celular', value: celular, setter: setCelular, placeholder: '+57 300 000 0000', keyboard: 'phone-pad' },
        ].map(({ label, value, setter, placeholder, keyboard, capitalize }) => (
          <View key={label} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.textHint}
              value={value}
              onChangeText={setter}
              keyboardType={keyboard || 'default'}
              autoCapitalize={capitalize || 'sentences'}
              autoCorrect={false}
            />
          </View>
        ))}

        {hasVehicleCatalog && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Modelo de carro (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Model 3"
                placeholderTextColor={colors.textHint}
                value={modeloCarro}
                onChangeText={setModeloCarro}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Marca del vehículo</Text>
              <View style={styles.chipRow}>
                {marcas.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.chip, brandId === m.id && styles.chipActive]}
                    onPress={() => setBrandId(brandId === m.id ? null : m.id)}
                  >
                    <Text style={[styles.chipText, brandId === m.id && styles.chipTextActive]}>{m.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de conector</Text>
              <View style={styles.chipRow}>
                {conectores.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.chip, connectorId === c.id && styles.chipActive]}
                    onPress={() => setConnectorId(connectorId === c.id ? null : c.id)}
                  >
                    <Text style={[styles.chipText, connectorId === c.id && styles.chipTextActive]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {[
          { label: 'Contraseña', value: password, setter: setPassword, placeholder: 'Mínimo 8 caracteres' },
          { label: 'Confirmar contraseña', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Repite la contraseña' },
        ].map(({ label, value, setter, placeholder }) => (
          <View key={label} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.textHint}
              value={value}
              onChangeText={setter}
              secureTextEntry
            />
          </View>
        ))}

        <GradientButton
          label={loading ? 'Creando cuenta...' : 'Continuar'}
          onPress={handleSubmit}
          disabled={loading}
          style={{ marginTop: 24, marginBottom: 40 }}
        />
      </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: fonts.md, color: colors.textSecondary, marginBottom: 8, fontWeight: weights.medium },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fonts.xl,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipActive: { backgroundColor: colors.cyanDim, borderColor: colors.cyan },
  chipText: { fontSize: fonts.md, color: colors.textSecondary, fontWeight: weights.medium },
  chipTextActive: { color: colors.cyan, fontWeight: weights.bold },
});
