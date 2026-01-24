import React from "react";
import { View, Text, TextInput } from "react-native";
import SupportChatCard from "./SupportChatCard.native";
import { styles } from "../styles/todayStyles";

export default function ProgressPanel({
  dailyGoal,
  setDailyGoal,
  completedToday,
  safeGoal,
  completionRateToday,
  weeklySummary,
  totalCompletedWeek,
  weeklyGoal,
  maxForBars,
}) {
  return (
    <>
      {/* Today summary */}
      <View style={[styles.card, styles.cardSpacing]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Today summary</Text>

          <View style={styles.goalEdit}>
            <Text style={styles.goalLabel}>Daily goal</Text>
            <TextInput
              value={String(dailyGoal)}
              onChangeText={(txt) => {
                const v = parseInt(txt, 10);
                setDailyGoal(Number.isNaN(v) ? 1 : Math.max(1, v));
              }}
              keyboardType="number-pad"
              style={styles.goalInput}
            />
          </View>
        </View>

        <Text style={styles.bigNumber}>{completedToday}</Text>
        <Text style={styles.cardLabel}>tasks completed of {safeGoal} today</Text>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${completionRateToday}%` }]} />
        </View>

        <Text style={styles.smallText}>Completion rate: {completionRateToday}%</Text>
      </View>

      {/* Weekly bar chart */}
      <View style={[styles.card, styles.cardSpacing]}>
        <Text style={styles.cardTitle}>Weekly bar chart</Text>
        <Text style={styles.smallText}>
          Total completed this week: <Text style={styles.bold}>{totalCompletedWeek}</Text> / {weeklyGoal}
        </Text>

        <View style={styles.weeklyChart}>
          {weeklySummary.map((day) => {
            const heightPct = Math.min(100, (day.completed / maxForBars) * 100);
            return (
              <View style={styles.chartCol} key={day.dateKey}>
                <View style={styles.chartBar}>
                  <View style={[styles.chartBarInner, { height: `${heightPct || 0}%` }]} />
                </View>
                <Text style={styles.chartLabel}>{day.label === "Today" ? "T" : day.label[0]}</Text>
                <Text style={styles.chartCount}>{day.completed}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Support chat */}
      <SupportChatCard />
    </>
  );
}