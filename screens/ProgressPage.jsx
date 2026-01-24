import React from "react";
import { ScrollView, Text } from "react-native";
import ProgressPanel from "../components/ProgressPanel.native";
import { styles } from "../styles/todayStyles";

export default function ProgressPage({ route }) {
  const {
    dailyGoal,
    completedToday,
    safeGoal,
    completionRateToday,
    weeklySummary,
    totalCompletedWeek,
    weeklyGoal,
    maxForBars,
  } = route.params;

  // If you want dailyGoal editable here and reflected back, see section 4 below.
  // For now, keep it display-only or handle it via global state.
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Progress</Text>

      <ProgressPanel
        dailyGoal={dailyGoal}
        setDailyGoal={() => {}}
        completedToday={completedToday}
        safeGoal={safeGoal}
        completionRateToday={completionRateToday}
        weeklySummary={weeklySummary}
        totalCompletedWeek={totalCompletedWeek}
        weeklyGoal={weeklyGoal}
        maxForBars={maxForBars}
      />
    </ScrollView>
  );
}