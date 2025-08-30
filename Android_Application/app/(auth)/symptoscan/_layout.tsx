import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SymptomProvider } from "@/context/symptom-context";
import { useTheme } from "@/context/theme-context";
import { Text, View } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import { ResultProvider } from "@/context/result-context";

export default function CoreLayout() {
  const { palette } = useTheme();
  return (
    <SafeAreaProvider>
      <ResultProvider>
        <SymptomProvider>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: palette.bg,
              },
              headerStyle: {
                backgroundColor: palette.card,
                // height is not valid here, so remove it
              },
              headerStatusBarHeight: 0, // removes top safe area padding
              headerTintColor: palette.text,
              headerTitleStyle: {
                color: palette.text,
                fontWeight: "600",
              },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="Step1"
              options={{
                header: ({ navigation, options }) => (
                  <View
                    style={{
                      height: 50,
                      backgroundColor: palette.card,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    <HeaderBackButton
                      onPress={navigation.goBack}
                      tintColor={palette.text}
                    />
                    <Text
                      style={{
                        color: palette.text,
                        fontWeight: "600",
                        marginLeft: 8,
                      }}
                    >
                      {"Step 1"}
                    </Text>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Step2"
              options={{
                header: ({ navigation, options }) => (
                  <View
                    style={{
                      height: 50,
                      backgroundColor: palette.card,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    <HeaderBackButton
                      onPress={navigation.goBack}
                      tintColor={palette.text}
                    />
                    <Text
                      style={{
                        color: palette.text,
                        fontWeight: "600",
                        marginLeft: 8,
                      }}
                    >
                      {"Step 2"}
                    </Text>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Step3"
              options={{
                header: ({ navigation, options }) => (
                  <View
                    style={{
                      height: 50,
                      backgroundColor: palette.card,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    <HeaderBackButton
                      onPress={navigation.goBack}
                      tintColor={palette.text}
                    />
                    <Text
                      style={{
                        color: palette.text,
                        fontWeight: "600",
                        marginLeft: 8,
                      }}
                    >
                      {"Step 3"}
                    </Text>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Step4"
              options={{
                header: ({ navigation, options }) => (
                  <View
                    style={{
                      height: 50,
                      backgroundColor: palette.card,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    <HeaderBackButton
                      onPress={navigation.goBack}
                      tintColor={palette.text}
                    />
                    <Text
                      style={{
                        color: palette.text,
                        fontWeight: "600",
                        marginLeft: 8,
                      }}
                    >
                      {"Step 4"}
                    </Text>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Step5"
              options={{
                headerShown: false,
                header: ({ navigation, options }) => (
                  <View
                    style={{
                      height: 50,
                      backgroundColor: palette.card,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    <HeaderBackButton
                      onPress={navigation.goBack}
                      tintColor={palette.text}
                    />
                    <Text
                      style={{
                        color: palette.text,
                        fontWeight: "600",
                        marginLeft: 8,
                      }}
                    >
                      {"Step 5"}
                    </Text>
                  </View>
                ),
              }}
            />
          </Stack>
        </SymptomProvider>
      </ResultProvider>
    </SafeAreaProvider>
  );
}
