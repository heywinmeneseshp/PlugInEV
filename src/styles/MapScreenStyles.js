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
    right: 16,
    zIndex: 10,
  },

  /* Markers */
  markerWrapper: { alignItems: 'center' },
  markerCard: {
    backgroundColor: 'rgba(5,10,21,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  markerCardText: {
    fontSize: fonts.xs,
    fontWeight: weights.bold,
  },
  markerDotContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBubble: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    zIndex: 1,
  },
  markerPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.2,
  },
});

export default styles;
