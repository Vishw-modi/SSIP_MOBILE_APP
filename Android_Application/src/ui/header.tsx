import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { spacing, typography } from "@/design/styles";
import { useTheme } from "@/context/theme-context";
import { JSX } from "react";

interface Props extends ViewProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function NHeader({
  title,
  subtitle,
  center,
  style,
  ...rest
}: Props): JSX.Element {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    container: {
      gap: spacing.xs,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h3,
      color: palette.text,
    },
    subtitle: {
      ...typography.bodySmall,
      color: palette.textMuted,
    },
  });

  return (
    <View
      style={[styles.container, center && { alignItems: "center" }, style]}
      {...rest}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
