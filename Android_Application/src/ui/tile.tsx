import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing, radii, typography, shadows } from "@/design/styles";
import { useTheme } from "@/context/theme-context";
import { JSX } from "react";

export function Tile({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}): JSX.Element {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: palette.card,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: palette.border,
      padding: spacing.md,
      gap: 6,
      ...shadows.sm,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    title: {
      ...typography.labelSmall,
      fontWeight: "700",
      color: palette.text,
    },
    subtitle: {
      ...typography.caption,
      color: palette.textMuted,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={palette.textInverse} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
