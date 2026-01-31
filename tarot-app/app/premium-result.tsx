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
import type { SingleCardReading, ThreeCardReading, SOAReading, DestinysEmbraceReading, LoveChoiceReading, PathToLoveReading } from "../types/tarot";

export default function PremiumResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedCards, spreadType, language, resetReading, focusArea } = useApp();
  const { loading, error, getSingleCardReading, getThreeCardReading, getSOAReading, getDestinysEmbraceReading, getLoveChoiceReading, getPathToLoveReading, resetPremiumLogs } =
    useReading();

  const [singleReading, setSingleReading] = useState<SingleCardReading | null>(
    null
  );
  const [threeReading, setThreeReading] = useState<ThreeCardReading | null>(
    null
  );
  const [soaReading, setSOAReading] = useState<SOAReading | null>(null);
  const [destinyReading, setDestinyReading] = useState<DestinysEmbraceReading | null>(null);
  const [loveChoiceReading, setLoveChoiceReading] = useState<LoveChoiceReading | null>(null);
  const [pathToLoveReading, setPathToLoveReading] = useState<PathToLoveReading | null>(null);
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
      } else if (spreadType === "situation_obstacle_advice" && selectedCards.length === 3) {
        const reading = await getSOAReading(language, selectedCards);
        setSOAReading(reading);
      } else if (spreadType === "destinys_embrace" && selectedCards.length === 3) {
        const reading = await getDestinysEmbraceReading(language, selectedCards);
        setDestinyReading(reading);
      } else if (spreadType === "love_choice" && selectedCards.length === 5) {
        const reading = await getLoveChoiceReading(language, selectedCards);
        setLoveChoiceReading(reading);
      } else if (spreadType === "path_to_love" && selectedCards.length === 5) {
        const reading = await getPathToLoveReading(language, selectedCards);
        setPathToLoveReading(reading);
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
              <Text style={styles.readingLabel}>{t("deepDive")}</Text>
              <Text style={styles.readingText}>{singleReading.deepDive}</Text>
            </View>

            <View style={styles.readingCard}>
              <Text style={styles.readingLabel}>🌑 {t("shadow")}</Text>
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
            <Text style={styles.throughlineLabel}>{t("throughline")}</Text>
            <Text style={styles.throughlineText}>{threeReading.throughline}</Text>
          </View>

          {/* Story */}
          <View style={styles.storySection}>
            <Text style={styles.storyLabel}>{t("story")}</Text>
            <Text style={styles.storyText}>{threeReading.story}</Text>
          </View>

          {/* Beats */}
          <View style={styles.beatsSection}>
            <Text style={styles.sectionTitle}>{t("timeline")}</Text>
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
            <Text style={styles.sectionTitle}>{t("decisionFrame")}</Text>
            <View style={styles.choiceCard}>
              <Text style={styles.choiceLabel}>{t("pathA")}</Text>
              <Text style={styles.choiceText}>{threeReading.choice.pathA}</Text>
            </View>
            <View style={styles.choiceCard}>
              <Text style={styles.choiceLabel}>{t("pathB")}</Text>
              <Text style={styles.choiceText}>{threeReading.choice.pathB}</Text>
            </View>
          </View>

          {/* Meta Info */}
          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t("emotionalTone")}</Text>
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
            <Text style={styles.nextStepLabel}>{t("actionStep")}</Text>
            <Text style={styles.nextStepText}>{threeReading.nextStep}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // SOA Reading
  if (spreadType === "situation_obstacle_advice" && soaReading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{soaReading.title}</Text>
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
            <Text style={styles.overallText}>{soaReading.overall}</Text>
          </View>

          {/* Beats - SOA */}
          <View style={styles.beatsSection}>
            <View style={styles.beatCard}>
              <Text style={styles.beatLabel}>{t("situation")}</Text>
              <Text style={styles.beatText}>{soaReading.beats.situation}</Text>
            </View>
            <View style={[styles.beatCard, styles.obstacleCard]}>
              <Text style={[styles.beatLabel, styles.obstacleLabel]}>{t("obstacle")}</Text>
              <Text style={styles.beatText}>{soaReading.beats.obstacle}</Text>
            </View>
            <View style={[styles.beatCard, styles.adviceCard]}>
              <Text style={[styles.beatLabel, styles.adviceLabel]}>{t("advice")}</Text>
              <Text style={styles.beatText}>{soaReading.beats.advice}</Text>
            </View>
          </View>

          {/* Next Step */}
          <View style={styles.nextStepSection}>
            <Text style={styles.nextStepLabel}>{t("nextStep")}</Text>
            <Text style={styles.nextStepText}>{soaReading.nextStep}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Destiny's Embrace Reading
  if (spreadType === "destinys_embrace" && destinyReading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{destinyReading.title}</Text>
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
            <Text style={styles.overallText}>{destinyReading.overall}</Text>
          </View>

          {/* Beats */}
          <View style={styles.beatsSection}>
            <View style={[styles.beatCard, styles.destinyCard]}>
              <Text style={[styles.beatLabel, styles.destinyLabel]}>{t("destiny")}</Text>
              <Text style={styles.beatText}>{destinyReading.beats.destiny}</Text>
            </View>
            <View style={[styles.beatCard, styles.pathCard]}>
              <Text style={[styles.beatLabel, styles.pathLabel]}>{t("path")}</Text>
              <Text style={styles.beatText}>{destinyReading.beats.path}</Text>
            </View>
            <View style={[styles.beatCard, styles.unionCard]}>
              <Text style={[styles.beatLabel, styles.unionLabel]}>{t("union")}</Text>
              <Text style={styles.beatText}>{destinyReading.beats.union}</Text>
            </View>
          </View>

          {/* Keywords */}
          <View style={styles.metaSection}>
            <View style={styles.keywordsRow}>
              {destinyReading.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Next Step */}
          <View style={styles.nextStepSection}>
            <Text style={styles.nextStepLabel}>{t("nextStep")}</Text>
            <Text style={styles.nextStepText}>{destinyReading.nextStep}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Love Choice Reading
  if (spreadType === "love_choice" && loveChoiceReading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{loveChoiceReading.title}</Text>
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
            <Text style={styles.overallText}>{loveChoiceReading.overall}</Text>
          </View>

          {/* Beats - 5 cards */}
          <View style={styles.beatsSection}>
            <View style={[styles.beatCard, styles.optionACard]}>
              <Text style={[styles.beatLabel, styles.optionALabel]}>{t("optionA")}</Text>
              <Text style={styles.beatText}>{loveChoiceReading.beats.optionA}</Text>
            </View>
            <View style={[styles.beatCard, styles.optionAOutcomeCard]}>
              <Text style={[styles.beatLabel, styles.optionAOutcomeLabel]}>{t("optionA_outcome")}</Text>
              <Text style={styles.beatText}>{loveChoiceReading.beats.optionA_outcome}</Text>
            </View>
            <View style={[styles.beatCard, styles.optionBCard]}>
              <Text style={[styles.beatLabel, styles.optionBLabel]}>{t("optionB")}</Text>
              <Text style={styles.beatText}>{loveChoiceReading.beats.optionB}</Text>
            </View>
            <View style={[styles.beatCard, styles.optionBOutcomeCard]}>
              <Text style={[styles.beatLabel, styles.optionBOutcomeLabel]}>{t("optionB_outcome")}</Text>
              <Text style={styles.beatText}>{loveChoiceReading.beats.optionB_outcome}</Text>
            </View>
            <View style={[styles.beatCard, styles.adviceCard]}>
              <Text style={[styles.beatLabel, styles.adviceLabel]}>{t("heartGuidance")}</Text>
              <Text style={styles.beatText}>{loveChoiceReading.beats.advice}</Text>
            </View>
          </View>

          {/* Decision Lens */}
          <View style={styles.decisionLensSection}>
            <Text style={styles.decisionLensLabel}>{t("decisionLens")}</Text>
            <Text style={styles.decisionLensText}>{loveChoiceReading.decisionLens}</Text>
          </View>

          {/* Keywords */}
          <View style={styles.metaSection}>
            <View style={styles.keywordsRow}>
              {loveChoiceReading.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Next Step */}
          <View style={styles.nextStepSection}>
            <Text style={styles.nextStepLabel}>{t("nextStep")}</Text>
            <Text style={styles.nextStepText}>{loveChoiceReading.nextStep}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Path to Love Reading
  if (spreadType === "path_to_love" && pathToLoveReading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>{pathToLoveReading.title}</Text>
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
            <Text style={styles.overallText}>{pathToLoveReading.overall}</Text>
          </View>

          {/* Beats - 5 cards */}
          <View style={styles.beatsSection}>
            <View style={[styles.beatCard, styles.selfCard]}>
              <Text style={[styles.beatLabel, styles.selfLabel]}>{t("self")}</Text>
              <Text style={styles.beatText}>{pathToLoveReading.beats.self}</Text>
            </View>
            <View style={[styles.beatCard, styles.blockCard]}>
              <Text style={[styles.beatLabel, styles.blockLabel]}>{t("block")}</Text>
              <Text style={styles.beatText}>{pathToLoveReading.beats.block}</Text>
            </View>
            <View style={[styles.beatCard, styles.needCard]}>
              <Text style={[styles.beatLabel, styles.needLabel]}>{t("need")}</Text>
              <Text style={styles.beatText}>{pathToLoveReading.beats.need}</Text>
            </View>
            <View style={[styles.beatCard, styles.actionCard]}>
              <Text style={[styles.beatLabel, styles.actionLabel]}>{t("action")}</Text>
              <Text style={styles.beatText}>{pathToLoveReading.beats.action}</Text>
            </View>
            <View style={[styles.beatCard, styles.potentialCard]}>
              <Text style={[styles.beatLabel, styles.potentialLabel]}>{t("potential")}</Text>
              <Text style={styles.beatText}>{pathToLoveReading.beats.potential}</Text>
            </View>
          </View>

          {/* Strategy */}
          <View style={styles.strategySection}>
            <Text style={styles.strategyLabel}>{t("strategy")}</Text>
            <Text style={styles.strategyText}>{pathToLoveReading.strategy}</Text>
          </View>

          {/* Keywords */}
          <View style={styles.metaSection}>
            <View style={styles.keywordsRow}>
              {pathToLoveReading.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Next Step */}
          <View style={styles.nextStepSection}>
            <Text style={styles.nextStepLabel}>{t("nextStep")}</Text>
            <Text style={styles.nextStepText}>{pathToLoveReading.nextStep}</Text>
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
    lineHeight: 22,
  },
  obstacleCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  obstacleLabel: {
    color: "#e74c3c",
  },
  adviceCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  adviceLabel: {
    color: "#27ae60",
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
  // Destiny's Embrace styles
  destinyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#9b59b6",
  },
  destinyLabel: {
    color: "#9b59b6",
  },
  pathCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  pathLabel: {
    color: "#3498db",
  },
  unionCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  unionLabel: {
    color: "#e74c3c",
  },
  // Love Choice styles (5 cards)
  optionACard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  optionALabel: {
    color: "#3498db",
  },
  optionAOutcomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2980b9",
  },
  optionAOutcomeLabel: {
    color: "#2980b9",
  },
  optionBCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e67e22",
  },
  optionBLabel: {
    color: "#e67e22",
  },
  optionBOutcomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#d35400",
  },
  optionBOutcomeLabel: {
    color: "#d35400",
  },
  decisionLensSection: {
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: "#3a2f5b",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#9b59b6",
  },
  decisionLensLabel: {
    color: "#9b59b6",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  decisionLensText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
  },
  // Path to Love styles (5 cards)
  selfCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#9b59b6",
  },
  selfLabel: {
    color: "#9b59b6",
  },
  blockCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  blockLabel: {
    color: "#e74c3c",
  },
  needCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f39c12",
  },
  needLabel: {
    color: "#f39c12",
  },
  actionCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  actionLabel: {
    color: "#3498db",
  },
  potentialCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  potentialLabel: {
    color: "#27ae60",
  },
  strategySection: {
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: "#3a2f5b",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f39c12",
  },
  strategyLabel: {
    color: "#f39c12",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  strategyText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
  },
});
