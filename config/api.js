import { Platform } from "react-native";


const RAILWAY_API = "https://mood-app-production-b874.up.railway.app";


export const API_BASE =
Platform.OS === "web"
? "http://localhost:4000"
: RAILWAY_API;