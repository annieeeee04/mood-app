import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  useWindowDimensions,
  Pressable,
} from "react-native";
import axios from "axios";

import SupportChatCard from "../components/SupportChatCard.native";
import MoodSelector from "../components/MoodSelector.native";
import TaskList from "../components/TaskList.native";
import JournalInput from "../components/JournalInput.native";

// IMPORTANT (RN networking):
// - Android emulator: http://10.0.2.2:4000
// - iOS simulator: http://localhost:4000
// - Real phone: http://<YOUR_LAPTOP_LAN_IP>:4000
const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

// helper: turn any Date/string into "YYYY-MM-DD"
function getDateKey(value) {
  const d = new Date(value);
  return d.toISOString().slice(0, 10);
}

export default function TodayPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [mood, setMood] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [note, setNote] = useState("");
  const [dailyGoal, setDailyGoal] = useState(5);

  async function loadTasks() {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`);
      setTasks(
        res.data.map((t) => ({
          id: t.id,
          text: t.text,
          done: !!t.done,
          createdAt: t.created_at,
        }))
      );
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  }

  // Polling to sync tasks (RN has no BroadcastChannel)
  useEffect(() => {
    loadTasks();
    const id = setInterval(loadTasks, 5000);
    return () => clearInterval(id);
  }, []);

  async function addTask(text) {
    if (!text.trim()) return;
    const createdAt = new Date().toISOString();

    try {
      const res = await axios.post(`${API_BASE}/api/tasks`, {
        text,
        done: false,
        createdAt,
        source: "mobile",
      });

      const t = res.data;
      setTasks((prev) => [
        ...prev,
        {
          id: t.id,
          text: t.text,
          done: !!t.done,
          createdAt: t.created_at,
        },
      ]);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  }

  async function toggleTask(id) {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;

    const newDone = !current.done;

    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: newDone } : t))
    );

    try {
      await axios.patch(`${API_BASE}/api/tasks/${id}`, { done: newDone });
    } catch (err) {
      console.error("Failed to update task", err);
    }
  }

  async function deleteTask(id) {
    // optimistic UI
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await axios.delete(`${API_BASE}/api/tasks/${id}`);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  }

  async function saveToday() {
    const dateKey = getDateKey(new Date());

    try {
      await axios.post(`${API_BASE}/api/journal`, { dateKey, mood, note });
      Alert.alert("Saved", "Day saved!");
    } catch (err) {
      console.error("Failed to save journal", err);
      Alert.alert("Error", "Couldn't save your day. Please try again.");
    }
  }

  const today = new Date();
  const todayKey = getDateKey(today);

  const weeklySummary = useMemo(() => {
    const arr = [];
    for (let offset = 6; offset >= 0; offset--) {
      const d = new Date();
      d.setDate(today.getDate() - offset);

      const dateKey = getDateKey(d);
      const label =
        offset === 0
          ? "Today"
          : d.toLocaleDateString(undefined, { weekday: "short" });

      const completedCount = tasks.filter(
        (t) => t.done && getDateKey(t.createdAt || today) === dateKey
      ).length;

      // 0–100% based on up to 5 tasks
      const intensity = Math.min(100, completedCount * 20);

      arr.push({ dateKey, label, completed: completedCount, intensity });
    }
    return arr;
  }, [tasks]);

  const completedToday = tasks.filter(
    (t) => t.done && getDateKey(t.createdAt || today) === todayKey
  ).length;

  const totalCompletedWeek = weeklySummary.reduce(
    (sum, d) => sum + d.completed,
    0
  );

  const safeGoal = dailyGoal > 0 ? dailyGoal : 1;
  const completionRateToday = Math.min(
    100,
    Math.round((completedToday / safeGoal) * 100)
  );

  const weeklyGoal = safeGoal * 7;
  const maxForBars = safeGoal;

  return (
    <View style={styles.screen}>
      <View
        style={[styles.layout, { flexDirection: isWide ? "row" : "column" }]}
      >
        {/* LEFT */}
        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
        >
          <Text style={styles.pageTitle}>Today</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How do you feel?</Text>
            <MoodSelector mood={mood} setMood={setMood} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <TaskList
              tasks={tasks}
              addTask={addTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Journal</Text>
            <JournalInput note={note} setNote={setNote} />
          </View>

          {/* Save button (Pressable is more correct than Text onPress) */}
          <Pressable
            onPress={saveToday}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
            accessibilityRole="button"
            pointerEvents="auto"
          >
            <Text style={styles.saveButtonText}>Save Today</Text>
          </Pressable>

          {/* Weekly report list */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly report</Text>
            <Text style={styles.weeklySubtitle}>
              Completed tasks in the last 7 days.
            </Text>

            {weeklySummary.map((day) => (
              <View style={styles.weeklyRow} key={day.dateKey}>
                <Text style={styles.weeklyDayLabel}>{day.label}</Text>

                <View style={styles.weeklyBarBg}>
                  <View
                    style={[
                      styles.weeklyBarFill,
                      { width: `${day.intensity}%` },
                    ]}
                  />
                </View>

                <Text style={styles.weeklyCount}>
                  {day.completed}{" "}
                  <Text style={styles.weeklyCountUnit}>done</Text>
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* RIGHT */}
        <View style={[styles.sidebar, { width: isWide ? 320 : "100%" }]}>
          {/* Today summary */}
          <View style={styles.card}>
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
            <Text style={styles.cardLabel}>
              tasks completed of {safeGoal} today
            </Text>

            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionRateToday}%` },
                ]}
              />
            </View>

            <Text style={styles.smallText}>
              Completion rate: {completionRateToday}%
            </Text>
          </View>

          {/* Weekly bar chart */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly bar chart</Text>
            <Text style={styles.smallText}>
              Total completed this week:{" "}
              <Text style={styles.bold}>{totalCompletedWeek}</Text> /{" "}
              {weeklyGoal}
            </Text>

            <View style={styles.weeklyChart}>
              {weeklySummary.map((day) => {
                const heightPct = Math.min(
                  100,
                  (day.completed / maxForBars) * 100
                );

                return (
                  <View style={styles.chartCol} key={day.dateKey}>
                    <View style={styles.chartBar}>
                      <View
                        style={[
                          styles.chartBarInner,
                          { height: `${heightPct || 0}%` },
                        ]}
                      />
                    </View>

                    <Text style={styles.chartLabel}>
                      {day.label === "Today" ? "T" : day.label[0]}
                    </Text>
                    <Text style={styles.chartCount}>{day.completed}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <SupportChatCard />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  layout: { flex: 1, gap: 16 },

  main: { flex: 1 },
  mainContent: { paddingBottom: 24 },

  pageTitle: { fontSize: 28, fontWeight: "700", marginBottom: 12 },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },

  saveButton: {
    marginTop: 16,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: { fontWeight: "600" },

  weeklySubtitle: { marginBottom: 10 },

  weeklyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  weeklyDayLabel: { width: 60, fontWeight: "600" },
  weeklyBarBg: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  weeklyBarFill: { height: "100%" },
  weeklyCount: { width: 70, textAlign: "right" },
  weeklyCountUnit: { opacity: 0.7 },

  sidebar: { gap: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 14 },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },

  goalEdit: { alignItems: "flex-end" },
  goalLabel: { fontSize: 12, opacity: 0.7, marginBottom: 4 },
  goalInput: {
    width: 70,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
  },

  bigNumber: { fontSize: 36, fontWeight: "800", marginTop: 12 },
  cardLabel: { marginTop: 4, opacity: 0.8 },

  progressBg: {
    marginTop: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  progressFill: { height: "100%" },

  smallText: { marginTop: 8, opacity: 0.8 },
  bold: { fontWeight: "700" },

  weeklyChart: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 6,
  },
  chartCol: { alignItems: "center", width: 32 },
  chartBar: {
    width: 18,
    height: 90,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  chartBarInner: { width: "100%" },
  chartLabel: { marginTop: 6, fontWeight: "700" },
  chartCount: { marginTop: 2, fontSize: 12, opacity: 0.8 },
});
