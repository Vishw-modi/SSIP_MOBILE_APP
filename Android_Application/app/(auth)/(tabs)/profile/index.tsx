import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { spacing, typography, radii, shadows } from "@/design/styles";
import { useTheme } from "../../../../context/theme-context";
import { NCard } from "@/ui/card";
import { NButton } from "@/ui/button";
import { useEffect, useState } from "react";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../../../appwriteConfig";
import { Query } from "react-native-appwrite";

export default function ProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { palette } = useTheme(); // Add theme hook

  const [userDetails, setUserDetails] = useState({
    age: "",
    fullName: "",
    gender: "",
    bio: "",
    specialization: "",
    experience: "",
    rating: 4.8,
    totalConsultations: 156,
    activeClients: 23,
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user!.id)]
        );

        let userDoc = res.documents[0];
        if (userDoc) {
          const fullName = userDoc.firstName + " " + userDoc.lastName;
          setUserDetails((prev) => ({
            ...prev,
            age: userDoc.age,
            fullName,
            gender: userDoc.gender,
            bio:
              userDoc.bio ||
              "Dedicated nutrition specialist helping clients achieve their health goals through personalized meal plans and lifestyle changes.",
            specialization: userDoc.specialization || "Dietetics & Nutrition",
            experience: userDoc.experience || "5+ years",
          }));
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    }

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user]);

  const navigateToSettings = () => {
    router.push("/(auth)/(tabs)/profile/settings");
  };

  const navigateToEditProfile = () => {
    router.push("/(auth)/(tabs)/profile/edit");
  };

  // Create dynamic styles that use current theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.bg,
    },
    headerTitle: {
      ...typography.h3,
      color: palette.text,
    },
    name: {
      ...typography.h2,
      color: palette.text,
      marginBottom: spacing.xxs,
    },
    specialization: {
      ...typography.bodyLarge,
      color: palette.primary,
      fontWeight: "600",
      marginBottom: spacing.xs,
    },
    location: {
      ...typography.bodySmall,
      color: palette.textMuted,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: palette.card,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...shadows.md, // Enhanced shadow
    },
    statDivider: {
      width: 1,
      backgroundColor: palette.border,
      marginHorizontal: spacing.md,
    },
    statNumber: {
      ...typography.h3,
      color: palette.text,
      marginBottom: spacing.xxs,
    },
    statLabel: {
      ...typography.captionSmall,
      color: palette.textMuted,
      textAlign: "center",
    },
    shareButton: {
      width: 48,
      height: 48,
      borderRadius: radii.button,
      backgroundColor: palette.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: palette.primary,
      ...shadows.sm,
    },
    sectionTitle: {
      ...typography.h5,
      color: palette.text,
      marginBottom: spacing.sm,
    },
    bioText: {
      ...typography.body,
      color: palette.textSecondary,
      lineHeight: 22,
    },
    detailText: {
      ...typography.bodySmall,
      color: palette.textSecondary,
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md, // Increased padding
      borderRadius: radii.lg, // Larger radius
      backgroundColor: palette.bgSecondary,
      marginBottom: spacing.xs, // Add spacing between items
    },
    actionIcon: {
      width: 44, // Slightly larger
      height: 44,
      borderRadius: radii.md,
      backgroundColor: palette.primaryBg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    actionTitle: {
      ...typography.body, // Larger text
      color: palette.text,
      fontWeight: "600",
    },
    actionSubtitle: {
      ...typography.bodySmall,
      color: palette.textMuted,
      marginTop: spacing.xxs,
    },
    badgeTitle: {
      ...typography.captionSmall,
      color: palette.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: palette.primary,
    },
    statusIndicator: {
      position: "absolute",
      bottom: 8,
      right: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: palette.success,
      borderWidth: 3,
      borderColor: palette.card,
    },
  });

  return (
    <ScrollView
      style={dynamicStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Settings */}
      <View style={styles.header}>
        <Text style={dynamicStyles.headerTitle}>Profile</Text>
        <Pressable style={styles.settingsButton} onPress={navigateToSettings}>
          <Ionicons name="settings-outline" size={24} color={palette.text} />
        </Pressable>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar and Basic Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user?.imageUrl ||
                  "https://via.placeholder.com/120x120/34C759/FFFFFF?text=DR",
              }}
              style={dynamicStyles.avatar}
            />
            <View style={dynamicStyles.statusIndicator} />
          </View>

          <Text style={dynamicStyles.name}>
            {user?.fullName || userDetails.fullName || "Dr. Professional"}
          </Text>

          <Text style={dynamicStyles.specialization}>
            {userDetails.specialization}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={palette.textMuted}
            />
            <Text style={dynamicStyles.location}>Dubai, UAE</Text>
          </View>
        </View>

        {/* Enhanced Stats Row with better visual hierarchy */}
        <View style={dynamicStyles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={dynamicStyles.statNumber}>
              {userDetails.totalConsultations}
            </Text>
            <Text style={dynamicStyles.statLabel}>Consultations</Text>
          </View>
          <View style={dynamicStyles.statDivider} />
          <View style={styles.statItem}>
            <Text style={dynamicStyles.statNumber}>
              {userDetails.activeClients}
            </Text>
            <Text style={dynamicStyles.statLabel}>Active Clients</Text>
          </View>
          <View style={dynamicStyles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingRow}>
              <Text style={dynamicStyles.statNumber}>{userDetails.rating}</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
            <Text style={dynamicStyles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <NButton
            title="Edit Profile"
            variant="primary"
            style={styles.editButton}
            onPress={navigateToEditProfile}
          />
          <Pressable style={dynamicStyles.shareButton}>
            <Ionicons name="share-outline" size={20} color={palette.primary} />
          </Pressable>
        </View>
      </View>

      {/* Enhanced Bio Section */}
      <NCard style={styles.bioCard}>
        <Text style={dynamicStyles.sectionTitle}>About</Text>
        <Text style={dynamicStyles.bioText}>{userDetails.bio}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons
              name="briefcase-outline"
              size={16}
              color={palette.primary}
            />
            <Text style={dynamicStyles.detailText}>
              Experience: {userDetails.experience}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color={palette.primary} />
            <Text style={dynamicStyles.detailText}>
              Age: {userDetails.age || "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="school-outline" size={16} color={palette.primary} />
            <Text style={dynamicStyles.detailText}>Certified Nutritionist</Text>
          </View>
        </View>
      </NCard>

      {/* Enhanced Quick Actions */}
      <NCard style={styles.quickActionsCard}>
        <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>

        <Pressable style={dynamicStyles.actionItem}>
          <View style={dynamicStyles.actionIcon}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={palette.primary}
            />
          </View>
          <View style={styles.actionContent}>
            <Text style={dynamicStyles.actionTitle}>Schedule Management</Text>
            <Text style={dynamicStyles.actionSubtitle}>
              Manage your appointments
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={palette.textMuted}
          />
        </Pressable>

        <Pressable style={dynamicStyles.actionItem}>
          <View style={dynamicStyles.actionIcon}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={palette.primary}
            />
          </View>
          <View style={styles.actionContent}>
            <Text style={dynamicStyles.actionTitle}>Client Reports</Text>
            <Text style={dynamicStyles.actionSubtitle}>
              View progress reports
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={palette.textMuted}
          />
        </Pressable>

        <Pressable style={dynamicStyles.actionItem}>
          <View style={dynamicStyles.actionIcon}>
            <Ionicons
              name="analytics-outline"
              size={20}
              color={palette.primary}
            />
          </View>
          <View style={styles.actionContent}>
            <Text style={dynamicStyles.actionTitle}>Analytics</Text>
            <Text style={dynamicStyles.actionSubtitle}>
              View your performance
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={palette.textMuted}
          />
        </Pressable>
      </NCard>

      {/* Enhanced Achievement/Badges Section */}
      <NCard style={styles.achievementsCard}>
        <Text style={dynamicStyles.sectionTitle}>Achievements</Text>

        <View style={styles.badgesGrid}>
          <View style={styles.badge}>
            <View
              style={[
                styles.badgeIcon,
                { backgroundColor: palette.success + "20" },
              ]}
            >
              <Ionicons name="trophy" size={20} color={palette.success} />
            </View>
            <Text style={dynamicStyles.badgeTitle}>Top Rated</Text>
          </View>

          <View style={styles.badge}>
            <View
              style={[
                styles.badgeIcon,
                { backgroundColor: palette.info + "20" },
              ]}
            >
              <Ionicons name="people" size={20} color={palette.info} />
            </View>
            <Text style={dynamicStyles.badgeTitle}>100+ Clients</Text>
          </View>

          <View style={styles.badge}>
            <View
              style={[
                styles.badgeIcon,
                { backgroundColor: palette.warning + "20" },
              ]}
            >
              <Ionicons name="star" size={20} color={palette.warning} />
            </View>
            <Text style={dynamicStyles.badgeTitle}>Expert</Text>
          </View>
        </View>
      </NCard>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// Static styles that don't need theming
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  settingsButton: {
    padding: spacing.xs,
    borderRadius: radii.sm,
  },

  // Profile Section
  profileSection: {
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },

  // Stats
  statItem: {
    flex: 1,
    alignItems: "center",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },

  editButton: {
    flex: 1,
  },

  // Cards
  bioCard: {
    margin: spacing.screen,
    gap: spacing.sm,
  },

  quickActionsCard: {
    margin: spacing.screen,
    marginTop: 0,
    gap: spacing.sm, // Reduced gap since we added margin to items
  },

  achievementsCard: {
    margin: spacing.screen,
    marginTop: 0,
    gap: spacing.md,
  },

  detailsGrid: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  // Quick Actions
  actionContent: {
    flex: 1,
  },

  // Badges
  badgesGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },

  badge: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },

  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.circle,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomSpacing: {
    height: spacing.massive,
  },
});
