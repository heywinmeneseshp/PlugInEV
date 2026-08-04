import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '../components/GradientButton';
import { obtenerEstadisticas } from '../services/api/anfitrion';
import { useAuth } from '../context/AuthContext';
import DemoBadge from '../components/DemoBadge';
import { colors, weights, radius } from '../styles/theme';

const BANKS = [
  { id: 'nequi',    label: 'Nequi',        icon: 'phone-portrait-outline' },
  { id: 'bancol',   label: 'Bancolombia',  icon: 'business-outline'       },
  { id: 'daviplata',label: 'Daviplata',    icon: 'phone-portrait-outline' },
  { id: 'banco_bogota', label: 'Banco de Bogotá', icon: 'business-outline' },
];

const ACCOUNT_TYPES = ['Ahorros', 'Corriente'];


export default function HostAccountScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [bank, setBank]           = useState('nequi');
  const [accountType, setAccountType] = useState('Ahorros');
  const [accountNum, setAccountNum]   = useState('');
  const [accountName, setAccountName] = useState('');
  const [saved, setSaved]             = useState(false);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingPayout: 0,
    sessions: 0,
    nextPayout: 'Por definir',
  });

  useEffect(() => {
    obtenerEstadisticas(user?.email)
      .then(data => {
        if (data) setStats({
          totalEarned: data.total_earned || 0,
          pendingPayout: data.pending_payout || 0,
          sessions: data.total_sessions || 0,
          nextPayout: data.next_payout || 'Por definir',
        });
      })
      .catch(() => {});
  }, [user]);

  const handleSave = () => {
    if (!accountNum.trim() || !accountName.trim()) {
      Alert.alert('Campos requeridos', 'Completa el número y titular de la cuenta.');
      return;
    }
    // TODO: cuando el backend tenga endpoint de pago, conectar aquí
    setSaved(true);
    Alert.alert('Guardado', 'Los datos de pago serán procesados próximamente.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.header}>
        <Text style={s.headerTitle}>Mi Cuenta</Text>
        <DemoBadge style={{ marginTop: 6 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* ── Resumen de ganancias ── */}
        <LinearGradient colors={['rgba(0,186,255,0.12)','rgba(0,255,140,0.10)']} style={s.summaryCard}>
          <View style={s.summaryTop}>
            <View>
              <Text style={s.summaryMeta}>Ganancias totales</Text>
              <Text style={s.summaryTotal}>${stats.totalEarned.toLocaleString('es-CO')}</Text>
            </View>
            <View style={s.summaryBadge}>
              <Ionicons name="flash" size={14} color="#050A15" />
              <Text style={s.summaryBadgeText}>{stats.sessions} sesiones</Text>
            </View>
          </View>

          <View style={s.summaryDivider} />

          <View style={s.summaryRow}>
            <View>
              <Text style={s.summaryMeta}>Pendiente de pago</Text>
              <Text style={s.summaryPending}>${stats.pendingPayout.toLocaleString('es-CO')}</Text>
            </View>
            <View>
              <Text style={s.summaryMeta}>Próximo pago</Text>
              <Text style={s.summaryDate}>{stats.nextPayout}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Cuenta de cobro ── */}
        <Text style={s.sectionLabel}>CUENTA DE COBRO</Text>

        {/* Banco */}
        <Text style={s.fieldLabel}>Entidad</Text>
        <View style={s.bankGrid}>
          {BANKS.map((b) => {
            const active = bank === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[s.bankCard, active && s.bankCardActive]}
                onPress={() => setBank(b.id)}
                activeOpacity={0.8}
              >
                <Ionicons name={b.icon} size={20} color={active ? colors.cyan : colors.textMuted} />
                <Text style={[s.bankLabel, active && s.bankLabelActive]}>{b.label}</Text>
                {active && (
                  <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.bankCheck}>
                    <Ionicons name="checkmark" size={10} color="#050A15" />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tipo de cuenta */}
        <Text style={s.fieldLabel}>Tipo de cuenta</Text>
        <View style={s.typeRow}>
          {ACCOUNT_TYPES.map((t) => {
            const active = accountType === t;
            if (active) {
              return (
                <TouchableOpacity key={t} onPress={() => setAccountType(t)} activeOpacity={0.8} style={{flex:1}}>
                  <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.typeChipActive}>
                    <Text style={s.typeChipTextActive}>{t}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity key={t} style={s.typeChip} onPress={() => setAccountType(t)} activeOpacity={0.75}>
                <Text style={s.typeChipText}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Número de cuenta */}
        <Text style={s.fieldLabel}>Número de cuenta / teléfono</Text>
        <View style={s.inputWrap}>
          <Ionicons name="card-outline" size={16} color={colors.textMuted} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder="Ej: 300 123 4567"
            placeholderTextColor={colors.textHint}
            value={accountNum}
            onChangeText={setAccountNum}
            keyboardType="phone-pad"
          />
        </View>

        {/* Titular */}
        <Text style={s.fieldLabel}>Titular de la cuenta</Text>
        <View style={s.inputWrap}>
          <Ionicons name="person-outline" size={16} color={colors.textMuted} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder="Nombre completo"
            placeholderTextColor={colors.textHint}
            value={accountName}
            onChangeText={setAccountName}
          />
        </View>

        {/* Info escrow */}
        <View style={s.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.green} />
          <Text style={s.infoText}>
            Los pagos se liquidan cada lunes. El dinero queda protegido y solo lo recibes cuando la sesión se completa exitosamente.
          </Text>
        </View>

        {/* Botón guardar */}
        {saved ? (
          <View style={s.savedBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.green} />
            <Text style={s.savedText}>Cuenta guardada correctamente</Text>
          </View>
        ) : (
          <GradientButton
            label="Guardar cuenta"
            onPress={handleSave}
            icon={<Ionicons name="save-outline" size={18} color="#050A15" />}
          />
        )}

        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary },
  scroll: { paddingHorizontal: 20, gap: 14 },

  /* Summary */
  summaryCard: {
    borderRadius: radius['2xl'], padding: 20, gap: 14,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
  },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryMeta: { fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  summaryTotal: { fontSize: 26, fontWeight: weights.bold, color: colors.textPrimary },
  summaryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.green, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  summaryBadgeText: { fontSize: 11, fontWeight: weights.bold, color: '#050A15' },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryPending: { fontSize: 18, fontWeight: weights.bold, color: colors.cyan },
  summaryDate:    { fontSize: 15, fontWeight: weights.semibold, color: colors.green },

  sectionLabel: {
    fontSize: 10, color: colors.textMuted, fontWeight: weights.semibold,
    letterSpacing: 1, marginTop: 8,
  },

  fieldLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium },

  /* Bank grid */
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bankCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl, padding: 14,
    alignItems: 'center', gap: 6,
  },
  bankCardActive: { borderColor: 'rgba(0,186,255,0.4)', backgroundColor: 'rgba(0,186,255,0.07)' },
  bankLabel:      { fontSize: 12, color: colors.textMuted, fontWeight: weights.medium, textAlign: 'center' },
  bankLabelActive:{ color: colors.cyan },
  bankCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Type chips */
  typeRow: { flexDirection: 'row', gap: 10 },
  typeChip: {
    flex: 1, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  typeChipActive: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  typeChipText:       { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium },
  typeChipTextActive: { fontSize: 13, color: '#050A15', fontWeight: weights.bold },

  /* Inputs */
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.lg, paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: colors.textPrimary },

  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,255,140,0.07)',
    borderWidth: 1, borderColor: 'rgba(0,255,140,0.2)',
    borderRadius: radius.lg, padding: 14,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  savedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(0,255,140,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,255,140,0.25)',
    borderRadius: radius.xl, paddingVertical: 16,
  },
  savedText: { fontSize: 15, fontWeight: weights.semibold, color: colors.green },
});
