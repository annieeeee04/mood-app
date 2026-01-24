import React from "react";
import { View, Pressable, Text } from "react-native";
import { moodSelectorStyles as styles } from "../styles/moodSelector.styles.js";

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
