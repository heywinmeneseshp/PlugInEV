import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HostScreen            from '../screens/HostScreen';
import HostReservationsScreen from '../screens/HostReservationsScreen';
import HostAccountScreen     from '../screens/HostAccountScreen';
import { colors, weights }   from '../styles/theme';

const Tab = createBottomTabNavigator();

const TABS = {
  HostDashboard:    { active: 'grid',           inactive: 'grid-outline' },
  HostReservas:     { active: 'notifications',  inactive: 'notifications-outline' },
  HostCuenta:       { active: 'wallet',         inactive: 'wallet-outline' },
};

function TabIcon({ routeName, focused }) {
  const icons = TABS[routeName] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
  if (focused) {
    return (
      <LinearGradient colors={['#00BAFF','#00FF8C']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.pill}>
        <Ionicons name={icons.active} size={20} color="#050A15" />
      </LinearGradient>
    );
  }
  return (
    <View style={s.inactiveWrap}>
      <Ionicons name={icons.inactive} size={22} color={colors.textMuted} />
    </View>
  );
}

function getAndroidNavBarHeight() {
  if (Platform.OS !== 'android') return 0;
  const screenH = Dimensions.get('screen').height;
  const windowH = Dimensions.get('window').height;
  const diff = screenH - windowH;
  return diff > 10 ? diff : 48;
}

export default function AnfitrionTabs() {
  const androidPad = getAndroidNavBarHeight();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneContainerStyle: { backgroundColor: colors.bg },
        tabBarStyle: [s.tabBar, Platform.OS === 'android' && { paddingBottom: androidPad + 6 }],
        tabBarShowLabel: true,
        tabBarLabelStyle: s.tabLabel,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="HostDashboard"  component={HostScreen}             options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="HostReservas"   component={HostReservationsScreen} options={{ tabBarLabel: 'Reservas' }} />
      <Tab.Screen name="HostCuenta"     component={HostAccountScreen}      options={{ tabBarLabel: 'Cuenta' }} />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0A1525',
    borderTopColor: 'rgba(255,255,255,0.07)',
    borderTopWidth: 1,
    paddingTop: 2,
    paddingBottom: Platform.select({ ios: 8, default: 8 }),
  },
  tabLabel: { fontSize: 10, fontWeight: weights.medium, marginTop: 2, letterSpacing: 0.3 },
  pill: { width: 44, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  inactiveWrap: { width: 44, height: 30, alignItems: 'center', justifyContent: 'center' },
});
