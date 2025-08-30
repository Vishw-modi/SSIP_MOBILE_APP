import { Stack } from "expo-router";
import { useTheme } from "@/context/theme-context";

export default function ProfileLayout() {
  const { palette } = useTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: palette.bg,
        },
        headerStyle: {
          backgroundColor: palette.bg,
        },
        headerTintColor: palette.text,
        headerTitleStyle: {
          color: palette.text,
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Profile",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
