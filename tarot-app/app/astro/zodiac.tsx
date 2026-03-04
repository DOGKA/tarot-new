import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { GradientBackground, Zodiac3D } from "../../components/ui";

export default function ZodiacDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    zodiacKey: string;
    zodiacName: string;
    zodiacElement: string;
    meaning: string;
    firsat: string;
    his: string;
  }>();

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← {t("moonAstroBack")}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Zodiac3D zodiacKey={params.zodiacKey || "aries"} size={140} />
          <Text style={styles.title}>
            {t("moonZodiacDetail", { name: params.zodiacName })}
          </Text>
          {params.his ? (
            <Text style={styles.his}>{params.his}</Text>
          ) : null}
        </View>

        {params.meaning ? (
          <View style={styles.section}>
            <Text style={styles.sectionText}>{params.meaning}</Text>
          </View>
        ) : null}

        {params.firsat ? (
          <View style={styles.firsatCard}>
            <Text style={styles.firsatTitle}>{t("moonZodiacChance")}</Text>
            <Text style={styles.firsatText}>{params.firsat}</Text>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 12 },
  backButton: { marginBottom: 16 },
  backText: { color: "rgba(255,255,255,0.6)", fontSize: 16 },
  header: { alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
  his: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    marginTop: 8,
    fontStyle: "italic",
    letterSpacing: 1,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  sectionText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    lineHeight: 23,
  },
  firsatCard: {
    backgroundColor: "rgba(74, 222, 128, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.2)",
    borderRadius: 14,
    padding: 18,
  },
  firsatTitle: {
    color: "#4ade80",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  firsatText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 23,
  },
});
