import React, { createContext, useContext, useMemo, useState } from "react";

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [dailyGoal, setDailyGoal] = useState(5);

  const value = useMemo(
    () => ({
      dailyGoal,
      setDailyGoal,
    }),
    [dailyGoal]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return ctx;
}