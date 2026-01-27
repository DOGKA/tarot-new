// Card data types
export interface Card {
  id: number;
  name: string;
  image: string;
  arcana: "major" | "minor";
  number: string;
  suit: "wands" | "cups" | "swords" | "pentacles" | null;
  element: "fire" | "water" | "air" | "earth" | null;
  meanings: {
    upright: CategoryMeanings;
    reversed: CategoryMeanings;
  };
}

export interface CategoryMeanings {
  general: string;
  love: string;
  career: string;
  finance: string;
}

export type FocusArea = "general" | "love" | "career" | "finance";

export interface TarotData {
  cards: Card[];
}

// Selected card for reading
export interface SelectedCard {
  card: Card;
  orientation: "upright" | "reversed";
  position?: "past" | "present" | "future";
}

// Spread types
export type SpreadType = "single_card" | "past_present_future";

// Language types
export type Language = "en" | "tr" | "de" | "es";

// User type
export interface User {
  isPremium: boolean;
}

// API Request types
export interface SingleCardRequest {
  language: Language;
  spread: "single_card";
  focusArea: FocusArea;
  card: {
    name: string;
    orientation: "upright" | "reversed";
  };
}

export interface ThreeCardRequest {
  language: Language;
  spread: "past_present_future";
  cards: Array<{
    position: "past" | "present" | "future";
    name: string;
    orientation: "upright" | "reversed";
  }>;
}

export interface SingleCardReading {
  title: string;
  overall: string;
  focusArea: FocusArea;
  deepDive: string;
  shadow: string;
  nextStep: string;
  journal: string;
}

// Premium output types - Three Card
export interface ThreeCardReading {
  title: string;
  overall: string;
  throughline: string;
  story: string;
  beats: {
    past: string;
    present: string;
    future: string;
  };
  choice: {
    pathA: string;
    pathB: string;
  };
  keywords: string[];
  mood: string;
  timing: string;
  nextStep: string;
}
