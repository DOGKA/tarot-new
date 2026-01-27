import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Language, SpreadType, SelectedCard, FocusArea } from "../types/tarot";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isPremium: boolean;
  togglePremium: () => void;
  spreadType: SpreadType | null;
  setSpreadType: (spread: SpreadType | null) => void;
  focusArea: FocusArea;
  setFocusArea: (area: FocusArea) => void;
  selectedCards: SelectedCard[];
  setSelectedCards: (cards: SelectedCard[]) => void;
  resetReading: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isPremium, setIsPremium] = useState(false);
  const [spreadType, setSpreadType] = useState<SpreadType | null>(null);
  const [focusArea, setFocusArea] = useState<FocusArea>("general");
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);

  const togglePremium = () => setIsPremium((prev) => !prev);

  const resetReading = () => {
    setSpreadType(null);
    setFocusArea("general");
    setSelectedCards([]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isPremium,
        togglePremium,
        spreadType,
        setSpreadType,
        focusArea,
        setFocusArea,
        selectedCards,
        setSelectedCards,
        resetReading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
