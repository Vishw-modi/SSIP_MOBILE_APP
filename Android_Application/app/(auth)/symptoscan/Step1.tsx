import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useSymptoms } from "@/context/symptom-context";
import { router } from "expo-router";
import { useTheme } from "@/context/theme-context";
export default function SymptoScan() {
  const { palette } = useTheme(); // Add this hook
  const {
    bodyAreas,
    currentAreaId,
    setCurrentArea,
    selectedSymptoms,
    maxSelected,
    toggleSymptom,
    addCustomSymptom,
    removeSymptom,
  } = useSymptoms();
  const [custom, setCustom] = useState("");

  const currentArea = useMemo(
    () => bodyAreas.find((a) => a.id === currentAreaId) ?? null,
    [bodyAreas, currentAreaId]
  );

  const handleAddCustom = () => {
    if (!custom.trim()) return;
    addCustomSymptom(custom);
    setCustom("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
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
          style={[styles.card, { backgroundColor: palette.card }]}
        >
          <Text style={[styles.title, { color: palette.text }]}>
            SymptomScan Pro
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
              Progress Step 1 of 4
            </Text>
          </View>

          <View style={styles.columns}>
            <View style={styles.colLeft}>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>
                Body Areas
              </Text>
              {bodyAreas.map((area) => {
                const active = area.id === currentAreaId;
                return (
                  <Pressable
                    key={area.id}
                    onPress={() => setCurrentArea(area.id)}
                    style={({ pressed }) => [
                      styles.areaBtn,
                      {
                        backgroundColor: active
                          ? palette.primaryBg
                          : palette.bgSecondary,
                        borderColor: active ? palette.primary : palette.border,
                      },
                      pressed && { opacity: 0.9 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${area.name}`}
                  >
                    <Text
                      style={[
                        styles.areaBtnText,
                        { color: active ? palette.primary : palette.text },
                      ]}
                    >
                      {area.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.colRight}>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>
                Select a body area
              </Text>
              <View
                style={[
                  styles.panel,
                  {
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                  },
                ]}
              >
                {!currentArea ? (
                  <Text
                    style={[styles.panelEmpty, { color: palette.textMuted }]}
                  >
                    Please select a body area to see related symptoms
                  </Text>
                ) : (
                  <View style={{ gap: 8 }}>
                    {currentArea.symptoms.map((sym) => {
                      const selected = selectedSymptoms.some(
                        (s) => s.id === sym.id
                      );
                      const disabled =
                        !selected && selectedSymptoms.length >= maxSelected;
                      return (
                        <Pressable
                          key={sym.id}
                          onPress={() => toggleSymptom(sym)}
                          style={({ pressed }) => [
                            styles.symptomRow,
                            {
                              backgroundColor: selected
                                ? palette.primaryBg
                                : palette.card,
                              borderColor: selected
                                ? palette.primary
                                : palette.border,
                            },
                            disabled && { opacity: 0.5 },
                            pressed && { opacity: 0.85 },
                          ]}
                          disabled={disabled}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          accessibilityLabel={sym.label}
                        >
                          <View
                            style={[
                              styles.check,
                              {
                                borderColor: selected
                                  ? palette.primary
                                  : palette.borderLight,
                                backgroundColor: selected
                                  ? palette.primary
                                  : "transparent",
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.symptomText,
                              {
                                color: selected
                                  ? palette.primary
                                  : palette.text,
                              },
                            ]}
                          >
                            {sym.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.selectedWrap}>
            <View style={styles.selectedHeader}>
              <Text style={[styles.sectionTitle, { color: palette.text }]}>
                Selected Symptoms
              </Text>
              <Text style={[styles.counterText, { color: palette.textMuted }]}>
                {selectedSymptoms.length}/{maxSelected} symptoms
              </Text>
            </View>

            <View
              style={[
                styles.selectedPanel,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}
            >
              {selectedSymptoms.length === 0 ? (
                <Text style={[styles.panelEmpty, { color: palette.textMuted }]}>
                  No symptoms selected. Select from the list above or add custom
                  symptoms.
                </Text>
              ) : (
                <View style={styles.pillsWrap}>
                  {selectedSymptoms.map((s) => (
                    <View
                      key={s.id}
                      style={[
                        styles.pill,
                        { backgroundColor: palette.bgSecondary },
                      ]}
                    >
                      <Text style={[styles.pillText, { color: palette.text }]}>
                        {s.label}
                      </Text>
                      <Pressable
                        onPress={() => removeSymptom(s.id)}
                        hitSlop={8}
                      >
                        <Text
                          style={[
                            styles.pillClose,
                            { color: palette.textMuted },
                          ]}
                        >
                          ×
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.customRow}>
              <TextInput
                placeholder="Add a custom symptom..."
                placeholderTextColor={palette.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    color: palette.text,
                  },
                ]}
                value={custom}
                onChangeText={setCustom}
                onSubmitEditing={handleAddCustom}
                returnKeyType="done"
              />
              <Pressable
                onPress={handleAddCustom}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: palette.textMuted },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text
                  style={[styles.addBtnText, { color: palette.textInverse }]}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                router.push("/symptoscan/Step2");
              }}
              style={({ pressed }) => [
                styles.nextBtn,
                { backgroundColor: palette.primary },
                pressed && { opacity: 0.9 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Next"
            >
              <Text style={[styles.nextText, { color: palette.textInverse }]}>
                Next →
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 10 },
  card: {
    borderRadius: 0,
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
    width: "25%",
  },
  progressText: { marginTop: 6, fontSize: 12 },
  columns: { flexDirection: "row", gap: 16, marginTop: 8 },
  colLeft: { flex: 1 },
  colRight: { flex: 1.4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  areaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  areaBtnText: { fontWeight: "600" },
  panel: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    justifyContent: "center",
  },
  panelEmpty: { textAlign: "center" },
  symptomRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
  },
  symptomText: { fontWeight: "600" },
  selectedWrap: { marginTop: 16 },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  counterText: { fontSize: 12 },
  selectedPanel: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 84,
    padding: 12,
    justifyContent: "center",
  },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  pillText: { fontWeight: "600" },
  pillClose: { fontSize: 16, marginTop: -2 },
  customRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  addBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addBtnText: { fontWeight: "700" },
  footer: { marginTop: 12, alignItems: "flex-end" },
  nextBtn: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  nextText: { fontWeight: "700" },
});
