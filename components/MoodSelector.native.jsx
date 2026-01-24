import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

export default function MoodSelector({ mood, setMood, onMoodPicked }) {
  const moods = ["😢", "😕", "😐", "😊", "🤩"];

  return (
    <View style={styles.row}>
      {moods.map((emoji, i) => {
        const value = i + 1;
        const isActive = mood === value;

        return (
          <Pressable
            key={value}
            onPress={() => {
              setMood(value);
              onMoodPicked?.(value);
            }}
            style={({ pressed }) => [
              styles.btn,
              isActive && styles.btnActive,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  btn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnActive: { borderWidth: 2 },
  btnPressed: { opacity: 0.7 },
  emoji: { fontSize: 22 },
});
