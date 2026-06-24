import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/ProfileScreenStyles';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const initials = user?.nombre ? user.nombre.slice(0, 2).toUpperCase() : 'HE';
  const role = user?.role || 'conductor';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.nombre || 'Heywin'}</Text>
          <Text style={styles.email}>{user?.email || 'heywin@correo.com'}</Text>
        </View>

        <View style={styles.card}>
          <ProfileRow label="Vehículo" value={user?.vehiculo || 'Tesla Model 3'} />
          <View style={styles.divider} />
          <ProfileRow label="Placa" value={user?.placa || 'ABC-123'} />
          <View style={styles.divider} />
          <ProfileRow label="Método de pago" value={user?.metodoPago || 'Visa •••• 4242'} />
          <View style={styles.divider} />
          <ProfileRow label="Reservas activas" value={user?.reservasActivas?.toString() || '1'} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {role === 'anfitrion' ? (
          <TouchableOpacity style={styles.dashboardButton} onPress={() => navigation.navigate('AnfitrionStack')}>
            <Text style={styles.dashboardButtonText}>Dashboard anfitrión</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.hostButton} onPress={() => navigation.navigate('AnfitrionStack')}>
            <Text style={styles.hostButtonText}>Modo anfitrión</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.roleBadge}>{role === 'anfitrion' ? 'Anfitrión' : 'Conductor'}</Text>
      </ScrollView>
    </View>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}


