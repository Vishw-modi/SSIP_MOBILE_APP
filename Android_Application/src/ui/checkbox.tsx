import { Pressable, StyleSheet, Text, View } from "react-native";
import { radii, spacing, typography } from "@/design/styles";
import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { JSX } from "react";

interface Props {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}

export function NCheckbox({ label, value, onChange }: Props): JSX.Element {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    box: {
      width: 24,
      height: 24,
      borderRadius: radii.badge,
      borderWidth: 1,
      borderColor: value ? palette.primary : palette.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: value ? palette.primary : palette.card,
    },
    label: {
      ...typography.body,
      color: palette.text,
    },
  });

  return (
    <Pressable onPress={() => onChange(!value)} style={styles.row}>
      <View style={styles.box}>
        {value ? (
          <Ionicons name="checkmark" size={18} color={palette.textInverse} />
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
