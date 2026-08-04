import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import ConductorTabs from './ConductorTabs';
import AnfitrionStack from './AnfitrionStack';
import ReservationScreen from '../screens/ReservationScreen';
import ChargingSessionScreen from '../screens/ChargingSessionScreen';
import CDRScreen from '../screens/CDRScreen';
import StationDetailScreen from '../screens/StationDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();
const screenBg = { backgroundColor: colors.bg };

function MainScreens() {
  const { user } = useAuth();
  const isHost = user?.role === 'anfitrion';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: screenBg,
      }}
    >
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
      <Stack.Screen name="StationDetail" component={StationDetailScreen} />
      <Stack.Screen name="Booking"       component={BookingScreen} />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#19D4FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: screenBg }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainScreens} />
      )}
    </Stack.Navigator>
  );
}
