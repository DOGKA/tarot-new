import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDream } from "../../context/DreamContext";
import { useApp } from "../../context/AppContext";
import { GradientBackground } from "../../components/ui";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import type { FeelingTag, LifeContextTag } from "../../types/dream";

const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
const API_URL = `http://${host}:3001/api/dream`;

const MAX_CHARS = 300;

const FEELING_OPTIONS: { value: FeelingTag; label: string }[] = [
  { value: "korku", label: "Korku" },
  { value: "özlem", label: "Özlem" },
  { value: "merak", label: "Merak" },
  { value: "rahatlık", label: "Rahatlık" },
  { value: "utanç", label: "Utanç" },
  { value: "öfke", label: "Öfke" },
  { value: "hüzün", label: "Hüzün" },
  { value: "şaşkınlık", label: "Şaşkınlık" },
];

const CONTEXT_OPTIONS: { value: LifeContextTag; label: string }[] = [
  { value: "iş", label: "İş" },
  { value: "aşk", label: "Aşk" },
  { value: "para", label: "Para" },
  { value: "aile", label: "Aile" },
  { value: "sağlık", label: "Sağlık" },
  { value: "arkadaşlık", label: "Arkadaşlık" },
  { value: "kayıp", label: "Kayıp" },
  { value: "değişim", label: "Değişim" },
];

export default function DreamInputScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    dreamMode,
    dreamText,
    setDreamText,
    feelingTag,
    setFeelingTag,
    lifeContextTag,
    setLifeContextTag,
    setCurrentResult,
    gemstoneBalance,
    prices,
    deviceId,
    fetchUserInfo,
  } = useDream();
  const { language } = useApp();

  const [loading, setLoading] = useState(false);

  const cost = prices[dreamMode];
  const canAfford = gemstoneBalance >= cost;
  const isValid = dreamText.trim().length >= 20;

  const modeLabels: Record<string, string> = {
    A: t("quickDecode") || "Quick Decode",
    B: t("deepDecode") || "Deep Decode",
    C: t("rewritePlan") || "Rewrite Plan",
  };

  const handleDecode = async () => {
    if (!isValid || !canAfford) return;

    setLoading(true);
    try {
      const requestId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const response = await fetch(`${API_URL}/decode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: dreamMode,
          dreamText: dreamText.trim(),
          feelingTag: feelingTag || undefined,
          lifeContextTag: lifeContextTag || undefined,
          deviceId,
          requestId,
          language,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.error === "INSUFFICIENT_GEMSTONES") {
          Alert.alert(
            t("insufficientGemstone") || "Yetersiz Gemstone",
            `${err.required} gemstone gerekli, bakiyen: ${err.balance}`
          );
        } else {
          Alert.alert("Hata", err.message || err.error || "Bilinmeyen hata");
        }
        return;
      }

      const data = await response.json();
      setCurrentResult(data);
      fetchUserInfo(); // refresh balance
      router.push("/dream/result");
    } catch (err) {
      Alert.alert("Bağlantı Hatası", "Sunucuya bağlanılamadı. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{modeLabels[dreamMode]}</Text>
            <View style={styles.costContainer}>
              <Text style={styles.costText}>💎 {cost}</Text>
            </View>
          </View>

          {/* Dream Text Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {t("dreamInputLabel") || "Rüyanı anlat"}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={t("dreamPlaceholder") || "Rüyamda karanlık bir koridorda yürüyordum..."}
              placeholderTextColor="rgba(255, 255, 255, 0.25)"
              multiline
              maxLength={MAX_CHARS}
              value={dreamText}
              onChangeText={setDreamText}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, dreamText.length > MAX_CHARS - 50 && styles.charCountWarn]}>
              {dreamText.length}/{MAX_CHARS}
            </Text>
          </View>

          {/* Feeling Tag (Optional) */}
          <View style={styles.tagSection}>
            <Text style={styles.tagLabel}>
              {t("feelingTagLabel") || "Baskın duygu"} <Text style={styles.optional}>(opsiyonel)</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
              {FEELING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.tagChip, feelingTag === opt.value && styles.tagChipSelected]}
                  onPress={() => setFeelingTag(feelingTag === opt.value ? null : opt.value)}
                >
                  <Text style={[styles.tagChipText, feelingTag === opt.value && styles.tagChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Life Context Tag (Optional) */}
          <View style={styles.tagSection}>
            <Text style={styles.tagLabel}>
              {t("lifeContextLabel") || "Yaşam bağlamı"} <Text style={styles.optional}>(opsiyonel)</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
              {CONTEXT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.tagChip, lifeContextTag === opt.value && styles.tagChipSelected]}
                  onPress={() => setLifeContextTag(lifeContextTag === opt.value ? null : opt.value)}
                >
                  <Text style={[styles.tagChipText, lifeContextTag === opt.value && styles.tagChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Decode Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDecode}
            disabled={loading || !isValid || !canAfford}
          >
            <LinearGradient
              colors={
                !isValid || !canAfford
                  ? ["rgba(100,100,100,0.4)", "rgba(80,80,80,0.3)"]
                  : ["#a855f7", "#6366f1"]
              }
              style={styles.decodeButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.decodeButtonText}>
                  {!isValid
                    ? t("dreamTooShort") || "En az 20 karakter yaz"
                    : !canAfford
                      ? t("insufficientGemstone") || "Yetersiz Gemstone"
                      : t("decodeButton") || "Decode Et"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Min length hint */}
          {dreamText.length > 0 && dreamText.length < 20 && (
            <Text style={styles.hintText}>
              {t("minLengthHint") || `Henüz ${20 - dreamText.length} karakter daha gerekiyor`}
            </Text>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
    paddingRight: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  costContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.4)",
  },
  costText: {
    color: "#c084fc",
    fontSize: 12,
    fontWeight: "700",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    minHeight: 140,
    maxHeight: 220,
  },
  charCount: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 12,
    textAlign: "right",
    marginTop: 6,
  },
  charCountWarn: {
    color: "#f59e0b",
  },
  tagSection: {
    marginBottom: 18,
  },
  tagLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },
  optional: {
    color: "rgba(255, 255, 255, 0.3)",
    fontWeight: "400",
  },
  tagRow: {
    gap: 8,
    paddingRight: 20,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 5,
  },
  tagChipSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  tagChipText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    fontWeight: "500",
  },
  tagChipTextSelected: {
    color: "#c084fc",
  },
  decodeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  decodeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  hintText: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  bottomPadding: {
    height: 40,
  },
});
