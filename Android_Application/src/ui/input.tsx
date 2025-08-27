import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { radii, spacing, typography } from "@/design/styles";
import { useTheme } from "../../context/theme-context";
import { JSX } from "react";

interface NInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function NInput({
  label,
  error,
  style,
  ...props
}: NInputProps): JSX.Element {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    wrapper: { width: "100%" },
    label: {
      ...typography.labelSmall,
      color: palette.text,
      marginBottom: spacing.xs,
    },
    input: {
      height: 52,
      backgroundColor: palette.card,
      borderWidth: 1,
      borderColor: error ? palette.danger : palette.border,
      borderRadius: radii.input,
      paddingHorizontal: spacing.md,
      ...typography.body,
      color: palette.text,
    },
    error: {
      ...typography.captionSmall,
      color: palette.danger,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={palette.textMuted}
        style={[styles.input, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
