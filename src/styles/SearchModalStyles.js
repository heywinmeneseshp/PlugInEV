import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    maxHeight: SCREEN_HEIGHT * 0.75,
    paddingBottom: 32,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.disabled,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fonts.xl,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  closeBtnText: {
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fonts.lg,
    marginTop: 24,
  },
  suggestions: {
    marginTop: 8,
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
