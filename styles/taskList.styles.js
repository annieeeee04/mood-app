import { StyleSheet } from "react-native";
import { base } from "./base";
import { borders, radius, spacing, colors, typography } from "./tokens";

export const taskListStyles = StyleSheet.create({
  wrapper: { gap: spacing.lg },

  inputRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  input: { ...base.input, flex: 1 },

  addBtn: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  addBtnText: { fontWeight: "700" },

  list: { gap: spacing.md },
  item: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  taskText: { ...typography.body, flex: 1 },
  taskDone: { opacity: 0.6, textDecorationLine: "line-through" },

  delBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: borders.hairline,
    borderColor: colors.border,
  },
  delBtnText: { fontWeight: "700" },

  pressed: base.pressed,
  empty: { ...typography.body, opacity: 0.8 },
});