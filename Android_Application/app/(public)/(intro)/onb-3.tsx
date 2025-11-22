import { Pressable, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import OnboardingSlide from "@/components/OnboardingSlide";
import { palette } from "@/design/styles";

export default function Onboarding4() {
  return (
    <OnboardingSlide
      image={require("../../../assets/images/9th.png")}
      headline="Smart Meal Analysis With Just a Photo."
      index={2}
      total={3}
      skipHref="/welcome"
    >
      {/* Two pill buttons per mock */}
      <Link href="/welcome" asChild>
        <Pressable
          style={[styles.secondary, styles.pill]}
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        >
          <Text style={styles.secondaryText}>Get Started</Text>
        </Pressable>
      </Link>
    </OnboardingSlide>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: palette.primary,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondary: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  secondaryText: { color: "white", fontWeight: "700" },
});
