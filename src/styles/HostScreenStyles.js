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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: fonts['3xl'],
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: fonts.lg,
    color: colors.textMuted,
    textAlign: 'center',
  },
  stationSummary: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationTitle: {
    fontSize: fonts['3xl'],
    fontWeight: weights.bold,
    color: colors.white,
    marginBottom: 2,
  },
  stationAddr: {
    fontSize: fonts.md,
    color: colors.textMuted,
  },
  toggleSection: {
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  statusText: {
    fontSize: fonts.sm,
    fontWeight: weights.medium,
    color: colors.textMuted,
  },
  statusOnline: {
    color: colors.green,
  },
  stationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: fonts.sm,
    color: colors.accent,
    fontWeight: weights.medium,
  },
  sectionTitle: {
    fontSize: fonts['2xl'],
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValue: {
    fontSize: fonts['5xl'],
    fontWeight: weights.bold,
    color: colors.accent,
  },
  statLabel: {
    fontSize: fonts.base,
    color: colors.textMuted,
    marginTop: 4,
  },
  weekBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  barCol: {
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    opacity: 0.6,
    minHeight: 8,
  },
  barLabel: {
    fontSize: fonts.xs,
    color: colors.textMuted,
  },
  barValue: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    fontWeight: weights.medium,
  },
  configCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  configTitle: {
    fontSize: fonts['2xl'],
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 8,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  configLabel: {
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
  configValue: {
    fontSize: fonts.lg,
    fontWeight: weights.medium,
    color: colors.white,
  },
  footer: {
    textAlign: 'center',
    fontSize: fonts.sm,
    color: colors.textHint,
    marginTop: 8,
    marginBottom: 40,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: radius['2xl'],
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: fonts.base,
    fontWeight: weights.bold,
    color: colors.bg,
  },
});

export default styles;
