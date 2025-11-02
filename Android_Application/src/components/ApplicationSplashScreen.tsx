import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { MotiText } from "moti";

const CustomSplashScreen = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) => {
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
  }, [onAnimationComplete]);

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

export default CustomSplashScreen;
