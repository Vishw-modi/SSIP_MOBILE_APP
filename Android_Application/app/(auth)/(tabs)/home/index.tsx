import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { spacing, typography, radii, shadows } from "@/design/styles";
import { useTheme } from "@/context/theme-context";
import { NCard } from "@/ui/card";
import { NProgress } from "@/ui/progress";
import { Segmented } from "@/ui/segmented";
import { Tile } from "@/ui/tile";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../../../appwriteConfig";
import { Query } from "react-native-appwrite";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { palette } = useTheme(); // Use theme hook
  const { user } = useUser();
  const [userName, setUserName] = useState({ age: "", fullName: "" });

  useEffect(() => {
    async function run() {
      try {
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user!.id)]
        );

        let userDoc = res.documents[0];
        if (userDoc) {
          const fullName = userDoc.firstName + " " + userDoc.lastName;
          setUserName({ age: userDoc.age, fullName });
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    }

    run();
  }, [user]);

  const router = useRouter();

  // Create dynamic styles that use theme
  const dynamicStyles = StyleSheet.create({
    root: {
      padding: spacing.screen,
      backgroundColor: palette.bg, // Now uses theme
      gap: spacing.lg,
      flex: 1,
    },
    greet: {
      ...typography.bodyLarge,
      color: palette.textMuted, // Now uses theme
      fontWeight: "600",
    },
    headline: {
      ...typography.h2,
      color: palette.text, // Changed from hardcoded purple to theme text
      marginTop: spacing.xs,
    },
    patientName: {
      ...typography.label,
      color: palette.textInverse,
      fontWeight: "800",
    },
    timePillText: {
      ...typography.labelSmall,
      color: palette.textInverse,
      fontWeight: "600",
    },
    sectionTitle: {
      ...typography.labelSmall,
      color: palette.text, // Now uses theme
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    progressCaption: {
      ...typography.caption,
      color: palette.textMuted, // Now uses theme
    },
    activePlansText: {
      ...typography.bodySmall,
      color: palette.text, // Now uses theme
    },
  });

  return (
    <ScrollView contentContainerStyle={dynamicStyles.root}>
      {/* Greeting + Notification */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={dynamicStyles.greet}>
            {`Hey, ${userName.fullName.split(" ")[0]} 👋`}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              pressed &&
                Platform.select({ ios: { opacity: 0.7 }, default: {} }),
            ]}
            android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
            onPress={() => router.push("/(auth)/(tabs)/home/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={palette.text}
            />
          </Pressable>
        </View>
      </View>

      {/* Headline */}
      <Text style={dynamicStyles.headline}>Personalize your Consultation</Text>

      {/* Tabs selector */}
      <View style={styles.segmentedContainer}>
        <Segmented segments={["Appointment", "Analytics"]} />
      </View>

      {/* Appointment card */}
      <NCard style={styles.appointment}>
        <View style={styles.appointmentRow}>
          <Image
            source={require("../../../../assets/images/favicon.jpeg")}
            style={styles.patientAvatar}
          />
          <View style={styles.patientInfo}>
            <Text style={dynamicStyles.patientName}>
              {user?.fullName ?? "Your Client"}
            </Text>
            <Text style={styles.patientMeta}>
              32 Years | Dietetics / Nutrition
            </Text>
          </View>
          <View
            style={[
              styles.videoCallButton,
              { backgroundColor: palette.primary },
            ]}
          >
            <Ionicons name="videocam" size={16} color={palette.textInverse} />
          </View>
        </View>

        <View style={styles.timePill}>
          <Ionicons name="calendar" size={14} color={palette.textInverse} />
          <Text style={dynamicStyles.timePillText}>
            Sun, Jan 19, 08:00am - 10:00am
          </Text>
        </View>
      </NCard>

      {/* Quick tiles */}
      <View style={styles.tilesRow}>
        <Tile icon="people" title="Patients" subtitle="16 New Patients" />
        <Tile icon="card" title="Billing" subtitle="3 Payment Done" />
      </View>
      <View style={styles.tilesRow}>
        <Tile icon="folder" title="Records" subtitle="Labs & Reports" />
        <Tile icon="notifications" title="Alerts" subtitle="2 Pending" />
      </View>

      {/* Progress widgets */}
      <View style={styles.progressGrid}>
        <NCard style={styles.progressCard}>
          <Text style={dynamicStyles.sectionTitle}>
            Today&apos;s Completion
          </Text>
          <NProgress value={68} />
          <Text style={dynamicStyles.progressCaption}>68% completed</Text>
        </NCard>
        <NCard style={styles.activePlansCard}>
          <Text style={dynamicStyles.sectionTitle}>Active Plans</Text>
          <View style={styles.activePlansRow}>
            <Ionicons name="fitness" size={16} color={palette.primary} />
            <Text style={dynamicStyles.activePlansText}>3 nutrition plans</Text>
          </View>
        </NCard>
      </View>
    </ScrollView>
  );
}

// Static styles that don't need theme
const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  notificationButton: {
    padding: spacing.xs,
    borderRadius: radii.sm,
  },

  segmentedContainer: {
    marginTop: spacing.md,
  },

  appointment: {
    gap: spacing.md,
    backgroundColor: "#4F46E5", // Keep custom blue for appointment card
    borderColor: "#4F46E5",
    padding: spacing.md,
    borderRadius: radii.card,
    ...shadows.md,
  },

  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: radii.circle,
  },

  patientInfo: {
    flex: 1,
    gap: spacing.xxs,
  },

  patientMeta: {
    ...typography.bodySmall,
    color: "rgba(255,255,255,0.9)",
  },

  videoCallButton: {
    width: 36,
    height: 36,
    borderRadius: radii.circle,
    alignItems: "center",
    justifyContent: "center",
  },

  timePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: "flex-start",
  },

  tilesRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  progressGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  progressCard: {
    flex: 1,
    gap: spacing.sm,
  },

  activePlansCard: {
    flex: 1,
    gap: spacing.sm,
  },

  activePlansRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
