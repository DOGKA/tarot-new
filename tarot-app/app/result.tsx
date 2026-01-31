import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { GradientBackground, GlassCard, PremiumPreview } from "../components/ui";
import { LinearGradient } from "expo-linear-gradient";

export default function ResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedCards, isPremium, spreadType, resetReading, focusArea } = useApp();
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

  // Get focus area based on spread type
  const getCardMeaning = (card: typeof selectedCards[0]) => {
    if (spreadType === "single_card") {
      return card.card.meanings[card.orientation][focusArea];
    }
    
    // Spread-specific focus areas
    const spreadFocusMap: Record<string, keyof typeof card.card.meanings.upright> = {
      destinys_embrace: "love",
      love_choice: "love",
      path_to_love: "love",
      career_clarity: "career",
      career_path_guide: "career",
      new_business_exploration: "career",
      wealth_flow: "career",
      new_moon_ritual: "spiritual",
      full_moon_release: "spiritual",
      mind_body_spirit: "spiritual",
      celestial_illumination: "spiritual",
    };
    
    const focus = spreadFocusMap[spreadType || ""] || "general";
    return card.card.meanings[card.orientation][focus];
  };

  if (selectedCards.length === 0) {
    return (
      <GradientBackground>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No cards selected</Text>
          <TouchableOpacity onPress={handleNewReading}>
            <GlassCard style={styles.newButton}>
              <Text style={styles.newButtonText}>{t("newReading")}</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("yourReading")}</Text>
          <TouchableOpacity onPress={handleNewReading}>
            <Text style={styles.newReadingLink}>{t("newReading")}</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Summary - Minimal Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsSummary}
        >
          {selectedCards.map((sel, i) => (
            <View key={i} style={styles.cardChip}>
              <Text style={styles.cardChipName} numberOfLines={1}>
                {sel.card.name}
              </Text>
              <Text style={[
                styles.cardChipOrientation,
                { color: sel.orientation === "upright" ? "#22c55e" : "#ef4444" }
              ]}>
                {sel.orientation === "upright" ? "↑" : "↓"}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Single Card - focus area badge */}
        {spreadType === "single_card" && (
          <View style={styles.focusBadgeContainer}>
            <View style={styles.focusBadge}>
              <Text style={styles.focusBadgeText}>{t(focusArea)}</Text>
            </View>
          </View>
        )}

        {/* Card Meanings */}
        <View style={styles.meaningsSection}>
          {selectedCards.map((sel, i) => (
            <GlassCard key={i} style={styles.meaningCard}>
              {/* Position Label */}
              {sel.position && (
                <Text style={[
                  styles.positionLabel,
                  { color: sel.orientation === "upright" ? "#22c55e" : "#ef4444" }
                ]}>
                  {t(sel.position === "shadow" ? "hiddenResistance" : sel.position)}
                </Text>
              )}
              
              {/* Card Name */}
              <Text style={styles.cardNameLabel}>{sel.card.name}</Text>
              
              {/* Orientation */}
              <Text style={[
                styles.orientationLabel,
                { color: sel.orientation === "upright" ? "#22c55e" : "#ef4444" }
              ]}>
                {sel.orientation === "upright" ? "↑" : "↓"} {t(sel.orientation)}
              </Text>
              
              {/* Meaning */}
              <Text style={styles.meaningText}>
                {getCardMeaning(sel)}
              </Text>
            </GlassCard>
          ))}
        </View>

        {/* Premium Section */}
        {isPremium ? (
          // Premium User - Go Dive Button
          <TouchableOpacity onPress={handleGoDive} activeOpacity={0.8}>
            <LinearGradient
              colors={["#a855f7", "#6366f1"]}
              style={styles.goDiveButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.goDiveButtonText}>✨ {t("goDive")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          // Free User - Premium Preview (spread-specific)
          <PremiumPreview 
            spreadType={spreadType || "single_card"} 
            focusArea={focusArea}
            onUnlock={() => setShowPremiumModal(true)} 
          />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Premium Modal */}
      {showPremiumModal && (
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <Text style={styles.modalTitle}>{t("premiumFeature")}</Text>
            <Text style={styles.modalText}>
              Unlock deep dive readings with shadow analysis, blockers, mantras,
              and journal prompts.
            </Text>
            <TouchableOpacity
              onPress={() => setShowPremiumModal(false)}
            >
              <LinearGradient
                colors={["#a855f7", "#6366f1"]}
                style={styles.modalButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </View>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 18,
    marginBottom: 20,
  },
  newButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  newButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  newReadingLink: {
    color: "#a855f7",
    fontSize: 14,
    fontWeight: "500",
  },
  cardsSummary: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  cardChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  cardChipName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    maxWidth: 100,
  },
  cardChipOrientation: {
    fontSize: 14,
    fontWeight: "bold",
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
  meaningsSection: {
    padding: 16,
    gap: 12,
  },
  meaningCard: {
    marginBottom: 4,
  },
  positionLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 1,
  },
  cardNameLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orientationLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  meaningText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    lineHeight: 24,
  },
  goDiveButton: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  goDiveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
