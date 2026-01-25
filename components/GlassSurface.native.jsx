// components/GlassSurface.native.jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { radius, glass } from "../styles/tokens";

export default function GlassSurface({ children, style, borderRadius = radius.lg }) {
  return (
    <View style={[styles.outer, { borderRadius }, style]}>
      <BlurView
        intensity={80} // 🔥 try 80–120
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.tint, { borderRadius }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    overflow: "hidden",
  },
  tint: {
    flex: 1,
    // optional extra tint layer to ensure readability
    backgroundColor: "rgba(255,255,255,0.06)",
  },
});