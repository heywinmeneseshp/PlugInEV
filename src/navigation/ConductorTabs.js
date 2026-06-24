import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapScreen from '../screens/MapScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, weights } from '../styles/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Mapa: { active: '🗺️', inactive: '🗺️' },
  Reservas: { active: '📋', inactive: '📋' },
  Sesiones: { active: '⚡', inactive: '⚡' },
  Cartera: { active: '💳', inactive: '💳' },
  Perfil: { active: '👤', inactive: '👤' },
};

function TabIcon({ routeName, focused }) {
  const icons = TAB_ICONS[routeName];
  const color = focused ? colors.green : colors.textMuted;
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.5 }]}>
        {icons?.active || '●'}
      </Text>
      {focused && <View style={[styles.activeBar, { backgroundColor: colors.green }]} />}
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
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Reservas" component={ReservationsScreen} />
      <Tab.Screen name="Cartera" component={WalletScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
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
    width: 32,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    position: 'relative',
  },
  tabEmoji: {
    fontSize: 18,
  },
  activeBar: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 2,
    borderRadius: 1,
  },
});
