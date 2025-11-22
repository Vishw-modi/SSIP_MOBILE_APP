import { Stack } from "expo-router";

export default function IntroLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onb-1" />
      <Stack.Screen name="onb-2" />
      <Stack.Screen name="onb-3" />
    </Stack>
  );
}
