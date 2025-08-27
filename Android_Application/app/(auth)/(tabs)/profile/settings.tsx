import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../context/theme-context";
import { spacing, typography, radii, shadows } from "@/design/styles";
import { ThemeSelectionBottomSheet } from "@/components/ThemeSelectionModal";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function SettingsScreen() {
  const { theme, palette, isDark } = useTheme();
  const themeSheetRef = useRef<BottomSheetModal>(null);
  const getThemeDisplayText = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "System";
    }
  };

  const getThemeIcon = () => {
    if (theme === "system") return isDark ? "🌙" : "☀️";
    return theme === "dark" ? "🌙" : "☀️";
  };

  // Open modal instead of cycling through themes
  const openThemeModal = () => {
    themeSheetRef.current?.present();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]}>
      {/* Theme Selection Modal */}
      <ThemeSelectionBottomSheet ref={themeSheetRef} />

      {/* Appearance section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Appearance
        </Text>
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <TouchableOpacity
            style={styles.rowWithArrow}
            onPress={openThemeModal}
          >
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: palette.text }]}>
                Theme
              </Text>
              <View style={styles.rowValue}>
                <Text style={styles.themeIcon}>{getThemeIcon()}</Text>
                <Text style={[styles.valueText, { color: palette.textMuted }]}>
                  {getThemeDisplayText()}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account settings section with Language, Country, Currency */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Account settings
        </Text>
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <TouchableOpacity style={styles.rowWithArrow}>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: palette.text }]}>
                Language
              </Text>
              <View style={styles.rowValue}>
                <Text style={styles.flagEmoji}>🇺🇸</Text>
                <Text style={[styles.valueText, { color: palette.textMuted }]}>
                  English
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowWithArrow,
              styles.rowBorder,
              { borderTopColor: palette.border },
            ]}
          >
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: palette.text }]}>
                Country
              </Text>
              <Text style={[styles.valueText, { color: palette.textMuted }]}>
                Dubai
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Support section with navigation arrows */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Support
        </Text>
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <TouchableOpacity style={styles.rowWithArrow}>
            <Text style={[styles.rowLabel, { color: palette.text }]}>
              Get help
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowWithArrow,
              styles.rowBorder,
              { borderTopColor: palette.border },
            ]}
          >
            <Text style={[styles.rowLabel, { color: palette.text }]}>
              Give a feedback
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Legal section with navigation arrows */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Legal
        </Text>
        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <TouchableOpacity style={styles.rowWithArrow}>
            <Text style={[styles.rowLabel, { color: palette.text }]}>
              Terms of Service
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowWithArrow,
              styles.rowBorder,
              { borderTopColor: palette.border },
            ]}
          >
            <Text style={[styles.rowLabel, { color: palette.text }]}>
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: spacing.massive }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  section: {
    marginBottom: spacing.xxxl,
  },

  sectionTitle: {
    ...typography.h4,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.lg,
  },

  card: {
    marginHorizontal: spacing.screen,
    borderRadius: radii.card,
    ...shadows.sm,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56, // Minimum touch target
  },

  rowWithArrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56, // Minimum touch target
  },

  // New style to handle the content between label and arrow
  rowContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: spacing.sm,
  },

  rowBorder: {
    borderTopWidth: 1,
  },

  rowLabel: {
    ...typography.body,
  },

  rowValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  flagEmoji: {
    fontSize: 20,
  },

  themeIcon: {
    fontSize: 20,
  },

  valueText: {
    ...typography.body,
  },
});
