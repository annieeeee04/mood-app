import { Stack } from "expo-router";
import React from "react";
import { AppSettingsProvider } from "../context/AppSettingsContext"; 


export default function RootLayout() {
return (
<AppSettingsProvider>
<Stack screenOptions={{ headerShown: false }}>
<Stack.Screen name="index" />
</Stack>
</AppSettingsProvider>
);
}
