import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import type { YesNoReading } from "../types/tarot";

const API_URL = "http://192.168.5.123:3001";

// Confidence renk sistemi (netlik derecesi)
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 85) return "#27ae60"; // Yeşil - Çok Net
  if (confidence >= 75) return "#f1c40f"; // Sarı - İyi
  if (confidence >= 65) return "#e67e22"; // Turuncu - Orta
  return "#e74c3c"; // Kırmızı - Belirsiz
};

const getConfidenceLabel = (confidence: number, t: (key: string) => string): string => {
  if (confidence >= 85) return t("veryClean") || "Çok Net";
  if (confidence >= 75) return t("good") || "İyi";
  if (confidence >= 65) return t("moderate") || "Orta";
  return t("uncertain") || "Belirsiz";
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b59b6" />
          <Text style={styles.loadingText}>
            {isPremium ? "Yorumunuz hazırlanıyor..." : "Yükleniyor..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !reading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleNewReading}>
            <Text style={styles.retryButtonText}>{t("newReading")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isYes = reading.answer === "yes";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{reading.title}</Text>
          <TouchableOpacity onPress={handleNewReading}>
            <Text style={styles.newReadingLink}>{t("newReading")}</Text>
          </TouchableOpacity>
        </View>

        {/* Answer Display */}
        <View style={[styles.answerContainer, isYes ? styles.yesContainer : styles.noContainer]}>
          <Text style={[styles.answerEmoji, !isYes && styles.reversedCard]}>🎴</Text>
          <Text style={styles.answerText}>
            {isYes ? t("yes") : t("no")}
          </Text>
          <Text style={styles.orientationLabel}>
            {isYes ? "↑ " + t("upright") : "↓ " + t("reversed")}
          </Text>
        </View>

        {/* Confidence Bar */}
        <View style={styles.confidenceSection}>
          <View style={styles.confidenceHeader}>
            <Text style={styles.confidenceLabel}>{t("confidence")}</Text>
            <View style={styles.confidenceValueContainer}>
              <View style={[styles.confidenceDot, { backgroundColor: getConfidenceColor(reading.confidence) }]} />
              <Text style={[styles.confidenceValue, { color: getConfidenceColor(reading.confidence) }]}>
                {reading.confidence}%
              </Text>
              <Text style={[styles.confidenceLabelText, { color: getConfidenceColor(reading.confidence) }]}>
                ({getConfidenceLabel(reading.confidence, t)})
              </Text>
            </View>
          </View>
          <View style={styles.confidenceBarBg}>
            <View
              style={[
                styles.confidenceBarFill,
                { width: `${reading.confidence}%`, backgroundColor: getConfidenceColor(reading.confidence) },
              ]}
            />
          </View>
        </View>

        {/* Focus Area Badge */}
        <View style={styles.focusBadge}>
          <Text style={styles.focusBadgeText}>{t(reading.focusArea)}</Text>
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
        <View style={styles.explanationSection}>
          <Text style={styles.explanationText}>{reading.explanation}</Text>
        </View>

        {/* Premium Badge */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>★ Premium</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#9b59b6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  newReadingLink: {
    color: "#9b59b6",
    fontSize: 14,
  },
  answerContainer: {
    alignItems: "center",
    padding: 32,
    borderRadius: 20,
    marginBottom: 24,
  },
  yesContainer: {
    backgroundColor: "rgba(39, 174, 96, 0.2)",
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  noContainer: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  answerEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  reversedCard: {
    transform: [{ rotate: "180deg" }],
  },
  answerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  orientationLabel: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 8,
  },
  confidenceSection: {
    marginBottom: 20,
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  confidenceLabel: {
    color: "#888",
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
    backgroundColor: "#333",
    borderRadius: 6,
    overflow: "hidden",
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  focusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#3a3a5a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  focusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  keywordsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  keywordBadge: {
    backgroundColor: "#4a3f6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    color: "#ddd",
    fontSize: 13,
  },
  explanationSection: {
    backgroundColor: "#252540",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  explanationText: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },
  premiumBadge: {
    alignSelf: "center",
    backgroundColor: "#9b59b6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  premiumBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
