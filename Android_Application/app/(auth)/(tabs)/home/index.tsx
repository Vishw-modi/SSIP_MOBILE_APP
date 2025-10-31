// import {
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   Platform,
// } from "react-native";
// import { spacing, typography, radii, shadows } from "@/design/styles";
// import { useTheme } from "@/context/theme-context";
// import { NCard } from "@/ui/card";
// import { NProgress } from "@/ui/progress";
// import { Segmented } from "@/ui/segmented";
// import { Tile } from "@/ui/tile";
// import { Ionicons } from "@expo/vector-icons";
// import { useUser } from "@clerk/clerk-expo";
// import { useEffect, useState } from "react";
// import {
//   USERS_DETAILS_COLLECTION_ID,
//   databases,
//   DB_ID,
// } from "../../../../appwriteConfig";
// import { Query } from "react-native-appwrite";
// import { useRouter } from "expo-router";
// import { useUserContext } from "@/context/UserContext";

// export default function HomeScreen() {
//   const { userData, isLoading } = useUserContext();

//   console.log("User data from Supabase:", userData);
//   const { palette } = useTheme(); // Use theme hook
//   const { user } = useUser();
//   const [userName, setUserName] = useState({ age: "", fullName: "" });

//   useEffect(() => {
//     async function run() {
//       try {
//         const res = await databases.listDocuments(
//           DB_ID,
//           USERS_DETAILS_COLLECTION_ID,
//           [Query.equal("userId", user!.id)]
//         );

//         let userDoc = res.documents[0];
//         if (userDoc) {
//           const fullName = userDoc.firstName + " " + userDoc.lastName;
//           setUserName({ age: userDoc.age, fullName });
//         }
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     }

//     run();
//   }, [user]);

//   const router = useRouter();

//   // Create dynamic styles that use theme
//   const dynamicStyles = StyleSheet.create({
//     root: {
//       padding: spacing.screen,
//       backgroundColor: palette.bg, // Now uses theme
//       gap: spacing.lg,
//       flex: 1,
//     },
//     greet: {
//       ...typography.bodyLarge,
//       color: palette.textMuted, // Now uses theme
//       fontWeight: "600",
//     },
//     headline: {
//       ...typography.h2,
//       color: palette.text, // Changed from hardcoded purple to theme text
//       marginTop: spacing.xs,
//     },
//     patientName: {
//       ...typography.label,
//       color: palette.textInverse,
//       fontWeight: "800",
//     },
//     timePillText: {
//       ...typography.labelSmall,
//       color: palette.textInverse,
//       fontWeight: "600",
//     },
//     sectionTitle: {
//       ...typography.labelSmall,
//       color: palette.text, // Now uses theme
//       fontWeight: "600",
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//     },
//     progressCaption: {
//       ...typography.caption,
//       color: palette.textMuted, // Now uses theme
//     },
//     activePlansText: {
//       ...typography.bodySmall,
//       color: palette.text, // Now uses theme
//     },
//   });

//   return (
//     <ScrollView contentContainerStyle={dynamicStyles.root}>
//       {/* Greeting + Notification */}
//       <View style={styles.headerContainer}>
//         <View style={styles.topRow}>
//           <Text style={dynamicStyles.greet}>
//             {`Hey, ${userName.fullName.split(" ")[0]} 👋`}
//           </Text>

//           <Pressable
//             style={({ pressed }) => [
//               styles.notificationButton,
//               pressed &&
//                 Platform.select({ ios: { opacity: 0.7 }, default: {} }),
//             ]}
//             android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
//             onPress={() => router.push("/(auth)/(tabs)/home/notifications")}
//           >
//             <Ionicons
//               name="notifications-outline"
//               size={24}
//               color={palette.text}
//             />
//           </Pressable>
//         </View>
//       </View>

//       {/* Headline */}
//       <Text style={dynamicStyles.headline}>Personalize your Consultation</Text>

//       {/* Tabs selector */}
//       <View style={styles.segmentedContainer}>
//         <Segmented segments={["Appointment", "Analytics"]} />
//       </View>

//       {/* Appointment card */}
//       <NCard style={styles.appointment}>
//         <View style={styles.appointmentRow}>
//           <Image
//             source={require("../../../../assets/images/favicon.jpeg")}
//             style={styles.patientAvatar}
//           />
//           <View style={styles.patientInfo}>
//             <Text style={dynamicStyles.patientName}>
//               {user?.fullName ?? "Your Client"}
//             </Text>
//             <Text style={styles.patientMeta}>
//               32 Years | Dietetics / Nutrition
//             </Text>
//           </View>
//           <View
//             style={[
//               styles.videoCallButton,
//               { backgroundColor: palette.primary },
//             ]}
//           >
//             <Ionicons name="videocam" size={16} color={palette.textInverse} />
//           </View>
//         </View>

//         <View style={styles.timePill}>
//           <Ionicons name="calendar" size={14} color={palette.textInverse} />
//           <Text style={dynamicStyles.timePillText}>
//             Sun, Jan 19, 08:00am - 10:00am
//           </Text>
//         </View>
//       </NCard>

//       {/* Quick tiles */}
//       <View style={styles.tilesRow}>
//         <Tile icon="people" title="Patients" subtitle="16 New Patients" />
//         <Tile icon="card" title="Billing" subtitle="3 Payment Done" />
//       </View>
//       <View style={styles.tilesRow}>
//         <Tile icon="folder" title="Records" subtitle="Labs & Reports" />
//         <Tile icon="notifications" title="Alerts" subtitle="2 Pending" />
//       </View>

//       {/* Progress widgets */}
//       <View style={styles.progressGrid}>
//         <NCard style={styles.progressCard}>
//           <Text style={dynamicStyles.sectionTitle}>
//             Today&apos;s Completion
//           </Text>
//           <NProgress value={68} />
//           <Text style={dynamicStyles.progressCaption}>68% completed</Text>
//         </NCard>
//         <NCard style={styles.activePlansCard}>
//           <Text style={dynamicStyles.sectionTitle}>Active Plans</Text>
//           <View style={styles.activePlansRow}>
//             <Ionicons name="fitness" size={16} color={palette.primary} />
//             <Text style={dynamicStyles.activePlansText}>3 nutrition plans</Text>
//           </View>
//         </NCard>
//       </View>
//     </ScrollView>
//   );
// }

// // Static styles that don't need theme
// const styles = StyleSheet.create({
//   headerContainer: {
//     width: "100%",
//   },

//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//   },

//   notificationButton: {
//     padding: spacing.xs,
//     borderRadius: radii.sm,
//   },

//   segmentedContainer: {
//     marginTop: spacing.md,
//   },

//   appointment: {
//     gap: spacing.md,
//     backgroundColor: "#4F46E5", // Keep custom blue for appointment card
//     borderColor: "#4F46E5",
//     padding: spacing.md,
//     borderRadius: radii.card,
//     ...shadows.md,
//   },

//   appointmentRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: spacing.sm,
//   },

//   patientAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: radii.circle,
//   },

//   patientInfo: {
//     flex: 1,
//     gap: spacing.xxs,
//   },

//   patientMeta: {
//     ...typography.bodySmall,
//     color: "rgba(255,255,255,0.9)",
//   },

//   videoCallButton: {
//     width: 36,
//     height: 36,
//     borderRadius: radii.circle,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   timePill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: spacing.xs,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderRadius: radii.pill,
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     alignSelf: "flex-start",
//   },

//   tilesRow: {
//     flexDirection: "row",
//     gap: spacing.sm,
//     marginTop: spacing.md,
//   },

//   progressGrid: {
//     flexDirection: "row",
//     gap: spacing.sm,
//     marginTop: spacing.md,
//   },

//   progressCard: {
//     flex: 1,
//     gap: spacing.sm,
//   },

//   activePlansCard: {
//     flex: 1,
//     gap: spacing.sm,
//   },

//   activePlansRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: spacing.xs,
//   },
// });

"use client";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Animated,
  ActivityIndicator,
  Modal,
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
import { useUserContext } from "@/context/UserContext";
import Svg, {
  Circle,
  Polyline,
  Line,
  G,
  Text as SvgText,
} from "react-native-svg";
import { BACKEND_URL } from "@/chat/config";

interface HealthAnalytics {
  healthScore: number;
  urgencyLevel: "High" | "Moderate" | "Low";
  summary: string;
  possibleConditions: string[];
  advice: string;
  createdAt: string;
}

const HealthScoreCircle = ({
  score,
  urgencyLevel,
  palette,
}: {
  score: number;
  urgencyLevel: string;
  palette: any;
}) => {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case "High":
        return "#EF4444";
      case "Moderate":
        return "#F97316";
      default:
        return "#22C55E";
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Animated.View
      style={[
        styles.scoreCircleContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.scoreCircle}>
        <Svg width={145} height={145} viewBox="0 0 120 120">
          <Circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={palette.border}
            strokeWidth="8"
          />
          <Circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={getUrgencyColor()}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.scoreText}>
          <Text style={[typography.h3, { color: palette.text }]}>
            {score}/100
          </Text>
          <Text style={[typography.caption, { color: palette.textMuted }]}>
            Score
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const ScoreTrendChart = ({
  records,
  palette,
}: {
  records: HealthAnalytics[];
  palette: any;
}) => {
  if (records.length < 2) return null;

  const chartWidth = 320;
  const chartHeight = 220;
  const padding = 50;
  const labelPadding = 30;
  const graphWidth = chartWidth - padding - labelPadding;
  const graphHeight = chartHeight - padding - labelPadding;

  const scores = records.reverse().map((r) => r.healthScore);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1;

  const points = scores.map((score, idx) => {
    const x = padding + (idx / (scores.length - 1)) * graphWidth;
    const y =
      chartHeight -
      labelPadding -
      ((score - minScore) / scoreRange) * graphHeight;
    return { x, y, score, idx };
  });

  const yAxisTicks = [
    minScore,
    Math.round((minScore + maxScore) / 2),
    maxScore,
  ];

  return (
    <View style={styles.trendChartContainer}>
      <Svg
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        <SvgText
          x="8"
          y="20"
          fontSize="10"
          fill={palette.textMuted}
          textAnchor="middle"
        >
          {maxScore}
        </SvgText>
        <SvgText
          x="8"
          y={chartHeight / 2 + 5}
          fontSize="10"
          fill={palette.textMuted}
          textAnchor="middle"
        >
          {yAxisTicks[1]}
        </SvgText>
        <SvgText
          x="8"
          y={chartHeight - labelPadding + 5}
          fontSize="10"
          fill={palette.textMuted}
          textAnchor="middle"
        >
          {minScore}
        </SvgText>

        {/* Y-axis line */}
        <Line
          x1={padding}
          y1={padding / 2}
          x2={padding}
          y2={chartHeight - labelPadding}
          stroke={palette.border}
          strokeWidth="1"
        />

        {/* X-axis line */}
        <Line
          x1={padding}
          y1={chartHeight - labelPadding}
          x2={chartWidth - 10}
          y2={chartHeight - labelPadding}
          stroke={palette.border}
          strokeWidth="1"
        />

        {/* Grid lines */}
        {yAxisTicks.map((tick, idx) => {
          const y =
            chartHeight -
            labelPadding -
            ((tick - minScore) / scoreRange) * graphHeight;
          return (
            <Line
              key={`grid-${idx}`}
              x1={padding}
              y1={y}
              x2={chartWidth - 10}
              y2={y}
              stroke={palette.border}
              strokeWidth="0.5"
              strokeDasharray="3,3"
              opacity="0.3"
            />
          );
        })}

        {/* Line connecting all points */}
        <Polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={palette.primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points with values and labels */}
        {points.map((point, idx) => (
          <G key={idx}>
            <Circle cx={point.x} cy={point.y} r="4" fill={palette.primary} />
            <SvgText
              x={point.x}
              y={point.y - 12}
              fontSize="11"
              fontWeight="600"
              fill={palette.text}
              textAnchor="middle"
            >
              {point.score}
            </SvgText>
            <SvgText
              x={point.x}
              y={chartHeight - labelPadding + 16}
              fontSize="10"
              fill={palette.textMuted}
              textAnchor="middle"
            >
              {`D${records.length - 1 - idx}`}
            </SvgText>
          </G>
        ))}

        <SvgText
          x="8"
          y="12"
          fontSize="11"
          fontWeight="600"
          fill={palette.text}
          textAnchor="middle"
        >
          {maxScore - minScore > 0 ? `Range: ${minScore}-${maxScore}` : "Score"}
        </SvgText>
      </Svg>
    </View>
  );
};

const ConditionPill = ({
  condition,
  palette,
}: {
  condition: string;
  palette: any;
}) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim }]}>
      <View
        style={[
          styles.conditionPill,
          { backgroundColor: palette.surfaceVariant },
        ]}
      >
        <Text style={[typography.labelSmall, { color: palette.text }]}>
          {condition}
        </Text>
      </View>
    </Animated.View>
  );
};

const QuickStatCard = ({
  icon,
  label,
  value,
  palette,
}: {
  icon: string;
  label: string;
  value: string;
  palette: any;
}) => {
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <View
        style={[
          styles.quickStatCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <View style={styles.quickStatIcon}>
          <Ionicons name={icon as any} size={20} color={palette.primary} />
        </View>
        <View style={styles.quickStatContent}>
          <Text style={[typography.caption, { color: palette.textMuted }]}>
            {label}
          </Text>
          <Text
            style={[
              typography.labelSmall,
              { color: palette.text, fontWeight: "600" },
            ]}
          >
            {value}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const QuickStatsRow = ({
  records,
  palette,
}: {
  records: HealthAnalytics[];
  palette: any;
}) => {
  if (!records.length) return null;

  const calculateStats = () => {
    const scores = records.map((r) => r.healthScore);
    const averageScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
    const currentUrgency = records[0].urgencyLevel;
    const lastCheckDate = new Date(records[0].createdAt);
    const now = new Date();
    const daysSinceCheck = Math.floor(
      (now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      totalChecks: records.length,
      averageScore,
      currentUrgency,
      daysSinceCheck,
    };
  };

  const stats = calculateStats();

  return (
    <View style={styles.quickStatsGrid}>
      <QuickStatCard
        icon="checkmark-circle-outline"
        label="Total Checks"
        value={`${stats.totalChecks}`}
        palette={palette}
      />
      <QuickStatCard
        icon="bar-chart-outline"
        label="Avg Score"
        value={`${stats.averageScore}`}
        palette={palette}
      />
      <QuickStatCard
        icon="alert-circle-outline"
        label="Current Level"
        value={stats.currentUrgency}
        palette={palette}
      />
      <QuickStatCard
        icon="calendar-outline"
        label="Days Since"
        value={`${stats.daysSinceCheck}d`}
        palette={palette}
      />
    </View>
  );
};

export default function HomeScreen() {
  const { userData, isLoading } = useUserContext();
  const { palette } = useTheme();
  const { user } = useUser();
  const [userName, setUserName] = useState({ age: "", fullName: "" });
  const [activeTab, setActiveTab] = useState(0);
  const [healthData, setHealthData] = useState<HealthAnalytics | null>(null);
  const [allHealthRecords, setAllHealthRecords] = useState<HealthAnalytics[]>(
    []
  );
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user!.id)]
        );

        const userDoc = res.documents[0];
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

  useEffect(() => {
    if (activeTab === 1) {
      fetchHealthAnalytics();
    }
  }, [activeTab]);

  const fetchHealthAnalytics = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const clerkUserId = userData?.clerkuserid;
      if (!clerkUserId) {
        throw new Error("User ID not available");
      }

      const response = await fetch(
        `${BACKEND_URL}/api/health-records/${clerkUserId}`,
        {
          headers: {
            "X-User-ID": clerkUserId,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch health analytics");
      }

      const data = await response.json();

      if (data.records && data.records.length > 0) {
        const mappedRecords: HealthAnalytics[] = data.records.map(
          (record: any) => ({
            healthScore: record.score || 0,
            urgencyLevel: (record.urgency || "Low") as
              | "High"
              | "Moderate"
              | "Low",
            summary: record.summary || "",
            possibleConditions: record.possible_conditions
              ? record.possible_conditions
                  .split(" ")
                  .filter((c: string) => c.trim())
              : [],
            advice: record.advice || "",
            createdAt: record.created_at || "",
          })
        );

        setHealthData(mappedRecords[0]);
        setAllHealthRecords(mappedRecords);
      } else {
        setHealthError("No health records found");
      }
    } catch (err) {
      setHealthError(
        err instanceof Error ? err.message : "Failed to load health data"
      );
    } finally {
      setHealthLoading(false);
    }
  };

  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    root: {
      padding: spacing.screen,
      backgroundColor: palette.bg,
      gap: spacing.lg,
    },
    greet: {
      ...typography.bodyLarge,
      color: palette.textMuted,
      fontWeight: "600",
    },
    headline: {
      ...typography.h2,
      color: palette.text,
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
      color: palette.text,
      fontWeight: "800",
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    progressCaption: {
      ...typography.caption,
      color: palette.textMuted,
    },
    activePlansText: {
      ...typography.bodySmall,
      color: palette.text,
    },
  });

  return (
    <ScrollView contentContainerStyle={dynamicStyles.root}>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={dynamicStyles.greet}>{`Hey, ${
            userName.fullName.split(" ")[0]
          } 👋`}</Text>

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

      <Text style={dynamicStyles.headline}>Personalize your Consultation</Text>

      <View style={styles.segmentedContainer}>
        <Segmented
          segments={["Appointment", "Analytics"]}
          onChange={setActiveTab}
        />
      </View>

      {activeTab === 0 ? (
        <>
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
                <Ionicons
                  name="videocam"
                  size={16}
                  color={palette.textInverse}
                />
              </View>
            </View>

            <View style={styles.timePill}>
              <Ionicons name="calendar" size={14} color={palette.textInverse} />
              <Text style={dynamicStyles.timePillText}>
                Sun, Jan 19, 08:00am - 10:00am
              </Text>
            </View>
          </NCard>

          <View style={styles.tilesRow}>
            <Tile icon="people" title="Patients" subtitle="16 New Patients" />
            <Tile icon="card" title="Billing" subtitle="3 Payment Done" />
          </View>
          <View style={styles.tilesRow}>
            <Tile icon="folder" title="Records" subtitle="Labs & Reports" />
            <Tile icon="notifications" title="Alerts" subtitle="2 Pending" />
          </View>

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
                <Text style={dynamicStyles.activePlansText}>
                  3 nutrition plans
                </Text>
              </View>
            </NCard>
          </View>
        </>
      ) : (
        <>
          {healthLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={palette.primary} />
              <Text
                style={[
                  typography.bodySmall,
                  { color: palette.textMuted, marginTop: spacing.md },
                ]}
              >
                Loading health insights...
              </Text>
            </View>
          ) : healthError ? (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateContent}>
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color={palette.primary}
                />
                <Text
                  style={[
                    typography.bodyLarge,
                    {
                      color: palette.text,
                      marginTop: spacing.md,
                      textAlign: "center",
                    },
                  ]}
                >
                  No Health Reports Yet
                </Text>
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: palette.textMuted,
                      marginTop: spacing.sm,
                      textAlign: "center",
                    },
                  ]}
                >
                  Generate a detailed health report to get started with your
                  health insights
                </Text>
                <Pressable
                  style={[
                    styles.symptoscanButton,
                    { backgroundColor: palette.primary },
                  ]}
                  onPress={() => router.replace("/(auth)/symptoscan")}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: palette.textInverse, fontWeight: "600" },
                    ]}
                  >
                    Try SymptoScan
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : healthData ? (
            <>
              <View style={styles.healthScoreCard}>
                <View style={styles.scoreHeader}>
                  <Text style={dynamicStyles.sectionTitle}>
                    Your Last Health Score
                  </Text>
                  <View
                    style={[
                      styles.urgencyBadge,
                      {
                        backgroundColor:
                          healthData.urgencyLevel === "High"
                            ? "#FEE2E2"
                            : healthData.urgencyLevel === "Moderate"
                            ? "#FEF3C7"
                            : "#DCFCE7",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelSmall,
                        {
                          color:
                            healthData.urgencyLevel === "High"
                              ? "#DC2626"
                              : healthData.urgencyLevel === "Moderate"
                              ? "#D97706"
                              : "#16A34A",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {healthData.urgencyLevel}
                    </Text>
                  </View>
                </View>

                <View style={styles.scoreMainContent}>
                  <HealthScoreCircle
                    score={healthData.healthScore}
                    urgencyLevel={healthData.urgencyLevel}
                    palette={palette}
                  />
                  <View style={styles.scoreMainInfo}>
                    <Text
                      style={[
                        typography.bodySmall,
                        { color: palette.textMuted },
                      ]}
                    >
                      {healthData.summary}
                    </Text>
                  </View>
                </View>

                <View style={{ marginVertical: spacing.md }}>
                  <QuickStatsRow records={allHealthRecords} palette={palette} />
                </View>

                {allHealthRecords.length > 1 && (
                  <>
                    <Text
                      style={[
                        dynamicStyles.sectionTitle,
                        { marginTop: spacing.md },
                      ]}
                    >
                      Score Trend
                    </Text>
                    <ScoreTrendChart
                      records={allHealthRecords}
                      palette={palette}
                    />
                  </>
                )}

                <View style={styles.quickActionsContainer}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      styles.primaryActionButton,
                      { backgroundColor: palette.primary },
                    ]}
                    onPress={() => setShowDetailsModal(true)}
                  >
                    <Ionicons
                      name="document-outline"
                      size={16}
                      color={palette.textInverse}
                    />
                    <Text
                      style={[
                        typography.labelSmall,
                        { color: palette.textInverse, fontWeight: "600" },
                      ]}
                    >
                      View Full Report
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      styles.secondaryActionButton,
                      { borderColor: palette.primary, borderWidth: 1 },
                    ]}
                    onPress={() => router.push("/(auth)/symptoscan")}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={16}
                      color={palette.primary}
                    />
                    <Text
                      style={[
                        typography.labelSmall,
                        { color: palette.primary, fontWeight: "600" },
                      ]}
                    >
                      New Report
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          ) : null}
        </>
      )}

      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <ScrollView
          contentContainerStyle={[
            dynamicStyles.root,
            { paddingTop: spacing.xl },
          ]}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowDetailsModal(false)}>
              <Ionicons name="close" size={24} color={palette.text} />
            </Pressable>
            <Text style={[typography.h3, { color: palette.text }]}>
              Health Details
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {healthData && (
            <>
              <View style={styles.overviewCard}>
                <Text style={dynamicStyles.sectionTitle}>
                  Current Health Overview
                </Text>
                <View style={{ gap: spacing.md, marginTop: spacing.md }}>
                  <NCard>
                    <Text
                      style={[
                        typography.labelSmall,
                        { color: palette.textMuted, marginBottom: spacing.xs },
                      ]}
                    >
                      Summary
                    </Text>
                    <Text
                      style={[
                        typography.bodySmall,
                        { color: palette.text, lineHeight: 20 },
                      ]}
                    >
                      {healthData.summary}
                    </Text>
                  </NCard>
                  <View>
                    <Text
                      style={[typography.caption, { color: palette.textMuted }]}
                    >
                      {new Date(healthData.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {healthData.possibleConditions.length > 0 && (
                <NCard style={styles.conditionsCard}>
                  <Text style={dynamicStyles.sectionTitle}>
                    Possible Conditions
                  </Text>
                  <View style={styles.conditionsGrid}>
                    {healthData.possibleConditions.map((condition, idx) => (
                      <ConditionPill
                        key={idx}
                        condition={condition}
                        palette={palette}
                      />
                    ))}
                  </View>
                </NCard>
              )}

              <NCard style={styles.adviceCard}>
                <Text style={dynamicStyles.sectionTitle}>
                  Recommended Advice
                </Text>
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: palette.text,
                      marginTop: spacing.md,
                      lineHeight: 20,
                    },
                  ]}
                >
                  {healthData.advice}
                </Text>
              </NCard>

              {allHealthRecords.length > 1 && (
                <View style={styles.historyCard}>
                  <Text style={dynamicStyles.sectionTitle}>Health History</Text>
                  <View style={styles.timelineContainer}>
                    {allHealthRecords.map((record, idx) => (
                      <View key={idx} style={styles.timelineItem}>
                        <View style={styles.timelineMarker}>
                          <View
                            style={[
                              styles.timelineCircle,
                              {
                                backgroundColor:
                                  record.urgencyLevel === "High"
                                    ? "#EF4444"
                                    : record.urgencyLevel === "Moderate"
                                    ? "#F97316"
                                    : "#22C55E",
                              },
                            ]}
                          />
                          {idx < allHealthRecords.length - 1 && (
                            <View
                              style={[
                                styles.timelineLine,
                                { backgroundColor: palette.border },
                              ]}
                            />
                          )}
                        </View>
                        <View style={styles.timelineContent}>
                          <View style={styles.timelineHeader}>
                            <Text
                              style={[
                                typography.labelSmall,
                                { color: palette.text, fontWeight: "600" },
                              ]}
                            >
                              Score: {record.healthScore}
                            </Text>
                            <Text
                              style={[
                                typography.caption,
                                { color: palette.textMuted },
                              ]}
                            >
                              {new Date(record.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text
                            style={[
                              typography.bodySmall,
                              {
                                color: palette.textMuted,
                                marginTop: spacing.xs,
                              },
                            ]}
                          >
                            {record.summary}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

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
    backgroundColor: "#4F46E5",
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

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },

  healthScoreCard: {
    gap: spacing.md,
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreMainContent: {
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.lg,
  },

  scoreCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  scoreText: {
    // fontSize: 8,
    fontWeight: "300",
    alignItems: "center",
    position: "absolute",
  },

  scoreMainInfo: {
    flex: 1,
    gap: spacing.sm,
  },

  urgencyBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },

  trendChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.sm,
  },

  quickStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  quickStatCard: {
    flex: 1,
    minWidth: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
  },

  quickStatIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },

  quickStatContent: {
    flex: 1,
    gap: spacing.xxs,
  },

  quickActionsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radii.sm,
  },

  primaryActionButton: {
    // ... styled as filled button
  },

  secondaryActionButton: {
    // ... styled as outlined button
  },

  emptyStateCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },

  emptyStateContent: {
    alignItems: "center",
    gap: spacing.md,
  },

  symptoscanButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    marginTop: spacing.md,
    alignItems: "center",
  },

  overviewCard: {
    gap: spacing.md,
  },

  conditionsCard: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  conditionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  conditionPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },

  adviceCard: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  historyCard: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  timelineContainer: {
    gap: spacing.md,
  },

  timelineItem: {
    flexDirection: "row",
    gap: spacing.md,
  },

  timelineMarker: {
    alignItems: "center",
    width: 24,
  },

  timelineCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: spacing.sm,
  },

  timelineContent: {
    flex: 1,
    paddingVertical: spacing.sm,
  },

  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
});
