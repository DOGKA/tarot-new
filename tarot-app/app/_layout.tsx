import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import i18n from "../i18n";
import { AppProvider } from "../context/AppContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <AppProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="pick/[spread]" options={{ headerShown: false }} />
            <Stack.Screen name="result" options={{ headerShown: false }} />
            <Stack.Screen name="premium-result" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </AppProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
