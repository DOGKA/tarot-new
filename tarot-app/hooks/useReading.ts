import { useState } from "react";
import Constants from "expo-constants";
import type {
  Language,
  FocusArea,
  SelectedCard,
  SingleCardReading,
  ThreeCardReading,
  SOAReading,
  DestinysEmbraceReading,
  LoveChoiceReading,
  PathToLoveReading,
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

interface SOAPayload {
  language: Language;
  spread: "situation_obstacle_advice";
  isPremium: boolean;
  cards: Array<{
    position: "situation" | "obstacle" | "advice";
    name: string;
    orientation: "upright" | "reversed";
  }>;
}

interface DestinysEmbracePayload {
  language: Language;
  spread: "destinys_embrace";
  isPremium: boolean;
  cards: Array<{
    position: "destiny" | "path" | "union";
    name: string;
    orientation: "upright" | "reversed";
  }>;
}

interface LoveChoicePayload {
  language: Language;
  spread: "love_choice";
  isPremium: boolean;
  cards: Array<{
    position: "optionA" | "optionA_outcome" | "optionB" | "optionB_outcome" | "advice";
    name: string;
    orientation: "upright" | "reversed";
  }>;
}

interface PathToLovePayload {
  language: Language;
  spread: "path_to_love";
  isPremium: boolean;
  cards: Array<{
    position: "self" | "block" | "need" | "action" | "potential";
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

  const getSOAReading = async (
    language: Language,
    selectedCards: SelectedCard[]
  ): Promise<SOAReading | null> => {
    setLoading(true);
    setError(null);

    const payload: SOAPayload = {
      language,
      spread: "situation_obstacle_advice",
      isPremium: true,
      cards: selectedCards.map((sel) => ({
        position: sel.position as "situation" | "obstacle" | "advice",
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
      return data as SOAReading;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDestinysEmbraceReading = async (
    language: Language,
    selectedCards: SelectedCard[]
  ): Promise<DestinysEmbraceReading | null> => {
    setLoading(true);
    setError(null);

    const payload: DestinysEmbracePayload = {
      language,
      spread: "destinys_embrace",
      isPremium: true,
      cards: selectedCards.map((sel) => ({
        position: sel.position as "destiny" | "path" | "union",
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
      return data as DestinysEmbraceReading;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLoveChoiceReading = async (
    language: Language,
    selectedCards: SelectedCard[]
  ): Promise<LoveChoiceReading | null> => {
    setLoading(true);
    setError(null);

    const payload: LoveChoicePayload = {
      language,
      spread: "love_choice",
      isPremium: true,
      cards: selectedCards.map((sel) => ({
        position: sel.position as "optionA" | "optionA_outcome" | "optionB" | "optionB_outcome" | "advice",
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
      return data as LoveChoiceReading;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPathToLoveReading = async (
    language: Language,
    selectedCards: SelectedCard[]
  ): Promise<PathToLoveReading | null> => {
    setLoading(true);
    setError(null);

    const payload: PathToLovePayload = {
      language,
      spread: "path_to_love",
      isPremium: true,
      cards: selectedCards.map((sel) => ({
        position: sel.position as "self" | "block" | "need" | "action" | "potential",
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
      return data as PathToLoveReading;
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
    getSOAReading,
    getDestinysEmbraceReading,
    getLoveChoiceReading,
    getPathToLoveReading,
    resetPremiumLogs,
  };
}
