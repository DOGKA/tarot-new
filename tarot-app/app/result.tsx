import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";

export default function ResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    selectedCards,
    isPremium,
    spreadType,
    resetReading,
    focusArea,
  } =
    useApp();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleNewReading = () => {
    resetReading();
    router.replace("/");
  };

  const handleGoDive = () => {
    if (isPremium) {
      router.push("/premium-result");
    } else {
      setShowPremiumModal(true);
    }
  };

  if (selectedCards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No cards selected</Text>
          <TouchableOpacity style={styles.newButton} onPress={handleNewReading}>
            <Text style={styles.newButtonText}>{t("newReading")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("yourReading")}</Text>
          <TouchableOpacity onPress={handleNewReading}>
            <Text style={styles.newReadingLink}>{t("newReading")}</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Summary */}
        <View style={styles.cardsSummary}>
          {selectedCards.map((sel, i) => (
            <View key={i} style={styles.cardSummaryItem}>
              <View
                style={[
                  styles.cardBadge,
                  sel.orientation === "reversed" && styles.cardBadgeReversed,
                ]}
              >
                <Text
                  style={[
                    styles.cardBadgeText,
                    sel.orientation === "reversed" && { transform: [{ rotate: "180deg" }] },
                  ]}
                >
                  🃏
                </Text>
              </View>
              <Text style={styles.cardSummaryName}>{sel.card.name}</Text>
              <Text style={styles.cardSummaryOrientation}>
                {t(sel.orientation)}
              </Text>
              {sel.position && (
                <Text style={styles.cardSummaryPosition}>{t(sel.position)}</Text>
              )}
            </View>
          ))}
        </View>

        {spreadType === "single_card" && (
          <View style={styles.meaningsSection}>
            {/* Focus Area Badge */}
            <View style={styles.focusAreaBadge}>
              <Text style={styles.focusAreaText}>{t(focusArea)}</Text>
            </View>
            
            {selectedCards.map((sel, i) => (
              <View key={i} style={styles.meaningCard}>
                <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
                <Text style={styles.orientationLabel}>
                  {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
                </Text>
                <Text style={styles.meaningText}>
                  {sel.card.meanings[sel.orientation][focusArea]}
                </Text>
              </View>
            ))}
          </View>
        )}

        {spreadType === "past_present_future" && (
          <View style={styles.meaningsSection}>
            {selectedCards.map((sel, i) => (
              <View key={i} style={styles.meaningCard}>
                {sel.position && (
                  <Text style={styles.positionLabel}>{t(sel.position)}</Text>
                )}
                <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
                <Text style={styles.orientationLabel}>
                  {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
                </Text>
                <Text style={styles.meaningText}>
                  {sel.card.meanings[sel.orientation].general}
                </Text>
              </View>
            ))}
          </View>
        )}

        {spreadType === "situation_obstacle_advice" && (
          <View style={styles.meaningsSection}>
            {selectedCards.map((sel, i) => (
              <View key={i} style={styles.meaningCard}>
                {sel.position && (
                  <Text style={styles.positionLabel}>{t(sel.position)}</Text>
                )}
                <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
                <Text style={styles.orientationLabel}>
                  {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
                </Text>
                <Text style={styles.meaningText}>
                  {sel.card.meanings[sel.orientation].general}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Destiny's Embrace - FREE */}
        {spreadType === "destinys_embrace" && (
          <View style={styles.meaningsSection}>
            {selectedCards.map((sel, i) => (
              <View key={i} style={styles.meaningCard}>
                {sel.position && (
                  <Text style={styles.positionLabel}>{t(sel.position)}</Text>
                )}
                <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
                <Text style={styles.orientationLabel}>
                  {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
                </Text>
                <Text style={styles.meaningText}>
                  {sel.card.meanings[sel.orientation].love}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Love Choice - FREE */}
        {spreadType === "love_choice" && (
          <View style={styles.meaningsSection}>
            {selectedCards.map((sel, i) => (
              <View key={i} style={styles.meaningCard}>
                {sel.position && (
                  <Text style={styles.positionLabel}>
                    {sel.position === "advice" ? t("heartGuidance") : t(sel.position)}
                  </Text>
                )}
                <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
                <Text style={styles.orientationLabel}>
                  {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
                </Text>
                <Text style={styles.meaningText}>
                  {sel.card.meanings[sel.orientation].love}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Path to Love - FREE */}
        {spreadType === "path_to_love" && (
          <View style={styles.meaningsSection}>
            {selectedCards.map((sel, i) => (
              <View key={i} style={styles.meaningCard}>
                {sel.position && (
                  <Text style={styles.positionLabel}>{t(sel.position)}</Text>
                )}
                <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
                <Text style={styles.orientationLabel}>
                  {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
                </Text>
                <Text style={styles.meaningText}>
                  {sel.card.meanings[sel.orientation].love}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Go Dive Button (Premium) */}
        <TouchableOpacity
          style={[styles.goDiveButton, isPremium && styles.goDiveButtonPremium]}
          onPress={handleGoDive}
        >
          <Text style={styles.goDiveButtonText}>
            {isPremium ? `✨ ${t("goDive")}` : `🔒 ${t("goDive")} - ${t("premiumFeature")}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Premium Modal */}
      {showPremiumModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t("premiumFeature")}</Text>
            <Text style={styles.modalText}>
              Unlock deep dive readings with shadow analysis, blockers, mantras,
              and journal prompts.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  newReadingLink: {
    color: "#9b59b6",
    fontSize: 14,
  },
  cardsSummary: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    justifyContent: "center",
  },
  cardSummaryItem: {
    alignItems: "center",
    backgroundColor: "#252540",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    maxWidth: 120,
  },
  cardBadge: {
    width: 50,
    height: 70,
    backgroundColor: "#4a3f6b",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#9b59b6",
  },
  cardBadgeReversed: {
    backgroundColor: "#6b3f4a",
    borderColor: "#b659a0",
  },
  cardBadgeText: {
    fontSize: 24,
  },
  cardSummaryName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cardSummaryOrientation: {
    color: "#9b59b6",
    fontSize: 11,
    marginTop: 4,
  },
  cardSummaryPosition: {
    color: "#888",
    fontSize: 10,
    marginTop: 2,
  },
  focusAreaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#3a3a5a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  focusAreaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  meaningsSection: {
    padding: 16,
    gap: 16,
  },
  meaningCard: {
    backgroundColor: "#252540",
    borderRadius: 12,
    padding: 16,
  },
  positionLabel: {
    color: "#9b59b6",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardNameLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orientationLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 12,
  },
  meaningText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
  },
  goDiveButton: {
    backgroundColor: "#333",
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  goDiveButtonPremium: {
    backgroundColor: "#9b59b6",
  },
  goDiveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 18,
    marginBottom: 20,
  },
  newButton: {
    backgroundColor: "#9b59b6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#252540",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#9b59b6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
