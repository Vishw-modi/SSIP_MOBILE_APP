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
import * as DocumentPicker from "expo-document-picker";

import { useSymptoms } from "@/context/symptom-context";
// import { Progress } from "@/components/Progress";
import { BACKEND_URL } from "@/chat/config";
import Step5 from "./Step5";
import Toast from "react-native-toast-message";
import { useResult } from "@/context/result-context";
import { useUserContext } from "@/context/UserContext";

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
  reportInsights: string[];
  summary: string[];
};

const Step4 = () => {
  const { setResult } = useResult();
  const { userData, isLoaded } = useUserContext();
  // console.log("userdata from context", userData);

  const router = useRouter();
  const { selectedSymptoms, demographics, lifestyle, bodyAreas } =
    useSymptoms();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [reportFile, setReportFile] = useState<
    {
      name: string;
      uri: string;
      mimeType?: string;
      size?: number;
    }[]
  >([]);

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

  const pickReport = async () => {
    try {
      if (reportFile.length >= 3) {
        Toast.show({
          type: "error",
          text1: "Maximum 3 files allowed",
          position: "bottom",
          visibilityTime: 2000,
        });
        return;
      }
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"], // allow pdf + images
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFile = result.assets.map((f) => ({
          uri: f.uri,
          name: f.name || "Unnamed File",
          mimeType: f.mimeType,
          size: f.size,
        }));

        setReportFile((prev) => {
          const updated = [...prev];

          newFile.forEach((file) => {
            if (!file.size || file.size > 20 * 1024 * 1024) {
              Toast.show({
                type: "error",
                text1: `File ${file.name} exceeds 20 MB limit`,
                position: "bottom",
                visibilityTime: 2000,
              });
              return;
            }

            const alreadyExists = updated.find((f) => f.name === file.name);
            if (alreadyExists) {
              Toast.show({
                type: "error",
                text1: `File ${alreadyExists.name} already exists`,
                position: "bottom",
                visibilityTime: 2000,
              });
            } else if (updated.length < 3) {
              updated.push(file);
            }
          });

          return updated;
        });
      }
    } catch (err) {
      console.error("File pick error:", err);
      Alert.alert("Error", "Unable to pick the file. Try again.");
    }
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
      const basePayload = createAnalysisPayload();

      const formData = new FormData();

      formData.append("payload", JSON.stringify(basePayload));
      formData.append("clerkUserId", userData?.clerkuserid ?? "");

      reportFile.forEach((file) => {
        formData.append("reportfiles", {
          uri: file.uri,
          name: file.name,
          type: file.name.endsWith(".pdf") ? "application/pdf" : file.mimeType,
        } as any);
      });

      // console.log("formData", formData);

      const response = await fetch(`${BACKEND_URL}/api/generate-report`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - Error Message: ${response.body}`
        );
      }

      const result = await response.json();
      // console.log("result", result);
      setResult(result);
      // router.push("/symptoscan/Step5");
      // console.log("result", result);

      setAnalysisResult(result);

      router.push("/symptoscan/Step5");
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
      <View style={styles.loadingOverlay}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.loadingContent}
        >
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
        </MotiView>
      </View>
    );
  }

  // if (analysisResult && !isAnalyzing) {
  //   return <Step5 analysisResult={analysisResult} />;
  // }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: 12, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          easing: Easing.out(Easing.cubic),
        }}
        style={styles.card}
      >
        <Text style={styles.title}>SymptomScan Pro</Text>
        <Text style={styles.lead}>
          Review your information below, then tap &apos;Analyze Symptoms&apos;
          for personalized insights.
        </Text>

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack} />
          <View style={styles.progressBar} />
          <Text style={styles.progressText}>Progress Step 4 of 4</Text>
        </View>

        {/* Selected Symptoms Summary */}
        <MotiView
          from={{ translateX: -20, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ delay: 200 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🩺</Text>
            <Text style={styles.sectionTitle}>Selected Symptoms</Text>
            <Text style={styles.sectionCount}>
              ({selectedSymptoms.length}/7)
            </Text>
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
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={styles.sectionTitle}>Demographics</Text>
          </View>

          <View style={styles.summaryGrid}>
            {demographics.age && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Age</Text>
                <Text style={styles.summaryValue}>{demographics.age}</Text>
              </View>
            )}
            {demographics.gender && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Gender</Text>
                <Text style={styles.summaryValue}>{demographics.gender}</Text>
              </View>
            )}
            {demographics.heightCm && demographics.weightKg && (
              <View style={styles.summaryItem}>
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
              <View style={[styles.summaryItem, styles.fullWidth]}>
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
            <Text style={styles.sectionIcon}>🏃‍♂️</Text>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
          </View>

          <View style={styles.summaryGrid}>
            {lifestyle.exerciseFrequency && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Exercise</Text>
                <Text style={styles.summaryValue}>
                  {lifestyle.exerciseFrequency}
                </Text>
              </View>
            )}
            {lifestyle.sleepQuality && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Sleep</Text>
                <Text style={styles.summaryValue}>
                  {lifestyle.sleepQuality}
                </Text>
              </View>
            )}
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Stress Level</Text>
              <Text style={styles.summaryValue}>{lifestyle.stress}/100</Text>
            </View>
            {lifestyle.diet && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Diet</Text>
                <Text style={styles.summaryValue}>{lifestyle.diet}</Text>
              </View>
            )}
          </View>
        </MotiView>

        {/* Medical Report Upload */}
        <MotiView
          from={{ translateX: 20, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ delay: 700 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📑</Text>
            <Text style={styles.sectionTitle}>Upload Medical Report</Text>
          </View>

          <Text style={styles.uploadSubtext}>Upload up to 3 reports only</Text>

          {reportFile.length > 0 ? (
            <View style={styles.fileList}>
              <Text style={styles.summaryLabel}>Selected Files:</Text>
              {reportFile.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <Text
                    style={styles.fileName}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {file.name}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setReportFile((prev) =>
                        prev.filter((f) => f.uri !== file.uri)
                      )
                    }
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </Pressable>
                </View>
              ))}

              {reportFile.length < 3 && (
                <Pressable style={styles.addFileButton} onPress={pickReport}>
                  <Text style={styles.addFileButtonText}>
                    + Add Another File
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable style={styles.uploadButton} onPress={pickReport}>
              <Text style={styles.uploadButtonText}>Select PDF or Image</Text>
            </Pressable>
          )}
        </MotiView>

        <View style={styles.footer}>
          <Pressable style={styles.btnGhost} onPress={() => router.back()}>
            <Text style={styles.btnGhostText}>← Back</Text>
          </Pressable>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => {
              analyzeSymptoms();
            }}
          >
            <Text style={styles.btnPrimaryText}>Analyze Symptoms</Text>
          </Pressable>
        </View>
      </MotiView>
    </ScrollView>
  );
};

export default Step4;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  lead: {
    fontSize: 14.5,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  progressWrap: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    backgroundColor: "#6366f1",
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomPill: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  pillText: {
    fontSize: 13,
    color: "#4338ca",
    fontWeight: "600",
  },
  affectedAreasContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  affectedAreasLabel: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
    marginRight: 6,
  },
  affectedAreas: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
    fontStyle: "italic",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryItem: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: "30%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fullWidth: {
    minWidth: "100%",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "600",
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
  },
  fileList: {
    marginTop: 8,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 8,
    backgroundColor: "#f87171",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  addFileButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  addFileButtonText: {
    color: "#6366f1",
    fontSize: 13,
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  btnGhost: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  btnGhostText: {
    fontWeight: "700",
    color: "#475569",
    fontSize: 14,
  },
  btnPrimary: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontWeight: "700",
    color: "white",
    fontSize: 14,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 6,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },
});
