import { StyleSheet } from "react-native";
import { base } from "./base";
import { borders, radius, spacing, colors, typography } from "./tokens";

export const supportChatCardStyles = StyleSheet.create({
  card: { ...base.card, gap: spacing.md },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: typography.title,

  toggleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  toggleLabel: { fontWeight: "700", opacity: 0.8 },

  small: { ...typography.body, opacity: 0.8 },

  window: {
    marginTop: spacing.sm,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    maxHeight: 260,
  },

  bubble: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  userBubble: { alignSelf: "flex-end", borderWidth: borders.hairline, borderColor: colors.border },
  aiBubble: { alignSelf: "flex-start", borderWidth: borders.hairline, borderColor: colors.border },
  bubbleText: typography.body,

  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.md },
  input: {
    ...base.input,
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
  },

  sendBtn: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { fontWeight: "800" },
  pressed: base.pressed,

  note: { ...typography.small, marginTop: spacing.sm, opacity: 0.75 },
});