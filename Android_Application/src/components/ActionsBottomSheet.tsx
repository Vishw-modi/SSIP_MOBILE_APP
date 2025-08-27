import React, { useMemo, forwardRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/theme-context"; // 👈 same theme hook
import { useRouter } from "expo-router";

// Action button that uses theme
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
  palette: ReturnType<typeof useTheme>["palette"];
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

export const ActionsBottomSheetModal = forwardRef<BottomSheetModal>(
  (props, ref) => {
    const { palette } = useTheme(); // 👈 grab theme
    const snapPoints = useMemo(() => ["50%", "65%"], []);
    const router = useRouter();
    const handleSheetChanges = useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);

    const handleClose = useCallback(() => {
      if (ref && typeof ref === "object" && ref.current) {
        ref.current.dismiss();
      }
    }, [ref]);
    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackgroundProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close" // 👈 closes when clicking outside
          opacity={0.2} // optional dim effect
        />
      ),
      []
    );
    const actions = [
      {
        icon: "camera" as const,
        title: "Caltrack",
        subtitle: "Log your meals easily",
        onPress: () => {
          router.push("/(core)/(caltrack)/Caltrack");
          handleClose();
        },
      },
      {
        icon: "document-text" as const,
        title: "SymptoScan",
        subtitle: "Scan and log symptoms",
        onPress: () => {
          router.push("/(core)/(symptoscan)/SymptoScan");
          handleClose();
        },
      },
      {
        icon: "people" as const,
        title: "Invite Friends",
        subtitle: "Share with your contacts",
        onPress: () => {
          handleClose();
        },
      },
      {
        icon: "settings" as const,
        title: "Quick Settings",
        subtitle: "Adjust your preferences",
        onPress: () => {
          handleClose();
        },
      },
    ];

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: palette.card, // 👈 theme background
        }}
        handleIndicatorStyle={{
          backgroundColor: palette.textSecondary,
          width: 40,
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.container}>
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: palette.text }]}>
                Quick Actions
              </Text>
              <Text style={[styles.subtitle, { color: palette.textMuted }]}>
                Choose an action to get started
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <ActionButton
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  subtitle={action.subtitle}
                  onPress={action.onPress}
                  palette={palette}
                />
              ))}
            </View>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

ActionsBottomSheetModal.displayName = "ActionsBottomSheetModal";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
});
