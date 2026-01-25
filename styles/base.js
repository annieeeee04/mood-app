import { StyleSheet } from "react-native";
import { borders, radius, spacing, colors } from "./tokens";


export const base = StyleSheet.create({
    // existing (solid)
    card: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    },
    
    
    // NEW: glass-friendly (for use inside GlassSurface or alone)
    cardGlass: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        backgroundColor: "rgba(255,255,255,0.12)", // KEY CHANGE
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
    backgroundColor: colors.cardBg,
    },
    
    
    // NEW: glass input (matches what you were aiming for)
    inputGlass: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: radius.md,
        padding: spacing.lg,
        color: colors.text,
      },
    
    
    pressed: { opacity: 0.7 },
    });