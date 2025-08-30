import { Stack } from "expo-router";
import { useTheme } from "@/context/theme-context";

const HomeLayout = () => {
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
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: true,
          title: "Notifications",
          headerStyle: {
            backgroundColor: palette.card,
          },
          headerTintColor: palette.text,
          headerTitleStyle: {
            color: palette.text,
            fontWeight: "600",
          },
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
