import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useTheme } from "../../context/theme-context";

const Layout = () => {
  const { palette } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
            headerLargeTitle: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
