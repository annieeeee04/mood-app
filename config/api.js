import { Platform } from "react-native";

export const API_BASE =
  Platform.OS === "web"
    ? "http://localhost:4000"
    : "http://128.189.40.146:4000";