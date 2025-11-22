import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { useRouter, RelativePathString } from "expo-router";
import { palette, spacing, typography } from "@/design/styles";

type Props = {
  image: ImageSourcePropType;
  headline: string;
  body?: string;
  index: number;
  total: number;
  nextHref?: string;
  skipHref?: string;
  children?: React.ReactNode;
};

export default function OnboardingSlide({
  image,
  headline,
  body,
  index,
  total,
  nextHref,
  skipHref,
  children,
}: Props) {
  const router = useRouter();
  const dots = Array.from({ length: total }, (_, i) => i);

  return (
    <View style={styles.root}>
      {/* Background */}
      <Image source={image} style={styles.bg} />
      <View style={styles.gradient} />

      <View style={styles.content}>
        <Text style={styles.headline}>{headline}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}

        {/* Dots */}
        <View style={styles.dotsRow}>
          {dots.map((d) => (
            <View
              key={d}
              style={[styles.dot, d === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {skipHref ? (
            <Pressable onPress={() => router.replace(skipHref as any)}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View />
          )}

          {children ? (
            <View style={{ width: 70 }} />
          ) : nextHref ? (
            <Pressable
              onPress={() => router.replace(nextHref as any)}
              style={styles.nextBtn}
            >
              <Text style={styles.nextText}>Next</Text>
            </Pressable>
          ) : (
            <View style={{ width: 70 }} />
          )}
        </View>

        {children && <View style={styles.customCta}>{children}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  bg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 28,
  },

  headline: {
    ...typography.title,
    color: "white",
    textAlign: "left",
    marginBottom: 8,
  },

  body: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    marginBottom: 30,
  },

  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
    alignSelf: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    backgroundColor: "white",
    width: 10,
    height: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skip: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
  },

  nextBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  nextText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  customCta: {
    marginTop: 20,
  },
});
