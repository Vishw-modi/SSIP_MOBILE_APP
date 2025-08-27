import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { ID, Query } from "react-native-appwrite";
import { Ionicons } from "@expo/vector-icons";
import { NButton } from "@/ui/button";
import { spacing } from "@/design/styles";
import { useTheme } from "../../context/theme-context"; // Add this import
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../appwriteConfig";

export default function UserDetailsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { palette } = useTheme(); // Use theme hook

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(true);

  const isValidName = fullName.trim().length > 1;
  const isValidAge = /^\d+$/.test(age) && parseInt(age) > 0;

  const canContinue = useMemo(() => {
    return isValidName && isValidAge && gender !== null;
  }, [isValidName, isValidAge, gender]);

  // Create dynamic styles that use theme
  const dynamicStyles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.bg, // Now uses theme
      padding: spacing.xl,
    },
    label: {
      color: palette.textSecondary, // Now uses theme instead of hardcoded
      fontWeight: "700",
    },
    underlineInput: {
      height: 44,
      borderBottomWidth: 2,
      borderBottomColor: palette.border, // Now uses theme
      color: palette.text, // Now uses theme
      fontSize: 16,
      paddingRight: 44,
      backgroundColor: "transparent",
    },
    successBadge: {
      position: "absolute",
      right: 4,
      top: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: palette.success, // Now uses theme
      alignItems: "center",
      justifyContent: "center",
    },
    cta: {
      marginTop: spacing.xl,
      borderRadius: 999,
      backgroundColor: palette.primary, // Now uses theme
      paddingVertical: 16,
    },
  });

  // Prefill from Appwrite if data exists
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      try {
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user.id), Query.limit(1)]
        );
        const doc = res.documents?.[0];
        if (doc && !cancelled) {
          const fname = String(doc.firstName ?? "").trim();
          const lname = String(doc.lastName ?? "").trim();
          const nm = [fname, lname].filter(Boolean).join(" ");
          if (nm) setFullName(nm);
          if (doc.age) setAge(String(doc.age));
          if (doc.gender === "male" || doc.gender === "female")
            setGender(doc.gender);
        }
      } catch (err) {
        console.error("Prefill error:", err);
      } finally {
        if (!cancelled) setPrefilling(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  function splitName(name: string) {
    const parts = name.trim().split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
    };
  }

  const onSaveDetails = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { firstName, lastName } = splitName(fullName);

      const userData = {
        userId: user.id,
        firstName,
        lastName,
        age: parseInt(age) || 0,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        gender,
        onboardingComplete: true,
      };

      const res = await databases.listDocuments(
        DB_ID,
        USERS_DETAILS_COLLECTION_ID,
        [Query.equal("userId", user.id)]
      );

      if (res.documents.length > 0) {
        await databases.updateDocument(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          res.documents[0].$id,
          userData
        );
      } else {
        await databases.createDocument(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          ID.unique(),
          userData
        );
      }

      router.replace("/(auth)/(tabs)/home");
    } catch (error: any) {
      console.error("Error saving user details:", error);
      Alert.alert("Save failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={dynamicStyles.root}>
      {/* Full name (underline) */}
      <Text style={dynamicStyles.label}>Enter Full name</Text>
      <View style={styles.inputLineWrap}>
        <Ionicons
          name="person-outline"
          size={18}
          color={palette.text} // Now uses theme
          style={styles.leadingIcon}
        />
        <TextInput
          placeholder="John Appleseed"
          placeholderTextColor={palette.textMuted} // Now uses theme
          value={fullName}
          onChangeText={setFullName}
          style={[dynamicStyles.underlineInput, { paddingLeft: 36 }]}
        />
        {isValidName ? (
          <View style={dynamicStyles.successBadge}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        ) : null}
      </View>

      {/* Gender chips */}
      <Text style={[dynamicStyles.label, { marginTop: spacing.lg }]}>
        Gender
      </Text>
      <View style={styles.genderRow}>
        <GenderChip
          label="Male"
          active={gender === "male"}
          onPress={() => setGender("male")}
          palette={palette} // Pass palette to chip
        />
        <GenderChip
          label="Female"
          active={gender === "female"}
          onPress={() => setGender("female")}
          palette={palette} // Pass palette to chip
        />
      </View>

      {/* Age (underline) */}
      <Text style={[dynamicStyles.label, { marginTop: spacing.lg }]}>Age</Text>
      <View style={styles.inputLineWrap}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={palette.text} // Now uses theme
          style={styles.leadingIcon}
        />
        <TextInput
          placeholder="Your age"
          placeholderTextColor={palette.textMuted} // Now uses theme
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          style={[dynamicStyles.underlineInput, { paddingLeft: 36 }]}
        />
        {isValidAge ? (
          <View style={dynamicStyles.successBadge}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        ) : null}
      </View>

      {/* Continue */}
      <NButton
        title={loading ? "Saving..." : "Continue"}
        fullWidth
        onPress={onSaveDetails}
        loading={loading || prefilling}
        disabled={!canContinue || prefilling}
        style={dynamicStyles.cta}
      />
    </View>
  );
}

// Update GenderChip to accept palette
function GenderChip({
  label,
  active,
  onPress,
  palette,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  palette: any; // Add palette prop
}) {
  const chipStyles = StyleSheet.create({
    chip: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.border, // Now uses theme
      backgroundColor: palette.card, // Now uses theme
      alignItems: "center",
      justifyContent: "center",
    },
    chipActive: {
      borderColor: palette.primary, // Now uses theme
      backgroundColor: palette.primaryBg, // Now uses theme
    },
    chipText: {
      color: palette.text, // Now uses theme
      fontWeight: "700",
    },
    chipTextActive: {
      color: palette.primary, // Now uses theme
    },
  });

  return (
    <Pressable
      onPress={onPress}
      style={[chipStyles.chip, active && chipStyles.chipActive]}
      android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
    >
      <Text style={[chipStyles.chipText, active && chipStyles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

// Static styles that don't need theme
const styles = StyleSheet.create({
  inputLineWrap: {
    position: "relative",
    marginTop: 4,
    minHeight: 44,
    justifyContent: "center",
    marginBottom: 6,
  },
  leadingIcon: {
    position: "absolute",
    left: 4,
    top: 12,
  },
  genderRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
