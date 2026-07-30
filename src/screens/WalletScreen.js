import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  StyleSheet, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { formatCOP } from '../utils/format';
import { colors, weights, radius } from '../styles/theme';

const RECHARGE_AMOUNTS = [10000, 20000, 50000, 100000];

const PAYMENT_OPTIONS = [
  { id: 'nequi',       label: 'Nequi',           icon: 'phone-portrait-outline', sub: '300 123 4567' },
  { id: 'bancolombia', label: 'Bancolombia',      icon: 'business-outline',       sub: 'PSE · Débito' },
  { id: 'daviplata',   label: 'Daviplata',        icon: 'phone-portrait-outline', sub: '310 456 7890' },
  { id: 'card',        label: 'Tarjeta',          icon: 'card-outline',           sub: 'Visa / MC / Amex' },
];

const MOCK_TRANSACTIONS = [
  { id: '1', concept: 'Carga ElectroCarga Norte', amount: -20625, date: 'Hoy',   icon: 'flash-outline'    },
  { id: '2', concept: 'Recarga Nequi',            amount:  50000, date: 'Ayer',  icon: 'arrow-down'       },
  { id: '3', concept: 'Carga VoltStation',         amount:  -8100, date: '23/06', icon: 'flash-outline'    },
  { id: '4', concept: 'Carga E-Charge',            amount: -14580, date: '22/06', icon: 'flash-outline'    },
  { id: '5', concept: 'Recarga Bancolombia',       amount:  20000, date: '20/06', icon: 'arrow-down'       },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateWallet } = useAuth();

  const [balance, setBalance]           = useState(user?.walletBalance ?? 0);

  useEffect(() => {
    if (user?.walletBalance != null) setBalance(user.walletBalance);
  }, [user?.walletBalance]);
  const [showRecharge, setShowRecharge] = useState(false);
  const [selectedAmount, setAmount]     = useState(null);
  const [selectedPay, setPay]           = useState('nequi');

  const monthCharged = MOCK_TRANSACTIONS
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const handleConfirmRecharge = () => {
    if (!selectedAmount) return;
    const newBalance = balance + selectedAmount;
    setBalance(newBalance);
    updateWallet(newBalance);
    setShowRecharge(false);
    setAmount(null);
    Alert.alert('Recarga exitosa', `Se han agregado ${formatCOP(selectedAmount)} a tu cartera.`);
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Cartera</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Balance card */}
        <LinearGradient colors={['rgba(0,186,255,0.18)', 'rgba(0,255,140,0.10)']} style={s.balanceCard}>
          <View style={s.balanceTop}>
            <View style={s.balanceIcon}>
              <Ionicons name="wallet-outline" size={20} color={colors.cyan} />
            </View>
            <View style={s.escrowPill}>
              <Ionicons name="shield-checkmark-outline" size={12} color={colors.green} />
              <Text style={s.escrowText}>Escrow protegido</Text>
            </View>
          </View>
          <Text style={s.balanceLabel}>Saldo disponible</Text>
          <Text style={s.balanceAmount}>{formatCOP(balance)}</Text>
          <View style={s.statRow}>
            <View style={s.stat}>
              <Text style={s.statVal}>{formatCOP(monthCharged)}</Text>
              <Text style={s.statLabel}>Gastado este mes</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={[s.statVal, { color: colors.green }]}>{MOCK_TRANSACTIONS.filter((t) => t.amount < 0).length}</Text>
              <Text style={s.statLabel}>Sesiones totales</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Recharge button */}
        <TouchableOpacity
          onPress={() => setShowRecharge(true)}
          activeOpacity={0.85}
          style={s.rechargeWrap}
        >
          <LinearGradient colors={['#00BAFF', '#00FF8C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.rechargeBtn}>
            <Ionicons name="add-circle-outline" size={20} color="#050A15" />
            <Text style={s.rechargeBtnText}>Recargar saldo</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick amounts strip */}
        <View style={s.quickRow}>
          {RECHARGE_AMOUNTS.slice(0, 3).map((amt) => (
            <TouchableOpacity
              key={amt}
              style={s.quickChip}
              onPress={() => { setAmount(amt); setShowRecharge(true); }}
              activeOpacity={0.8}
            >
              <Text style={s.quickChipText}>+{formatCOP(amt)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <Text style={s.sectionTitle}>Movimientos recientes</Text>

        {MOCK_TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={s.txRow}>
            <View style={[s.txIcon, { backgroundColor: tx.amount > 0 ? 'rgba(0,255,140,0.12)' : 'rgba(0,186,255,0.12)' }]}>
              <Ionicons
                name={tx.icon}
                size={16}
                color={tx.amount > 0 ? colors.green : colors.cyan}
              />
            </View>
            <View style={s.txInfo}>
              <Text style={s.txConcept}>{tx.concept}</Text>
              <Text style={s.txDate}>{tx.date}</Text>
            </View>
            <Text style={[s.txAmount, { color: tx.amount > 0 ? colors.green : colors.textPrimary }]}>
              {tx.amount > 0 ? '+' : ''}{formatCOP(Math.abs(tx.amount))}
            </Text>
          </View>
        ))}

        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>

      {/* ── Recharge Modal ── */}
      <Modal visible={showRecharge} transparent animationType="slide" onRequestClose={() => setShowRecharge(false)}>
        <View style={s.modalWrapper}>
          <TouchableOpacity style={s.modalBackdrop} activeOpacity={1} onPress={() => setShowRecharge(false)} />
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Recargar cartera</Text>

            {/* Amount selector */}
            <Text style={s.modalLabel}>Monto</Text>
            <View style={s.amountGrid}>
              {RECHARGE_AMOUNTS.map((amt) => {
                const active = selectedAmount === amt;
                return active ? (
                  <TouchableOpacity key={amt} onPress={() => setAmount(amt)} activeOpacity={0.8} style={{ flex: 1, minWidth: '45%' }}>
                    <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.amountChipActive}>
                      <Text style={s.amountChipTextActive}>{formatCOP(amt)}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity key={amt} style={[s.amountChip, { flex: 1, minWidth: '45%' }]} onPress={() => setAmount(amt)} activeOpacity={0.8}>
                    <Text style={s.amountChipText}>{formatCOP(amt)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Payment method */}
            <Text style={s.modalLabel}>Método de recarga</Text>
            {PAYMENT_OPTIONS.map((pm) => {
              const active = selectedPay === pm.id;
              return (
                <TouchableOpacity
                  key={pm.id}
                  style={[s.payCard, active && s.payCardActive]}
                  onPress={() => setPay(pm.id)}
                  activeOpacity={0.8}
                >
                  <View style={[s.payIcon, active && s.payIconActive]}>
                    <Ionicons name={pm.icon} size={18} color={active ? '#050A15' : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.payLabel, active && s.payLabelActive]}>{pm.label}</Text>
                    <Text style={s.paySub}>{pm.sub}</Text>
                  </View>
                  {active && (
                    <LinearGradient colors={['#00BAFF', '#00FF8C']} style={s.payCheck}>
                      <Ionicons name="checkmark" size={11} color="#050A15" />
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Confirm button */}
            <TouchableOpacity
              onPress={handleConfirmRecharge}
              disabled={!selectedAmount}
              activeOpacity={0.85}
              style={s.confirmWrap}
            >
              <LinearGradient
                colors={selectedAmount ? ['#00BAFF', '#00FF8C'] : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.06)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.confirmGrad}
              >
                <Text style={[s.confirmText, !selectedAmount && s.confirmTextDisabled]}>
                  {selectedAmount ? `Recargar ${formatCOP(selectedAmount)}` : 'Selecciona un monto'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: weights.extrabold, color: colors.textPrimary },

  scroll: { paddingHorizontal: 20, gap: 14 },

  /* Balance card */
  balanceCard: {
    borderRadius: radius['2xl'], padding: 20, gap: 6,
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.25)',
  },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(0,186,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  escrowPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,255,140,0.1)',
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(0,255,140,0.2)',
  },
  escrowText: { fontSize: 11, color: colors.green, fontWeight: weights.semibold },
  balanceLabel: { fontSize: 12, color: colors.textSecondary },
  balanceAmount: { fontSize: 38, fontWeight: weights.extrabold, color: colors.textPrimary },
  statRow: { flexDirection: 'row', marginTop: 8, gap: 0 },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 2 },
  statVal: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  /* Recharge */
  rechargeWrap: { borderRadius: 27 },
  rechargeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 27,
  },
  rechargeBtnText: { fontSize: 16, fontWeight: weights.bold, color: '#050A15' },

  quickRow: { flexDirection: 'row', gap: 8 },
  quickChip: {
    flex: 1, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,186,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  quickChipText: { fontSize: 12, color: colors.cyan, fontWeight: weights.semibold },

  sectionTitle: { fontSize: 16, fontWeight: weights.bold, color: colors.textPrimary },

  txRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  txIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txConcept: { fontSize: 14, fontWeight: weights.semibold, color: colors.textPrimary, marginBottom: 2 },
  txDate: { fontSize: 12, color: colors.textMuted },
  txAmount: { fontSize: 15, fontWeight: weights.bold },

  /* Modal */
  modalWrapper: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: '#0D1626',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 0,
    gap: 14,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary },
  modalLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium, marginBottom: -6 },

  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amountChip: {
    height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  amountChipActive: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  amountChipText:       { fontSize: 14, color: colors.textSecondary, fontWeight: weights.semibold },
  amountChipTextActive: { fontSize: 14, color: '#050A15', fontWeight: weights.bold },

  payCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl, paddingHorizontal: 14, paddingVertical: 12,
  },
  payCardActive: { borderColor: 'rgba(0,186,255,0.4)', backgroundColor: 'rgba(0,186,255,0.07)' },
  payIcon: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  payIconActive: { backgroundColor: colors.cyan },
  payLabel:       { fontSize: 14, color: colors.textSecondary, fontWeight: weights.semibold },
  payLabelActive: { color: colors.textPrimary },
  paySub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  payCheck: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },

  confirmWrap: { borderRadius: 27, marginTop: 4 },
  confirmGrad: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  confirmText:         { fontSize: 16, fontWeight: weights.bold, color: '#050A15' },
  confirmTextDisabled: { color: colors.textMuted },
});
