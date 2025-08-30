import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CaltrackProvider } from "@/context/caltrack-context";

export default function CoreLayout() {
  return (
    <SafeAreaProvider>
      <CaltrackProvider>
        <Slot />
      </CaltrackProvider>
    </SafeAreaProvider>
  );
}
