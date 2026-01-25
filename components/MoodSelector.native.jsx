import React from "react";
import { View, Pressable, Text, ScrollView } from "react-native";
import { moodSelectorStyles as styles } from "../styles/moodSelector.styles.js";
import GlassSurface from "./GlassSurface.native";

export default function MoodSelector({ mood, setMood, onMoodPicked }) {
  const moods = ["😸", "😹", "😺", "😻", "🙀", "😿", "😼"];

  return (
    <GlassSurface style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
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
      </ScrollView>
    </GlassSurface>
  );
}