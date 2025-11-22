import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { palette, spacing } from "@/design/styles";
import { NButton } from "@/ui/button";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../appwriteConfig";
import { ID, Query } from "react-native-appwrite";

export default function WelcomeScreen() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function runCheck() {
      AsyncStorage.setItem("hasCompletedOnboarding", "true");

      if (!authLoaded || !userLoaded) return;
      if (!isSignedIn || !user) return setLoading(false);

      try {
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user.id)]
        );

        let userDoc = res.documents[0];
        if (!userDoc) {
          userDoc = await databases.createDocument(
            DB_ID,
            USERS_DETAILS_COLLECTION_ID,
            ID.unique(),
            {
              userId: user.id,
              email: user.primaryEmailAddress?.emailAddress || "",
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              age: 0,
              onboardingComplete: false,
              gender: null,
            }
          );
        }

        if (!isActive) return;

        if (!userDoc.onboardingComplete) {
          router.replace("/(auth)/(onboarding)/user-details");
          return;
        }

        router.replace("/home");
      } catch (err) {
        console.error("Error:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    runCheck();
    return () => {
      isActive = false;
    };
  }, [authLoaded, userLoaded, isSignedIn, user, router]);

  if (loading || !authLoaded || !userLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  // Show Welcome UI only if not signed in
  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.top}>
          <Text style={styles.brand}>
            HealthVitals<Text style={styles.brandAccent}>AI</Text>
          </Text>

          <Image
            source={require("../assets/images/HealthVitals-AI.png")}
            resizeMode="contain"
            style={styles.heroImage}
          />

          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Your personal AI-powered health & nutrition companion.
          </Text>
        </View>

        {/* Bottom Sheet */}
        <View style={styles.sheet}>
          <NButton
            title="Sign In"
            fullWidth
            style={styles.primaryBtn}
            onPress={() => router.push("/(public)/sign-in")}
          />

          <NButton
            title="Create Account"
            fullWidth
            variant="secondary"
            style={styles.secondaryBtn}
            onPress={() => router.push("/(public)/sign-up")}
          />
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },

  container: {
    flex: 1,
    backgroundColor: "#000", // darker for modern design
  },

  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  brand: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: spacing.lg,
  },
  brandAccent: { color: palette.primary },

  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 28,
    marginBottom: spacing.xl,

    // Pop-out effect
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#111",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },

  sheet: {
    backgroundColor: "#111",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: spacing.md,
    elevation: 20,
    shadowColor: "#000",
  },

  primaryBtn: {
    backgroundColor: "#6366F1",
    borderRadius: 999,
  },

  secondaryBtn: {
    borderRadius: 999,
    borderColor: "#333",
  },
});
