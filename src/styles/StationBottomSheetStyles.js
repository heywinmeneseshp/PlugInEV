import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    maxHeight: MAX_SHEET_HEIGHT,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.disabled,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.white,
    marginBottom: 4,
  },
  address: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius['2xl'],
  },
  statusText: {
    fontSize: fonts.md,
    fontWeight: weights.semibold,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: fonts.base,
    color: colors.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.white,
  },
  connectorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  connectorBadge: {
    backgroundColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  connectorText: {
    fontSize: fonts.base,
    color: colors.accent,
    fontWeight: weights.medium,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  estimateLabel: {
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  estimateValue: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.accent,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.disabled,
  },
  mapButtonIcon: {
    fontSize: fonts['5xl'],
    color: colors.accent,
  },
  reserveButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  reserveButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  reserveButtonText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
});

export default styles;
