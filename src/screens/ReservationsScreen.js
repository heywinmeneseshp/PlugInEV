import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatCOP } from '../utils/format';

const TABS = ['Activas', 'Historial'];

const MOCK_RESERVATIONS = [
  { id: '1', stationName: 'ElectroCarga Norte', address: 'Cra. 65 #80-120', date: 'Hoy', time: '14:00', duration: '1h', cost: 2475, status: 'active' },
  { id: '2', stationName: 'VoltStation El Prado', address: 'Cra. 54 #70-30', date: 'Hoy', time: '16:30', duration: '2h', cost: 1350, status: 'completed' },
  { id: '3', stationName: 'E-Charge Buenavista', address: 'Cra. 51B #88-22', date: 'Ayer', time: '10:00', duration: '1h', cost: 3240, status: 'completed' },
  { id: '4', stationName: 'PlugExpress Sur', address: 'Av. Murillo #55-200', date: '23/06', time: '08:00', duration: '3h', cost: 3600, status: 'cancelled' },
];

const STATUS_COLORS = {
  active: '#22C55E',
  completed: '#64748B',
  cancelled: '#EF4444',
};

const STATUS_LABELS = {
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export default function ReservationsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Activas');

  const filtered =
    activeTab === 'Activas'
      ? MOCK_RESERVATIONS.filter((r) => r.status === 'active')
      : MOCK_RESERVATIONS.filter((r) => r.status !== 'active');

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={item.status === 'active' ? 0.7 : 1}
      onPress={() => {
        if (item.status === 'active') {
          navigation.navigate('ChargingSession', {
            station: { name: item.stationName, address: item.address },
            reservationId: item.id,
          });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
          <Text style={styles.stationName}>{item.stationName}</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: STATUS_COLORS[item.status] }]}>
          <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[item.status] }]}>
            {STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>

      <Text style={styles.address}>{item.address}</Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Fecha</Text>
          <Text style={styles.metaValue}>{item.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Hora</Text>
          <Text style={styles.metaValue}>{item.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Duración</Text>
          <Text style={styles.metaValue}>{item.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Costo</Text>
          <Text style={styles.metaValue}>{formatCOP(item.cost)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reservas</Text>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeTab === 'Activas' ? 'No tienes reservas activas' : 'Sin historial'}
            </Text>
          </View>
        }
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
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#1E293B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 12,
    marginLeft: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
  },
});
