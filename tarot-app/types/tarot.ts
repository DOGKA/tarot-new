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
  spiritual: string;
}

export type FocusArea = "general" | "love" | "career" | "spiritual";

export interface TarotData {
  cards: Card[];
}

// Selected card for reading
export interface SelectedCard {
  card: Card;
  orientation: "upright" | "reversed";
  position?: "past" | "present" | "future" | "situation" | "obstacle" | "advice" | "destiny" | "path" | "union" | "optionA" | "optionA_outcome" | "optionB" | "optionB_outcome" | "self" | "block" | "need" | "action" | "potential";
}

// Spread types
export type SpreadType = "single_card" | "past_present_future" | "yes_no" | "situation_obstacle_advice" | "destinys_embrace" | "love_choice" | "path_to_love";

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
  nextStep: string;
}

// SOA (Situation/Obstacle/Advice) Reading Output
export interface SOAReading {
  title: string;
  overall: string;
  beats: {
    situation: string;
    obstacle: string;
    advice: string;
  };
  nextStep: string;
}

// SOA Request
export interface SOARequest {
  language: Language;
  spread: "situation_obstacle_advice";
  isPremium: boolean;
  cards: Array<{
    position: "situation" | "obstacle" | "advice";
    name: string;
    orientation: "upright" | "reversed";
  }>;
}

// Yes/No Request
export interface YesNoRequest {
  language: Language;
  spread: "yes_no";
  focusArea: FocusArea;
  card: {
    name: string;
    orientation: "upright" | "reversed";
  };
}

// Yes/No Reading Output
export interface YesNoReading {
  title: string;
  focusArea: FocusArea;
  answer: "yes" | "no";
  confidence: number; // 55-90
  explanation: string;
  keywords?: string[]; // focusArea'ya göre keywords
}

// Yes/No Clarity Data (for JSON file)
export interface YesNoClarityData {
  clarityWeight: number;
  keywords: {
    [lang in Language]: {
      [area in FocusArea]: [string, string];
    };
  };
}

// Destiny's Embrace Reading Output
export interface DestinysEmbraceReading {
  title: string;
  overall: string;
  beats: {
    destiny: string;
    path: string;
    union: string;
  };
  nextStep: string;
  keywords: string[];
}

// Love Choice Reading Output (5 kart)
export interface LoveChoiceReading {
  title: string;
  overall: string;
  beats: {
    optionA: string;
    optionA_outcome: string;
    optionB: string;
    optionB_outcome: string;
    advice: string;
  };
  decisionLens: string;
  nextStep: string;
  keywords: string[];
}

// Path to Love Reading Output (5 kart)
export interface PathToLoveReading {
  title: string;
  overall: string;
  beats: {
    self: string;
    block: string;
    need: string;
    action: string;
    potential: string;
  };
  strategy: string;
  nextStep: string;
  keywords: string[];
}
