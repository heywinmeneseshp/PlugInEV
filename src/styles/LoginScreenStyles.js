import { StyleSheet } from 'react-native';
import { colors, fonts, weights, radius } from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: radius['2xl'],
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginBottom: 16,
  },
  logoIconText: {
    fontSize: fonts['6xl'],
  },
  title: {
    fontSize: fonts['6xl'],
    fontWeight: weights.extrabold,
    color: colors.accent,
    letterSpacing: 1,
    marginBottom: 24,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  roleTab: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 11,
  },
  roleTabActive: {
    backgroundColor: colors.accent,
  },
  roleTabText: {
    fontSize: fonts.lg,
    fontWeight: weights.semibold,
    color: colors.textMuted,
  },
  roleTabTextActive: {
    color: colors.bg,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: fonts['3xl'],
    fontWeight: weights.semibold,
    color: colors.white,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  loginButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: fonts['2xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  registerButtonText: {
    fontSize: fonts.md,
    color: colors.accent,
    fontWeight: weights.medium,
  },
});

export default styles;
