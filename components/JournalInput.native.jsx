import React, { useMemo } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { journalInputStyles as styles } from "../styles/journalInput.styles.js";
import GlassSurface from "./GlassSurface.native";

const MAX_CHARS = 1000;

const PROMPTS = [
  "What went well today, even if it was small?",
  "What is making you feel stressed right now?",
  "What would you tell a friend who felt the way you do today?",
];

export default function JournalInput({ note, setNote }) {
  const length = note.length;
  const remaining = MAX_CHARS - length;
  const isNearLimit = remaining <= 100;

  function handleChange(value) {
    if (value.length <= MAX_CHARS) setNote(value);
  }

  function insertPrompt(text) {
    if (!note.trim()) setNote(text + " ");
    else setNote(note.trimEnd() + "\n\n" + text + " ");
  }

  const chips = useMemo(
    () => [
      { icon: "✨ ", text: PROMPTS[0] },
      { icon: "🌧 ", text: PROMPTS[1] },
      { icon: "💌 ", text: PROMPTS[2] },
    ],
    []
  );

  return (
    <GlassSurface style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Today’s reflection</Text>
          <Text style={styles.subtitle}>
            A few sentences are enough. This stays on your device for now.
          </Text>
        </View>

        <Text style={[styles.counter, isNearLimit && styles.counterWarn]}>
          {length}/{MAX_CHARS}
        </Text>
      </View>

      <View style={styles.chipsRow}>
        {chips.map((c, i) => (
          <Pressable
            key={i}
            onPress={() => insertPrompt(c.text)}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipText}>
              {c.icon}
              {c.text}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={note}
        onChangeText={handleChange}
        placeholder="Write about your day, or tap a prompt above to get started..."
        multiline
        textAlignVertical="top"
        style={styles.textarea}
      />

      <Text style={styles.footer}>
        Be kind to yourself. This journal is for you, not for perfection.
      </Text>
    </GlassSurface>
  );
}