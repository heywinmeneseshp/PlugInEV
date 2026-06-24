import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const SW = 6.5; // stroke width uniforme
const CAP = { r: 'round' }; // shorthand

/**
 * PluginLogo — wordmark SVG trazado a mano replicando el logo oficial.
 *
 * variant: 'wordmark' | 'isotipo' | 'mono'
 * size: multiplicador (1 = tamaño base)
 */
export default function PluginLogo({ variant = 'wordmark', size = 1 }) {
  if (variant === 'isotipo') return <Isotipo size={size} />;
  return <Wordmark size={size} mono={variant === 'mono'} />;
}

/* ─── Wordmark ─────────────────────────────────────────────────── */
function Wordmark({ size = 1, mono = false }) {
  const W = 244 * size;
  const H = 90 * size;
  // gradientUnits userSpaceOnUse → gradiente continuo en coordenadas absolutas
  const stroke = mono ? 'white' : 'url(#wg)';

  return (
    <Svg width={W} height={H} viewBox="0 0 244 90">
      <Defs>
        <LinearGradient id="wg" x1="0" y1="0" x2="244" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0"   stopColor="#00BAFF" />
          <Stop offset="1"   stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>

      {/* ── p ──────────────────────────────────────────────────────
          Stem vertical (con descender) + arco D cerrado a la derecha */}
      <Path
        d="M14,16 L14,82"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none"
      />
      <Path
        d="M14,19 C14,5 58,5 58,42 C58,68 14,68 14,55"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none"
      />

      {/* ── l ──────────────────────────────────────────────────────
          Trazo vertical simple */}
      <Path
        d="M70,16 L70,70"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none"
      />

      {/* ── plug (ü) ───────────────────────────────────────────────
          Dos pines rectangulares arriba + U abierta que baja hasta y=82 */}
      <Path d="M83,2 L83,21"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none" />
      <Path d="M105,2 L105,21"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none" />
      <Path
        d="M83,21 L83,56 Q83,82 94,82 Q105,82 105,56 L105,21"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />

      {/* ── g ──────────────────────────────────────────────────────
          Círculo abierto a las 3:00 (≈y=42) + cola descendente con gancho */}
      <Path
        d="M161,42 C161,8 117,8 117,42 C117,70 161,70 161,50 L161,64 C161,80 128,84 116,76"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none"
      />

      {/* ── i ──────────────────────────────────────────────────────
          Punto (pequeño trazo redondeado) + fuste */}
      <Path d="M173,8 L173,16"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none" />
      <Path d="M173,24 L173,70"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none" />

      {/* ── n ──────────────────────────────────────────────────────
          Fuste izquierdo + arco + fuste derecho */}
      <Path d="M186,24 L186,70"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none" />
      <Path
        d="M186,36 C186,16 228,16 228,40 L228,70"
        stroke={stroke} strokeWidth={SW} strokeLinecap="round" fill="none"
      />
    </Svg>
  );
}

/* ─── Isotipo ──────────────────────────────────────────────────── */
function Isotipo({ size = 1 }) {
  const W = 52 * size;
  const H = 68 * size;

  return (
    <Svg width={W} height={H} viewBox="0 0 52 68">
      <Defs>
        <LinearGradient id="ig" x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0"   stopColor="#00BAFF" />
          <Stop offset="1"   stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>
      {/* Pín izquierdo */}
      <Path d="M14,2 L14,20"
        stroke="url(#ig)" strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* Pín derecho */}
      <Path d="M38,2 L38,20"
        stroke="url(#ig)" strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* U */}
      <Path
        d="M14,20 L14,44 Q14,66 26,66 Q38,66 38,44 L38,20"
        stroke="url(#ig)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}
