import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { GradientBackground } from "../components/ui";
import { LinearGradient } from "expo-linear-gradient";
import type { Language } from "../types/tarot";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { language, setLanguage, gemstoneBalance, isPremium, togglePremium } = useApp();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.premiumBadge, isPremium && styles.premiumActive]}
            onPress={togglePremium}
          >
            <Text style={styles.premiumText}>
              {isPremium ? "★ Premium" : "Free"}
            </Text>
          </TouchableOpacity>
          <View style={styles.topBarRight}>
            <View style={styles.balanceBadge}>
              <Text style={styles.balanceText}>💎 {gemstoneBalance}</Text>
            </View>
            <TouchableOpacity style={styles.marketButton} onPress={() => router.push("/market")}>
              <Text style={styles.marketButtonText}>Market</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Mystic</Text>
          <Text style={styles.appSubtitle}>Tarot & Dream</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.languageSection}>
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
                <Text
                  style={[
                    styles.languageLabel,
                    language === lang.code && styles.languageLabelSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {/* Tarot Card */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push("/tarot")}
          >
            <LinearGradient
              colors={[
                "rgba(168, 85, 247, 0.3)",
                "rgba(99, 102, 241, 0.2)",
                "rgba(30, 20, 60, 0.8)",
              ]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.cardIcon}>✨</Text>
              <Text style={styles.cardTitle}>Tarot</Text>
              <Text style={styles.cardDescription}>
                {t("tarotWelcomeDesc")}
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{t("tarotBadge")}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Dream Coder Card */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push("/dream")}
          >
            <LinearGradient
              colors={[
                "rgba(56, 189, 248, 0.3)",
                "rgba(99, 102, 241, 0.2)",
                "rgba(30, 20, 60, 0.8)",
              ]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.cardIcon}>🌙</Text>
              <Text style={styles.cardTitle}>Dream Coder</Text>
              <Text style={styles.cardDescription}>
                {t("dreamWelcomeDesc")}
              </Text>
              <View style={[styles.cardBadge, styles.dreamBadge]}>
                <Text style={[styles.cardBadgeText, styles.dreamBadgeText]}>
                  {t("dreamBadge")}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>v4.0</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  marketButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(245, 158, 11, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.5)",
  },
  marketButtonText: {
    color: "#fbbf24",
    fontWeight: "700",
    fontSize: 13,
  },
  premiumBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
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
    fontSize: 13,
  },
  balanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  balanceText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 3,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 6,
    marginTop: 4,
    textTransform: "uppercase",
  },
  languageSection: {
    marginBottom: 32,
  },
  languageGrid: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    borderRadius: 12,
  },
  languageSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderWidth: 1,
    borderColor: "#a855f7",
  },
  flag: {
    fontSize: 20,
  },
  languageLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  languageLabelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  cardsContainer: {
    width: "100%",
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  cardGradient: {
    padding: 24,
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 280,
    marginBottom: 12,
  },
  cardBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(168, 85, 247, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  cardBadgeText: {
    color: "#c084fc",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dreamBadge: {
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    borderColor: "rgba(56, 189, 248, 0.4)",
  },
  dreamBadgeText: {
    color: "#7dd3fc",
  },
  version: {
    color: "rgba(255, 255, 255, 0.2)",
    fontSize: 12,
    marginTop: 24,
  },
});
