import { StyleSheet } from "react-native";
import { colors, spacing, radius, borders, typography } from "./tokens";

export const journalInputStyles = StyleSheet.create({
  // existing solid card
  card: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  // NEW: use this when wrapped by <GlassSurface>
  cardGlass: {
    borderWidth: borders.hairline,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.04)", // lighter so blur shows
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  title: typography.title,

  subtitle: {
    marginTop: spacing.xs,
    color: colors.muted,
  },

  counter: {
    fontWeight: "700",
    color: colors.muted,
  },

  counterWarn: {
    color: colors.text,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBg,
  },

  // NEW: chip glass (optional)
  chipGlass: {
    borderWidth: borders.hairline,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  chipPressed: { opacity: 0.7 },

  chipText: {
    fontSize: 13,
    color: colors.text,
  },

  textarea: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    minHeight: 120,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    backgroundColor: colors.cardBg,
  },

  // NEW: textarea glass (recommended if you want consistent glass feel)
  textareaGlass: {
    borderWidth: borders.hairline,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.md,
    padding: spacing.lg,
    minHeight: 120,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  footer: {
    ...typography.small,
    color: colors.muted,
  },
});