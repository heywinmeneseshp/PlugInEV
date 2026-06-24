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
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
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
  searchInputWrapper: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fonts.xl,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fonts.lg,
    marginTop: 40,
  },
  suggestions: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 12,
  },
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  suggestionText: {
    fontSize: fonts.xl,
    color: colors.textSecondary,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  resultDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: fonts.base,
    color: colors.textMuted,
  },
  resultPrice: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.accent,
  },
});

export default styles;
