// import React, { JSX } from "react";
// import { View, Pressable, Platform, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useTheme } from "@/context/theme-context";

// // Type definitions
// type RouteIconConfig = {
//   focused: keyof typeof Ionicons.glyphMap;
//   unfocused: keyof typeof Ionicons.glyphMap;
// };

// type RouteIcons = {
//   [key: string]: RouteIconConfig;
// };

// type Route = {
//   name: string;
//   key: string;
// };

// type TabBarDescriptor = {
//   options: {
//     tabBarAccessibilityLabel?: string;
//     title?: string;
//   };
// };

// type NavigationState = {
//   routes: Route[];
//   index: number;
// };

// type NavigationEmitOptions = {
//   type: string;
//   target: string;
//   canPreventDefault?: boolean;
// };

// type NavigationEvent = {
//   defaultPrevented: boolean;
// };

// type Navigation = {
//   emit: (options: NavigationEmitOptions) => NavigationEvent;
//   navigate: (routeName: string) => void;
// };

// export interface BottomBarClassicProps {
//   state: NavigationState;
//   descriptors: { [key: string]: TabBarDescriptor };
//   navigation: Navigation;
//   onCenterPress: () => void;
// }

// // Define your route icons and configuration
// const ROUTE_ICONS: RouteIcons = {
//   home: { focused: "home", unfocused: "home-outline" },
//   chat: { focused: "chatbubbles", unfocused: "chatbubbles-outline" },
//   dailytask: {
//     focused: "calendar-clear-sharp",
//     unfocused: "calendar-outline",
//   },
//   profile: { focused: "person", unfocused: "person-outline" },
// };

// const ROUTES_WITH_DOT = new Set(["dailytask"]);

// export default function BottomBarClassic({
//   state,
//   descriptors,
//   navigation,
//   onCenterPress,
// }: BottomBarClassicProps): JSX.Element {
//   const { palette } = useTheme(); // Use theme hook
//   const { routes, index } = state;

//   const renderTabItem = (
//     route: Route,
//     routeIndex: number
//   ): JSX.Element | null => {
//     const { options } = descriptors[route.key];
//     const isFocused = index === routeIndex;
//     const color = isFocused ? palette.primary : palette.textMuted; // Use theme colors

//     // Get icon configuration for this route
//     const iconConfig = ROUTE_ICONS[route.name];
//     if (!iconConfig) {
//       console.warn(`No icon configuration found for route: ${route.name}`);
//       return null;
//     }

//     const iconName = isFocused ? iconConfig.focused : iconConfig.unfocused;
//     const showDot = ROUTES_WITH_DOT.has(route.name);

//     const onPress = (): void => {
//       const event = navigation.emit({
//         type: "tabPress",
//         target: route.key,
//         canPreventDefault: true,
//       });

//       if (!isFocused && !event.defaultPrevented) {
//         navigation.navigate(route.name);
//       }
//     };

//     const onLongPress = (): void => {
//       navigation.emit({
//         type: "tabLongPress",
//         target: route.key,
//       });
//     };

//     // Create dynamic styles for this tab item
//     const tabItemStyles = StyleSheet.create({
//       iconWrap: {
//         position: "relative",
//         height: 28,
//         justifyContent: "center",
//       },
//       dot: {
//         position: "absolute",
//         right: -4,
//         top: -2,
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: palette.accent, // Use theme accent color
//       },
//     });

//     return (
//       <Pressable
//         key={route.key}
//         accessibilityRole="button"
//         accessibilityState={isFocused ? { selected: true } : {}}
//         accessibilityLabel={options.tabBarAccessibilityLabel}
//         onPress={onPress}
//         onLongPress={onLongPress}
//         style={styles.tabItem}
//         android_ripple={{
//           color: palette.primary + "10", // Use theme-aware ripple
//           borderless: true,
//         }}
//       >
//         <View style={tabItemStyles.iconWrap}>
//           <Ionicons name={iconName} size={26} color={color} />
//           {showDot && <View style={tabItemStyles.dot} />}
//         </View>
//       </Pressable>
//     );
//   };

//   // Create dynamic styles that use current theme
//   const dynamicStyles = StyleSheet.create({
//     container: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       paddingHorizontal: 10,
//       backgroundColor: palette.card, // Use theme card background
//       borderTopWidth: 1,
//       borderTopColor: palette.border, // Use theme border color
//       paddingTop: 10,
//       paddingBottom: 10 + (Platform.OS === "ios" ? 8 : 0),
//     },
//     centerBtn: {
//       width: 58,
//       height: 58,
//       borderRadius: 29,
//       alignItems: "center",
//       justifyContent: "center",
//       marginHorizontal: 4,
//     },
//     centerHalo: {
//       position: "absolute",
//       width: 58,
//       height: 58,
//       borderRadius: 29,
//       backgroundColor: palette.primary + "10", // Use theme primary with opacity
//       borderWidth: 1,
//       borderColor: palette.primary + "40", // Use theme primary with opacity
//     },
//     centerInner: {
//       width: 44,
//       height: 44,
//       borderRadius: 22,
//       backgroundColor: palette.card, // Use theme card background
//       alignItems: "center",
//       justifyContent: "center",
//       borderWidth: 2,
//       borderColor: palette.primary, // Use theme primary color
//       shadowColor: palette.text + "20", // Use theme-aware shadow
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.06,
//       shadowRadius: 4,
//       elevation: 2,
//     },
//   });

//   return (
//     <View style={dynamicStyles.container}>
//       {/* First two tabs (home, chat) */}
//       <View style={styles.sideGroup}>
//         {routes
//           .slice(0, 2)
//           .map((route, routeIndex) => renderTabItem(route, routeIndex))}
//       </View>

//       {/* Center action button at position 3 */}
//       <Pressable
//         accessibilityRole="button"
//         accessibilityLabel="Open actions menu"
//         onPress={onCenterPress}
//         style={({ pressed }) => [
//           dynamicStyles.centerBtn,
//           pressed &&
//             Platform.select({
//               android: { opacity: 0.85 },
//               default: { transform: [{ scale: 0.96 }] },
//             }),
//         ]}
//       >
//         <View style={dynamicStyles.centerHalo} />
//         <View style={dynamicStyles.centerInner}>
//           <Ionicons name="apps" size={26} color={palette.primary} />
//         </View>
//       </Pressable>

//       {/* Last two tabs (dailytask, profile) */}
//       <View style={styles.sideGroup}>
//         {routes
//           .slice(2)
//           .map((route, routeIndex) => renderTabItem(route, routeIndex + 2))}
//       </View>
//     </View>
//   );
// }

// // Static styles that don't need theming
// const styles = StyleSheet.create({
//   sideGroup: {
//     flexDirection: "row",
//     flex: 1,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 48,
//     paddingVertical: 8,
//   },
// });

import React, { JSX, useRef, useCallback, useMemo, useState } from "react";
import {
  View,
  Pressable,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

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
}

// Action button component
const ActionButton = ({
  icon,
  title,
  subtitle,
  onPress,
  palette,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  palette: any;
}) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      {
        backgroundColor: palette.card,
        borderColor: palette.border,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[styles.actionIcon, { backgroundColor: palette.primary + "15" }]}
    >
      <Ionicons name={icon} size={24} color={palette.primary} />
    </View>
    <View style={styles.actionText}>
      <Text style={[styles.actionTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.actionSubtitle, { color: palette.textMuted }]}>
        {subtitle}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
  </TouchableOpacity>
);

// Define your route icons and configuration
const ROUTE_ICONS: RouteIcons = {
  home: { focused: "home", unfocused: "home-outline" },
  chat: { focused: "chatbubbles", unfocused: "chatbubbles-outline" },
  dailytask: {
    focused: "calendar-clear",
    unfocused: "calendar-outline",
  },
  profile: { focused: "person", unfocused: "person-outline" },
};

const ROUTES_WITH_DOT = new Set(["dailytask"]);

export default function BottomBarClassic({
  state,
  descriptors,
  navigation,
}: BottomBarClassicProps): JSX.Element {
  const { palette } = useTheme();
  const { routes, index } = state;
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Bottom sheet setup
  const snapPoints = useMemo(() => ["75%"], []);

  const handlePresentModal = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
      />
    ),
    []
  );

  // Actions for the bottom sheet
  const actions = [
    {
      icon: "camera" as const,
      title: "Caltrack",
      subtitle: "Log your meals easily",
      onPress: () => {
        router.push("/caltrack");
        handleCloseModal();
      },
    },
    {
      icon: "document-text" as const,
      title: "SymptoScan",
      subtitle: "Scan and log symptoms",
      onPress: () => {
        router.push("/symptoscan");
        handleCloseModal();
      },
    },
    {
      icon: "people" as const,
      title: "Invite Friends",
      subtitle: "Share with your contacts",
      onPress: () => {
        handleCloseModal();
      },
    },
    {
      icon: "settings" as const,
      title: "Quick Settings",
      subtitle: "Adjust your preferences",
      onPress: () => {
        router.push("/profile/settings");
        handleCloseModal();
      },
    },
  ];

  // Filter actions based on search query
  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return actions;

    return actions.filter(
      (action) =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderTabItem = (
    route: Route,
    routeIndex: number
  ): JSX.Element | null => {
    const { options } = descriptors[route.key];
    const isFocused = index === routeIndex;
    const color = isFocused ? palette.text : palette.textMuted;

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
        backgroundColor: palette.accent,
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
          color: palette.primary + "10",
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
      backgroundColor: palette.card,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      paddingTop: 5,
      paddingBottom: 5 + (Platform.OS === "ios" ? 8 : 0),
    },
    centerBtn: {
      width: 44,
      height: 44,
      borderRadius: 14, // More rounded corners
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
      // backgroundColor: palette.bgSecondary,
      borderWidth: 1,
      borderColor: palette.border,
    },
  });

  return (
    <>
      <View style={dynamicStyles.container}>
        {/* First two tabs (home, chat) */}
        <View style={styles.sideGroup}>
          {routes
            .slice(0, 2)
            .map((route, routeIndex) => renderTabItem(route, routeIndex))}
        </View>

        {/* Center search/menu button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open search and quick menu"
          onPress={handlePresentModal}
          style={({ pressed }) => [
            dynamicStyles.centerBtn,
            pressed &&
              Platform.select({
                android: { opacity: 0.85 },
                default: { transform: [{ scale: 0.96 }] },
              }),
          ]}
        >
          <Ionicons name="search-outline" size={24} color={palette.textMuted} />
        </Pressable>

        {/* Last two tabs (dailytask, profile) */}
        <View style={styles.sideGroup}>
          {routes
            .slice(2)
            .map((route, routeIndex) => renderTabItem(route, routeIndex + 2))}
        </View>
      </View>

      {/* Integrated Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: palette.card,
          shadowColor: palette.text,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
        handleIndicatorStyle={{
          backgroundColor: palette.textMuted,
          width: 50,
          height: 5,
          borderRadius: 2.5,
        }}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDismissOnClose
        animateOnMount={true}
      >
        {/* <KeyboardAvoidingView> */}
        <BottomSheetView style={styles.sheetContainer}>
          {/* Functional Search Header */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: palette.bg,
                borderColor: palette.border,
              },
            ]}
          >
            <Ionicons name="search" size={20} color={palette.textMuted} />

            <TextInput
              style={[styles.searchInput, { color: palette.text }]}
              placeholder="Search features, settings..."
              placeholderTextColor={palette.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={palette.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Scrollable Content */}
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* <View style={styles.header}>
              <Text style={[styles.title, { color: palette.text }]}>
                Quick Actions
              </Text>
              <Text style={[styles.subtitle, { color: palette.textMuted }]}>
                Access your most used features
              </Text>
            </View> */}

            <View style={styles.actionsContainer}>
              {filteredActions.length > 0 ? (
                filteredActions.map((action, index) => (
                  <ActionButton
                    key={index}
                    icon={action.icon}
                    title={action.title}
                    subtitle={action.subtitle}
                    onPress={action.onPress}
                    palette={palette}
                  />
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search" size={48} color={palette.textMuted} />
                  <Text
                    style={[styles.noResultsText, { color: palette.textMuted }]}
                  >
                    No results found for {searchQuery}!
                  </Text>
                </View>
              )}
            </View>

            {/* Recent Activity */}
            {/* <View style={styles.quickAccessSection}>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>
                Recent Activity
              </Text>
              <View style={styles.quickAccessGrid}>
                <TouchableOpacity
                  style={[
                    styles.quickAccessItem,
                    {
                      backgroundColor: palette.bg,
                      borderColor: palette.border,
                    },
                  ]}
                  onPress={() => {
                    router.push("/caltrack");
                    handleCloseModal();
                  }}
                >
                  <Ionicons
                    name="restaurant"
                    size={20}
                    color={palette.primary}
                  />
                  <Text
                    style={[
                      styles.quickAccessText,
                      { color: palette.textMuted },
                    ]}
                  >
                    Last Meal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickAccessItem,
                    {
                      backgroundColor: palette.bg,
                      borderColor: palette.border,
                    },
                  ]}
                  onPress={() => {
                    router.push("/symptoscan");
                    handleCloseModal();
                  }}
                >
                  <Ionicons name="medical" size={20} color={palette.warning} />
                  <Text
                    style={[
                      styles.quickAccessText,
                      { color: palette.textMuted },
                    ]}
                  >
                    Symptoms
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </BottomSheetScrollView>
        </BottomSheetView>
        {/* </KeyboardAvoidingView> */}
      </BottomSheetModal>
    </>
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
  // Bottom sheet styles
  sheetContainer: {
    height: "90%",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60, // Increased bottom padding for better scroll experience
    flexGrow: 1, // Ensures content can grow and be scrollable
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickAccessItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickAccessText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  // New styles for additional scrollable content
  additionalSection: {
    marginBottom: 24,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "transparent",
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
});
