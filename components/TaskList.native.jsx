import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";

export default function TaskList({ tasks, addTask, toggleTask, deleteTask }) {
  const [input, setInput] = useState("");

  function handleAdd() {
    const t = input.trim();
    if (!t) return;
    addTask(t);
    setInput("");
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add task..."
          placeholderTextColor="#777"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.item}>
            <View style={styles.itemLeft}>
              <Switch
                value={task.done}
                onValueChange={() => toggleTask(task.id)}
              />
              <Text style={[styles.taskText, task.done && styles.taskDone]}>
                {task.text}
              </Text>
            </View>

            <Pressable
              onPress={() => deleteTask(task.id)}
              style={({ pressed }) => [styles.delBtn, pressed && styles.pressed]}
            >
              <Text style={styles.delBtnText}>✕</Text>
            </Pressable>
          </View>
        ))}

        {tasks.length === 0 && (
          <Text style={styles.empty}>No tasks yet. Add your first one ✨</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },

  inputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: { borderWidth: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  addBtnText: { fontWeight: "700" },

  list: { gap: 10 },
  item: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  taskText: { flex: 1, fontSize: 14 },
  taskDone: { opacity: 0.6, textDecorationLine: "line-through" },

  delBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  delBtnText: { fontWeight: "700" },

  pressed: { opacity: 0.7 },
  empty: { opacity: 0.8 },
});
