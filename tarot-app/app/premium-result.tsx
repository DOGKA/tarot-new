import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { useReading } from "../hooks/useReading";
import type { SingleCardReading, ThreeCardReading } from "../types/tarot";

export default function PremiumResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedCards, spreadType, language, resetReading, focusArea } = useApp();
  const { loading, error, getSingleCardReading, getThreeCardReading, resetPremiumLogs } =
    useReading();

  const [singleReading, setSingleReading] = useState<SingleCardReading | null>(
    null
  );
  const [threeReading, setThreeReading] = useState<ThreeCardReading | null>(
    null
  );
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchReading = async () => {
      if (spreadType === "single_card" && selectedCards[0]) {
        const reading = await getSingleCardReading(
          language,
          selectedCards[0],
          focusArea
        );
        setSingleReading(reading);
      } else if (spreadType === "past_present_future" && selectedCards.length === 3) {
        const reading = await getThreeCardReading(language, selectedCards);
        setThreeReading(reading);
      }
    };

    fetchReading();
  }, []);

  const handleNewReading = () => {
    resetReading();
    router.replace("/");
  };

  const handleResetLogs = () => {
    Alert.alert(
      t("resetLogsTitle"),
      t("resetLogsConfirm"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("reset"),
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            const ok = await resetPremiumLogs();
            setResetting(false);
            if (!ok) {
              Alert.alert(t("resetLogsFailedTitle"), t("resetLogsFailedBody"));
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b59b6" />
          <Text style={styles.loadingText}>Yorumunuz hazırlanıyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
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

  // Single Card Reading
  if (spreadType === "single_card" && singleReading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{singleReading.title}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNewReading}>
                <Text style={styles.newReadingLink}>{t("newReading")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResetLogs} disabled={resetting}>
                <Text style={styles.resetLink}>
                  {resetting ? t("resetting") : t("reset")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overall */}
          <View style={styles.overallSection}>
            <Text style={styles.overallText}>{singleReading.overall}</Text>
          </View>

          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>{t(singleReading.focusArea)}</Text>
          </View>

          {/* Deep Reading */}
          <View style={styles.deepReadingSection}>
            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>Deep Dive</Text>
              <Text style={styles.readingText}>{singleReading.deepDive}</Text>
            </View>

            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>🌑 Shadow</Text>
              <Text style={styles.readingText}>{singleReading.shadow}</Text>
            </View>

            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>➡️ {t("nextStep")}</Text>
              <Text style={styles.readingText}>{singleReading.nextStep}</Text>
            </View>

            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>📝 {t("journal")}</Text>
              <Text style={[styles.readingText, styles.journalText]}>
                {singleReading.journal}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Three Card Reading
  if (spreadType === "past_present_future" && threeReading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{threeReading.title}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNewReading}>
                <Text style={styles.newReadingLink}>{t("newReading")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResetLogs} disabled={resetting}>
                <Text style={styles.resetLink}>
                  {resetting ? t("resetting") : t("reset")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overall */}
          <View style={styles.overallSection}>
            <Text style={styles.overallText}>{threeReading.overall}</Text>
          </View>

          {/* Throughline */}
          <View style={styles.throughlineSection}>
            <Text style={styles.throughlineLabel}>Kırmızı İp</Text>
            <Text style={styles.throughlineText}>{threeReading.throughline}</Text>
          </View>

          {/* Story */}
          <View style={styles.storySection}>
            <Text style={styles.storyLabel}>Hikaye</Text>
            <Text style={styles.storyText}>{threeReading.story}</Text>
          </View>

          {/* Beats */}
          <View style={styles.beatsSection}>
            <Text style={styles.sectionTitle}>Zaman Çizgisi</Text>
            <View style={styles.beatCard}>
              <Text style={styles.beatLabel}>{t("past")}</Text>
              <Text style={styles.beatText}>{threeReading.beats.past}</Text>
            </View>
            <View style={styles.beatCard}>
              <Text style={styles.beatLabel}>{t("present")}</Text>
              <Text style={styles.beatText}>{threeReading.beats.present}</Text>
            </View>
            <View style={styles.beatCard}>
              <Text style={styles.beatLabel}>{t("future")}</Text>
              <Text style={styles.beatText}>{threeReading.beats.future}</Text>
            </View>
          </View>

          {/* Choice */}
          <View style={styles.choiceSection}>
            <Text style={styles.sectionTitle}>Seçim</Text>
            <View style={styles.choiceCard}>
              <Text style={styles.choiceLabel}>Yol A</Text>
              <Text style={styles.choiceText}>{threeReading.choice.pathA}</Text>
            </View>
            <View style={styles.choiceCard}>
              <Text style={styles.choiceLabel}>Yol B</Text>
              <Text style={styles.choiceText}>{threeReading.choice.pathB}</Text>
            </View>
          </View>

          {/* Meta Info */}
          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Mood</Text>
                <Text style={styles.metaValue}>{threeReading.mood}</Text>
              </View>
            </View>

            <View style={styles.keywordsRow}>
              {threeReading.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Next Step */}
          <View style={styles.nextStepSection}>
            <Text style={styles.nextStepLabel}>Sonraki Adım</Text>
            <Text style={styles.nextStepText}>{threeReading.nextStep}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  newReadingLink: {
    color: "#9b59b6",
    fontSize: 14,
  },
  resetLink: {
    color: "#e74c3c",
    fontSize: 14,
  },
  overallSection: {
    padding: 16,
    backgroundColor: "#252540",
    margin: 16,
    borderRadius: 12,
  },
  overallText: {
    color: "#eee",
    fontSize: 16,
    lineHeight: 24,
  },
  focusBadge: {
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#3a3a5a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  focusBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  deepReadingSection: {
    padding: 16,
    gap: 12,
  },
  readingCard: {
    backgroundColor: "#252540",
    borderRadius: 12,
    padding: 16,
  },
  readingLabel: {
    color: "#9b59b6",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  readingText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
  },
  journalText: {
    fontStyle: "italic",
  },
  throughlineSection: {
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: "#3a2f5b",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#9b59b6",
  },
  throughlineLabel: {
    color: "#9b59b6",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  throughlineText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
  },
  storySection: {
    padding: 16,
    margin: 16,
    backgroundColor: "#252540",
    borderRadius: 12,
  },
  storyLabel: {
    color: "#9b59b6",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  storyText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 24,
  },
  beatsSection: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  beatCard: {
    backgroundColor: "#252540",
    borderRadius: 12,
    padding: 16,
  },
  beatLabel: {
    color: "#9b59b6",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  beatText: {
    color: "#ccc",
    fontSize: 14,
  },
  choiceSection: {
    padding: 16,
    gap: 12,
  },
  choiceCard: {
    backgroundColor: "#252540",
    borderRadius: 12,
    padding: 16,
  },
  choiceLabel: {
    color: "#27ae60",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  choiceText: {
    color: "#ccc",
    fontSize: 14,
  },
  metaSection: {
    padding: 16,
    margin: 16,
    backgroundColor: "#252540",
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    color: "#888",
    fontSize: 10,
    marginBottom: 4,
  },
  metaValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  keywordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  keywordBadge: {
    backgroundColor: "#4a3f6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    color: "#fff",
    fontSize: 12,
  },
  nextStepSection: {
    padding: 16,
    margin: 16,
    backgroundColor: "#27ae60",
    borderRadius: 12,
  },
  nextStepLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  nextStepText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
