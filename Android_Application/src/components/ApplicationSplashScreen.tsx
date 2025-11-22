// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, StatusBar } from "react-native";
// import { MotiText } from "moti";

// const CustomSplashScreen = ({
//   onAnimationComplete,
// }: {
//   onAnimationComplete: () => void;
// }) => {
//   const [stage, setStage] = useState("healthVitals");

//   useEffect(() => {
//     const t1 = setTimeout(() => setStage("showAI"), 1200); // show AI
//     const t2 = setTimeout(() => setStage("zoomV"), 2200); // zoom V
//     const t3 = setTimeout(() => {
//       onAnimationComplete && onAnimationComplete();
//     }, 3700);

//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//       clearTimeout(t3);
//     };
//   }, [onAnimationComplete]);

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />

//       <View style={styles.column}>
//         {/* HEALTH + V + ITALS */}
//         <View style={styles.textRow}>
//           <MotiText
//             style={styles.mainText}
//             animate={{
//               opacity: stage === "zoomV" ? 0 : 1, // fade out when zooming
//             }}
//             from={{ opacity: 0 }}
//             transition={{ type: "timing", duration: 600 }}
//           >
//             HEALTH
//           </MotiText>

//           <MotiText
//             style={[styles.mainText, styles.vLetter]}
//             animate={{
//               scale: stage === "zoomV" ? 80 : 1,
//               opacity: 1, // always visible during zoom
//             }}
//             from={{ scale: 0.8, opacity: 0 }}
//             transition={{ type: "timing", duration: 1500 }}
//           >
//             V
//           </MotiText>

//           <MotiText
//             style={styles.mainText}
//             animate={{
//               opacity: stage === "zoomV" ? 0 : 1, // fade out when zooming
//             }}
//             from={{ opacity: 0 }}
//             transition={{ type: "timing", duration: 600 }}
//           >
//             ITALS
//           </MotiText>
//         </View>

//         {/* AI text */}
//         <MotiText
//           style={styles.aiText}
//           animate={{
//             opacity: stage === "showAI" ? 1 : 0, // visible only in showAI stage
//             translateY: stage === "showAI" ? 0 : 20,
//             scale: stage === "showAI" ? 1 : 0.9,
//           }}
//           transition={{ type: "timing", duration: 700 }}
//         >
//           AI
//         </MotiText>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   column: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   textRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   mainText: {
//     fontSize: 42,
//     fontWeight: "800",
//     color: "#FFF",
//     letterSpacing: 2,
//   },
//   vLetter: {
//     fontSize: 42,
//     fontWeight: "900",
//     color: "#00D4FF",
//     marginHorizontal: 4,
//   },
//   aiText: {
//     fontSize: 38,
//     fontWeight: "700",
//     color: "#00D4FF",
//     letterSpacing: 3,
//     marginTop: 10,
//   },
// });

// export default CustomSplashScreen;
"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { MotiView, MotiText } from "moti";
import { Easing } from "react-native-reanimated";

const CustomSplashScreen = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100); // Show H and V
    const t2 = setTimeout(() => setStage(2), 100); // Expand to HealthVitals
    const t3 = setTimeout(() => setStage(3), 2000); // Show lines
    const t4 = setTimeout(() => {
      onAnimationComplete && onAnimationComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.logoContainer}>
        {/* Stage 2: Expand to HealthVitals */}
        {stage >= 2 && (
          <View style={styles.slidingContainer}>
            {/* "Healt" expands from H to left */}
            <MotiView
              from={{ width: 0, translateX: 20 }}
              animate={{ width: 155, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 700,
                easing: Easing.out(Easing.cubic),
              }}
              delay={900}
              style={{ overflow: "hidden", alignItems: "flex-end" }}
            >
              <MotiText
                from={{ opacity: 0, translateX: 30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: "timing",
                  duration: 700,
                  easing: Easing.out(Easing.cubic),
                }}
                delay={900}
                style={styles.slidinghelt}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                Healt
              </MotiText>
            </MotiView>

            {/* "h" in center */}
            <MotiText
              style={styles.slidingcenter}
              from={{ scale: 0.9, rotate: "0deg" }}
              animate={{ scale: 1, rotate: "10deg" }}
              transition={{ type: "timing", duration: 600 }}
              delay={900}
            >
              hV
            </MotiText>

            {/* "Vitals" expands from V to right */}
            <MotiView
              from={{ width: 0, translateX: -20 }}
              animate={{ width: 150, translateX: 0 }}
              transition={{
                type: "timing",
                duration: 700,
                easing: Easing.out(Easing.cubic),
              }}
              delay={900}
              style={{
                overflow: "hidden",
                alignItems: "flex-start",
                flexShrink: 0,
              }}
            >
              <MotiText
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: "timing",
                  duration: 700,
                  easing: Easing.out(Easing.cubic),
                }}
                delay={900}
                style={[styles.slidingitals, { textAlign: "left" }]}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                itals
              </MotiText>
            </MotiView>
          </View>
        )}

        {/* Stage 3: Lines
         */}
        {stage >= 3 && (
          <>
            {/* Top line */}
            <MotiView
              style={styles.lineTop}
              from={{ width: 0, opacity: 0 }}
              animate={{ width: 150, opacity: 0.9 }}
              transition={{ type: "timing", duration: 700 }}
            />
            <MotiView
              style={styles.lineBottom}
              from={{ width: 0, opacity: 0 }}
              animate={{ width: 150, opacity: 0.9 }}
              transition={{ type: "timing", duration: 700 }}
            />
          </>
        )}
      </View>

      {/* Tagline */}
      {stage >= 3 && (
        <MotiText
          style={styles.tagline}
          from={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ type: "timing", duration: 500, delay: 300 }}
        >
          Your Pocket Health Expert
        </MotiText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#14B8A6",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
  },

  slidingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  slidingcenter: {
    backgroundColor: "#FFFFFF",
    color: "#14B8A6", // for the "hV" text

    zIndex: 999,
    fontSize: 56,
    fontWeight: "700",
    letterSpacing: 1,
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  lineTop: {
    position: "absolute",
    top: -50,
    left: "50%",
    height: 2,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -70 }],
  },
  lineBottom: {
    position: "absolute",
    bottom: -50,
    left: "50%",
    height: 2,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -60 }],
  },
  tagline: {
    position: "absolute",
    bottom: 80,
    fontSize: 12,
    fontWeight: "300",
    color: "#FFFFFF",
    letterSpacing: 2,
  },

  slidinghelt: {
    zIndex: 600,
    fontSize: 56,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  slidingitals: {
    zIndex: 800,
    fontSize: 56,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});

export default CustomSplashScreen;
