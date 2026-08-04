import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DemoBadge({ style }) {
  return (
    <View style={[s.badge, style]}>
      <Text style={s.text}>Demo local</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,214,10,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,214,10,0.25)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFD60A',
    letterSpacing: 0.3,
  },
});
