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
  avatarSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.bg,
  },
  name: {
    fontSize: fonts['4xl'],
    fontWeight: weights.bold,
    color: colors.white,
  },
  email: {
    fontSize: fonts.lg,
    color: colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: fonts.lg,
    fontWeight: weights.medium,
    color: colors.white,
  },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.red,
  },
  logoutText: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.red,
  },
  roleBadge: {
    textAlign: 'center',
    fontSize: fonts.base,
    color: colors.textHint,
    marginTop: 24,
    marginBottom: 40,
  },
  hostButton: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  hostButtonText: {
    fontSize: fonts.xl,
    fontWeight: weights.semibold,
    color: colors.accent,
  },
  dashboardButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  dashboardButtonText: {
    fontSize: fonts.xl,
    fontWeight: weights.bold,
    color: colors.bg,
  },
});

export default styles;
