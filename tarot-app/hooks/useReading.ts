import { useState } from "react";
import Constants from "expo-constants";
import type {
  Language,
  FocusArea,
  SelectedCard,
  SingleCardReading,
  ThreeCardReading,
} from "../types/tarot";

// Backend API URL - prefers EXPO_PUBLIC_API_URL, falls back to Expo host IP
const hostUri =
  Constants.expoConfig?.hostUri ||
  (Constants as { manifest?: { hostUri?: string } }).manifest?.hostUri ||
  (Constants as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })
    .manifest2?.extra?.expoGo?.debuggerHost;
const host = hostUri ? hostUri.split(":")[0] : "localhost";
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${host}:3001`;

interface SingleCardPayload {
  language: Language;
  spread: "single_card";
  focusArea: FocusArea;
  card: {
    name: string;
    orientation: "upright" | "reversed";
  };
}

interface ThreeCardPayload {
  language: Language;
  spread: "past_present_future";
  cards: Array<{
    position: "past" | "present" | "future";
    name: string;
    orientation: "upright" | "reversed";
  }>;
}

export function useReading() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSingleCardReading = async (
    language: Language,
    selectedCard: SelectedCard,
    focusArea: FocusArea
  ): Promise<SingleCardReading | null> => {
    setLoading(true);
    setError(null);

    const payload: SingleCardPayload = {
      language,
      spread: "single_card",
      focusArea,
      card: {
        name: selectedCard.card.name,
        orientation: selectedCard.orientation,
      },
    };

    try {
      const response = await fetch(`${API_URL}/api/reading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data as SingleCardReading;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getThreeCardReading = async (
    language: Language,
    selectedCards: SelectedCard[]
  ): Promise<ThreeCardReading | null> => {
    setLoading(true);
    setError(null);

    const payload: ThreeCardPayload = {
      language,
      spread: "past_present_future",
      cards: selectedCards.map((sel) => ({
        position: sel.position as "past" | "present" | "future",
        name: sel.card.name,
        orientation: sel.orientation,
      })),
    };

    try {
      const response = await fetch(`${API_URL}/api/reading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data as ThreeCardReading;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPremiumLogs = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/logs/reset`, {
        method: "POST",
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  };

  return {
    loading,
    error,
    getSingleCardReading,
    getThreeCardReading,
    resetPremiumLogs,
  };
}
