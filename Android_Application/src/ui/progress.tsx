import { StyleSheet, View } from "react-native";
import { radii } from "@/design/styles";
import { useTheme } from "../../context/theme-context";
import { JSX } from "react";

export function NProgress({ value }: { value: number }): JSX.Element {
  const { palette } = useTheme();
  const clamped = Math.max(0, Math.min(100, value));

  const styles = StyleSheet.create({
    track: {
      height: 10,
      borderRadius: radii.pill,
      backgroundColor: palette.bgSecondary,
      overflow: "hidden",
    },
    bar: {
      height: "100%",
      backgroundColor: palette.primary,
    },
  });

  return (
    <View style={styles.track}>
      <View style={[styles.bar, { width: `${clamped}%` }]} />
    </View>
  );
}
