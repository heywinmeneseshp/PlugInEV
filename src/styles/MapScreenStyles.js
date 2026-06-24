import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
    width: 10,
    height: 10,
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

  /* Top section */
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: { fontSize: 16, color: colors.textPrimary },

  /* Wallet widget — glassmorphism top-right */
  walletWidget: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'flex-end',
    minWidth: 130,
  },
  walletBalance: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.green,
  },
  walletLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },

  searchPadding: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  /* Location button */
  locationWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },

  /* Markers */
  markerWrapper: { alignItems: 'center' },
  markerCard: {
    backgroundColor: '#050A15',
    borderRadius: radius.sm,
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
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBubble: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 1,
  },
  markerPulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.2,
  },
});

export default styles;
