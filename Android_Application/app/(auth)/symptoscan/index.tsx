// import React from "react";
// import {
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import { MotiView } from "moti";
// import { FeatureItem } from "@/components/Feature-Item";
// import { Easing } from "react-native-reanimated";
// import { router } from "expo-router";

// const SymptoScan = () => {
//   const features = [
//     {
//       id: "ai",
//       icon: "🤖",
//       title: "AI-Powered Analysis",
//       description:
//         "Our advanced AI analyzes your symptoms using the latest medical knowledge.",
//       color: "#EEF2FF",
//     },
//     {
//       id: "accurate",
//       icon: "✅",
//       title: "Accurate Results",
//       description:
//         "Get reliable insights based on medical databases and AI learning.",
//       color: "#ECFDF5",
//     },
//     {
//       id: "guidance",
//       icon: "🩺",
//       title: "Healthcare Guidance",
//       description:
//         "Receive recommendations on next steps and potential treatments.",
//       color: "#F5F3FF",
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
//       />
//       <ScrollView
//         contentContainerStyle={[
//           styles.container,
//           { flex: 1, justifyContent: "center" },
//         ]}
//       >
//         <MotiView
//           from={{ opacity: 0, translateY: 12, scale: 0.98 }}
//           animate={{ opacity: 1, translateY: 0, scale: 1 }}
//           transition={{
//             type: "timing",
//             duration: 450,
//             easing: Easing.out(Easing.cubic),
//           }}
//           // style={styles.card}
//         >
//           <Text style={styles.title}>Introducing SymptomScan</Text>
//           <Text style={styles.lead}>
//             Our core technology that analyzes your symptoms and provides
//             accurate health insights.
//           </Text>
//           <View style={styles.sectionHeaderWrap}>
//             <Text style={styles.sectionHeader}>How SymptomScan Works</Text>
//           </View>
//           <View style={styles.features}>
//             {features.map((f, i) => (
//               <FeatureItem
//                 key={f.id}
//                 index={i}
//                 icon={f.icon}
//                 title={f.title}
//                 description={f.description}
//                 bubbleColor={f.color}
//               />
//             ))}
//           </View>
//           <Pressable
//             onPress={() => router.push("/symptoscan/Step1")}
//             accessibilityRole="button"
//             accessibilityLabel="Try SymptomScan"
//             style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
//           >
//             <Text style={styles.ctaText}>Try SymptomScan</Text>
//           </Pressable>
//           <Pressable
//             onPress={() => router.push("/(auth)/(tabs)/home")}
//             accessibilityRole="button"
//             accessibilityLabel="Try SymptomScan"
//             style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
//           >
//             <Text style={styles.ctaText}>Go to home</Text>
//           </Pressable>
//         </MotiView>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SymptoScan;

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#F5F7FB",
//   },
//   container: {
//     padding: 16,
//     paddingTop: 24,
//   },
//   // card: {
//   //   backgroundColor: "transparent",
//   //   borderRadius: 20,
//   //   paddingVertical: 24,
//   //   paddingHorizontal: 16,
//   //   borderWidth: 1,
//   //   borderColor: "#E5E7EB",
//   //   // subtle shadow
//   //   shadowColor: "#000",
//   //   shadowOffset: { width: 0, height: 6 },
//   //   shadowOpacity: 0.08,
//   //   shadowRadius: 12,
//   //   elevation: 4,
//   // },
//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     textAlign: "center",
//     color: "#0F172A",
//   },
//   lead: {
//     marginTop: 10,
//     textAlign: "center",
//     color: "#6B7280",
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   sectionHeaderWrap: {
//     marginTop: 22,
//     marginBottom: 6,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#0F172A",
//   },
//   features: {
//     marginTop: 2,
//   },
//   cta: {
//     alignSelf: "center",
//     marginTop: 22,
//     backgroundColor: "#0B1324",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 14,
//   },
//   ctaText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
// });
"use client";

import { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/context/theme-context";

const SymptoScan = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { palette } = useTheme();

  const steps = [
    {
      id: 1,
      icon: "🔍",
      title: "Symptom Assessment",
      description: "Select body area and describe symptoms",
    },
    {
      id: 2,
      icon: "👤",
      title: "Health Profile",
      description: "Demographics and medical history",
    },
    {
      id: 3,
      icon: "❤️",
      title: "Lifestyle Factors",
      description: "Daily habits and routines",
    },
    {
      id: 4,
      icon: "✨",
      title: "AI Analysis",
      description: "Upload reports and get insights",
    },
  ];

  const features = [
    {
      icon: "📊",
      title: "Health Score",
      description: "Comprehensive 1-100 score",
    },
    {
      icon: "🔍",
      title: "Condition Analysis",
      description: "Possible conditions insights",
    },
    {
      icon: "📄",
      title: "Medical Report",
      description: "Professional PDF report",
    },
    {
      icon: "🛡️",
      title: "Prevention Guide",
      description: "Preventive measures",
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 500,
            easing: Easing.out(Easing.cubic),
          }}
          style={[styles.heroSection, { backgroundColor: palette.primary }]}
        >
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: palette.textInverse }]}>
              ADVANCED HEALTH DIAGNOSTICS
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: palette.textInverse }]}>
            SymptomScan
          </Text>

          <Text style={[styles.heroSubtitle, { color: palette.textInverse }]}>
            AI-Powered Medical Insights in 4 Simple Steps
          </Text>

          <View style={styles.heroBadge}>
            <View
              style={[styles.dot, { backgroundColor: palette.textInverse }]}
            />
            <Text
              style={[styles.heroBadgeText, { color: palette.textInverse }]}
            >
              Get results in 4 minutes
            </Text>
          </View>

          {/* Primary CTA Button */}
          <Pressable
            onPress={() => router.push("/symptoscan/Step1")}
            style={({ pressed }) => [
              styles.heroCTA,
              { backgroundColor: palette.textInverse },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.heroCTAText, { color: palette.primary }]}>
              Start Analysis →
            </Text>
          </Pressable>
        </MotiView>

        {/* Steps Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              How It Works
            </Text>
            <View
              style={[
                styles.titleUnderline,
                { backgroundColor: palette.primary },
              ]}
            />
          </View>

          <View style={styles.stepsContainer}>
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <Pressable
                  key={step.id}
                  onPress={() => setActiveStep(index)}
                  style={[
                    styles.stepCard,
                    {
                      backgroundColor: isActive
                        ? palette.primaryBg
                        : palette.card,
                      borderColor: isActive ? palette.primary : palette.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.stepIcon,
                      {
                        backgroundColor: isActive
                          ? palette.primary
                          : palette.bgSecondary,
                      },
                    ]}
                  >
                    <Text style={styles.stepIconText}>{step.icon}</Text>
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <View
                        style={[
                          styles.stepBadge,
                          {
                            backgroundColor: isActive
                              ? palette.primary
                              : palette.bgSecondary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.stepBadgeText,
                            {
                              color: isActive
                                ? palette.textInverse
                                : palette.textMuted,
                            },
                          ]}
                        >
                          Step {step.id}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.stepTitle, { color: palette.text }]}>
                      {step.title}
                    </Text>

                    <Text
                      style={[
                        styles.stepDescription,
                        { color: isActive ? palette.text : palette.textMuted },
                      ]}
                    >
                      {step.description}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.chevron,
                      { color: isActive ? palette.primary : palette.textMuted },
                    ]}
                  >
                    →
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              What You'll Get
            </Text>
            <View
              style={[
                styles.titleUnderline,
                { backgroundColor: palette.primary },
              ]}
            />
          </View>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: palette.primaryBg },
                  ]}
                >
                  <Text style={styles.featureIconText}>{feature.icon}</Text>
                </View>

                <Text style={[styles.featureTitle, { color: palette.text }]}>
                  {feature.title}
                </Text>

                <Text
                  style={[
                    styles.featureDescription,
                    { color: palette.textMuted },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom CTA Section */}
        <View style={styles.section}>
          <View
            style={[
              styles.ctaCard,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.ctaTitle, { color: palette.text }]}>
              Ready to Begin?
            </Text>
            <Text style={[styles.ctaDescription, { color: palette.textMuted }]}>
              Get accurate health insights in 4 minutes
            </Text>

            <Pressable
              onPress={() => router.push("/symptoscan/Step1")}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: palette.primary },
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: palette.textInverse },
                ]}
              >
                Start Analysis
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/(tabs)/home")}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: palette.border,
                  backgroundColor: palette.bgSecondary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text
                style={[styles.secondaryButtonText, { color: palette.text }]}
              >
                Back to Home
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.trustText, { color: palette.textMuted }]}>
            Powered by Advanced Medical AI • Trusted by Thousands
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SymptoScan;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingBottom: 32,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.95,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  heroCTA: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroCTAText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  titleUnderline: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },

  // Steps
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  stepIconText: {
    fontSize: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: 4,
  },
  stepBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 20,
    fontWeight: "600",
  },

  // Features
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 22,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 18,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },

  // CTA
  ctaCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  ctaDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  trustText: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
  },
});
