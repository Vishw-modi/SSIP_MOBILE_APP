import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/theme-context";
import { spacing, typography, radii } from "@/design/styles";

export const ThemeSelectionBottomSheet = forwardRef<BottomSheetModal>(
  (props, ref) => {
    const { theme, setTheme, palette } = useTheme();

    const snapPoints = useMemo(() => ["50%", "60%"], []);

    const handleClose = useCallback(() => {
      if (ref && typeof ref === "object" && ref.current) {
        ref.current.dismiss();
      }
    }, [ref]);

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.3}
        />
      ),
      []
    );

    const themeOptions = [
      {
        key: "light" as const,
        title: "Light",
        description: "Light appearance",
        icon: "sunny-outline" as const,
      },
      {
        key: "dark" as const,
        title: "Dark",
        description: "Dark appearance",
        icon: "moon-outline" as const,
      },
      {
        key: "system" as const,
        title: "System",
        description: "Follow device setting",
        icon: "phone-portrait-outline" as const,
      },
    ];

    const handleThemeSelect = (selectedTheme: "system" | "light" | "dark") => {
      setTheme(selectedTheme);
      handleClose();
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: palette.card,
          borderTopLeftRadius: radii.xl,
          borderTopRightRadius: radii.xl,
        }}
        handleIndicatorStyle={{
          backgroundColor: palette.textSecondary,
        }}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: palette.text }]}>
              Choose Theme
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={palette.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Theme Options */}
          <BottomSheetScrollView
            contentContainerStyle={styles.optionsContainer}
          >
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      theme === option.key ? palette.primaryBg : "transparent",
                    borderColor:
                      theme === option.key ? palette.primary : palette.border,
                  },
                ]}
                onPress={() => handleThemeSelect(option.key)}
              >
                <View style={styles.optionContent}>
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={
                      theme === option.key ? palette.primary : palette.text
                    }
                    style={{ marginRight: spacing.md }}
                  />
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionTitle,
                        {
                          color:
                            theme === option.key
                              ? palette.primary
                              : palette.text,
                        },
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        { color: palette.textMuted },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                </View>
                {theme === option.key && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={palette.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

ThemeSelectionBottomSheet.displayName = "ThemeSelectionBottomSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h4,
  },
  closeButton: {
    padding: spacing.xs,
  },
  optionsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...typography.label,
    marginBottom: spacing.xxs,
  },
  optionDescription: {
    ...typography.caption,
  },
});
