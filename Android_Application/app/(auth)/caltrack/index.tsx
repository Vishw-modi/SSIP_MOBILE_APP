"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MotiView, MotiText } from "moti";
import { useCaltrack } from "@/context/caltrack-context";

import { BACKEND_URL } from "../../../src/chat/config";
import { router } from "expo-router";

interface NutritionResponse {
  calories: number;
  foodName: string;
  healthAssessment: string;
  macronutrients: {
    carbohydrates: number;
    fat: number;
    protein: number;
  };
  micronutrients: {
    fiber: number;
    sodium: number;
    sugar: number;
    vitamins: string[];
    iron: number;
    calcium: number;
    potassium: number;
    phosphorus: number;
  };
  suggestions: string[];
}

const COLORS = {
  primary: "#007AFF", // brand blue
  accent: "#34C759", // success green
  bg: "#F8FAFC", // app background
  card: "#FFFFFF", // surfaces/cards
  text: "#1F2937", // slate-800
};

function NutritionAnalyzer() {
  const {
    userInput,
    setUserInput,
    photo,
    setPhoto,
    loading,
    setLoading,
    responsePoints,
    setResponsePoints,
  } = useCaltrack();

  const [nutritionData, setNutritionData] =
    React.useState<NutritionResponse | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);

  const chooseFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission denied!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.length) {
      setPhoto(result.assets[0]);
    }
  };

  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Choose from Gallery",
          onPress: chooseFromGallery,
        },
        {
          text: "Take Photo",
          onPress: () => router.push("/caltrack/camerascreen"), // navigates to your camera screen
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const analyzeNutrition = async () => {
    if (!photo) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);
    setResponsePoints([]);
    setNutritionData(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
      if (userInput && userInput.trim()) {
        formData.append("userInput", userInput);
      }
      setHasUploaded(false);
      const response = await fetch(`${BACKEND_URL}/api/analyze-nutrition`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // console.log("result received", result);

        if (result.points) {
          setResponsePoints(result.points);
        }
        if (!result.calories && !result.foodName) {
          setHasUploaded(true);
        }
        if (result.calories || result.foodName) {
          setNutritionData(result as NutritionResponse);
        }
      } else {
        throw new Error(result.error || "Error analyzing nutrition");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
        style={{ marginBottom: 8 }}
      >
        <Text style={styles.title}>Your Nutrition Analyzer</Text>
        <Text style={styles.subtitle}>
          Upload a clear photo of your meal or snap a new one. We’ll estimate
          calories, macronutrients, micronutrients, and provide a quick health
          assessment with suggestions.
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 150 }}
        style={styles.helperBox}
      >
        <Text style={styles.helperItem}>
          • Best results with one dish centered, in focus
        </Text>
        <Text style={styles.helperItem}>
          • Good lighting and minimal clutter
        </Text>
        <Text style={styles.helperItem}>
          • Optional notes like “no sauce” or “half portion”
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 400, delay: 200 }}
      >
        <TextInput
          style={styles.input}
          placeholder="Add notes or instructions (optional)"
          value={userInput}
          onChangeText={setUserInput}
          placeholderTextColor="rgba(31,41,55,0.6)"
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 250 }}
      >
        <TouchableOpacity
          onPress={pickImage}
          disabled={loading}
          style={[styles.uploadCard, loading && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Upload or change food photo"
        >
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.uploadImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadTitle}>Tap to upload a food photo</Text>
              <Text style={styles.uploadCaption}>
                JPG or PNG · Clear, well‑lit image
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 450, delay: 300 }}
        style={styles.uploadRow}
      >
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            loading && styles.disabledButton,
          ]}
          onPress={chooseFromGallery}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Choose from Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            loading && styles.disabledButton,
          ]}
          onPress={() => router.push("/caltrack/camerascreen")}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Take Photo
          </Text>
        </TouchableOpacity>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600, delay: 350 }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            styles.analyzeButton,
            loading && styles.disabledButton,
          ]}
          onPress={analyzeNutrition}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Analyzing..." : "Analyze Nutrition"}
          </Text>
        </TouchableOpacity>
      </MotiView>

      {loading && (
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 16 }}
          />
        </MotiView>
      )}

      {hasUploaded && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <Text style={styles.noDataText}>
            We couldn’t detect a recognizable dish. Try a clear, well‑lit photo
            where the food fills most of the frame.
          </Text>
        </MotiView>
      )}

      {nutritionData && (
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          style={styles.nutritionCard}
        >
          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 200 }}
            style={styles.foodName}
          >
            {nutritionData.foodName
              ? nutritionData.foodName
              : nutritionData.healthAssessment}
          </MotiText>

          <MotiView
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 280 }}
            style={styles.caloriesContainer}
          >
            <Text style={styles.caloriesText}>
              {nutritionData.calories} calories
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 350 }}
            style={styles.macroContainer}
          >
            <Text style={styles.sectionTitle}>Macronutrients</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroText}>
                Protein: {nutritionData.macronutrients.protein}g
              </Text>
              <Text style={styles.macroText}>
                Carbs: {nutritionData.macronutrients.carbohydrates}g
              </Text>
              <Text style={styles.macroText}>
                Fat: {nutritionData.macronutrients.fat}g
              </Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 420 }}
            style={styles.microContainer}
          >
            <Text style={styles.sectionTitle}>Micronutrients</Text>

            <View style={styles.microGrid}>
              <Text style={styles.microText}>
                Fiber: {nutritionData.micronutrients.fiber ?? "N/A"}g
              </Text>
              <Text style={styles.microText}>
                Sodium: {nutritionData.micronutrients.sodium ?? "N/A"}mg
              </Text>
              <Text style={styles.microText}>
                Sugar: {nutritionData.micronutrients.sugar ?? "N/A"}g
              </Text>
              <Text style={styles.microText}>
                Calcium: {nutritionData.micronutrients.calcium ?? "N/A"}mg
              </Text>
              <Text style={styles.microText}>
                Iron: {nutritionData.micronutrients.iron ?? "N/A"}mg
              </Text>
              <Text style={styles.microText}>
                Phosphorus: {nutritionData.micronutrients.phosphorus ?? "N/A"}mg
              </Text>
              <Text style={styles.microText}>
                Potassium: {nutritionData.micronutrients.potassium ?? "N/A"}mg
              </Text>
            </View>

            <Text style={styles.microVitamins}>
              {nutritionData.micronutrients.vitamins?.length
                ? nutritionData.micronutrients.vitamins.join(", ")
                : "Vitamins: N/A"}
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 480 }}
            style={styles.assessmentContainer}
          >
            <Text style={styles.sectionTitle}>Health Assessment</Text>
            <Text style={styles.assessmentText}>
              {nutritionData.healthAssessment}
            </Text>
          </MotiView>

          {nutritionData.suggestions &&
            nutritionData.suggestions.length > 0 && (
              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 520 }}
                style={styles.suggestionsContainer}
              >
                <Text style={styles.sectionTitle}>Suggestions</Text>
                {nutritionData.suggestions.map((suggestion, idx) => (
                  <Text key={idx} style={styles.suggestionText}>
                    • {suggestion}
                  </Text>
                ))}
              </MotiView>
            )}
        </MotiView>
      )}

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300, delay: 200 }}
      >
        <Text style={styles.disclaimer}>
          Estimates are generated from the photo and may vary. For personalized
          medical or dietary advice, consult a professional.
        </Text>
      </MotiView>
    </ScrollView>
  );
}

export default function Caltrack() {
  return <NutritionAnalyzer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.bg,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "left",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(31,41,55,0.8)",
    lineHeight: 20,
    marginBottom: 8,
  },
  helperBox: {
    backgroundColor: "rgba(0,122,255,0.06)", // primary tint
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  helperItem: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(31,41,55,0.12)",
    padding: 14,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    fontSize: 16,
    color: COLORS.text,
  },
  uploadCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    overflow: "hidden",
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  uploadImage: {
    width: "100%",
    height: 220,
  },
  uploadPlaceholder: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  uploadCaption: {
    fontSize: 12,
    color: "rgba(31,41,55,0.7)",
  },
  uploadRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(31,41,55,0.12)",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  analyzeButton: {
    backgroundColor: COLORS.accent,
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  noDataText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "left",
    marginTop: 12,
  },
  nutritionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(31,41,55,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  foodName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "left",
    marginBottom: 12,
  },
  caloriesContainer: {
    backgroundColor: "rgba(52,199,89,0.12)", // accent tint
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.accent,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  macroContainer: {
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    padding: 12,
  },
  macroText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(31,41,55,0.9)",
  },
  microContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
  },
  microGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
    gap: 6,
  },
  microText: {
    width: "48%",
    fontSize: 12,
    marginBottom: 6,
    color: COLORS.text,
    fontWeight: "600",
  },
  microVitamins: {
    fontSize: 12,
    color: "rgba(31,41,55,0.85)",
  },
  assessmentContainer: {
    backgroundColor: "rgba(31,41,55,0.04)",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  assessmentText: {
    fontSize: 13,
    color: "rgba(31,41,55,0.9)",
    lineHeight: 20,
  },
  suggestionsContainer: {
    backgroundColor: "rgba(0,122,255,0.06)",
    borderRadius: 10,
    padding: 12,
  },
  suggestionText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  resultContainer: {
    marginTop: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(31,41,55,0.08)",
  },
  resultText: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.text,
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: 12,
    color: "rgba(31,41,55,0.7)",
    marginTop: 18,
    marginBottom: 8,
    lineHeight: 18,
  },
});
