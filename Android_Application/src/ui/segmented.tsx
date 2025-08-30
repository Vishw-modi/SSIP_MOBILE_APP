import { JSX, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radii, typography } from "@/design/styles";
import { useTheme } from "@/context/theme-context";

export function Segmented({
  segments = ["Left", "Right"],
  onChange,
}: {
  segments?: string[];
  onChange?: (i: number) => void;
}): JSX.Element {
  const [index, setIndex] = useState(0);
  const { palette } = useTheme();

  const styles = StyleSheet.create({
    wrap: {
      flexDirection: "row",
      backgroundColor: palette.bgSecondary,
      padding: 4,
      borderRadius: radii.pill,
      alignSelf: "flex-start",
    },
    item: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: radii.pill,
    },
    itemActive: {
      backgroundColor: palette.card,
      shadowColor: palette.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    label: {
      ...typography.labelSmall,
      color: palette.textMuted,
      fontWeight: "600",
    },
    labelActive: {
      ...typography.labelSmall,
      color: palette.text,
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.wrap}>
      {segments.map((s, i) => {
        const active = i === index;
        return (
          <Pressable
            key={s}
            onPress={() => {
              setIndex(i);
              onChange?.(i);
            }}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {s}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
