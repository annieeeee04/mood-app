import { StyleSheet } from "react-native";
import { borders, radius, spacing } from "./tokens";

export const moodSelectorStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md },
  btn: {
    borderWidth: borders.hairline,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  btnActive: { borderWidth: borders.strong },
  btnPressed: { opacity: 0.7 },
  emoji: { fontSize: 22 },
});