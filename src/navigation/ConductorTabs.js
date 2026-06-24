import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapScreen from '../screens/MapScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, weights } from '../styles/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Mapa:     { active: 'map',      inactive: 'map-outline' },
  Reservas: { active: 'calendar', inactive: 'calendar-outline' },
  Cartera:  { active: 'wallet',   inactive: 'wallet-outline' },
  Perfil:   { active: 'person',   inactive: 'person-outline' },
};

function TabIcon({ routeName, focused }) {
  const icons = TAB_ICONS[routeName] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

  if (focused) {
    return (
      <LinearGradient
        colors={['#00BAFF', '#00FF8C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.activePill}
      >
        <Ionicons name={icons.active} size={20} color="#050A15" />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.inactiveWrap}>
      <Ionicons name={icons.inactive} size={22} color={colors.textMuted} />
    </View>
  );
}

export default function ConductorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Mapa"     component={MapScreen} />
      <Tab.Screen name="Reservas" component={ReservationsScreen} />
      <Tab.Screen name="Cartera"  component={WalletScreen} />
      <Tab.Screen name="Perfil"   component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0A1525',
    borderTopColor: 'rgba(255,255,255,0.07)',
    borderTopWidth: 1,
    height: 62 + (Platform.OS === 'ios' ? 14 : 0),
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: weights.medium,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  activePill: {
    width: 44,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveWrap: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
