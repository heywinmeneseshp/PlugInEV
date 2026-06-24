import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HostScreen from '../screens/HostScreen';
import HostSetupScreen from '../screens/HostSetupScreen';
import HostConfigScreen from '../screens/HostConfigScreen';

const Stack = createNativeStackNavigator();

export default function AnfitrionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="HostDashboard" component={HostScreen} />
      <Stack.Screen name="HostSetup" component={HostSetupScreen} />
      <Stack.Screen name="HostConfig" component={HostConfigScreen} />
    </Stack.Navigator>
  );
}
