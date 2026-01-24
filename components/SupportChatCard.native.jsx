import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
} from "react-native";
import axios from "axios";

const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export default function SupportChatCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi, I’m your AI buddy. I can listen and give gentle suggestions, " +
        "but I’m not a professional. What’s on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  const mappedPayload = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role,
        content: m.text,
      })),
    [messages]
  );

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        messages: newMessages.map((m) => ({ role: m.role, content: m.text })),
      });

      const replyText = res.data.reply || "(No reply received)";

      setMessages((prev) => [...prev, { role: "assistant", text: replyText }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (err) {
      console.error("chat error", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I had trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Need to talk?</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{isOpen ? "On" : "Off"}</Text>
          <Switch value={isOpen} onValueChange={setIsOpen} />
        </View>
      </View>

      <Text style={styles.small}>
        Chat with an AI companion about your day. This is not a substitute for
        professional help.
      </Text>

      {isOpen && (
        <>
          <ScrollView
            ref={scrollRef}
            style={styles.window}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.bubble,
                  m.role === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type something…"
              placeholderTextColor="#777"
              style={styles.input}
              multiline
            />
            <Pressable
              onPress={handleSend}
              disabled={loading || !input.trim()}
              style={({ pressed }) => [
                styles.sendBtn,
                (loading || !input.trim()) && styles.sendBtnDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.sendBtnText}>{loading ? "…" : "Send"}</Text>
            </Pressable>
          </View>

          <Text style={styles.note}>
            If you’re feeling overwhelmed, consider reaching out to a trusted
            person nearby.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggleLabel: { fontWeight: "700", opacity: 0.8 },
  small: { opacity: 0.8 },

  window: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    maxHeight: 260,
  },

  bubble: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, marginBottom: 8 },
  userBubble: { alignSelf: "flex-end", borderWidth: 1 },
  aiBubble: { alignSelf: "flex-start", borderWidth: 1 },
  bubbleText: { fontSize: 14, lineHeight: 20 },

  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
  },
  sendBtn: { borderWidth: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { fontWeight: "800" },
  pressed: { opacity: 0.7 },

  note: { marginTop: 4, opacity: 0.75, fontSize: 12 },
});
