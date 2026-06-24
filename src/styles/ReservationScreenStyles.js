import { StyleSheet } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius['2xl'],
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  backIcon: {
    fontSize: fonts['4xl'],
    color: colors.white,
  },
  headerTitle: {
    fontSize: fonts['3xl'],
    fontWeight: weights.semibold,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stationCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 16,
    marginBottom: 24,
  },
  stationName: {
    fontSize: fonts['3xl'],
    fontWeight: weights.bold,
    color: colors.white,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: fonts.md,
    color: colors.textMuted,
    marginBottom: 12,
  },
  stationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stationPrice: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.accent,
  },
  stationPower: {
    fontSize: fonts.md,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 12,
  },
  hoursScroll: {
    marginBottom: 24,
  },
  chip: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: fonts.lg,
    fontWeight: weights.medium,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.bg,
    fontWeight: weights.semibold,
  },
  summary: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fonts.lg,
    fontWeight: weights.medium,
    color: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
});

export default styles;
