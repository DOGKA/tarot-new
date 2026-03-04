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
import { GradientBackground, Planet3D } from "../../components/ui";

export default function PlanetDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    planetKey: string;
    planetName: string;
    planetDay: string;
    meaning: string;
    advice: string;
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
          <Planet3D planetKey={params.planetKey || "sun"} size={130} />
          <Text style={styles.title}>{params.planetName}</Text>
          <Text style={styles.dayLabel}>{params.planetDay}</Text>
        </View>

        {params.meaning ? (
          <View style={styles.section}>
            <Text style={styles.sectionText}>{params.meaning}</Text>
          </View>
        ) : null}

        {params.advice ? (
          <View style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>{t("moonPlanetStep")}</Text>
            <Text style={styles.adviceText}>{params.advice}</Text>
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
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginTop: 12,
  },
  dayLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
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
  adviceCard: {
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  adviceTitle: {
    color: "#7dd3fc",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  adviceText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 23,
  },
});
