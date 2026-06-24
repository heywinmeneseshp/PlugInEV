import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

/**
 * PluginLogo — wordmark SVG fiel al logo oficial.
 * variant: 'wordmark' | 'isotipo' | 'mono'
 * size: multiplicador (1 = base)
 */
export default function PluginLogo({ variant = 'wordmark', size = 1 }) {
  if (variant === 'isotipo') return <Isotipo size={size} />;
  return <Wordmark size={size} mono={variant === 'mono'} />;
}

/* ─── Wordmark ─────────────────────────────────────────────────── */
// ViewBox: 290 × 88
// Cap: y 20→72  (52px tall)
// Descender de p: hasta y=84
// Plug pins: y 4→22, U hasta y=84
// strokeWidth: 8, caps: round

function Wordmark({ size = 1, mono = false }) {
  const W = 290 * size;
  const H = 88 * size;
  const s = mono ? 'white' : 'url(#wg)';
  const sw = 8;

  return (
    <Svg width={W} height={H} viewBox="0 0 290 88">
      <Defs>
        {/* Gradiente continuo en coordenadas absolutas */}
        <LinearGradient id="wg" x1="0" y1="0" x2="290" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0"   stopColor="#00BAFF" />
          <Stop offset="1"   stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>

      {/*
       * p  — círculo grande a la derecha del fuste
       * El fuste va de y=20 a y=84 (descender)
       * El círculo (r≈26) conecta con el fuste en top y bottom del círculo
       */}
      <Path d="M14,20 L14,84"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />
      {/* Arco D: empieza en (14,24), hace un arco por la derecha hasta (14,60) */}
      <Path d="M14,24 C14,8 66,8 66,46 C66,74 14,74 14,57"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />

      {/*
       * l  — trazo vertical simple
       */}
      <Path d="M78,20 L78,72"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />

      {/*
       * plug (reemplaza la ü)
       * Dos pines cortos arriba + U redondeada que baja hasta y=84
       * Pines: x=92 y x=114, de y=4 a y=24
       * U body: de y=24 baja, curva inferior a y=84
       */}
      <Path d="M92,4 L92,24"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <Path d="M114,4 L114,24"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <Path d="M92,24 L92,58 Q92,84 103,84 Q114,84 114,58 L114,24"
        stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/*
       * g  — círculo cerrado con abertura a las 3:00 + cola descendente con gancho
       * Círculo: centro aprox (152, 46), r≈26
       * La cola baja y gira a la izquierda
       */}
      <Path d="M178,46 C178,12 126,12 126,46 C126,74 178,74 178,54 L178,66 C178,82 140,86 128,78"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />

      {/*
       * i  — punto (trazo corto) + fuste
       */}
      <Path d="M192,10 L192,18"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <Path d="M192,26 L192,72"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />

      {/*
       * n  — fuste izquierdo + arco + fuste derecho
       */}
      <Path d="M206,26 L206,72"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <Path d="M206,38 C206,18 252,18 252,44 L252,72"
        stroke={s} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/* ─── Isotipo ──────────────────────────────────────────────────── */
function Isotipo({ size = 1 }) {
  const W = 56 * size;
  const H = 72 * size;

  return (
    <Svg width={W} height={H} viewBox="0 0 56 72">
      <Defs>
        <LinearGradient id="ig" x1="0" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0"   stopColor="#00BAFF" />
          <Stop offset="1"   stopColor="#00FF8C" />
        </LinearGradient>
      </Defs>
      {/* Pín izquierdo */}
      <Path d="M14,2 L14,22"
        stroke="url(#ig)" strokeWidth={7} strokeLinecap="round" fill="none" />
      {/* Pín derecho */}
      <Path d="M42,2 L42,22"
        stroke="url(#ig)" strokeWidth={7} strokeLinecap="round" fill="none" />
      {/* U */}
      <Path d="M14,22 L14,48 Q14,70 28,70 Q42,70 42,48 L42,22"
        stroke="url(#ig)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
