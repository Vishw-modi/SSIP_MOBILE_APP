// import { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Pressable,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { MotiView } from "moti";
// import { Easing } from "react-native-reanimated";
// import { useRouter } from "expo-router";
// import { useSymptoms } from "../../../../context/symptom-context";
// import { Progress } from "@/components/Progress";
// import { BACKEND_URL } from "@/chat/config";
// import Step5 from "./Step5";

// export type AnalysisResult = {
//   possibleConditions: string[];
//   advice: string;
//   urgency: "Low" | "Moderate" | "High";
//   recommendedNextSteps: string[];
//   dos: string[];
//   donts: string[];
//   followUpActions: string[];
//   riskFactors: string[];
//   possibleDiseases: string[];
//   preventiveMeasures: string[];
//   dietRecommendations: {
//     breakfast: string[];
//     lunch: string[];
//     dinner: string[];
//   };
//   exercisePlan: string[];
//   ayurvedicMedications: string[];
// };

// const Step4 = () => {
//   const router = useRouter();
//   const { selectedSymptoms, demographics, lifestyle, bodyAreas } =
//     useSymptoms();

//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
//     null
//   );

//   const createAnalysisPayload = () => {
//     return {
//       symptoms: selectedSymptoms.map((s) => ({
//         id: s.id,
//         label: s.label,
//         areaId: s.areaId,
//         isCustom: s.isCustom || false,
//       })),
//       demographics: {
//         age: Number.parseInt(demographics.age) || null,
//         gender: demographics.gender,
//         heightCm: Number.parseFloat(demographics.heightCm) || null,
//         weightKg: Number.parseFloat(demographics.weightKg) || null,
//         bmi:
//           demographics.heightCm && demographics.weightKg
//             ? (
//                 Number.parseFloat(demographics.weightKg) /
//                 Math.pow(Number.parseFloat(demographics.heightCm) / 100, 2)
//               ).toFixed(1)
//             : null,
//         conditions: demographics.conditions,
//         medicalHistory: demographics.medicalHistory,
//         currentMedications: demographics.currentMedications,
//         allergies: demographics.allergies,
//       },
//       lifestyle: {
//         exerciseFrequency: lifestyle.exerciseFrequency,
//         sleepQuality: lifestyle.sleepQuality,
//         stressLevel: lifestyle.stress,
//         diet: lifestyle.diet,
//         recentChanges: lifestyle.recentChanges,
//       },
//       timestamp: new Date().toISOString(),
//     };
//   };

//   const analyzeSymptoms = async () => {
//     if (selectedSymptoms.length === 0) {
//       Alert.alert(
//         "No Symptoms",
//         "Please select at least one symptom to analyze."
//       );
//       return;
//     }

//     setIsAnalyzing(true);
//     try {
//       const payload = createAnalysisPayload();

//       // console.log("payload", payload);

//       const response = await fetch(`${BACKEND_URL}/api/generate-report`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(
//           `HTTP ${response.status}: ${response.statusText} - Error Message: ${response.body}`
//         );
//       }

//       const result = await response.json();
//       // console.log("result", result);

//       setAnalysisResult(result);
//     } catch (error) {
//       console.error("Analysis failed:", error);
//       Alert.alert(
//         "Analysis Failed",
//         "Unable to connect to analysis service. Please check your connection and try again."
//       );
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const getAffectedAreas = () => {
//     const areaIds = new Set(
//       selectedSymptoms.map((s) => s.areaId).filter(Boolean)
//     );
//     return bodyAreas
//       .filter((area) => areaIds.has(area.id))
//       .map((area) => area.name);
//   };

//   if (isAnalyzing) {
//     return (
//       <MotiView
//         from={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         style={styles.container}
//       >
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
//           <Text style={styles.loadingSubtext}>This may take a few moments</Text>
//         </View>
//       </MotiView>
//     );
//   }

//   if (analysisResult && !isAnalyzing) {
//     return <Step5 analysisResult={analysisResult} />;
//   }

//   return (
//     <MotiView
//       from={{ opacity: 0, translateY: 20 }}
//       animate={{ opacity: 1, translateY: 0 }}
//       transition={{
//         type: "timing",
//         duration: 400,
//         easing: Easing.out(Easing.cubic),
//       }}
//       style={styles.container}
//     >
//       <Progress step={4} total={4} />
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.title}>Review & Analyze</Text>
//         <Text style={styles.subtitle}>
//           Review your information below, then tap &dapos;Analyze Symptoms&dapos;
//           for personalized insights.
//         </Text>

//         {/* Selected Symptoms Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Selected Symptoms ({selectedSymptoms.length}/7)
//           </Text>
//           <View style={styles.pillContainer}>
//             {selectedSymptoms.map((symptom) => (
//               <View key={symptom.id} style={styles.symptomPill}>
//                 <Text style={styles.pillText}>{symptom.label}</Text>
//               </View>
//             ))}
//           </View>
//           {getAffectedAreas().length > 0 && (
//             <Text style={styles.affectedAreas}>
//               Affected areas: {getAffectedAreas().join(", ")}
//             </Text>
//           )}
//         </View>

//         {/* Demographics Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Demographics</Text>
//           <View style={styles.summaryGrid}>
//             {demographics.age && (
//               <Text style={styles.summaryItem}>Age: {demographics.age}</Text>
//             )}
//             {demographics.gender && (
//               <Text style={styles.summaryItem}>
//                 Gender: {demographics.gender}
//               </Text>
//             )}
//             {demographics.heightCm && demographics.weightKg && (
//               <Text style={styles.summaryItem}>
//                 BMI:{" "}
//                 {(
//                   Number.parseFloat(demographics.weightKg) /
//                   Math.pow(Number.parseFloat(demographics.heightCm) / 100, 2)
//                 ).toFixed(1)}
//               </Text>
//             )}
//             {demographics.conditions.length > 0 && (
//               <Text style={styles.summaryItem}>
//                 Conditions: {demographics.conditions.join(", ")}
//               </Text>
//             )}
//           </View>
//         </View>

//         {/* Lifestyle Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Lifestyle</Text>
//           <View style={styles.summaryGrid}>
//             {lifestyle.exerciseFrequency && (
//               <Text style={styles.summaryItem}>
//                 Exercise: {lifestyle.exerciseFrequency}
//               </Text>
//             )}
//             {lifestyle.sleepQuality && (
//               <Text style={styles.summaryItem}>
//                 Sleep: {lifestyle.sleepQuality}
//               </Text>
//             )}
//             <Text style={styles.summaryItem}>
//               Stress Level: {lifestyle.stress}/100
//             </Text>
//             {lifestyle.diet && (
//               <Text style={styles.summaryItem}>Diet: {lifestyle.diet}</Text>
//             )}
//           </View>
//         </View>

//         <View style={styles.actions}>
//           <Pressable
//             style={styles.secondaryButton}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.secondaryButtonText}>Back</Text>
//           </Pressable>
//           <Pressable
//             style={styles.primaryButton}
//             onPress={() => {
//               analyzeSymptoms();
//             }}
//           >
//             <Text style={styles.primaryButtonText}>Analyze Symptoms</Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </MotiView>
//   );
// };

// export default Step4;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     paddingHorizontal: 20,
//     paddingTop: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#1a1a1a",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#6b7280",
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   section: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1a1a1a",
//     marginBottom: 12,
//   },
//   pillContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   symptomPill: {
//     backgroundColor: "#e0f2fe",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#0284c7",
//   },
//   pillText: {
//     fontSize: 14,
//     color: "#0284c7",
//     fontWeight: "500",
//   },
//   affectedAreas: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginTop: 8,
//     fontStyle: "italic",
//   },
//   summaryGrid: {
//     gap: 8,
//   },
//   summaryItem: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 20,
//   },
//   urgencyBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginBottom: 8,
//   },
//   urgencyLow: {
//     backgroundColor: "#dcfce7",
//   },
//   urgencyModerate: {
//     backgroundColor: "#fef3c7",
//   },
//   urgencyHigh: {
//     backgroundColor: "#fee2e2",
//   },
//   urgencyText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#1a1a1a",
//   },
//   adviceText: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 22,
//     backgroundColor: "#f0f9ff",
//     padding: 12,
//     borderRadius: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: "#0284c7",
//   },
//   listItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   bullet: {
//     fontSize: 16,
//     color: "#0284c7",
//     marginRight: 8,
//     marginTop: 2,
//   },
//   listText: {
//     flex: 1,
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 20,
//   },
//   guidanceText: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 22,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1a1a1a",
//     marginTop: 16,
//   },
//   loadingSubtext: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginTop: 4,
//   },
//   actions: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 24,
//     marginBottom: 40,
//   },
//   primaryButton: {
//     flex: 1,
//     backgroundColor: "#1a1a1a",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   primaryButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   secondaryButton: {
//     flex: 1,
//     backgroundColor: "white",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//   },
//   secondaryButtonText: {
//     color: "#374151",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   conditionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#f8fafc",
//     borderRadius: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: "#0284c7",
//   },
//   conditionBadge: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#0284c7",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   conditionNumber: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "white",
//   },
//   conditionText: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#1a1a1a",
//   },
// });

"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSymptoms } from "../../../../context/symptom-context";
import { Progress } from "@/components/Progress";
import { BACKEND_URL } from "@/chat/config";
import Step5 from "./Step5";
import { palette } from "@/design/tokens";

export type AnalysisResult = {
  possibleConditions: string[];
  advice: string;
  urgency: "Low" | "Moderate" | "High";
  recommendedNextSteps: string[];
  doList: string[];
  dontList: string[];
  followUpActions: string[];
  riskFactors: string[];
  possibleDiseases: string[];
  preventiveMeasures: string[];
  dietRecommendations: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  exercisePlan: string[];
  ayurvedicMedications: string[];
  personalizedHealthScore: number;
};

const Step4 = () => {
  const router = useRouter();
  const { selectedSymptoms, demographics, lifestyle, bodyAreas } =
    useSymptoms();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const createAnalysisPayload = () => {
    return {
      symptoms: selectedSymptoms.map((s) => ({
        id: s.id,
        label: s.label,
        areaId: s.areaId,
        isCustom: s.isCustom || false,
      })),
      demographics: {
        age: Number.parseInt(demographics.age) || null,
        gender: demographics.gender,
        heightCm: Number.parseFloat(demographics.heightCm) || null,
        weightKg: Number.parseFloat(demographics.weightKg) || null,
        bmi:
          demographics.heightCm && demographics.weightKg
            ? (
                Number.parseFloat(demographics.weightKg) /
                Math.pow(Number.parseFloat(demographics.heightCm) / 100, 2)
              ).toFixed(1)
            : null,
        conditions: demographics.conditions,
        medicalHistory: demographics.medicalHistory,
        currentMedications: demographics.currentMedications,
        allergies: demographics.allergies,
      },
      lifestyle: {
        exerciseFrequency: lifestyle.exerciseFrequency,
        sleepQuality: lifestyle.sleepQuality,
        stressLevel: lifestyle.stress,
        diet: lifestyle.diet,
        recentChanges: lifestyle.recentChanges,
      },
      timestamp: new Date().toISOString(),
    };
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert(
        "No Symptoms",
        "Please select at least one symptom to analyze."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const payload = createAnalysisPayload();

      const response = await fetch(`${BACKEND_URL}/api/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - Error Message: ${response.body}`
        );
      }

      const result = await response.json();
      // console.log("result", result);

      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      Alert.alert(
        "Analysis Failed",
        "Unable to connect to analysis service. Please check your connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAffectedAreas = () => {
    const areaIds = new Set(
      selectedSymptoms.map((s) => s.areaId).filter(Boolean)
    );
    return bodyAreas
      .filter((area) => areaIds.has(area.id))
      .map((area) => area.name);
  };

  if (isAnalyzing) {
    return (
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "timing",
              duration: 600,
              easing: Easing.out(Easing.back(1.5)),
            }}
            style={styles.loadingIconContainer}
          >
            <ActivityIndicator size="large" color="#6366f1" />
          </MotiView>
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{
              type: "timing",
              duration: 500,
              delay: 200,
            }}
          >
            <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
            <Text style={styles.loadingSubtext}>
              This may take a few moments
            </Text>
          </MotiView>
        </View>
      </MotiView>
    );
  }

  if (analysisResult && !isAnalyzing) {
    return <Step5 analysisResult={analysisResult} />;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }}
      style={styles.container}
    >
      <Progress step={4} total={4} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ translateY: 10, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ delay: 100 }}
        >
          <Text style={styles.title}>Review & Analyze</Text>
          <Text style={styles.subtitle}>
            Review your information below, then tap 'Analyze Symptoms' for
            personalized insights.
          </Text>
        </MotiView>

        {/* Selected Symptoms Summary */}
        <MotiView
          from={{ translateX: -20, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ delay: 200 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIcon}>🩺</Text>
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Selected Symptoms</Text>
              <Text style={styles.sectionCount}>
                ({selectedSymptoms.length}/7)
              </Text>
            </View>
          </View>
          <View style={styles.pillContainer}>
            {selectedSymptoms.map((symptom, index) => (
              <MotiView
                key={symptom.id}
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  delay: 300 + index * 50,
                  damping: 15,
                  stiffness: 150,
                }}
                style={styles.symptomPill}
              >
                <Text style={styles.pillText}>{symptom.label}</Text>
              </MotiView>
            ))}
          </View>
          {getAffectedAreas().length > 0 && (
            <View style={styles.affectedAreasContainer}>
              <Text style={styles.affectedAreasLabel}>Affected areas:</Text>
              <Text style={styles.affectedAreas}>
                {getAffectedAreas().join(", ")}
              </Text>
            </View>
          )}
        </MotiView>

        {/* Demographics Summary */}
        <MotiView
          from={{ translateX: 20, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ delay: 400 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIcon}>👤</Text>
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Demographics</Text>
            </View>
          </View>
          <View style={styles.summaryGrid}>
            {demographics.age && (
              <View style={styles.summaryItemContainer}>
                <Text style={styles.summaryLabel}>Age</Text>
                <Text style={styles.summaryValue}>{demographics.age}</Text>
              </View>
            )}
            {demographics.gender && (
              <View style={styles.summaryItemContainer}>
                <Text style={styles.summaryLabel}>Gender</Text>
                <Text style={styles.summaryValue}>{demographics.gender}</Text>
              </View>
            )}
            {demographics.heightCm && demographics.weightKg && (
              <View style={styles.summaryItemContainer}>
                <Text style={styles.summaryLabel}>BMI</Text>
                <Text style={styles.summaryValue}>
                  {(
                    Number.parseFloat(demographics.weightKg) /
                    Math.pow(Number.parseFloat(demographics.heightCm) / 100, 2)
                  ).toFixed(1)}
                </Text>
              </View>
            )}
            {demographics.conditions.length > 0 && (
              <View style={[styles.summaryItemContainer, styles.fullWidth]}>
                <Text style={styles.summaryLabel}>Conditions</Text>
                <Text style={styles.summaryValue}>
                  {demographics.conditions.join(", ")}
                </Text>
              </View>
            )}
          </View>
        </MotiView>

        {/* Lifestyle Summary */}
        <MotiView
          from={{ translateX: -20, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ delay: 600 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIcon}>🏃‍♂️</Text>
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Lifestyle</Text>
            </View>
          </View>
          <View style={styles.summaryGrid}>
            {lifestyle.exerciseFrequency && (
              <View style={styles.summaryItemContainer}>
                <Text style={styles.summaryLabel}>Exercise</Text>
                <Text style={styles.summaryValue}>
                  {lifestyle.exerciseFrequency}
                </Text>
              </View>
            )}
            {lifestyle.sleepQuality && (
              <View style={styles.summaryItemContainer}>
                <Text style={styles.summaryLabel}>Sleep</Text>
                <Text style={styles.summaryValue}>
                  {lifestyle.sleepQuality}
                </Text>
              </View>
            )}
            <View style={styles.summaryItemContainer}>
              <Text style={styles.summaryLabel}>Stress Level</Text>
              <Text style={styles.summaryValue}>{lifestyle.stress}/100</Text>
            </View>
            {lifestyle.diet && (
              <View style={styles.summaryItemContainer}>
                <Text style={styles.summaryLabel}>Diet</Text>
                <Text style={styles.summaryValue}>{lifestyle.diet}</Text>
              </View>
            )}
          </View>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ delay: 800 }}
          style={styles.actions}
        >
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>← Back</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              analyzeSymptoms();
            }}
          >
            <Text style={styles.primaryButtonText}>Analyze Symptoms</Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </MotiView>
  );
};

export default Step4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: "#64748b",
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: "400",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    marginLeft: 8,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  symptomPill: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#c7d2fe",
  },
  pillText: {
    fontSize: 15,
    color: "#4338ca",
    fontWeight: "600",
  },
  affectedAreasContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  affectedAreasLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
    marginRight: 8,
  },
  affectedAreas: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
    fontStyle: "italic",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryItemContainer: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: "45%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fullWidth: {
    minWidth: "100%",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "600",
  },
  summaryItem: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 32,
    marginBottom: 40,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: palette.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    color: "#475569",
    fontSize: 17,
    fontWeight: "600",
  },
  urgencyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  urgencyLow: {
    backgroundColor: "#dcfce7",
  },
  urgencyModerate: {
    backgroundColor: "#fef3c7",
  },
  urgencyHigh: {
    backgroundColor: "#fee2e2",
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  adviceText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0284c7",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#0284c7",
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
  },
  guidanceText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0284c7",
  },
  conditionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0284c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  conditionNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  conditionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
});
