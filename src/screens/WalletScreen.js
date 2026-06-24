import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { formatCOP } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const TRANSACTIONS = [
  { id: '1', concept: 'Carga ElectroCarga Norte', amount: -2475, date: 'Hoy' },
  { id: '2', concept: 'Recarga', amount: 10000, date: 'Ayer' },
  { id: '3', concept: 'Carga VoltStation', amount: -1350, date: '23/06' },
  { id: '4', concept: 'Carga E-Charge', amount: -3240, date: '22/06' },
];

export default function WalletScreen() {
  const { updateWallet } = useAuth();
  const [balance, setBalance] = useState(25000);

  const handleDeposit = () => {
    const newBalance = balance + 10000;
    setBalance(newBalance);
    updateWallet(newBalance);
    Alert.alert('Recarga exitosa', 'Se han agregado $10.000 a tu cartera');
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionRow}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionConcept}>{item.concept}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount > 0 ? '#22C55E' : '#EF4444' },
        ]}
      >
        {item.amount > 0 ? '+' : ''}
        {formatCOP(Math.abs(item.amount))}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cartera</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>{formatCOP(balance)}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
          <Text style={styles.depositButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Movimientos recientes</Text>
      </View>

      <FlatList
        data={TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 28,
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0F1A',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  transactionLeft: {
    flex: 1,
    marginRight: 12,
  },
  transactionConcept: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
