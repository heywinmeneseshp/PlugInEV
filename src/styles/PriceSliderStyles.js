import { StyleSheet } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },
  label: {
    fontSize: fonts.base,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  trackContainer: {
    height: 36,
    justifyContent: 'center',
  },
  trackBg: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
  },
  trackFill: {
    position: 'absolute',
    left: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.bg,
    top: 6,
  },
});

export default styles;
