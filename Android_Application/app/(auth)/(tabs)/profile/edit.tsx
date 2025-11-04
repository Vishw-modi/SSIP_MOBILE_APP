import { View, Text, StyleSheet } from "react-native";
import { palette, spacing, typography } from "@/design/styles";

export default function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Edit Profile Screen</Text>
      <Text style={styles.subtitle}>UNDER DEVELOPMENT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.screen,
    backgroundColor: palette.bg,
  },
  placeholder: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: palette.textMuted,
    textAlign: "center",
  },
});
