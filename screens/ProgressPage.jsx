import React, { useMemo } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import ProgressPanel from "../components/ProgressPanel.native";
import { styles } from "../styles/todayStyles";
import { useAppSettings } from "../context/AppSettingsContext";

export default function ProgressPage() {
  const { dailyGoal, setDailyGoal } = useAppSettings();
  const params = useLocalSearchParams();

  const completedToday = Number(params.completedToday || 0);
  const totalCompletedWeek = Number(params.totalCompletedWeek || 0);

  const weeklySummary = useMemo(() => {
    try {
      return JSON.parse(params.weeklySummary || "[]");
    } catch {
      return [];
    }
  }, [params.weeklySummary]);

  const safeGoal = useMemo(() => (dailyGoal > 0 ? dailyGoal : 1), [dailyGoal]);
  const completionRateToday = useMemo(() => {
    return Math.min(100, Math.round((completedToday / safeGoal) * 100));
  }, [completedToday, safeGoal]);

  const weeklyGoal = safeGoal * 7;
  const maxForBars = safeGoal;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#dbeafe", "#f0f9ff", "#fef9c3"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Progress</Text>

        <ProgressPanel
          dailyGoal={dailyGoal}
          setDailyGoal={setDailyGoal}
          completedToday={completedToday}
          safeGoal={safeGoal}
          completionRateToday={completionRateToday}
          weeklySummary={weeklySummary}
          totalCompletedWeek={totalCompletedWeek}
          weeklyGoal={weeklyGoal}
          maxForBars={maxForBars}
        />
      </ScrollView>
    </SafeAreaView>
  );
}