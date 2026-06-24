export const colors = {
  // Fondo
  bg: '#050A15',
  bgCard: 'rgba(255,255,255,0.05)',
  bgCardBorder: 'rgba(255,255,255,0.10)',
  bgSurface: '#0D1626',

  // Accentos primarios
  cyan: '#00BAFF',
  green: '#00FF8C',
  cyanDim: 'rgba(0,186,255,0.15)',
  greenDim: 'rgba(0,255,140,0.15)',

  // Alias de compatibilidad
  accent: '#00BAFF',
  accentDim: 'rgba(0,186,255,0.15)',

  // Estado
  red: '#FF3B30',
  redDim: 'rgba(255,59,48,0.15)',
  yellow: '#FFD60A',

  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#64748B',
  textHint: '#475569',

  // Aliases de compatibilidad para archivos de estilo existentes
  white: '#FFFFFF',
  card: '#0D1626',
  cardBorder: 'rgba(255,255,255,0.08)',

  // Utilitarios
  disabled: '#1E2D40',
  trackBg: '#1E2D40',
  markerBorder: 'rgba(255,255,255,0.3)',
  accentShadow: 'rgba(0,186,255,0.3)',
  greenShadow: 'rgba(0,255,140,0.3)',
};

// Gradiente CTA: de cyan a green (#00BAFF → #00FF8C)
export const gradientCTA = ['#00BAFF', '#00FF8C'];

export const fonts = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 15,
  '2xl': 16,
  '3xl': 18,
  '4xl': 20,
  '5xl': 22,
  '6xl': 28,
  '7xl': 34,
};

export const weights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// Glassmorphism reutilizable
export const glass = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.12)',
  borderRadius: 16,
};
