import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";
import { palette } from "@/design/styles";

// Auth stack only when unauthenticated.
// Note: user-details moved to (onboarding) group.
export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (isSignedIn) return <Redirect href="/welcome" />;

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="reset" options={{ headerShown: false }} />
    </Stack>
  );
}
