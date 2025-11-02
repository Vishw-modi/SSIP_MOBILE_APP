// components/ScrollAwareStatusBar.tsx
import React from "react";
import { Animated, StatusBar, Platform } from "react-native";
import { useTheme } from "@/context/theme-context";

interface Props {
  scrollY: Animated.Value; // Pass the scroll position
  maxOffset?: number; // Scroll offset at which status bar is fully opaque
  initialBgColor?: string; // Optional initial transparent background
}

export const ScrollAwareStatusBar: React.FC<Props> = ({
  scrollY,
  maxOffset = 200,
  initialBgColor = "transparent",
}) => {
  const { palette, isDark } = useTheme();

  // Interpolate background opacity based on scroll
  const backgroundColor = scrollY.interpolate({
    inputRange: [0, maxOffset],
    outputRange: [initialBgColor, palette.bg + "FF"], // transparent -> theme background
    extrapolate: "clamp",
  });

  return (
    <>
      {Platform.OS === "android" && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: StatusBar.currentHeight,
            backgroundColor,
            zIndex: 100,
          }}
        />
      )}
      <StatusBar
        translucent
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        animated
      />
    </>
  );
};
