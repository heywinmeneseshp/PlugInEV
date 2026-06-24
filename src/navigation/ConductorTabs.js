import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, weights } from '../styles/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Mapa:    { active: 'map',         inactive: 'map-outline' },
  Reservas:{ active: 'calendar',    inactive: 'calendar-outline' },
  Cartera: { active: 'wallet',      inactive: 'wallet-outline' },
  Perfil:  { active: 'person',      inactive: 'person-outline' },
};

function TabIcon({ routeName, focused }) {
  const icons = TAB_ICONS[routeName] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
  const iconName = focused ? icons.active : icons.inactive;
  const color    = focused ? colors.green : colors.textMuted;

  return (
    <View style={styles.iconWrap}>
      <Ionicons name={iconName} size={22} color={color} />
      {focused && <View style={styles.activeBar} />}
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
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: weights.medium,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  activeBar: {
    position: 'absolute',
    bottom: -6,
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.green,
  },
});
