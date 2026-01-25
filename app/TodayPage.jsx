import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  useWindowDimensions,
  Pressable,
} from "react-native";
import axios from "axios";

import { router } from "expo-router";
import { styles } from "../styles/todayStyles";
import SupportChatCard from "../components/SupportChatCard.native";
import MoodSelector from "../components/MoodSelector.native";
import TaskList from "../components/TaskList.native";
import JournalInput from "../components/JournalInput.native";
import { useAppSettings } from "../context/AppSettingsContext";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE } from "../config/api";

// helper: turn any Date/string into "YYYY-MM-DD"
function getDateKey(value) {
  const d = new Date(value);
  return d.toISOString().slice(0, 10);
}

// ✅ helper: nicer axios error logging
function logAxiosError(label, err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const msg = err?.message;
  console.error(label, { status, data, msg });
}

export default function TodayPage({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [mood, setMood] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [note, setNote] = useState("");
  const { dailyGoal, setDailyGoal } = useAppSettings();

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
      logAxiosError("Failed to load tasks", err);
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

      // ✅ put newest task at TOP (since backend returns DESC)
      setTasks((prev) => [
        {
          id: t.id,
          text: t.text,
          done: !!t.done,
          createdAt: t.created_at,
        },
        ...prev,
      ]);
    } catch (err) {
      logAxiosError("Failed to add task", err);
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
      logAxiosError("Failed to update task", err);
      // optional: revert if failed
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !newDone } : t))
      );
    }
  }

  async function deleteTask(id) {
    // optimistic UI
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await axios.delete(`${API_BASE}/api/tasks/${id}`);
    } catch (err) {
      logAxiosError("Failed to delete task", err);
      // revert if failed
      setTasks(prevTasks);
    }
  }

  async function saveToday() {
    const dateKey = getDateKey(new Date());

    try {
      await axios.post(`${API_BASE}/api/journal`, { dateKey, mood, note });
      Alert.alert("Saved", "Day saved!");
    } catch (err) {
      logAxiosError("Failed to save journal", err);
      Alert.alert("Error", "Couldn't save your day. Please try again.");
    }
  }

  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
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

  const totalCompletedWeek = weeklySummary.reduce((sum, d) => sum + d.completed, 0);

  const safeGoal = dailyGoal > 0 ? dailyGoal : 1;
  const completionRateToday = Math.min(
    100,
    Math.round((completedToday / safeGoal) * 100)
  );

  const weeklyGoal = safeGoal * 7;
  const maxForBars = safeGoal;

  function renderAnalytics() {
    return (
      <>
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
          <Text style={styles.cardLabel}>tasks completed of {safeGoal} today</Text>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${completionRateToday}%` }]} />
          </View>

          <Text style={styles.smallText}>Completion rate: {completionRateToday}%</Text>
        </View>

        {/* Weekly bar chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly bar chart</Text>
          <Text style={styles.smallText}>
            Total completed this week: <Text style={styles.bold}>{totalCompletedWeek}</Text>{" "}
            / {weeklyGoal}
          </Text>

          <View style={styles.weeklyChart}>
            {weeklySummary.map((day) => {
              const heightPct = Math.min(100, (day.completed / maxForBars) * 100);

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
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screen}>
        {isWide ? (
          <View style={[styles.layout, { flexDirection: "row" }]}>
            {/* LEFT */}
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
              <Text style={styles.pageTitle}>{dateLabel}</Text>

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

              <Pressable
                onPress={saveToday}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.saveButtonPressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>Save Today</Text>
              </Pressable>

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
                      {day.completed} <Text style={styles.weeklyCountUnit}>done</Text>
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* RIGHT */}
            <View style={[styles.sidebar, { width: 320 }]}>{renderAnalytics()}</View>
          </View>
        ) : (
          <View style={styles.mobileSplit}>
            <ScrollView
              style={styles.mobileScroll}
              contentContainerStyle={styles.mobileScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.pageTitle}>{dateLabel}</Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/progress",
                    params: {
                      dailyGoal,
                      completedToday,
                      safeGoal,
                      completionRateToday,
                      weeklySummary: JSON.stringify(weeklySummary),
                      totalCompletedWeek,
                      weeklyGoal,
                      maxForBars,
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.saveButtonPressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>View progress</Text>
              </Pressable>

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

              <Pressable
                onPress={saveToday}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.saveButtonPressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>Save Today</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}