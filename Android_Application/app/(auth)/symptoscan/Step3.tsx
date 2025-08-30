import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  PanResponder,
} from "react-native";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSymptoms } from "@/context/symptom-context";
import { useTheme } from "@/context/theme-context";
import { DIET_OPTIONS, EXERCISE_OPTIONS, SLEEP_OPTIONS } from "./data/options";
import { Dropdown } from "@/ui/dropdown";

export default function Lifestyle() {
  const router = useRouter();
  const { palette } = useTheme(); // Add theme hook
  const { lifestyle, updateLifestyle, demographics, updateDemographics } =
    useSymptoms();

  // slider state
  const SENSITIVITY = 1;
  const trackWidth = useRef(0);
  const knobX = useSharedValue(0);
  const knobStart = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        knobStart.current = knobX.value; // save starting knob pos
      },

      onPanResponderMove: (_, gesture) => {
        if (!trackWidth.current) return;

        // add relative dx to starting knob pos
        const newX = knobStart.current + gesture.dx * SENSITIVITY;

        const clamped = Math.max(0, Math.min(trackWidth.current, newX));
        knobX.value = clamped;

        const percent = Math.round((clamped / trackWidth.current) * 100);
        runOnJS(updateLifestyle)("stress", percent);
      },
    })
  ).current;

  // animated knob style
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value - 10 }], // 10 = half knob size
  }));

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
            Progress Step 3 of 4
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Lifestyle Factors
        </Text>

        <View style={styles.grid2}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.text }]}>
              Exercise Frequency
            </Text>
            <Dropdown
              data={EXERCISE_OPTIONS}
              placeholder="Select exercise frequency"
              value={lifestyle.exerciseFrequency}
              onSelect={(item) =>
                updateLifestyle("exerciseFrequency", item.value as string)
              }
              searchable
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: palette.text }]}>
              Sleep Quality
            </Text>
            <Dropdown
              data={SLEEP_OPTIONS}
              placeholder="Select sleep quality"
              value={lifestyle.sleepQuality}
              onSelect={(item) =>
                updateLifestyle("sleepQuality", item.value as string)
              }
              searchable
            />
          </View>
        </View>

        <View>
          <Text style={[styles.label, { color: palette.text }]}>
            Stress Level
          </Text>
          <View
            style={[styles.track, { backgroundColor: palette.borderLight }]}
            onLayout={(e) => {
              trackWidth.current = e.nativeEvent.layout.width;
              knobX.value = (lifestyle.stress / 100) * trackWidth.current;
            }}
            {...panResponder.panHandlers}
          >
            <Animated.View
              style={[
                styles.knob,
                { backgroundColor: palette.primary },
                knobStyle,
              ]}
            />
          </View>
          <View style={styles.trackLabels}>
            <Text
              style={[styles.trackLabelText, { color: palette.textSecondary }]}
            >
              Low
            </Text>
            <Text
              style={[styles.trackLabelText, { color: palette.textSecondary }]}
            >
              Moderate
            </Text>
            <Text
              style={[styles.trackLabelText, { color: palette.textSecondary }]}
            >
              High
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={[styles.label, { color: palette.text }]}>Diet</Text>
          <Dropdown
            data={DIET_OPTIONS}
            placeholder="Select a diet"
            value={lifestyle.diet}
            onSelect={(item) => updateLifestyle("diet", item.value as string)}
            searchable
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
          <Text style={[styles.label, { color: palette.text }]}>
            Recent Life Changes
          </Text>
          <TextInput
            multiline
            value={lifestyle.recentChanges}
            onChangeText={(t) => updateLifestyle("recentChanges", t)}
            placeholder="Describe any recent changes (e.g., travel, new job, moved homes)..."
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
            onPress={() => {
              router.push("/symptoscan/Step4");
            }}
            style={({ pressed }) => [
              styles.btnPrimary,
              { backgroundColor: palette.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[styles.btnPrimaryText, { color: palette.textInverse }]}
            >
              Review Details
            </Text>
          </Pressable>
        </View>
      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 10,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  lead: {
    marginTop: 6,
    fontSize: 14.5,
    lineHeight: 20,
  },
  progressWrap: {
    marginTop: 12,
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    position: "absolute",
    left: 0,
    top: 0,
    width: "75%",
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
  },
  selector: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    fontWeight: "600",
    flexShrink: 1,
  },
  selectorChevron: {
    fontSize: 16,
    marginLeft: 12,
  },
  grid2: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  track: {
    height: 8,
    borderRadius: 4,
    marginVertical: 10,
  },
  knob: {
    position: "absolute",
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  trackLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackLabelText: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
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
  btnGhostText: {
    fontWeight: "700",
  },
  btnPrimary: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnPrimaryText: {
    fontWeight: "700",
  },
});
