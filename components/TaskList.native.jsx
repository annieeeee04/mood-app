import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Switch } from "react-native";
import { taskListStyles as styles } from "../styles/taskList.styles.js";
import GlassSurface from "./GlassSurface.native";

export default function TaskList({ tasks, addTask, toggleTask, deleteTask }) {
  const [input, setInput] = useState("");

  function handleAdd() {
    const t = input.trim();
    if (!t) return;
    addTask(t);
    setInput("");
  }

  return (
    <GlassSurface style={styles.wrapper}>
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
              <Switch value={task.done} onValueChange={() => toggleTask(task.id)} />
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
    </GlassSurface>
  );
}