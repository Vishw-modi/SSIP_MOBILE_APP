import React, { useRef, useCallback, JSX } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { ActionsBottomSheetModal } from "@/components/ActionsBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BottomBarClassic from "@/components/BottomBarClassic";

// Define tab route names as a union type for better type safety
type TabRouteNames = "home" | "chat" | "dailytask" | "profile";

// Optional: Create a configuration object for better maintainability
const TAB_SCREENS: {
  name: TabRouteNames;
  title: string;
}[] = [
  { name: "home", title: "Home" },
  { name: "chat", title: "Chat" },
  { name: "dailytask", title: "Daily Task" },
  { name: "profile", title: "Profile" },
];

export default function TabsLayout(): JSX.Element {
  const { isSignedIn } = useAuth();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback((): void => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCenterPress = useCallback((): void => {
    Haptics.selectionAsync();
    handlePresentModalPress();
  }, [handlePresentModalPress]);

  if (!isSignedIn) {
    return <Redirect href="/(public)/sign-in" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => (
          <BottomBarClassic
            {...props}
            navigation={props.navigation as any}
            onCenterPress={handleCenterPress}
          />
        )}
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        {TAB_SCREENS.map(({ name, title }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
            }}
          />
        ))}
      </Tabs>

      <ActionsBottomSheetModal ref={bottomSheetModalRef} />
    </View>
  );
}
