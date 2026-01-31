import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import type { Language, SpreadType, FocusArea } from "../types/tarot";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { language, setLanguage, isPremium, togglePremium, setSpreadType, setFocusArea } =
    useApp();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSpreadSelect = (spread: SpreadType, focus: FocusArea = "general") => {
    setSpreadType(spread);
    setFocusArea(focus);
    router.push(`/pick/${spread}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        {/* General Category */}
        <View style={styles.section}>
          <Text style={styles.categoryTitle}>{t("generalCategory")}</Text>
          <View style={styles.spreadGrid}>
            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("single_card", "general")}
            >
              <Text style={styles.spreadTitle}>{t("singleCard")}</Text>
              <Text style={styles.spreadDesc}>{t("oneCard")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("past_present_future")}
            >
              <Text style={styles.spreadTitle}>{t("threeCards")}</Text>
              <Text style={styles.spreadDesc}>{t("threeCardsCount")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("yes_no")}
            >
              <Text style={styles.spreadTitle}>{t("yesNo")}</Text>
              <Text style={styles.spreadDesc}>{t("oneCard")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("situation_obstacle_advice")}
            >
              <Text style={styles.spreadTitle}>{t("situationObstacleAdvice")}</Text>
              <Text style={styles.spreadDesc}>{t("threeCardsCount")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Love Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, styles.loveCategory]}>{t("loveCategory")}</Text>
          <View style={styles.spreadGrid}>
            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("single_card", "love")}
            >
              <Text style={styles.spreadTitle}>{t("singleCard")}</Text>
              <Text style={styles.spreadDesc}>{t("oneCard")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("destinys_embrace", "love")}
            >
              <Text style={styles.spreadTitle}>{t("destinysEmbrace")}</Text>
              <Text style={styles.spreadDesc}>{t("threeCardsCount")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("love_choice", "love")}
            >
              <Text style={styles.spreadTitle}>{t("loveChoice")}</Text>
              <Text style={styles.spreadDesc}>{t("fiveCards")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("path_to_love", "love")}
            >
              <Text style={styles.spreadTitle}>{t("pathToLove")}</Text>
              <Text style={styles.spreadDesc}>{t("fiveCards")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Career Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, styles.careerCategory]}>{t("careerCategory")}</Text>
          <View style={styles.spreadGrid}>
            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("single_card", "career")}
            >
              <Text style={styles.spreadTitle}>{t("singleCard")}</Text>
              <Text style={styles.spreadDesc}>{t("oneCard")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spiritual Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, styles.spiritualCategory]}>{t("spiritualCategory")}</Text>
          <View style={styles.spreadGrid}>
            <TouchableOpacity
              style={styles.spreadCard}
              onPress={() => handleSpreadSelect("single_card", "spiritual")}
            >
              <Text style={styles.spreadTitle}>{t("singleCard")}</Text>
              <Text style={styles.spreadDesc}>{t("oneCard")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
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
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9b59b6",
    marginBottom: 16,
  },
  loveCategory: {
    color: "#e74c3c",
  },
  careerCategory: {
    color: "#3498db",
  },
  spiritualCategory: {
    color: "#9b59b6",
  },
  spreadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  spreadCard: {
    backgroundColor: "#252540",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "31%",
    minWidth: 100,
  },
  spreadTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  spreadDesc: {
    color: "#888",
    fontSize: 12,
  },
});
