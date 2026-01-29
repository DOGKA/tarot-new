import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import type { Card, SelectedCard, SpreadType, TarotData, FocusArea } from "../../types/tarot";

// Import tarot data based on language (new folder structure)
import enData from "../../data/en/tarot-template.json";
import trData from "../../data/tr/tarot-template.json";
import deData from "../../data/de/tarot-template.json";
import esData from "../../data/es/tarot-template.json";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 5;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const tarotDataMap: Record<string, TarotData> = {
  en: enData as TarotData,
  tr: trData as TarotData,
  de: deData as TarotData,
  es: esData as TarotData,
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const focusAreas: FocusArea[] = ["general", "love", "career", "finance"];

export default function PickScreen() {
  const { spread } = useLocalSearchParams<{ spread: SpreadType }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setSelectedCards, focusArea, setFocusArea, isPremium } = useApp();

  const [deck, setDeck] = useState<Card[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<SelectedCard[]>([]);
  const [showFocusSelector, setShowFocusSelector] = useState(spread === "yes_no");

  const requiredCards = spread === "single_card" || spread === "yes_no" ? 1 : 3;
  const positions: Array<"past" | "present" | "future"> = [
    "past",
    "present",
    "future",
  ];

  useEffect(() => {
    const data = tarotDataMap[language] || tarotDataMap.en;
    setDeck(shuffleArray(data.cards));
    setRevealedCards(new Set());
    setSelected([]);
  }, [language]);

  const handleCardTap = (card: Card, index: number) => {
    if (selected.length >= requiredCards) return;
    if (revealedCards.has(index)) return;

    const orientation = Math.random() > 0.5 ? "upright" : "reversed";
    const position =
      spread === "past_present_future" ? positions[selected.length] : undefined;

    const newSelected: SelectedCard = {
      card,
      orientation,
      position,
    };

    setRevealedCards((prev) => new Set([...prev, index]));
    setSelected((prev) => [...prev, newSelected]);
  };

  const handleContinue = () => {
    setSelectedCards(selected);
    if (spread === "yes_no") {
      router.push("/yesno-result");
    } else if (isPremium) {
      router.push("/premium-result");
    } else {
      router.push("/result");
    }
  };

  const handleShuffle = () => {
    const data = tarotDataMap[language] || tarotDataMap.en;
    setDeck(shuffleArray(data.cards));
    setRevealedCards(new Set());
    setSelected([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← {t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {spread === "single_card" ? t("singleCard") : spread === "yes_no" ? t("yesNo") : t("threeCards")}
        </Text>
        <TouchableOpacity onPress={handleShuffle} disabled={selected.length > 0}>
          <Text style={[styles.shuffleButton, selected.length > 0 && styles.shuffleButtonDisabled]}>
            {t("shuffle")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Focus Area Selector for Yes/No - disabled after card selection */}
      {spread === "yes_no" && (
        <View style={styles.focusSection}>
          <Text style={styles.focusSectionTitle}>{t("selectFocusArea")}</Text>
          <View style={styles.focusGrid}>
            {focusAreas.map((area) => (
              <TouchableOpacity
                key={area}
                style={[
                  styles.focusButton,
                  focusArea === area && styles.focusButtonActive,
                  selected.length > 0 && styles.focusButtonDisabled,
                ]}
                onPress={() => setFocusArea(area)}
                disabled={selected.length > 0}
              >
                <Text
                  style={[
                    styles.focusButtonText,
                    focusArea === area && styles.focusButtonTextActive,
                    selected.length > 0 && focusArea !== area && styles.focusButtonTextDisabled,
                  ]}
                >
                  {t(area)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Selected Cards Display */}
      <View style={styles.selectedSection}>
        <Text style={styles.selectedTitle}>
          {selected.length}/{requiredCards} {t("selectCard")}
        </Text>
        <View style={styles.selectedCards}>
          {selected.map((sel, i) => (
            <View key={i} style={styles.selectedCard}>
              <Text style={styles.selectedCardName}>{sel.card.name}</Text>
              <Text style={styles.selectedCardOrientation}>
                {sel.orientation === "upright" ? "↑" : "↓"}{" "}
                {t(sel.orientation)}
              </Text>
              {sel.position && (
                <Text style={styles.selectedCardPosition}>
                  {t(sel.position)}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Card Deck */}
      <ScrollView contentContainerStyle={styles.deckContainer}>
        <View style={styles.deck}>
          {deck.map((card, index) => {
            const isRevealed = revealedCards.has(index);
            return (
              <TouchableOpacity
                key={`${card.id}-${index}`}
                style={[styles.card, isRevealed && styles.cardRevealed]}
                onPress={() => handleCardTap(card, index)}
                disabled={isRevealed || selected.length >= requiredCards}
              >
                {isRevealed ? (
                  <View style={styles.cardFront}>
                    <Text style={styles.cardName} numberOfLines={2}>
                      {card.name}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.cardBack}>
                    <Text style={styles.cardBackPattern}>✧</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button */}
      {selected.length === requiredCards && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>{t("yourReading")} →</Text>
        </TouchableOpacity>
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
  backButton: {
    color: "#9b59b6",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  shuffleButton: {
    color: "#9b59b6",
    fontSize: 16,
  },
  shuffleButtonDisabled: {
    color: "#444",
  },
  focusSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  focusSectionTitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
  },
  focusGrid: {
    flexDirection: "row",
    gap: 10,
  },
  focusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#252540",
    alignItems: "center",
  },
  focusButtonActive: {
    backgroundColor: "#9b59b6",
  },
  focusButtonDisabled: {
    opacity: 0.5,
  },
  focusButtonText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  focusButtonTextActive: {
    color: "#fff",
  },
  focusButtonTextDisabled: {
    color: "#444",
  },
  selectedSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  selectedTitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
  },
  selectedCards: {
    flexDirection: "row",
    gap: 12,
  },
  selectedCard: {
    flex: 1,
    backgroundColor: "#252540",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  selectedCardName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedCardOrientation: {
    color: "#9b59b6",
    fontSize: 11,
    marginTop: 4,
  },
  selectedCardPosition: {
    color: "#888",
    fontSize: 10,
    marginTop: 2,
  },
  deckContainer: {
    padding: 16,
  },
  deck: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardBack: {
    flex: 1,
    backgroundColor: "#4a3f6b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#9b59b6",
  },
  cardBackPattern: {
    fontSize: 20,
    color: "#9b59b6",
  },
  cardRevealed: {
    opacity: 0.7,
  },
  cardFront: {
    flex: 1,
    backgroundColor: "#252540",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderWidth: 2,
    borderColor: "#666",
  },
  cardName: {
    color: "#fff",
    fontSize: 9,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#9b59b6",
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
