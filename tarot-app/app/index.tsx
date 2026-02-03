import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { GradientBackground, GlassCard, SpreadCard } from "../components/ui";
import type { Language, SpreadType, FocusArea } from "../types/tarot";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

// Category colors
const COLORS = {
  general: "#a855f7",
  love: "#ec4899",
  career: "#f59e0b",
  spiritual: "#6366f1",
};

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

  // Get description based on premium status
  const getDesc = (key: string) => {
    return isPremium ? t(`${key}Premium`) : t(key);
  };

  return (
    <GradientBackground>
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

        {/* Language Selection - Clean flat design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectLanguage")}</Text>
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.7}
                style={[
                  styles.languageButton,
                  language === lang.code && styles.languageSelected,
                ]}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageLabel,
                  language === lang.code && styles.languageLabelSelected
                ]}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* General Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, { color: COLORS.general }]}>
            ✨ {t("generalCategory")}
          </Text>
          
          <SpreadCard
            title={t("singleCard")}
            description={getDesc("singleCardDesc")}
            cardCount="single"
            categoryColor={COLORS.general}
            onPress={() => handleSpreadSelect("single_card", "general")}
          />
          
          <SpreadCard
            title={t("threeCards")}
            description={getDesc("threeCardsDesc")}
            cardCount="three"
            categoryColor={COLORS.general}
            onPress={() => handleSpreadSelect("past_present_future")}
          />
          
          <SpreadCard
            title={t("yesNo")}
            description={getDesc("yesNoGeneralDesc")}
            cardCount="single"
            categoryColor={COLORS.general}
            onPress={() => handleSpreadSelect("yes_no", "general")}
          />
          
          <SpreadCard
            title={t("situationObstacleAdvice")}
            description={getDesc("situationObstacleAdviceDesc")}
            cardCount="three"
            categoryColor={COLORS.general}
            onPress={() => handleSpreadSelect("situation_obstacle_advice")}
          />
        </View>

        {/* Love Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, { color: COLORS.love }]}>
            💖 {t("loveCategory")}
          </Text>
          
          <SpreadCard
            title={t("singleCard")}
            description={getDesc("singleCardDesc")}
            cardCount="single"
            categoryColor={COLORS.love}
            onPress={() => handleSpreadSelect("single_card", "love")}
          />
          
          <SpreadCard
            title={t("yesNo")}
            description={getDesc("yesNoLoveDesc")}
            cardCount="single"
            categoryColor={COLORS.love}
            onPress={() => handleSpreadSelect("yes_no", "love")}
          />
          
          <SpreadCard
            title={t("destinysEmbrace")}
            description={getDesc("destinysEmbraceDesc")}
            cardCount="three"
            categoryColor={COLORS.love}
            onPress={() => handleSpreadSelect("destinys_embrace", "love")}
          />
          
          <SpreadCard
            title={t("loveChoice")}
            description={getDesc("loveChoiceDesc")}
            cardCount="five"
            categoryColor={COLORS.love}
            onPress={() => handleSpreadSelect("love_choice", "love")}
          />
          
          <SpreadCard
            title={t("pathToLove")}
            description={getDesc("pathToLoveDesc")}
            cardCount="five"
            categoryColor={COLORS.love}
            onPress={() => handleSpreadSelect("path_to_love", "love")}
          />
        </View>

        {/* Career Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, { color: COLORS.career }]}>
            💼 {t("careerCategory")}
          </Text>
          
          <SpreadCard
            title={t("singleCard")}
            description={getDesc("singleCardDesc")}
            cardCount="single"
            categoryColor={COLORS.career}
            onPress={() => handleSpreadSelect("single_card", "career")}
          />
          
          <SpreadCard
            title={t("yesNo")}
            description={getDesc("yesNoCareerDesc")}
            cardCount="single"
            categoryColor={COLORS.career}
            onPress={() => handleSpreadSelect("yes_no", "career")}
          />
          
          <SpreadCard
            title={t("careerClarity")}
            description={getDesc("careerClarityDesc")}
            cardCount="three"
            categoryColor={COLORS.career}
            onPress={() => handleSpreadSelect("career_clarity", "career")}
          />
          
          <SpreadCard
            title={t("careerPathGuide")}
            description={getDesc("careerPathGuideDesc")}
            cardCount="three"
            categoryColor={COLORS.career}
            onPress={() => handleSpreadSelect("career_path_guide", "career")}
          />
          
          <SpreadCard
            title={t("newBusinessExploration")}
            description={getDesc("newBusinessExplorationDesc")}
            cardCount="five"
            categoryColor={COLORS.career}
            onPress={() => handleSpreadSelect("new_business_exploration", "career")}
          />
          
          <SpreadCard
            title={t("wealthFlow")}
            description={getDesc("wealthFlowDesc")}
            cardCount="five"
            categoryColor={COLORS.career}
            onPress={() => handleSpreadSelect("wealth_flow", "career")}
          />
        </View>

        {/* Spiritual Category */}
        <View style={styles.section}>
          <Text style={[styles.categoryTitle, { color: COLORS.spiritual }]}>
            🔮 {t("spiritualCategory")}
          </Text>
          
          <SpreadCard
            title={t("singleCard")}
            description={getDesc("singleCardDesc")}
            cardCount="single"
            categoryColor={COLORS.spiritual}
            onPress={() => handleSpreadSelect("single_card", "spiritual")}
          />
          
          <SpreadCard
            title={t("yesNo")}
            description={getDesc("yesNoSpiritualDesc")}
            cardCount="single"
            categoryColor={COLORS.spiritual}
            onPress={() => handleSpreadSelect("yes_no", "spiritual")}
          />
          
          <SpreadCard
            title={t("newMoonRitual")}
            description={getDesc("newMoonRitualDesc")}
            cardCount="five"
            categoryColor={COLORS.spiritual}
            onPress={() => handleSpreadSelect("new_moon_ritual", "spiritual")}
          />
          
          <SpreadCard
            title={t("fullMoonRelease")}
            description={getDesc("fullMoonReleaseDesc")}
            cardCount="five"
            categoryColor={COLORS.spiritual}
            onPress={() => handleSpreadSelect("full_moon_release", "spiritual")}
          />
          
          <SpreadCard
            title={t("mindBodySpirit")}
            description={getDesc("mindBodySpiritDesc")}
            cardCount="three"
            categoryColor={COLORS.spiritual}
            onPress={() => handleSpreadSelect("mind_body_spirit", "spiritual")}
          />
          
          <SpreadCard
            title={t("celestialIllumination")}
            description={getDesc("celestialIlluminationDesc")}
            cardCount="three"
            categoryColor={COLORS.spiritual}
            onPress={() => handleSpreadSelect("celestial_illumination", "spiritual")}
          />
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  premiumBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  premiumActive: {
    backgroundColor: "rgba(168, 85, 247, 0.4)",
    borderColor: "#a855f7",
  },
  premiumText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 12,
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
    paddingVertical: 10,
    gap: 8,
    borderRadius: 12,
  },
  languageSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderWidth: 1,
    borderColor: "#a855f7",
  },
  flag: {
    fontSize: 24,
  },
  languageLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 15,
  },
  languageLabelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
