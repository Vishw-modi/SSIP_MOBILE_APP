import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SymptomProvider } from "@/context/symptom-context";
import { useTheme } from "@/context/theme-context";

export default function CoreLayout() {
  const { palette } = useTheme();
  return (
    <SafeAreaProvider>
      <SymptomProvider>
        {/* <Slot /> */}
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: palette.bg,
            },
            headerStyle: {
              backgroundColor: palette.card,
            },
            headerTintColor: palette.text,
            headerTitleStyle: {
              color: palette.text,
              fontWeight: "600",
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Step1" options={{ headerShown: true }} />
          <Stack.Screen name="Step2" options={{ headerShown: true }} />
          <Stack.Screen name="Step3" options={{ headerShown: true }} />
          <Stack.Screen name="Step4" options={{ headerShown: true }} />
          <Stack.Screen name="Step5" options={{ headerShown: true }} />
        </Stack>
      </SymptomProvider>
    </SafeAreaProvider>
  );
}
