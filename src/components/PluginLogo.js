import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text, Path, Rect, G } from 'react-native-svg';

/**
 * Plugin logo variants:
 *  - "wordmark"  → "plugin" completo con gradiente (default)
 *  - "isotipo"   → solo el símbolo del enchufe (la ü)
 *  - "mono"      → wordmark en blanco
 */
export default function PluginLogo({ variant = 'wordmark', size = 1 }) {
  if (variant === 'isotipo') return <Isotipo size={size} />;
  if (variant === 'mono')    return <Wordmark size={size} mono />;
  return <Wordmark size={size} />;
}

/* ─── Isotipo: enchufe en U con gradiente ─── */
function Isotipo({ size = 1 }) {
  const W = 56 * size;
  const H = 64 * size;
  return (
    <Svg width={W} height={H} viewBox="0 0 56 64">
      <Defs>
        <LinearGradient id="ig" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"   stopColor="#00BAFF" />
          <Stop offset="1"   stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>
      {/* Pín izquierdo */}
      <Rect x="10" y="0" width="8" height="22" rx="4" fill="url(#ig)" />
      {/* Pín derecho */}
      <Rect x="38" y="0" width="8" height="22" rx="4" fill="url(#ig)" />
      {/* Arco U */}
      <Path
        d="M10 18 Q10 58 28 58 Q46 58 46 18"
        fill="none"
        stroke="url(#ig)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ─── Wordmark: "plugin" con gradiente y el isotipo como ü ─── */
function Wordmark({ size = 1, mono = false }) {
  // Dimensiones base del wordmark completo
  const W = 260 * size;
  const H = 72 * size;

  const fill = mono ? 'white' : 'url(#grad)';

  return (
    <Svg width={W} height={H} viewBox="0 0 260 72">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"   stopColor="#00BAFF" />
          <Stop offset="1"   stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>

      {/* "pl" */}
      <Text
        x="0"
        y="58"
        fontSize="68"
        fontWeight="700"
        letterSpacing="-2"
        fill={fill}
        fontFamily="System"
      >
        pl
      </Text>

      {/* Isotipo (enchufe) como "ü" — centrado entre pl y gin */}
      <G transform="translate(90, 4) scale(0.72)">
        {/* Pín izquierdo */}
        <Rect x="4"  y="0" width="7" height="18" rx="3.5" fill={mono ? 'white' : 'url(#grad)'} />
        {/* Pín derecho */}
        <Rect x="33" y="0" width="7" height="18" rx="3.5" fill={mono ? 'white' : 'url(#grad)'} />
        {/* Arco U */}
        <Path
          d="M4 14 Q4 50 22 50 Q40 50 40 14"
          fill="none"
          stroke={mono ? 'white' : 'url(#grad)'}
          strokeWidth="7"
          strokeLinecap="round"
        />
      </G>

      {/* "gin" */}
      <Text
        x="138"
        y="58"
        fontSize="68"
        fontWeight="700"
        letterSpacing="-2"
        fill={fill}
        fontFamily="System"
      >
        gin
      </Text>
    </Svg>
  );
}
