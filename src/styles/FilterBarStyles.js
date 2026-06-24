import { StyleSheet } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 115,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  filterBtn: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderRadius: radius['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    fontSize: fonts.md,
    fontWeight: weights.medium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.bg,
    fontWeight: weights.semibold,
  },
});

export default styles;
