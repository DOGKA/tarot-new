import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { GradientBackground, GlassCard, PremiumPreview } from "../components/ui";
import { LinearGradient } from "expo-linear-gradient";
import type { YesNoReading } from "../types/tarot";
import Constants from "expo-constants";

// Backend API URL - dynamic based on Expo host
const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
const API_URL = `http://${host}:3001`;

// Answer colors
const getAnswerColor = (answer: string): string => {
  if (answer === "yes") return "#22c55e"; // Yeşil - Evet
  if (answer === "no") return "#ef4444"; // Kırmızı - Hayır
  return "#a855f7"; // Mor - Belirsiz
};

// Answer icons
const getAnswerIcon = (answer: string): string => {
  if (answer === "yes") return "↑";
  if (answer === "no") return "↓";
  return "◐"; // Belirsiz için yarım daire
};

// Confidence renk sistemi (netlik derecesi)
const getConfidenceColor = (confidence: number, answer: string): string => {
  // Belirsiz cevaplar için mor tonları
  if (answer === "uncertain") {
    if (confidence >= 60) return "#a855f7"; // Mor
    return "#8b5cf6"; // Koyu Mor
  }
  // Evet/Hayır için yeşil-sarı-turuncu-kırmızı
  if (confidence >= 80) return "#22c55e"; // Yeşil - Net
  if (confidence >= 65) return "#f59e0b"; // Amber - Şartlı
  if (confidence >= 50) return "#f97316"; // Turuncu - Düşük
  return "#ef4444"; // Kırmızı - Çok Düşük
};

export default function YesNoResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedCards, language, resetReading, focusArea, isPremium } = useApp();

  const [reading, setReading] = useState<YesNoReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReading = async () => {
      if (!selectedCards[0]) {
        setError("No card selected");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/reading`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            spread: "yes_no",
            focusArea,
            isPremium,
            card: {
              name: selectedCards[0].card.name,
              image: selectedCards[0].card.image, // cardKey for v2 system
              orientation: selectedCards[0].orientation,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        setReading(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, []);

  const handleNewReading = () => {
    resetReading();
    router.replace("/");
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
          <Text style={styles.loadingText}>
            {isPremium ? "Yorumunuz hazırlanıyor..." : "Yükleniyor..."}
          </Text>
        </View>
      </GradientBackground>
    );
  }

  if (error || !reading) {
    return (
      <GradientBackground>
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <Text style={styles.errorText}>Hata: {error}</Text>
            <TouchableOpacity onPress={handleNewReading}>
              <LinearGradient
                colors={["#a855f7", "#6366f1"]}
                style={styles.retryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.retryButtonText}>{t("newReading")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  // Answer display logic
  const answer = reading.answer || "uncertain";
  const answerColor = getAnswerColor(answer);
  const answerIcon = getAnswerIcon(answer);
  const isUncertain = answer === "uncertain";
  
  // Get answer text
  const getAnswerText = () => {
    if (answer === "yes") return t("yes");
    if (answer === "no") return t("no");
    return t("uncertainAnswer") || "Belirsiz";
  };
  
  // Get variant for GlassCard
  const getVariant = () => {
    if (answer === "yes") return "upright";
    if (answer === "no") return "reversed";
    return undefined; // neutral for uncertain
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{reading.title}</Text>
          <TouchableOpacity onPress={handleNewReading}>
            <Text style={styles.newReadingLink}>{t("newReading")}</Text>
          </TouchableOpacity>
        </View>

        {/* Answer Display - Clean bold design */}
        <GlassCard
          variant={getVariant()}
          style={styles.answerContainer}
        >
          <View style={[styles.answerCircle, { borderColor: answerColor, shadowColor: answerColor }]}>
            <Text style={[styles.arrowIcon, { color: answerColor }]}>
              {answerIcon}
            </Text>
          </View>
          <Text style={[styles.answerText, { color: answerColor }]}>
            {getAnswerText()}
          </Text>
          {/* Clarity Label from API */}
          {reading.clarityLabel && (
            <Text style={[styles.clarityLabel, { color: answerColor }]}>
              {reading.clarityLabel}
            </Text>
          )}
          {/* Condition Message for Uncertain */}
          {isUncertain && reading.conditionMessage && (
            <Text style={styles.conditionMessage}>
              {reading.conditionMessage}
            </Text>
          )}
        </GlassCard>

        {/* Confidence Section */}
        <GlassCard style={styles.confidenceSection}>
          <View style={styles.confidenceHeader}>
            <Text style={styles.confidenceLabel}>{t("confidence")}</Text>
            <View style={styles.confidenceValueContainer}>
              <View style={[styles.confidenceDot, { backgroundColor: getConfidenceColor(reading.confidence, answer) }]} />
              <Text style={[styles.confidenceValue, { color: getConfidenceColor(reading.confidence, answer) }]}>
                {reading.confidence}%
              </Text>
              {reading.clarityLabel && (
                <Text style={[styles.confidenceLabelText, { color: getConfidenceColor(reading.confidence, answer) }]}>
                  ({reading.clarityLabel})
                </Text>
              )}
            </View>
          </View>
          <View style={styles.confidenceBarBg}>
            <LinearGradient
              colors={[getConfidenceColor(reading.confidence, answer), getConfidenceColor(reading.confidence, answer) + "88"]}
              style={[styles.confidenceBarFill, { width: `${reading.confidence}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </GlassCard>

        {/* Focus Area Badge */}
        <View style={styles.focusBadgeContainer}>
          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>{t(reading.focusArea)}</Text>
          </View>
        </View>

        {/* Keywords */}
        {reading.keywords && reading.keywords.length > 0 && (
          <View style={styles.keywordsSection}>
            {reading.keywords.map((keyword, index) => (
              <View key={index} style={styles.keywordBadge}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Explanation */}
        <GlassCard style={styles.explanationSection}>
          <Text style={styles.explanationText}>{reading.explanation}</Text>
        </GlassCard>

        {/* Premium Preview for FREE users */}
        {!isPremium && (
          <PremiumPreview
            spreadType="yes_no"
            focusArea={reading.focusArea}
            onUnlock={() => {
              // TODO: Implement premium unlock flow
              console.log("Premium unlock requested");
            }}
          />
        )}

        {/* Premium Badge */}
        {isPremium && (
          <LinearGradient
            colors={["#a855f7", "#6366f1"]}
            style={styles.premiumBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.premiumBadgeText}>★ Premium</Text>
          </LinearGradient>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorCard: {
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  newReadingLink: {
    color: "#a855f7",
    fontSize: 14,
    fontWeight: "500",
  },
  answerContainer: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 16,
  },
  answerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  arrowIcon: {
    fontSize: 48,
    fontWeight: "bold",
  },
  answerText: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  clarityLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    textTransform: "capitalize",
  },
  conditionMessage: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 16,
  },
  confidenceSection: {
    marginBottom: 16,
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  confidenceLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  confidenceValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confidenceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  confidenceLabelText: {
    fontSize: 12,
    fontWeight: "500",
  },
  confidenceBarBg: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  focusBadgeContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  focusBadge: {
    backgroundColor: "rgba(168, 85, 247, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#a855f7",
  },
  focusBadgeText: {
    color: "#a855f7",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  keywordsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  keywordBadge: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.4)",
  },
  keywordText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  explanationSection: {
    marginBottom: 20,
  },
  explanationText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 16,
    lineHeight: 26,
  },
  premiumBadge: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
});
