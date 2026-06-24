import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const LOGO = require('../../assets/logo.png');

/**
 * PluginLogo
 * variant: 'wordmark' | 'isotipo' | 'mono'
 * size: multiplicador del ancho base (260px)
 */
export default function PluginLogo({ variant = 'wordmark', size = 1 }) {
  if (variant === 'isotipo') return <Isotipo size={size} />;

  const w = 260 * size;
  const h = 90 * size;

  return (
    <Image
      source={LOGO}
      style={[
        { width: w, height: h },
        variant === 'mono' && styles.mono,
      ]}
      resizeMode="contain"
    />
  );
}

/* ─── Isotipo SVG (solo el símbolo del enchufe) ─────────────────── */
function Isotipo({ size = 1 }) {
  const W = 52 * size;
  const H = 68 * size;
  return (
    <Svg width={W} height={H} viewBox="0 0 52 68">
      <Defs>
        <LinearGradient id="ig" x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#00BAFF" />
          <Stop offset="1" stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>
      <Path d="M14,2 L14,20" stroke="url(#ig)" strokeWidth={7} strokeLinecap="round" fill="none" />
      <Path d="M38,2 L38,20" stroke="url(#ig)" strokeWidth={7} strokeLinecap="round" fill="none" />
      <Path d="M14,20 L14,44 Q14,66 26,66 Q38,66 38,44 L38,20"
        stroke="url(#ig)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  mono: { tintColor: 'white' },
});
