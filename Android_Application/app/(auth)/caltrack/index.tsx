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
import { useTheme } from "@/context/theme-context";

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

function NutritionAnalyzer() {
  const { palette, isDark } = useTheme();
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
          onPress: () => router.push("/caltrack/camerascreen"),
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
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
        style={{ marginBottom: 8 }}
      >
        <Text style={[styles.title, { color: palette.text }]}>
          Your Nutrition Analyzer
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Upload a clear photo of your meal or snap a new one. We'll estimate
          calories, macronutrients, micronutrients, and provide a quick health
          assessment with suggestions.
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 150 }}
        style={[
          styles.helperBox,
          {
            backgroundColor: palette.primaryBg,
            borderColor: palette.primaryBorder,
          },
        ]}
      >
        <Text style={[styles.helperItem, { color: palette.text }]}>
          • Best results with one dish centered, in focus
        </Text>
        <Text style={[styles.helperItem, { color: palette.text }]}>
          • Good lighting and minimal clutter
        </Text>
        <Text style={[styles.helperItem, { color: palette.text }]}>
          • Optional notes like "no sauce" or "half portion"
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 400, delay: 200 }}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
              color: palette.text,
            },
          ]}
          placeholder="Add notes or instructions (optional)"
          placeholderTextColor={palette.textMuted}
          value={userInput}
          onChangeText={setUserInput}
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
          style={[
            styles.uploadCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.primary,
            },
            loading && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Upload or change food photo"
        >
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.uploadImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={[styles.uploadTitle, { color: palette.text }]}>
                Tap to upload a food photo
              </Text>
              <Text
                style={[styles.uploadCaption, { color: palette.textMuted }]}
              >
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
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
            loading && styles.disabledButton,
          ]}
          onPress={chooseFromGallery}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: palette.primary }]}>
            Choose from Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
            loading && styles.disabledButton,
          ]}
          onPress={() => router.push("/caltrack/camerascreen")}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: palette.primary }]}>
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
            { backgroundColor: palette.accent },
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
            color={palette.primary}
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
          <Text style={[styles.noDataText, { color: palette.text }]}>
            We couldn't detect a recognizable dish. Try a clear, well‑lit photo
            where the food fills most of the frame.
          </Text>
        </MotiView>
      )}

      {nutritionData && (
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          style={[
            styles.nutritionCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 200 }}
            style={[styles.foodName, { color: palette.text }]}
          >
            {nutritionData.foodName
              ? nutritionData.foodName
              : nutritionData.healthAssessment}
          </MotiText>

          <MotiView
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 280 }}
            style={[
              styles.caloriesContainer,
              { backgroundColor: palette.accentBg },
            ]}
          >
            <Text style={[styles.caloriesText, { color: palette.accent }]}>
              {nutritionData.calories} calories
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 350 }}
            style={styles.macroContainer}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Macronutrients
            </Text>
            <View style={styles.macroCardsRow}>
              <View
                style={[
                  styles.macroCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.macroLabel, { color: palette.textMuted }]}>
                  Protein
                </Text>
                <Text style={[styles.macroValue, { color: palette.primary }]}>
                  {nutritionData.macronutrients.protein}g
                </Text>
              </View>

              <View
                style={[
                  styles.macroCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.macroLabel, { color: palette.textMuted }]}>
                  Carbs
                </Text>
                <Text style={[styles.macroValue, { color: palette.primary }]}>
                  {nutritionData.macronutrients.carbohydrates}g
                </Text>
              </View>

              <View
                style={[
                  styles.macroCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.macroLabel, { color: palette.textMuted }]}>
                  Fat
                </Text>
                <Text style={[styles.macroValue, { color: palette.primary }]}>
                  {nutritionData.macronutrients.fat}g
                </Text>
              </View>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 420 }}
            style={styles.microContainer}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Micronutrients
            </Text>

            <View style={styles.microGrid}>
              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Fiber
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.fiber ?? "N/A"}g
                </Text>
              </View>

              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Sodium
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.sodium ?? "N/A"}mg
                </Text>
              </View>

              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Sugar
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.sugar ?? "N/A"}g
                </Text>
              </View>

              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Calcium
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.calcium ?? "N/A"}mg
                </Text>
              </View>

              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Iron
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.iron ?? "N/A"}mg
                </Text>
              </View>

              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Phosphorus
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.phosphorus ?? "N/A"}mg
                </Text>
              </View>

              <View
                style={[
                  styles.microCard,
                  {
                    backgroundColor: palette.bgSecondary,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.microLabel, { color: palette.textMuted }]}>
                  Potassium
                </Text>
                <Text style={[styles.microValue, { color: palette.text }]}>
                  {nutritionData.micronutrients.potassium ?? "N/A"}mg
                </Text>
              </View>
            </View>

            {nutritionData.micronutrients.vitamins?.length > 0 && (
              <View
                style={[
                  styles.vitaminsCard,
                  {
                    backgroundColor: palette.primaryBg,
                    borderColor: palette.primaryBorder,
                  },
                ]}
              >
                <Text
                  style={[styles.vitaminLabel, { color: palette.textMuted }]}
                >
                  Vitamins
                </Text>
                <Text style={[styles.vitaminValue, { color: palette.primary }]}>
                  {nutritionData.micronutrients.vitamins.join(", ")}
                </Text>
              </View>
            )}
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 480 }}
            style={[
              styles.assessmentContainer,
              {
                backgroundColor: palette.bgSecondary,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Health Assessment
            </Text>
            <Text
              style={[styles.assessmentText, { color: palette.textSecondary }]}
            >
              {nutritionData.healthAssessment}
            </Text>
          </MotiView>

          {nutritionData.suggestions &&
            nutritionData.suggestions.length > 0 && (
              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 520 }}
                style={[
                  styles.suggestionsContainer,
                  {
                    backgroundColor: palette.primaryBg,
                    borderColor: palette.primaryBorder,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: palette.text }]}>
                  Suggestions
                </Text>
                {nutritionData.suggestions.map((suggestion, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.suggestionText,
                      { color: palette.textSecondary },
                    ]}
                  >
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
        <Text style={[styles.disclaimer, { color: palette.textMuted }]}>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  helperBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  helperItem: {
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    marginVertical: 10,
    borderRadius: 12,
    fontSize: 16,
  },
  uploadCard: {
    borderRadius: 16,
    borderWidth: 2,
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
    marginBottom: 4,
  },
  uploadCaption: {
    fontSize: 12,
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
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  analyzeButton: {
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
    textAlign: "left",
    marginTop: 12,
  },
  nutritionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  foodName: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "left",
    marginBottom: 12,
  },
  caloriesContainer: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  macroContainer: {
    marginBottom: 16,
  },
  macroCardsRow: {
    flexDirection: "row",
    gap: 10,
  },
  macroCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  microContainer: {
    marginBottom: 16,
  },
  microGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  microCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  microLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },
  microValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  vitaminsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  vitaminLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  vitaminValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  assessmentContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  assessmentText: {
    fontSize: 13,
    lineHeight: 20,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  suggestionText: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  disclaimer: {
    fontSize: 12,
    marginTop: 18,
    marginBottom: 8,
    lineHeight: 18,
  },
});
