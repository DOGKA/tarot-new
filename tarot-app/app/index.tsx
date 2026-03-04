import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import { useApp } from "../context/AppContext";
import { GradientBackground, Moon3D, Planet3D, Zodiac3D } from "../components/ui";
import { getMoonIllumination } from "../utils/moon";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import type { Language } from "../types/tarot";
import type { MoonSlot, MoonApiResponse } from "../utils/moon";
import { getTimeUntilTransition } from "../utils/moon";

const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
const API_BASE = `http://${host}:3001/api`;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH - 48;

function sameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function formatSlotTime(isoStr: string, todayLabel: string, tomorrowLabel: string): string {
  const d = new Date(isoStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const time = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  if (sameDay(d, now)) return `${todayLabel} ${time}`;
  if (sameDay(d, tomorrow)) return `${tomorrowLabel} ${time}`;
  const months = ["Oca","Sub","Mar","Nis","May","Haz","Tem","Agu","Eyl","Eki","Kas","Ara"];
  return `${d.getDate()} ${months[d.getMonth()]} ${time}`;
}

const ZODIAC_GRADIENTS: Record<string, string[]> = {
  aries:       ["rgba(255, 60, 30, 0.5)",  "rgba(180, 30, 10, 0.25)", "rgba(40, 10, 10, 0.95)"],
  taurus:      ["rgba(40, 180, 80, 0.45)", "rgba(20, 120, 50, 0.2)",  "rgba(10, 35, 20, 0.95)"],
  gemini:      ["rgba(255, 220, 50, 0.5)", "rgba(200, 160, 0, 0.2)",  "rgba(40, 35, 10, 0.95)"],
  cancer:      ["rgba(80, 160, 255, 0.5)", "rgba(40, 100, 200, 0.25)","rgba(10, 20, 50, 0.95)"],
  leo:         ["rgba(255, 150, 0, 0.5)",  "rgba(220, 100, 0, 0.25)", "rgba(45, 25, 5, 0.95)"],
  virgo:       ["rgba(120, 80, 200, 0.5)", "rgba(80, 50, 160, 0.25)", "rgba(25, 15, 45, 0.95)"],
  libra:       ["rgba(230, 180, 255, 0.45)","rgba(180, 120, 220, 0.2)","rgba(35, 20, 50, 0.95)"],
  scorpio:     ["rgba(180, 20, 20, 0.55)", "rgba(120, 10, 10, 0.3)",  "rgba(35, 5, 5, 0.95)"],
  sagittarius: ["rgba(255, 100, 20, 0.5)", "rgba(200, 60, 0, 0.25)",  "rgba(40, 20, 5, 0.95)"],
  capricorn:   ["rgba(100, 90, 70, 0.5)",  "rgba(70, 60, 45, 0.25)",  "rgba(25, 22, 18, 0.95)"],
  aquarius:    ["rgba(0, 200, 255, 0.5)",  "rgba(0, 130, 200, 0.25)", "rgba(5, 20, 40, 0.95)"],
  pisces:      ["rgba(140, 80, 220, 0.5)", "rgba(100, 50, 180, 0.25)","rgba(25, 10, 45, 0.95)"],
};
const DEFAULT_GRADIENT = ["rgba(168, 85, 247, 0.4)", "rgba(99, 102, 241, 0.2)", "rgba(25, 15, 50, 0.95)"];

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { language, setLanguage, isPremium, togglePremium } = useApp();

  const [moonData, setMoonData] = useState<MoonApiResponse | null>(null);
  const [moonLoading, setMoonLoading] = useState(true);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialLoadDone = useRef(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const tabScrollRef = useRef<ScrollView>(null);
  const tabWidths = useRef<number[]>([]);

  const LOADING_KEYS = ["moonLoading1", "moonLoading2", "moonLoading3", "moonLoading4", "moonLoading5", "moonLoading6"];

  const startLoadingAnim = () => {
    setLoadingMsgIdx(0);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 0.9,
      duration: 45000,
      useNativeDriver: false,
    }).start();
    msgTimerRef.current = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % 6);
    }, 4000);
  };

  const stopLoadingAnim = () => {
    if (msgTimerRef.current) clearInterval(msgTimerRef.current);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fetchMoon = useCallback(async (lang: string, showLoading: boolean) => {
    try {
      if (showLoading) {
        setMoonLoading(true);
        startLoadingAnim();
      }
      const res = await fetch(`${API_BASE}/moon/current?lang=${lang}`);
      if (res.ok) {
        const data: MoonApiResponse = await res.json();
        setMoonData(data);
        setActiveSlotIndex(data.currentIndex || 0);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (data.nextTransition?.time) {
          const ms = getTimeUntilTransition(data.nextTransition.time);
          if (ms > 0 && ms < 86400000) {
            timerRef.current = setTimeout(() => fetchMoon(lang, false), ms + 1000);
          }
        }
      }
    } catch (err) {
      console.warn("Moon fetch error:", err);
    } finally {
      if (showLoading) {
        stopLoadingAnim();
        setMoonLoading(false);
      }
    }
  }, []);

  // Auto-scroll tabs when active slot changes
  useEffect(() => {
    if (tabScrollRef.current && activeSlotIndex >= 0) {
      const tabWidth = 90;
      const scrollX = Math.max(0, activeSlotIndex * (tabWidth + 6) - SCREEN_WIDTH / 2 + tabWidth / 2);
      tabScrollRef.current.scrollTo({ x: scrollX, animated: true });
    }
  }, [activeSlotIndex]);

  // Initial load -- show loading animation
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchMoon(language, true);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (msgTimerRef.current) clearInterval(msgTimerRef.current);
    };
  }, []);

  // Language switch -- silent refetch (no loading, cache returns instantly)
  useEffect(() => {
    if (initialLoadDone.current) {
      fetchMoon(language, false);
    }
  }, [language]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const slot = moonData?.currentSlot;

  const navigatePhase = (s: MoonSlot) => {
    if (!s?.content) return;
    router.push({
      pathname: "/astro/phase",
      params: {
        phaseKey: s.phase.key,
        phaseName: s.phase.name,
        general: s.content.phase.general,
        ayna: s.content.phase.ayna,
      },
    });
  };

  const navigateZodiac = (s: MoonSlot) => {
    if (!s?.content) return;
    router.push({
      pathname: "/astro/zodiac",
      params: {
        zodiacKey: s.zodiac.key,
        zodiacName: s.zodiac.name,
        zodiacElement: s.zodiac.element,
        meaning: s.content.zodiac.meaning,
        firsat: s.content.zodiac.firsat,
        his: s.content.zodiac.his,
      },
    });
  };

  const navigatePlanet = (s: MoonSlot) => {
    if (!s?.content) return;
    router.push({
      pathname: "/astro/planet",
      params: {
        planetKey: s.planet.key,
        planetName: s.planet.name,
        planetDay: s.planet.day,
        meaning: s.content.planet.meaning,
        advice: s.content.planet.advice,
      },
    });
  };

  const todayLabel = t("moonToday");
  const tomorrowLabel = t("moonTomorrow");

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.premiumBadge, isPremium && styles.premiumActive]}
            onPress={togglePremium}
          >
            <Text style={styles.premiumText}>
              {isPremium ? "★ Premium" : "Free"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.marketButton} onPress={() => router.push("/market")}>
            <Text style={styles.marketButtonText}>Market</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Astrolic</Text>
          <Text style={styles.appSubtitle}>Tarot & Dream</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.languageSection}>
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.7}
                style={[
                  styles.languageButton,
                  language === lang.code && styles.languageSelected,
                ]}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageLabel,
                    language === lang.code && styles.languageLabelSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {/* Tarot Card */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push("/tarot")}
          >
            <LinearGradient
              colors={[
                "rgba(168, 85, 247, 0.3)",
                "rgba(99, 102, 241, 0.2)",
                "rgba(30, 20, 60, 0.8)",
              ]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.cardIcon}>✨</Text>
              <Text style={styles.cardTitle}>Tarot</Text>
              <Text style={styles.cardDescription}>
                {t("tarotWelcomeDesc")}
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{t("tarotBadge")}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Dream Coder Card */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push("/dream")}
          >
            <LinearGradient
              colors={[
                "rgba(56, 189, 248, 0.3)",
                "rgba(99, 102, 241, 0.2)",
                "rgba(30, 20, 60, 0.8)",
              ]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.cardIcon}>🌙</Text>
              <Text style={styles.cardTitle}>Dream Coder</Text>
              <Text style={styles.cardDescription}>
                {t("dreamWelcomeDesc")}
              </Text>
              <View style={[styles.cardBadge, styles.dreamBadge]}>
                <Text style={[styles.cardBadgeText, styles.dreamBadgeText]}>
                  {t("dreamBadge")}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Moon Astro Card */}
          {moonLoading && !moonData ? (
            <View style={[styles.card, styles.astroCard, { padding: 20 }]}>
              <Text style={styles.loadingText}>{t(LOADING_KEYS[loadingMsgIdx])}</Text>
              <View style={styles.progressBarBg}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
                  ]}
                />
              </View>
            </View>
          ) : moonData?.allSlots && moonData.allSlots.length > 0 ? (
            <View>
              <FlatList
                ref={flatListRef}
                data={moonData.allSlots}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                snapToAlignment="start"
                decelerationRate="fast"
                initialScrollIndex={moonData.currentIndex || 0}
                getItemLayout={(_, index) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * index, index })}
                keyExtractor={(item) => item.id}
                onScroll={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
                  if (idx !== activeSlotIndex && idx >= 0 && idx < (moonData?.allSlots?.length || 0)) {
                    setActiveSlotIndex(idx);
                  }
                }}
                scrollEventThrottle={100}
                renderItem={({ item: s, index }) => {
                  const isCurrentSlot = index === (moonData.currentIndex || 0);
                  const isLocked = !isPremium && !isCurrentSlot;
                  const grad = ZODIAC_GRADIENTS[s.zodiac.key] || DEFAULT_GRADIENT;
                  return (
                    <LinearGradient
                      colors={grad as [string, string, ...string[]]}
                      style={[styles.slotCard, { width: CARD_WIDTH }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.slotDateRow}>
                        <Text style={styles.slotDate} numberOfLines={1}>{formatSlotTime(s.start, todayLabel, tomorrowLabel)}</Text>
                        <Text style={styles.slotDate} numberOfLines={1}>{formatSlotTime(s.end, todayLabel, tomorrowLabel)}</Text>
                      </View>
                      <View style={styles.astroColumns}>
                        <TouchableOpacity style={styles.astroCol} onPress={() => navigatePhase(s)} activeOpacity={0.7} disabled={isLocked}>
                          <Moon3D illumination={getMoonIllumination(new Date())} size={72} />
                          <Text style={styles.astroColName} numberOfLines={1}>{s.phase.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.astroCol} onPress={() => navigateZodiac(s)} activeOpacity={0.7} disabled={isLocked}>
                          <Zodiac3D zodiacKey={s.zodiac.key} size={72} />
                          <Text style={styles.astroColName} numberOfLines={1}>{s.zodiac.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.astroCol} onPress={() => navigatePlanet(s)} activeOpacity={0.7} disabled={isLocked}>
                          <Planet3D planetKey={s.planet.key} size={72} />
                          <Text style={styles.astroColName} numberOfLines={1}>{s.planet.name}</Text>
                        </TouchableOpacity>
                      </View>
                      {isLocked && (
                        <BlurView intensity={30} tint="dark" style={styles.blurOverlay}>
                          <TouchableOpacity style={styles.unlockButton} onPress={() => router.push("/market")} activeOpacity={0.8}>
                            <Text style={styles.unlockText}>{t("moonPremiumUnlock")}</Text>
                          </TouchableOpacity>
                        </BlurView>
                      )}
                    </LinearGradient>
                  );
                }}
              />
              <ScrollView ref={tabScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotTabs}>
                {moonData.allSlots.map((s, i) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.slotTab, i === activeSlotIndex && styles.slotTabActive]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveSlotIndex(i);
                      flatListRef.current?.scrollToIndex({ index: i, animated: true });
                    }}
                  >
                    <Text style={[styles.slotTabText, i === activeSlotIndex && styles.slotTabTextActive]} numberOfLines={1}>
                      {formatSlotTime(s.start, todayLabel, tomorrowLabel)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : slot ? (
            <LinearGradient
              colors={(ZODIAC_GRADIENTS[slot.zodiac.key] || DEFAULT_GRADIENT) as [string, string, ...string[]]}
              style={styles.slotCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.astroColumns}>
                <TouchableOpacity style={styles.astroCol} onPress={() => navigatePhase(slot)} activeOpacity={0.7}>
                  <Moon3D illumination={getMoonIllumination(new Date())} size={72} />
                  <Text style={styles.astroColName} numberOfLines={1}>{slot.phase.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.astroCol} onPress={() => navigateZodiac(slot)} activeOpacity={0.7}>
                  <Zodiac3D zodiacKey={slot.zodiac.key} size={72} />
                  <Text style={styles.astroColName} numberOfLines={1}>{slot.zodiac.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.astroCol} onPress={() => navigatePlanet(slot)} activeOpacity={0.7}>
                  <Planet3D planetKey={slot.planet.key} size={72} />
                  <Text style={styles.astroColName} numberOfLines={1}>{slot.planet.name}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ) : null}
        </View>

        {/* Version */}
        <Text style={styles.version}>v4.0</Text>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  marketButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(245, 158, 11, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.5)",
  },
  marketButtonText: {
    color: "#fbbf24",
    fontWeight: "700",
    fontSize: 13,
  },
  premiumBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  premiumActive: {
    backgroundColor: "rgba(168, 85, 247, 0.4)",
    borderColor: "#a855f7",
  },
  premiumText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  balanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  balanceText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 3,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 6,
    marginTop: 4,
    textTransform: "uppercase",
  },
  astroCard: {
    overflow: "hidden",
    backgroundColor: "rgba(20, 15, 40, 0.9)",
    padding: 20,
  },
  slotCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    overflow: "hidden",
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 14,
    textAlign: "center",
    minHeight: 18,
  },
  progressBarBg: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 3,
    backgroundColor: "#fbbf24",
    borderRadius: 2,
  },
  slotDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  slotDate: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontWeight: "600",
  },
  slotTabs: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  slotTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  slotTabActive: {
    backgroundColor: "rgba(168, 85, 247, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.4)",
  },
  slotTabText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    fontWeight: "600",
  },
  slotTabTextActive: {
    color: "#c084fc",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  unlockButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(168, 85, 247, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.7)",
  },
  unlockText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  astroColumns: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  astroCol: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },
  astroColName: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  astroColSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginTop: 2,
  },
  languageSection: {
    marginBottom: 20,
  },
  languageGrid: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    borderRadius: 12,
  },
  languageSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderWidth: 1,
    borderColor: "#a855f7",
  },
  flag: {
    fontSize: 20,
  },
  languageLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  languageLabelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  cardsContainer: {
    width: "100%",
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  cardGradient: {
    padding: 24,
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 280,
    marginBottom: 12,
  },
  cardBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(168, 85, 247, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  cardBadgeText: {
    color: "#c084fc",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dreamBadge: {
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    borderColor: "rgba(56, 189, 248, 0.4)",
  },
  dreamBadgeText: {
    color: "#7dd3fc",
  },
  version: {
    color: "rgba(255, 255, 255, 0.2)",
    fontSize: 12,
    marginTop: 24,
  },
});
