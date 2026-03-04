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
import { GradientBackground, Moon3D } from "../../components/ui";
import { getMoonIllumination } from "../../utils/moon";

export default function PhaseDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    phaseKey: string;
    phaseName: string;
    general: string;
    ayna: string;
  }>();

  const illumination = getMoonIllumination(new Date());

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
          <Moon3D illumination={illumination} size={160} phaseKey={params.phaseKey} />
          <Text style={styles.title}>{params.phaseName}</Text>
          <Text style={styles.illumination}>
            %{Math.round(illumination * 100)}
          </Text>
        </View>

        {params.general ? (
          <View style={styles.section}>
            <Text style={styles.sectionText}>{params.general}</Text>
          </View>
        ) : null}

        {params.ayna ? (
          <View style={styles.aynaCard}>
            <Text style={styles.aynaTitle}>{t("moonPhaseNotice")}</Text>
            <Text style={styles.aynaText}>{params.ayna}</Text>
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
    textAlign: "center",
  },
  illumination: {
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
  aynaCard: {
    backgroundColor: "rgba(168, 85, 247, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.25)",
    borderRadius: 14,
    padding: 18,
  },
  aynaTitle: {
    color: "#c084fc",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  aynaText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 23,
  },
});
