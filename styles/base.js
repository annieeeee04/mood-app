import { StyleSheet } from "react-native";
import { borders, radius, spacing, colors } from "./tokens";


export const base = StyleSheet.create({
card: {
borderWidth: borders.hairline,
borderColor: colors.border,
backgroundColor: colors.cardBg,
borderRadius: radius.lg,
padding: spacing.lg,
},
input: {
borderWidth: borders.hairline,
borderColor: colors.border,
borderRadius: radius.md,
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
color: colors.text,
},
pressed: { opacity: 0.7 },
});