import React, { JSX } from "react";
import { View, Pressable, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/theme-context";

// Type definitions
type RouteIconConfig = {
  focused: keyof typeof Ionicons.glyphMap;
  unfocused: keyof typeof Ionicons.glyphMap;
};

type RouteIcons = {
  [key: string]: RouteIconConfig;
};

type Route = {
  name: string;
  key: string;
};

type TabBarDescriptor = {
  options: {
    tabBarAccessibilityLabel?: string;
    title?: string;
  };
};

type NavigationState = {
  routes: Route[];
  index: number;
};

type NavigationEmitOptions = {
  type: string;
  target: string;
  canPreventDefault?: boolean;
};

type NavigationEvent = {
  defaultPrevented: boolean;
};

type Navigation = {
  emit: (options: NavigationEmitOptions) => NavigationEvent;
  navigate: (routeName: string) => void;
};

export interface BottomBarClassicProps {
  state: NavigationState;
  descriptors: { [key: string]: TabBarDescriptor };
  navigation: Navigation;
  onCenterPress: () => void;
}

// Define your route icons and configuration
const ROUTE_ICONS: RouteIcons = {
  home: { focused: "home", unfocused: "home-outline" },
  chat: { focused: "chatbubbles", unfocused: "chatbubbles-outline" },
  dailytask: {
    focused: "calendar-clear-sharp",
    unfocused: "calendar-outline",
  },
  profile: { focused: "person", unfocused: "person-outline" },
};

const ROUTES_WITH_DOT = new Set(["dailytask"]);

export default function BottomBarClassic({
  state,
  descriptors,
  navigation,
  onCenterPress,
}: BottomBarClassicProps): JSX.Element {
  const { palette } = useTheme(); // Use theme hook
  const { routes, index } = state;

  const renderTabItem = (
    route: Route,
    routeIndex: number
  ): JSX.Element | null => {
    const { options } = descriptors[route.key];
    const isFocused = index === routeIndex;
    const color = isFocused ? palette.primary : palette.textMuted; // Use theme colors

    // Get icon configuration for this route
    const iconConfig = ROUTE_ICONS[route.name];
    if (!iconConfig) {
      console.warn(`No icon configuration found for route: ${route.name}`);
      return null;
    }

    const iconName = isFocused ? iconConfig.focused : iconConfig.unfocused;
    const showDot = ROUTES_WITH_DOT.has(route.name);

    const onPress = (): void => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = (): void => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    // Create dynamic styles for this tab item
    const tabItemStyles = StyleSheet.create({
      iconWrap: {
        position: "relative",
        height: 28,
        justifyContent: "center",
      },
      dot: {
        position: "absolute",
        right: -4,
        top: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: palette.accent, // Use theme accent color
      },
    });

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabItem}
        android_ripple={{
          color: palette.primary + "10", // Use theme-aware ripple
          borderless: true,
        }}
      >
        <View style={tabItemStyles.iconWrap}>
          <Ionicons name={iconName} size={26} color={color} />
          {showDot && <View style={tabItemStyles.dot} />}
        </View>
      </Pressable>
    );
  };

  // Create dynamic styles that use current theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      backgroundColor: palette.card, // Use theme card background
      borderTopWidth: 1,
      borderTopColor: palette.border, // Use theme border color
      paddingTop: 10,
      paddingBottom: 10 + (Platform.OS === "ios" ? 8 : 0),
    },
    centerBtn: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    },
    centerHalo: {
      position: "absolute",
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: palette.primary + "10", // Use theme primary with opacity
      borderWidth: 1,
      borderColor: palette.primary + "40", // Use theme primary with opacity
    },
    centerInner: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.card, // Use theme card background
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: palette.primary, // Use theme primary color
      shadowColor: palette.text + "20", // Use theme-aware shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* First two tabs (home, chat) */}
      <View style={styles.sideGroup}>
        {routes
          .slice(0, 2)
          .map((route, routeIndex) => renderTabItem(route, routeIndex))}
      </View>

      {/* Center action button at position 3 */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open actions menu"
        onPress={onCenterPress}
        style={({ pressed }) => [
          dynamicStyles.centerBtn,
          pressed &&
            Platform.select({
              android: { opacity: 0.85 },
              default: { transform: [{ scale: 0.96 }] },
            }),
        ]}
      >
        <View style={dynamicStyles.centerHalo} />
        <View style={dynamicStyles.centerInner}>
          <Ionicons name="apps" size={26} color={palette.primary} />
        </View>
      </Pressable>

      {/* Last two tabs (dailytask, profile) */}
      <View style={styles.sideGroup}>
        {routes
          .slice(2)
          .map((route, routeIndex) => renderTabItem(route, routeIndex + 2))}
      </View>
    </View>
  );
}

// Static styles that don't need theming
const styles = StyleSheet.create({
  sideGroup: {
    flexDirection: "row",
    flex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingVertical: 8,
  },
});
