import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useSymptoms } from "@/context/symptom-context";
import { GENDER_OPTIONS, MEDICAL_CONDITIONS } from "./data/options";
import { useTheme } from "@/context/theme-context";

const Step2 = () => {
  const router = useRouter();
  const { palette } = useTheme(); // Add this hook
  const { demographics, updateDemographics, toggleCondition } = useSymptoms();

  const selectedCount = demographics.conditions.length;

  const validateRequiredFields = () => {
    const errors = [];

    if (!demographics.age || demographics.age.trim() === "") {
      errors.push("Age is required");
    }

    if (!demographics.gender || demographics.gender.trim() === "") {
      errors.push("Gender is required");
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateRequiredFields();

    if (errors.length > 0) {
      Toast.show({
        type: "error",
        text1: "Required Fields Missing",
        text2: errors.join(", "),
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    router.push("/symptoscan/Step3");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: palette.bg },
      ]}
    >
      <MotiView
        from={{ opacity: 0, translateY: 12, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "timing",
          duration: 450,
          easing: Easing.out(Easing.cubic),
        }}
        style={[styles.card]}
      >
        <Text style={[styles.title, { color: palette.text }]}>
          SymptoScan Pro
        </Text>
        <Text style={[styles.lead, { color: palette.textMuted }]}>
          Our comprehensive AI-powered health analysis tool. Get detailed
          insights and personalized recommendations. Fill every input for more
          accurate results.
        </Text>

        <View style={styles.progressWrap}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: palette.primaryBg },
            ]}
          />
          <View
            style={[styles.progressBar, { backgroundColor: palette.primary }]}
          />
          <Text style={[styles.progressText, { color: palette.text }]}>
            Progress Step 2 of 4
          </Text>
        </View>

        <View style={styles.grid2}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.text }]}>
              Age{" "}
              <Text style={[styles.required, { color: palette.danger }]}>
                *
              </Text>
            </Text>
            <TextInput
              value={demographics.age}
              onChangeText={(t) =>
                updateDemographics("age", t.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter your age"
              placeholderTextColor={palette.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                  color: palette.text,
                },
                (!demographics.age || demographics.age.trim() === "") && {
                  borderColor: palette.danger,
                  backgroundColor: palette.dangerBg,
                },
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.text }]}>
              Gender{" "}
              <Text style={[styles.required, { color: palette.danger }]}>
                *
              </Text>
            </Text>
            <View style={styles.rowWrap}>
              {GENDER_OPTIONS.map((g) => {
                const active = demographics.gender === g;
                return (
                  <Pressable
                    key={g}
                    onPress={() => updateDemographics("gender", g)}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        backgroundColor: active
                          ? palette.primaryBg
                          : palette.bgSecondary,
                        borderColor: active ? palette.primary : palette.border,
                      },
                      pressed && { opacity: 0.9 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: active ? palette.primary : palette.text },
                      ]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {(!demographics.gender || demographics.gender.trim() === "") && (
              <Text style={[styles.errorText, { color: palette.danger }]}>
                Please select a gender
              </Text>
            )}
          </View>
        </View>

        <View style={styles.grid2}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.text }]}>
              Height (cm)
            </Text>
            <TextInput
              value={demographics.heightCm}
              onChangeText={(t) =>
                updateDemographics("heightCm", t.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter your height in cm"
              placeholderTextColor={palette.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                  color: palette.text,
                },
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.text }]}>
              Weight (kg)
            </Text>
            <TextInput
              value={demographics.weightKg}
              onChangeText={(t) =>
                updateDemographics("weightKg", t.replace(/[^0-9.]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter your weight in kg"
              placeholderTextColor={palette.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                  color: palette.text,
                },
              ]}
            />
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={styles.conditionsHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Common Medical Conditions
            </Text>
            <Text style={[styles.counterText, { color: palette.textMuted }]}>
              {selectedCount}/3 selected
            </Text>
          </View>
          <View style={styles.chipGrid}>
            {MEDICAL_CONDITIONS.map((c) => {
              const active = demographics.conditions.includes(c);
              const atLimit = !active && selectedCount >= 3;
              return (
                <Pressable
                  key={c}
                  onPress={() => toggleCondition(c)}
                  disabled={atLimit}
                  style={({ pressed }) => [
                    styles.choice,
                    {
                      backgroundColor: active
                        ? palette.primaryBg
                        : palette.card,
                      borderColor: active ? palette.primary : palette.border,
                    },
                    atLimit && { opacity: 0.5 },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      { color: active ? palette.primary : palette.text },
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={[styles.label, { color: palette.text }]}>
            Additional Medical History
          </Text>
          <TextInput
            multiline
            value={demographics.medicalHistory}
            onChangeText={(t) => updateDemographics("medicalHistory", t)}
            placeholder="Describe any other medical conditions, surgeries, hospitalizations..."
            placeholderTextColor={palette.textMuted}
            style={[
              styles.input,
              styles.textarea,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                color: palette.text,
              },
            ]}
          />
          <Text style={[styles.helpText, { color: palette.textMuted }]}>
            This information helps provide a more accurate analysis of your
            symptoms.
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={[styles.label, { color: palette.text }]}>
            Current Medications
          </Text>
          <TextInput
            multiline
            value={demographics.currentMedications}
            onChangeText={(t) => updateDemographics("currentMedications", t)}
            placeholder="List any medications you are currently taking..."
            placeholderTextColor={palette.textMuted}
            style={[
              styles.input,
              styles.textarea,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                color: palette.text,
              },
            ]}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={[styles.label, { color: palette.text }]}>Allergies</Text>
          <TextInput
            multiline
            value={demographics.allergies}
            onChangeText={(t) => updateDemographics("allergies", t)}
            placeholder="List any allergies you have..."
            placeholderTextColor={palette.textMuted}
            style={[
              styles.input,
              styles.textarea,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                color: palette.text,
              },
            ]}
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.btnGhost,
              { backgroundColor: palette.bgSecondary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.btnGhostText, { color: palette.text }]}>
              ← Back
            </Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.btnPrimary,
              { backgroundColor: palette.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[styles.btnPrimaryText, { color: palette.textInverse }]}
            >
              Next →
            </Text>
          </Pressable>
        </View>
      </MotiView>

      <Toast />
    </ScrollView>
  );
};

export default Step2;

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 10 },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  title: { fontSize: 24, fontWeight: "800" },
  lead: { marginTop: 6, fontSize: 14.5, lineHeight: 20 },
  progressWrap: { marginTop: 12, marginBottom: 12 },
  progressTrack: { height: 6, borderRadius: 999 },
  progressBar: {
    height: 6,
    borderRadius: 999,
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
  },
  progressText: { marginTop: 6, fontSize: 12 },
  grid2: { flexDirection: "row", gap: 16, marginTop: 8 },
  label: { fontWeight: "700", marginBottom: 6 },
  required: { fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  textarea: { minHeight: 96, textAlignVertical: "top" },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipText: { fontWeight: "600" },
  conditionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  counterText: { fontSize: 12 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  choice: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  helpText: { marginTop: 6, fontSize: 12 },
  choiceText: { fontWeight: "600" },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnGhostText: { fontWeight: "700" },
  btnPrimary: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnPrimaryText: { fontWeight: "700" },
});
