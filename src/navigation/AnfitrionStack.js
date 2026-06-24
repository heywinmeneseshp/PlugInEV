import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnfitrionTabs     from './AnfitrionTabs';
import HostSetupScreen   from '../screens/HostSetupScreen';
import HostMatchScreen   from '../screens/HostMatchScreen';
import HostConfigScreen  from '../screens/HostConfigScreen';

const Stack = createNativeStackNavigator();

export default function AnfitrionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="AnfitrionHome" component={AnfitrionTabs} />
      <Stack.Screen name="HostSetup"    component={HostSetupScreen} />
      <Stack.Screen name="HostConfig"   component={HostConfigScreen} />
      <Stack.Screen
        name="HostMatch"
        component={HostMatchScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
