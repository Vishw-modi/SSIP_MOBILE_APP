import type { JSX, PropsWithChildren } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { radii, spacing, shadows } from "@/design/styles";
import { useTheme } from "../../context/theme-context";

export function NCard({
  style,
  children,
  ...rest
}: PropsWithChildren<ViewProps>): JSX.Element {
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: palette.card,
      borderRadius: radii.card,
      padding: spacing.cardPadding,
      borderColor: palette.border,
      borderWidth: 1,
      ...shadows.sm,
    },
  });

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}
