import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/context/theme-context";
import { View, Text } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import { ResultProvider } from "@/context/result-context";
import { SymptomProvider } from "@/context/symptom-context";

export default function ProfileLayout() {
  const { palette } = useTheme();

  const renderHeader = (title: string, navigation: any) => (
    <View
      style={{
        height: 50,
        backgroundColor: palette.card,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
      }}
    >
      <HeaderBackButton onPress={navigation.goBack} tintColor={palette.text} />
      <Text
        style={{
          color: palette.text,
          fontWeight: "600",
          marginLeft: 8,
        }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <ResultProvider>
        <SymptomProvider>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: palette.bg,
              },
              headerStyle: {
                backgroundColor: palette.card,
              },
              // headerStatusBarHeight: 0,
              headerTintColor: palette.text,
              headerTitleStyle: {
                color: palette.text,
                fontWeight: "600",
              },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen
              name="settings"
              options={({ navigation }) => ({
                header: () => renderHeader("Settings", navigation),
              })}
            />

            <Stack.Screen
              name="edit"
              options={({ navigation }) => ({
                header: () => renderHeader("Edit Profile", navigation),
              })}
            />
          </Stack>
        </SymptomProvider>
      </ResultProvider>
    </SafeAreaProvider>
  );
}
