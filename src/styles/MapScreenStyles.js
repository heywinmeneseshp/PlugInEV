import { StyleSheet } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Web fallback list */
  webFallback: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: colors.bg,
  },
  webFallbackTitle: {
    fontSize: fonts['6xl'],
    fontWeight: weights.extrabold,
    color: colors.green,
    textAlign: 'center',
    marginBottom: 4,
  },
  webFallbackSub: {
    fontSize: fonts.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 300,
  },
  stationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius['2xl'],
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  stationCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 12,
  },
  stationCardInfo: { flex: 1 },
  stationCardName: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  stationCardAddress: {
    fontSize: fonts.base,
    color: colors.textMuted,
  },
  stationCardRight: { alignItems: 'flex-end' },
  stationCardPrice: {
    fontSize: fonts['3xl'],
    fontWeight: weights.bold,
    color: colors.cyan,
  },
  stationCardUnit: {
    fontSize: fonts.sm,
    color: colors.textMuted,
  },

  /* ── Top overlay ── */
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 15,
    gap: 10,
    paddingBottom: 8,
  },

  /* Row 1 — hamburger + wallet side by side */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  /* Hamburger icon button */
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(13,22,38,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BAFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Wallet glassmorphism chip */
  walletWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13,22,38,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,140,0.25)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#00FF8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  walletBalance: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.green,
    lineHeight: 20,
  },
  walletLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
  },

  /* Row 2 — search bar */
  searchRow: {
    paddingHorizontal: 16,
  },

  /* Location FAB */
  locationWrapper: {
    position: 'absolute',
    right: 18,
    zIndex: 10,
  },

  /* Error banner */
  errorBanner: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    zIndex: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(13,22,38,0.97)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,214,10,0.4)',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#FFD60A',
    fontWeight: '600',
  },

  /* Markers */
  markerWrapper: { alignItems: 'center' },
  markerCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    marginBottom: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
  markerCardText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  /* iOS: glow nativo con shadowColor dinámico */
  markerDotIOS: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 7,
  },

  /* Android: glow simulado con capas concéntricas */
  markerDotWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  markerGlowOuter: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.12,
  },
  markerGlowMid: {
    position: 'absolute',
    width: 17,
    height: 17,
    borderRadius: 8.5,
    opacity: 0.28,
  },
  markerDotCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default styles;
