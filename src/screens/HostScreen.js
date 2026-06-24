import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/HostScreenStyles';
import { formatCOP } from '../utils/format';

export default function HostScreen() {
  const navigation = useNavigation();
  const { user, hostStation, logout } = useAuth();
  const station = hostStation;
  const [online, setOnline] = useState(station?.available ?? true);

  const stats = useMemo(() => {
    if (!station) return null;
    const price = station.pricePerKWh;
    const chargesToday = Math.floor(Math.random() * 12 + 6);
    const chargesWeek = chargesToday + Math.floor(Math.random() * 30 + 15);
    const earningsToday = chargesToday * price * 2.5;
    const earningsWeek = chargesWeek * price * 2.3;
    return { chargesToday, chargesWeek, earningsToday, earningsWeek };
  }, [station]);

  if (!station) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={logout}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Anfitrión</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚡</Text>
          <Text style={styles.emptyTitle}>Sin estaciones</Text>
          <Text style={styles.emptySub}>Completa el registro para gestionar tu estación</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={logout}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('HostConfig')}>
          <Text style={styles.profileIcon}>{user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : 'HE'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stationSummary}>
          <View style={styles.stationNameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stationTitle}>{station.name}</Text>
              <Text style={styles.stationAddr}>{station.address}</Text>
            </View>
            <View style={styles.toggleSection}>
              <Text style={[styles.statusText, online && styles.statusOnline]}>
                {online ? 'Activo' : 'Inactivo'}
              </Text>
              <Switch
                value={online}
                onValueChange={setOnline}
                trackColor={{ false: '#334155', true: '#00E5FF' }}
                thumbColor={online ? '#FFFFFF' : '#64748B'}
              />
            </View>
          </View>
          <View style={styles.stationTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{formatCOP(station.pricePerKWh)}/kWh</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{station.power}</Text>
            </View>
            {station.connectors?.map((c) => (
              <View key={c} style={styles.tag}>
                <Text style={styles.tagText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Hoy</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.chargesToday}</Text>
            <Text style={styles.statLabel}>Cargas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCOP(stats.earningsToday)}</Text>
            <Text style={styles.statLabel}>Ganancias</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Esta semana</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.chargesWeek}</Text>
            <Text style={styles.statLabel}>Cargas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCOP(stats.earningsWeek)}</Text>
            <Text style={styles.statLabel}>Ganancias</Text>
          </View>
        </View>

        <View style={styles.weekBar}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => {
            const h = Math.floor(Math.random() * 60 + 20);
            return (
              <View key={day} style={styles.barCol}>
                <View style={[styles.bar, { height: h }]} />
                <Text style={styles.barLabel}>{day}</Text>
                <Text style={styles.barValue}>{Math.floor(Math.random() * 8 + 2)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.configCard}>
          <Text style={styles.configTitle}>Configuración</Text>
          <ConfigRow label="Precio" value={`${formatCOP(station.pricePerKWh)}/kWh`} />
          <ConfigRow label="Potencia" value={station.power} />
          <ConfigRow label="Método de cobro" value={station.paymentMethod || 'Nequi'} />
          <ConfigRow label="Conectores" value={station.connectors?.join(', ') || '-'} />
        </View>

        <Text style={styles.footer}>Las ganancias se liquidan semanalmente a tu cuenta registrada</Text>
      </ScrollView>
    </View>
  );
}

function ConfigRow({ label, value }) {
  return (
    <View style={styles.configRow}>
      <Text style={styles.configLabel}>{label}</Text>
      <Text style={styles.configValue}>{value}</Text>
    </View>
  );
}


