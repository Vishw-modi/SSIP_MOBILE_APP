import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { MotiText } from "moti";

const SplashScreen = ({ onAnimationComplete }) => {
  const [stage, setStage] = useState("healthVitals");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("showAI"), 1200); // show AI
    const t2 = setTimeout(() => setStage("zoomV"), 2200); // zoom V
    const t3 = setTimeout(() => {
      onAnimationComplete && onAnimationComplete();
    }, 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.column}>
        {/* HEALTH + V + ITALS */}
        <View style={styles.textRow}>
          <MotiText
            style={styles.mainText}
            animate={{
              opacity: stage === "zoomV" ? 0 : 1, // fade out when zooming
            }}
            from={{ opacity: 0 }}
            transition={{ type: "timing", duration: 600 }}
          >
            HEALTH
          </MotiText>

          <MotiText
            style={[styles.mainText, styles.vLetter]}
            animate={{
              scale: stage === "zoomV" ? 80 : 1,
              opacity: 1, // always visible during zoom
            }}
            from={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "timing", duration: 1500 }}
          >
            V
          </MotiText>

          <MotiText
            style={styles.mainText}
            animate={{
              opacity: stage === "zoomV" ? 0 : 1, // fade out when zooming
            }}
            from={{ opacity: 0 }}
            transition={{ type: "timing", duration: 600 }}
          >
            ITALS
          </MotiText>
        </View>

        {/* AI text */}
        <MotiText
          style={styles.aiText}
          animate={{
            opacity: stage === "showAI" ? 1 : 0, // visible only in showAI stage
            translateY: stage === "showAI" ? 0 : 20,
            scale: stage === "showAI" ? 1 : 0.9,
          }}
          transition={{ type: "timing", duration: 700 }}
        >
          AI
        </MotiText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    alignItems: "center",
    justifyContent: "center",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 2,
  },
  vLetter: {
    fontSize: 42,
    fontWeight: "900",
    color: "#00D4FF",
    marginHorizontal: 4,
  },
  aiText: {
    fontSize: 38,
    fontWeight: "700",
    color: "#00D4FF",
    letterSpacing: 3,
    marginTop: 10,
  },
});

export default SplashScreen;
// PatientSummary.tsx
// import React from "react";
// import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
// import { SymptomProvider, useSymptoms } from "../../../context/symptom-context"; // adjust path

// const PatientSummaryContent = () => {
//   const { demographics, lifestyle, selectedSymptoms, resetAll } = useSymptoms();

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Patient Summary</Text>

//       <View style={styles.section}>
//         <Text style={styles.label}>Age:</Text>
//         <Text style={styles.value}>{demographics?.age || "N/A"}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Gender:</Text>
//         <Text style={styles.value}>{demographics?.gender || "N/A"}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Height:</Text>
//         <Text style={styles.value}>{demographics?.heightCm} cm</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Weight:</Text>
//         <Text style={styles.value}>{demographics?.weightKg} kg</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Conditions:</Text>
//         <Text style={styles.value}>
//           {demographics?.conditions?.length
//             ? demographics.conditions.join(", ")
//             : "None"}
//         </Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Symptoms:</Text>
//         <Text style={styles.value}>
//           {selectedSymptoms?.length
//             ? selectedSymptoms.map((s) => s.label).join(", ")
//             : "None"}
//         </Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Exercise:</Text>
//         <Text style={styles.value}>
//           {lifestyle?.exerciseFrequency || "N/A"}
//         </Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Stress:</Text>
//         <Text style={styles.value}>{lifestyle?.stress || "N/A"}</Text>
//       </View>

//       <Button title="Reset" onPress={resetAll} />
//     </ScrollView>
//   );
// };

// export default function PatientSummary() {
//   return (
//     <SymptomProvider>
//       <PatientSummaryContent />
//     </SymptomProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//     color: "#333",
//   },
//   section: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#444",
//   },
//   value: {
//     fontSize: 16,
//     color: "#666",
//   },
// });
