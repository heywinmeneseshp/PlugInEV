import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import ConductorTabs from './ConductorTabs';
import AnfitrionStack from './AnfitrionStack';
import ReservationScreen from '../screens/ReservationScreen';
import ChargingSessionScreen from '../screens/ChargingSessionScreen';
import CDRScreen from '../screens/CDRScreen';

const Stack = createNativeStackNavigator();

function MainScreens() {
  const { user } = useAuth();
  const isHost = user?.role === 'anfitrion';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {isHost ? (
        <Stack.Screen name="AnfitrionHome" component={AnfitrionStack} />
      ) : (
        <Stack.Screen name="ConductorHome" component={ConductorTabs} />
      )}
      <Stack.Screen
        name="Reservation"
        component={ReservationScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen
        name="ChargingSession"
        component={ChargingSessionScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="CDR"
        component={CDRScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainScreens} />
      )}
    </Stack.Navigator>
  );
}
