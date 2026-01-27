import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import type { Language, SpreadType } from "../types/tarot";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { language, setLanguage, isPremium, togglePremium, setSpreadType } =
    useApp();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSpreadSelect = (spread: SpreadType) => {
    setSpreadType(spread);
    router.push(`/pick/${spread}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("appName")}</Text>
          <TouchableOpacity
            style={[styles.premiumBadge, isPremium && styles.premiumActive]}
            onPress={togglePremium}
          >
            <Text style={styles.premiumText}>
              {isPremium ? "★ Premium" : "Free"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectLanguage")}</Text>
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  language === lang.code && styles.languageSelected,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={styles.languageLabel}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spread Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectSpread")}</Text>
          <View style={styles.spreadOptions}>
            <TouchableOpacity
              style={styles.spreadButton}
              onPress={() => handleSpreadSelect("single_card")}
            >
              <Text style={styles.spreadIcon}>🃏</Text>
              <Text style={styles.spreadTitle}>{t("singleCard")}</Text>
              <Text style={styles.spreadDesc}>1 card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadButton}
              onPress={() => handleSpreadSelect("past_present_future")}
            >
              <Text style={styles.spreadIcon}>🃏🃏🃏</Text>
              <Text style={styles.spreadTitle}>{t("threeCards")}</Text>
              <Text style={styles.spreadDesc}>3 cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#eee",
  },
  premiumBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  premiumActive: {
    backgroundColor: "#9b59b6",
  },
  premiumText: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#888",
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#252540",
    gap: 8,
  },
  languageSelected: {
    backgroundColor: "#4a4a6a",
    borderWidth: 2,
    borderColor: "#9b59b6",
  },
  flag: {
    fontSize: 24,
  },
  languageLabel: {
    color: "#fff",
    fontSize: 16,
  },
  spreadOptions: {
    gap: 16,
  },
  spreadButton: {
    backgroundColor: "#252540",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  spreadIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  spreadTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  spreadDesc: {
    color: "#888",
    fontSize: 14,
  },
});
