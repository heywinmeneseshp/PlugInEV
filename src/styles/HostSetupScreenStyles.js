import { StyleSheet } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.disabled,
  },
  stepDotActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  stepDotText: {
    fontSize: fonts.lg,
    fontWeight: weights.semibold,
    color: colors.textMuted,
  },
  stepDotTextActive: {
    color: colors.bg,
  },
  headerTitle: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: fonts['2xl'],
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 20,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: weights.medium,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fonts.xl,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  mapPlaceholder: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 8,
  },
  mapPlaceholderIcon: {
    fontSize: 32,
    color: colors.accent,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: fonts.xl,
    color: colors.white,
    fontWeight: weights.semibold,
  },
  mapPlaceholderSub: {
    fontSize: fonts.base,
    color: colors.textMuted,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.cardBorder,
    borderRadius: radius['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.disabled,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: fonts.md,
    fontWeight: weights.medium,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.bg,
    fontWeight: weights.semibold,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  paymentCardActive: {
    borderColor: colors.accent,
  },
  paymentText: {
    fontSize: fonts.xl,
    color: colors.white,
    fontWeight: weights.medium,
  },
  paymentTextActive: {
    color: colors.accent,
  },
  checkmark: {
    fontSize: fonts['3xl'],
    color: colors.accent,
    fontWeight: weights.bold,
  },
  paymentHint: {
    fontSize: fonts.base,
    color: colors.textHint,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  backBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  backBtnText: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.white,
  },
  nextBtn: {
    flex: 2,
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishBtn: {
    backgroundColor: colors.green,
  },
  nextBtnText: {
    fontSize: fonts.xl,
    fontWeight: weights.bold,
    color: colors.bg,
  },
});

export default styles;
