import React, { useEffect, useState } from "react";
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
import { GradientBackground, GlassCard } from "../components/ui";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
const API_URL = `http://${host}:3001/api/dream`;

interface GemPackage {
  id: string;
  gems: number;
  bonus: number;
  total: number;
  priceUSD: number;
  perGem: number;
}

interface PremiumPlan {
  id: string;
  priceUSD: number;
  bonusGems: number;
  durationDays: number;
}

// Base price per gem (50-pack = no discount)
const BASE_PER_GEM = 0.0798;

export default function MarketScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { gemstoneBalance, isPremium, fetchUserInfo } = useApp();

  const [packages, setPackages] = useState<GemPackage[]>([
    { id: "pack_50", gems: 50, bonus: 0, total: 50, priceUSD: 3.99, perGem: 0.0798 },
    { id: "pack_100", gems: 75, bonus: 25, total: 100, priceUSD: 5.99, perGem: 0.0599 },
    { id: "pack_250", gems: 150, bonus: 100, total: 250, priceUSD: 11.99, perGem: 0.04796 },
    { id: "pack_500", gems: 250, bonus: 250, total: 500, priceUSD: 19.99, perGem: 0.03998 },
  ]);
  const [premiumPlans, setPremiumPlans] = useState<{ monthly?: PremiumPlan; yearly?: PremiumPlan }>({
    monthly: { id: "premium_monthly", priceUSD: 9.99, bonusGems: 100, durationDays: 30 },
    yearly: { id: "premium_yearly", priceUSD: 59.99, bonusGems: 100, durationDays: 365 },
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      console.log("Market: fetching prices from", `${API_URL}/prices`);
      const res = await fetch(`${API_URL}/prices`);
      if (res.ok) {
        const data = await res.json();
        console.log("Market: packages=", data.packages?.length, "plans=", !!data.premiumSubscription);
        setPackages(data.packages || []);
        setPremiumPlans({
          monthly: data.premiumSubscription?.monthly,
          yearly: data.premiumSubscription?.yearly,
        });
      } else {
        console.warn("Market: prices fetch failed", res.status);
      }
    } catch (err) {
      console.warn("Market: fetch error", err);
    }
  };

  const getDiscount = (perGem: number): number => {
    if (perGem >= BASE_PER_GEM) return 0;
    return Math.round((1 - perGem / BASE_PER_GEM) * 100);
  };

  const getNormalPrice = (total: number): string => {
    return (total * BASE_PER_GEM).toFixed(2);
  };

  // Bilgi amaçli ekran — satin alma entegrasyonu sonra eklenecek

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Market</Text>
          <View style={styles.balanceBadge}>
            <Text style={styles.balanceText}>💎 {gemstoneBalance}</Text>
          </View>
        </View>

        {/* Premium Subscription */}
        <Text style={styles.sectionTitle}>Premium Abonelik</Text>

        {isPremium && (
          <View style={styles.activeTag}>
            <Text style={styles.activeTagText}>Aktif Premium Uye</Text>
          </View>
        )}

        {premiumPlans.monthly && (
          <View>
            <LinearGradient
              colors={["rgba(168, 85, 247, 0.35)", "rgba(99, 102, 241, 0.2)"]}
              style={styles.subscriptionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.subRow}>
                <View>
                  <Text style={styles.subTitle}>Aylik Premium</Text>
                  <Text style={styles.subDesc}>Dream C + 3-5 kart acilimlar</Text>
                </View>
                <View style={styles.subPriceBox}>
                  <Text style={styles.subPrice}>${premiumPlans.monthly.priceUSD}</Text>
                  <Text style={styles.subPeriod}>/ay</Text>
                </View>
              </View>
              <View style={styles.subBonusRow}>
                <Text style={styles.subBonus}>+{premiumPlans.monthly.bonusGems} gemstone hediye</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {premiumPlans.yearly && (
          <View>
            <LinearGradient
              colors={["rgba(245, 158, 11, 0.3)", "rgba(234, 88, 12, 0.15)"]}
              style={styles.subscriptionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.bestValueTag}>
                <Text style={styles.bestValueText}>En Avantajli</Text>
              </View>
              <View style={styles.subRow}>
                <View>
                  <Text style={styles.subTitle}>Yillik Premium</Text>
                  <Text style={styles.subDesc}>~$5/ay - %50 tasarruf</Text>
                </View>
                <View style={styles.subPriceBox}>
                  <Text style={styles.subPrice}>${premiumPlans.yearly.priceUSD}</Text>
                  <Text style={styles.subPeriod}>/yil</Text>
                </View>
              </View>
              <View style={styles.subBonusRow}>
                <Text style={styles.subBonus}>+{premiumPlans.yearly.bonusGems} gemstone hediye</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Gemstone Packages */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Gemstone Paketleri</Text>

        {packages.map((pkg, i) => {
          const discount = getDiscount(pkg.perGem);
          const normalPrice = getNormalPrice(pkg.total);
          const isBest = i === packages.length - 1;

          return (
            <View key={pkg.id}>
              <GlassCard style={styles.packageCard}>
                {isBest && (
                  <View style={styles.popularTag}>
                    <Text style={styles.popularTagText}>En Populer</Text>
                  </View>
                )}
                <View style={styles.packageRow}>
                  {/* Left: gem count + bonus inline */}
                  <View style={styles.packageLeft}>
                    <View style={styles.packageGemsRow}>
                      <Text style={styles.packageGems}>💎 {pkg.total}</Text>
                      {pkg.bonus > 0 && (
                        <Text style={styles.packageBonus}>({pkg.bonus} bonus)</Text>
                      )}
                    </View>
                  </View>

                  {/* Right: price */}
                  <View style={styles.packageRight}>
                    {discount > 0 && (
                      <Text style={styles.normalPrice}>${normalPrice}</Text>
                    )}
                    <Text style={styles.packagePrice}>${pkg.priceUSD}</Text>
                    {discount > 0 && (
                      <View style={styles.discountTag}>
                        <Text style={styles.discountText}>%{discount} indirim</Text>
                      </View>
                    )}
                  </View>
                </View>
              </GlassCard>
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
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
  sectionTitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  activeTag: {
    backgroundColor: "rgba(168, 85, 247, 0.25)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.4)",
  },
  activeTagText: {
    color: "#c084fc",
    fontSize: 13,
    fontWeight: "700",
  },
  subscriptionCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  bestValueTag: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  bestValueText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  subDesc: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    marginTop: 2,
  },
  subPriceBox: {
    alignItems: "flex-end",
  },
  subPrice: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },
  subPeriod: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 11,
  },
  subBonusRow: {
    marginTop: 10,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
  },
  subBonus: {
    color: "#4ade80",
    fontSize: 12,
    fontWeight: "600",
  },
  packageCard: {
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  popularTag: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#22c55e",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
    zIndex: 10,
  },
  popularTagText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  packageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packageLeft: {
    flex: 1,
  },
  packageGemsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  packageGems: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  packageBonus: {
    color: "#4ade80",
    fontSize: 12,
    fontWeight: "600",
  },
  packageRight: {
    alignItems: "flex-end",
  },
  normalPrice: {
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: 13,
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  packagePrice: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  discountTag: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  discountText: {
    color: "#4ade80",
    fontSize: 11,
    fontWeight: "700",
  },
  bottomPadding: {
    height: 30,
  },
});
