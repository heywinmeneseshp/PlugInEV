import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

const TRANSACTIONS = [
  { id: '1', concept: 'Carga ElectroCarga Norte', amount: -2475, date: 'Hoy' },
  { id: '2', concept: 'Recarga', amount: 10000, date: 'Ayer' },
  { id: '3', concept: 'Carga VoltStation', amount: -1350, date: '23/06' },
  { id: '4', concept: 'Carga E-Charge', amount: -3240, date: '22/06' },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { updateWallet } = useAuth();
  const [balance, setBalance] = useState(25000);

  const handleDeposit = () => {
    const newBalance = balance + 10000;
    setBalance(newBalance);
    updateWallet(newBalance);
    Alert.alert('Recarga exitosa', 'Se han agregado $10.000 a tu cartera');
  };

  const renderTransaction = ({ item }) => (
    <View style={s.txRow}>
      <View style={[s.txIcon, { backgroundColor: item.amount > 0 ? colors.greenDim : colors.redDim }]}>
        <Ionicons
          name={item.amount > 0 ? 'arrow-down-outline' : 'flash-outline'}
          size={16}
          color={item.amount > 0 ? colors.green : colors.red}
        />
      </View>
      <View style={s.txInfo}>
        <Text style={s.txConcept}>{item.concept}</Text>
        <Text style={s.txDate}>{item.date}</Text>
      </View>
      <Text style={[s.txAmount, { color: item.amount > 0 ? colors.green : colors.red }]}>
        {item.amount > 0 ? '+' : ''}{formatCOP(Math.abs(item.amount))}
      </Text>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Cartera</Text>
      </View>

      {/* Balance card */}
      <View style={s.balanceCard}>
        <Ionicons name="wallet-outline" size={20} color={colors.textSecondary} style={{ marginBottom: 8 }} />
        <Text style={s.balanceLabel}>Saldo disponible</Text>
        <Text style={s.balanceAmount}>{formatCOP(balance)}</Text>
      </View>

      {/* Recargar */}
      <View style={s.actionRow}>
        <GradientButton
          label="Recargar +$10.000"
          onPress={handleDeposit}
          icon={<Ionicons name="add-circle-outline" size={18} color="#050A15" />}
        />
      </View>

      <Text style={s.sectionTitle}>Movimientos recientes</Text>

      <FlatList
        data={TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: weights.extrabold, color: colors.textPrimary },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius['2xl'],
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  balanceAmount: { fontSize: 40, fontWeight: weights.extrabold, color: colors.textPrimary },
  actionRow: { marginHorizontal: 20, marginBottom: 28 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: weights.bold,
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txConcept: { fontSize: 14, fontWeight: weights.semibold, color: colors.textPrimary, marginBottom: 2 },
  txDate: { fontSize: 12, color: colors.textMuted },
  txAmount: { fontSize: 15, fontWeight: weights.bold },
});
