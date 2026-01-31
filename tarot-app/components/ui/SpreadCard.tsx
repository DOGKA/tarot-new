import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from "react-native";
import GlassCard from "./GlassCard";

type CardLayout = "single" | "three" | "five";

interface SpreadCardProps {
  title: string;
  description: string;
  cardCount: CardLayout;
  onPress: () => void;
  categoryColor?: string;
  style?: ViewStyle;
}

export default function SpreadCard({
  title,
  description,
  cardCount,
  onPress,
  categoryColor = "#a855f7",
  style,
}: SpreadCardProps) {
  const renderCardIcons = () => {
    if (cardCount === "single") {
      return (
        <View style={styles.iconContainer}>
          <View style={[styles.cardIcon, styles.cardIconLarge]} />
        </View>
      );
    }

    if (cardCount === "three") {
      return (
        <View style={styles.iconContainer}>
          <View style={styles.threeCardRow}>
            <View style={styles.cardIcon} />
            <View style={styles.cardIcon} />
            <View style={styles.cardIcon} />
          </View>
        </View>
      );
    }

    // Five cards - pyramid style
    return (
      <View style={styles.iconContainer}>
        <View style={styles.fiveCardTop}>
          <View style={styles.cardIconSmall} />
          <View style={styles.cardIconSmall} />
        </View>
        <View style={styles.fiveCardBottom}>
          <View style={styles.cardIconSmall} />
          <View style={styles.cardIconSmall} />
          <View style={styles.cardIconSmall} />
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassCard style={[styles.card, style]}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            {renderCardIcons()}
          </View>
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: categoryColor }]}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    width: 16,
    height: 24,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 2,
  },
  cardIconLarge: {
    width: 28,
    height: 42,
    borderRadius: 4,
    borderWidth: 2,
  },
  cardIconSmall: {
    width: 14,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 1,
    marginVertical: 1,
  },
  threeCardRow: {
    flexDirection: "row",
  },
  fiveCardTop: {
    flexDirection: "row",
    marginBottom: 2,
  },
  fiveCardBottom: {
    flexDirection: "row",
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
  },
});
