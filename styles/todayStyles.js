import { StyleSheet } from "react-native";
import { colors, spacing, radius, borders, typography } from "./tokens";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.surfaceBg, // optional but makes cards look nicer
  },

  // used for wide mode container
  layout: {
    flex: 1,
  },

  // ===== Mobile 50/50 split =====
  mobileSplit: { flex: 1 },
  mobileTop: { flex: 1 },
  mobileBottom: {
    flex: 1,
    marginTop: spacing.lg,
  },
  mobileScroll: { flex: 1 },
  mobileScrollContent: { paddingBottom: spacing.lg },

  // ===== Left/main content =====
  main: { flex: 1 },
  mainContent: { paddingBottom: spacing.xxl },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },

  section: { marginTop: spacing.xl },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  saveButton: {
    marginTop: spacing.xl,
    borderRadius: radius.md,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: { opacity: 0.7 },
  saveButtonText: { fontWeight: "600", color: colors.text },

  // ===== Weekly report list (left) =====
  weeklySubtitle: { marginBottom: spacing.md, color: colors.muted },

  weeklyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  // replace weeklyRow gap with margin
  weeklyDayLabel: { width: 60, fontWeight: "600", color: colors.text },
  weeklyBarBg: {
    flex: 1,
    height: 10,
    marginHorizontal: spacing.md, // replaces gap:10
    borderRadius: radius.pill,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.cardBg,
  },
  weeklyBarFill: { height: "100%" },
  weeklyCount: { width: 70, textAlign: "right", color: colors.text },
  weeklyCountUnit: { opacity: 0.7, color: colors.muted },

  // ===== Sidebar / analytics =====
  sidebar: {
    // if gap doesn't work for you, remove it and use cardSpacing below
  },
  cardSpacing: { marginBottom: spacing.xl }, // use this instead of gap

  card: {
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.cardBg,
    padding: spacing.lg,
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: { ...typography.title },

  goalEdit: { alignItems: "flex-end" },
  goalLabel: { fontSize: 12, color: colors.muted, marginBottom: spacing.xs },
  goalInput: {
    width: 70,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlign: "center",
    color: colors.text,
    backgroundColor: colors.cardBg,
  },

  bigNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.lg,
  },
  cardLabel: { marginTop: spacing.xs, color: colors.muted },

  progressBg: {
    marginTop: spacing.md,
    height: 10,
    borderRadius: radius.pill,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.cardBg,
  },
  progressFill: { height: "100%" },

  smallText: { marginTop: spacing.md, color: colors.muted },
  bold: { fontWeight: "700", color: colors.text },

  // Bottom Half
  mobileBottom: {
    flex: 1,
    marginTop: 14,
  },
  
  mobileBottomScroll: {
    flex: 1,
  },
  
  mobileBottomScrollContent: {
    paddingBottom: 16,
  },

  // Secondary-button
  secondaryButton: {
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontWeight: "700",
  },

  // ===== Weekly chart (right) =====
  weeklyChart: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
  },
  chartCol: { alignItems: "center", width: 32 },
  chartBar: {
    width: 18,
    height: 90,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: colors.cardBg,
  },
  chartBarInner: { width: "100%" },
  chartLabel: { marginTop: spacing.sm, fontWeight: "700", color: colors.text },
  chartCount: { marginTop: spacing.xs, fontSize: 12, color: colors.muted },
});