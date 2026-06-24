import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, weights, radius } from '../styles/theme';

export default function GradientButton({
  onPress,
  label,
  disabled = false,
  height = 54,
  style,
  textStyle,
  icon,
}) {
  if (disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled
        activeOpacity={0.85}
        style={[styles.wrapper, { height }, style]}
      >
        <View style={[styles.disabledBg, { height, borderRadius: height / 2 }]}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.label, styles.labelDisabled, textStyle]}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.wrapper, { height }, style]}
    >
      <LinearGradient
        colors={['#00BAFF', '#00FF8C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { height, borderRadius: height / 2 }]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    shadowColor: '#00BAFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.disabled,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: weights.bold,
    color: '#050A15',
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
