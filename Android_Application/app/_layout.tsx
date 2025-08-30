import { useFonts } from "expo-font";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LogBox, StatusBar, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ThemeProvider, useTheme } from "@/context/theme-context";

// Inner component that uses theme
function ThemedApp() {
  const { palette, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: palette.bg }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={palette.bg}
      />
      <Slot />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  LogBox.ignoreLogs([
    "Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview",
  ]);

  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.log(err);
        return;
      }
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ClerkProvider tokenCache={tokenCache}>
          <ThemedApp />
        </ClerkProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Remove the manual paddingTop - SafeAreaView handles this
  },
});
