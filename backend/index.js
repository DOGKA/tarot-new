require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// Import language-specific prompts
const { getSystemMessage, buildSinglePrompt, buildPpfPrompt, buildYesNoPrompt, buildSoaPrompt, buildDestinysEmbracePrompt, buildLoveChoicePrompt, buildPathToLovePrompt, buildNewMoonPrompt, buildFullMoonPrompt, buildMbsPrompt, buildCelestialPrompt, buildCareerClarityPrompt, buildCareerPathGuidePrompt, buildNewBusinessPrompt, buildWealthFlowPrompt } = require("./prompts");

const app = express();
app.use(cors());
app.use(express.json());

const logsDir = path.join(__dirname, "data");
const logsFilePath = path.join(logsDir, "premium-readings.json");

// Data folder base path
const dataBasePath = path.join(__dirname, "../tarot-app/data");

// Load Yes/No data for all languages
const yesNoClarityByLang = {};
const yesNoAnswersByLang = {};
const supportedLanguages = ['tr', 'en', 'de', 'es'];

supportedLanguages.forEach(lang => {
  // Load clarity data: data/{lang}/yesno-clarity.json
  const clarityPath = path.join(dataBasePath, lang, "yesno-clarity.json");
  try {
    yesNoClarityByLang[lang] = JSON.parse(fs.readFileSync(clarityPath, "utf8"));
    console.log(`Loaded ${lang}/yesno-clarity.json`);
  } catch (e) {
    console.warn(`Could not load ${lang}/yesno-clarity.json:`, e.message);
  }
  
  // Load answers data: data/{lang}/yesno-answers.json
  const answersPath = path.join(dataBasePath, lang, "yesno-answers.json");
  try {
    yesNoAnswersByLang[lang] = JSON.parse(fs.readFileSync(answersPath, "utf8"));
    console.log(`Loaded ${lang}/yesno-answers.json`);
  } catch (e) {
    console.warn(`Could not load ${lang}/yesno-answers.json:`, e.message);
  }
});

// Get clarity data for a specific language (fallback to TR then EN)
const getYesNoClarityData = (language, cardName) => {
  if (yesNoClarityByLang[language] && yesNoClarityByLang[language][cardName]) {
    return yesNoClarityByLang[language][cardName];
  }
  if (yesNoClarityByLang.en && yesNoClarityByLang.en[cardName]) {
    return yesNoClarityByLang.en[cardName];
  }
  return null;
};

// Get Yes/No answer based on card, orientation and language
const getYesNoAnswer = (language, cardName, orientation) => {
  const langAnswers = yesNoAnswersByLang[language] || yesNoAnswersByLang.en;
  if (langAnswers && langAnswers[cardName] && langAnswers[cardName][orientation]) {
    return langAnswers[cardName][orientation];
  }
  // Fallback to simple rule (should not happen if data is correct)
  console.warn(`Answer not found for: ${language}/${cardName}/${orientation}`);
  return orientation === "upright" ? "yes" : "no";
};

const ensureLogsFile = () => {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  if (!fs.existsSync(logsFilePath)) {
    fs.writeFileSync(logsFilePath, JSON.stringify([], null, 2), "utf8");
  }
};

const appendLog = (entry) => {
  ensureLogsFile();
  const raw = fs.readFileSync(logsFilePath, "utf8");
  const logs = raw ? JSON.parse(raw) : [];
  logs.push(entry);
  fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2), "utf8");
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const languageProfiles = {
  tr: {
    code: "tr",
    nativeName: "Türkçe",
    singleLabel: "Tek Kart",
    threeLabel: "Üç Kart",
    yesNoLabel: "Evet / Hayır",
    soaLabel: "Durum/Engel/Tavsiye",
    destinysEmbraceLabel: "Kaderin Kucağı",
    loveChoiceLabel: "Aşk Seçimi",
    pathToLoveLabel: "Aşka Giden Yol",
    newMoonLabel: "Yeni Ay Ritüeli",
    fullMoonLabel: "Dolunay Arınması",
    mbsLabel: "Zihin · Beden · Ruh",
    celestialLabel: "Kozmik Aydınlanma",
    careerClarityLabel: "Kariyer Netliği",
    careerPathGuideLabel: "Kariyer Yol Haritası",
    newBusinessLabel: "Yeni İş Keşfi",
    wealthFlowLabel: "Finansal Akış",
    tone: "Modern, psikolojik ve yüzleştirici yaz. Kısa ve net cümleler kur.",
    address: "Tüm metin 'sen' diliyle yazılacak. 'siz' kullanma.",
    singleRules:
      "Her zaman hem nextStep (1 cümle) hem journal (1 soru) üret. focusArea dışındaki alanlardan bahsetme. nextStep emir kipinde tek aksiyon olsun. journal tek soru işareti ile bitsin.",
    orientation: { upright: "Düz", reversed: "Ters" },
    yesNoAnswer: { yes: "Evet", no: "Hayır" },
  },
  en: {
    code: "en",
    nativeName: "English",
    singleLabel: "Single Card",
    threeLabel: "Three Cards",
    yesNoLabel: "Yes / No",
    soaLabel: "Situation/Obstacle/Advice",
    destinysEmbraceLabel: "Destiny's Embrace",
    loveChoiceLabel: "Love Choice",
    pathToLoveLabel: "Path to Love",
    newMoonLabel: "New Moon Ritual",
    fullMoonLabel: "Full Moon Release",
    mbsLabel: "Mind · Body · Spirit",
    celestialLabel: "Celestial Illumination",
    careerClarityLabel: "Career Clarity",
    careerPathGuideLabel: "Career Path Guide",
    newBusinessLabel: "New Business Exploration",
    wealthFlowLabel: "Wealth Flow",
    tone: "Write in a modern, direct, practical tone. Short, clear sentences.",
    address: "Use a direct 'you' voice throughout.",
    singleRules:
      "Always include nextStep (1 sentence) and journal (1 question). Do not mention areas outside focusArea. nextStep must be an imperative single action. journal must end with a single question mark.",
    orientation: { upright: "Upright", reversed: "Reversed" },
    yesNoAnswer: { yes: "Yes", no: "No" },
  },
  de: {
    code: "de",
    nativeName: "Deutsch",
    singleLabel: "Einzelkarte",
    threeLabel: "Drei Karten",
    yesNoLabel: "Ja / Nein",
    soaLabel: "Situation/Hindernis/Rat",
    destinysEmbraceLabel: "Umarmung des Schicksals",
    loveChoiceLabel: "Liebeswahl",
    pathToLoveLabel: "Weg zur Liebe",
    newMoonLabel: "Neumond-Ritual",
    fullMoonLabel: "Vollmond-Freigabe",
    mbsLabel: "Geist · Körper · Seele",
    celestialLabel: "Himmlische Erleuchtung",
    careerClarityLabel: "Karriere-Klarheit",
    careerPathGuideLabel: "Karriere-Wegweiser",
    newBusinessLabel: "Neue Geschäftserkundung",
    wealthFlowLabel: "Vermögensfluss",
    tone: "Schreibe modern, klar und psychologisch präzise. Kurze Sätze.",
    address: "Direkte Anrede in der Du-Form.",
    singleRules:
      "Erzeuge immer nextStep (1 Satz) und journal (1 Frage). Sprich nur über focusArea. nextStep als klarer Imperativ mit einer Aktion. journal endet mit genau einem Fragezeichen.",
    orientation: { upright: "Aufrecht", reversed: "Umgekehrt" },
    yesNoAnswer: { yes: "Ja", no: "Nein" },
  },
  es: {
    code: "es",
    nativeName: "Español",
    singleLabel: "Una carta",
    threeLabel: "Tres cartas",
    yesNoLabel: "Sí / No",
    soaLabel: "Situación/Obstáculo/Consejo",
    destinysEmbraceLabel: "Abrazo del Destino",
    loveChoiceLabel: "Elección de Amor",
    pathToLoveLabel: "Camino al Amor",
    newMoonLabel: "Ritual de Luna Nueva",
    fullMoonLabel: "Liberación de Luna Llena",
    mbsLabel: "Mente · Cuerpo · Espíritu",
    celestialLabel: "Iluminación Celestial",
    careerClarityLabel: "Claridad Profesional",
    careerPathGuideLabel: "Guía de Carrera",
    newBusinessLabel: "Exploración de Nuevo Negocio",
    wealthFlowLabel: "Flujo de Riqueza",
    tone: "Escribe con un tono moderno, directo y psicológico. Frases cortas.",
    address: "Usa la segunda persona (tú) en todo el texto.",
    singleRules:
      "Incluye siempre nextStep (1 frase) y journal (1 pregunta). No menciones áreas fuera de focusArea. nextStep debe ser un imperativo con una sola acción. journal termina con un solo signo de interrogación.",
    orientation: { upright: "Derecha", reversed: "Invertida" },
    yesNoAnswer: { yes: "Sí", no: "No" },
  },
};

const allowedFocusAreas = ["general", "love", "career", "spiritual"];
const allowedLanguages = ["tr", "en", "de", "es"];

// Prompts are now in separate files: backend/prompts/{tr,en,de,es}.js

// Calculate confidence for Yes/No (deterministic)
// clarityWeight tüm dillerde aynı
const calculateConfidence = (language, cardName, orientation) => {
  const clarityData = getYesNoClarityData(language, cardName) || { clarityWeight: 10 };
  const base = 55;
  const orientationAdj = orientation === "upright" ? 5 : -5;
  return Math.min(90, Math.max(55, base + clarityData.clarityWeight + orientationAdj));
};

// Get keywords for Yes/No explanation (fallback when shortReason not available)
const getYesNoKeywords = (cardName, language, focusArea) => {
  const clarityData = getYesNoClarityData(language, cardName);
  if (!clarityData || !clarityData.keywords) {
    return ["enerji", "işaret"];
  }
  return clarityData.keywords[focusArea] || clarityData.keywords.general || ["enerji", "işaret"];
};

// FREE Yes/No explanation templates (deterministic fallback)
const yesNoFreeTemplates = {
  tr: {
    upright: (kw1, kw2) => `Kart dik geldiği için yanıt Evet. ${kw1}, ${kw2} teması öne çıkıyor.`,
    reversed: (kw1, kw2) => `Kart ters geldiği için yanıt Hayır. ${kw1}, ${kw2} konusunda dikkat gerekiyor.`
  },
  en: {
    upright: (kw1, kw2) => `Card is upright, the answer is Yes. ${kw1}, ${kw2} theme emerges.`,
    reversed: (kw1, kw2) => `Card is reversed, the answer is No. Caution needed regarding ${kw1}, ${kw2}.`
  },
  de: {
    upright: (kw1, kw2) => `Die Karte ist aufrecht, die Antwort ist Ja. ${kw1}, ${kw2} Thema tritt hervor.`,
    reversed: (kw1, kw2) => `Die Karte ist umgekehrt, die Antwort ist Nein. Vorsicht bei ${kw1}, ${kw2}.`
  },
  es: {
    upright: (kw1, kw2) => `La carta está derecha, la respuesta es Sí. El tema de ${kw1}, ${kw2} emerge.`,
    reversed: (kw1, kw2) => `La carta está invertida, la respuesta es No. Precaución con ${kw1}, ${kw2}.`
  }
};

// System messages are now in separate files: backend/prompts/{tr,en,de,es}.js

const splitSentences = (text) => {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  if (!matches) {
    return [text.trim()].filter(Boolean);
  }
  return matches.map((s) => s.trim()).filter(Boolean);
};

const clampStory = (story) => {
  const sentences = splitSentences(story);
  if (sentences.length > 6) {
    return sentences.slice(0, 6).join(" ");
  }
  return story;
};

const detectJsonWrapperWarns = (content) => {
  const warns = [];
  const trimmed = (content || "").trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    warns.push("jsonNotTightBraces");
  }
  if (/here\s+is\s+the\s+json/i.test(trimmed) || /aşağıdaki\s+json/i.test(trimmed)) {
    warns.push("jsonWrapperText");
  }
  return warns;
};

const getQuestionMarkCount = (text) => (text.match(/\?/g) || []).length;

const journalWarns = (journal) => {
  const warns = [];
  const t = (journal || "").trim();
  if (!t) return ["journalEmpty"];
  if (!t.endsWith("?")) warns.push("journalNotEndingQuestionMark");
  const qCount = getQuestionMarkCount(t);
  if (qCount !== 1) warns.push(`journalQuestionMarkCount:${qCount}`);
  return warns;
};

const nextStepWarns = (nextStep) => {
  const warns = [];
  const t = (nextStep || "").trim();
  if (!t) return ["nextStepEmpty"];
  const sentenceCount = splitSentences(t).length;
  if (sentenceCount > 1) warns.push("nextStepMultiSentence");
  if (/[;,]/.test(t) || /\b(and|then|sonra|ve)\b/i.test(t)) {
    warns.push("nextStepMayBeMultiAction");
  }
  return warns;
};

const focusLeakWarns = ({ focusArea, text }) => {
  const warns = [];
  const t = (text || "").toLowerCase();
  const leakTerms = {
    love: ["love", "relationship", "partner", "aşk", "ilişki", "romantik", "liebe", "beziehung", "amor", "relación"],
    career: ["career", "job", "work", "kariyer", "iş", "meslek", "beruf", "arbeit", "carrera", "trabajo"],
    spiritual: ["spiritual", "soul", "inner", "ruhsal", "ruh", "içsel", "spirituell", "seele", "espiritual", "alma", "meditasyon", "farkındalık"],
  };
  ["love", "career", "spiritual"].forEach((area) => {
    if (area === focusArea) return;
    if (leakTerms[area].some((w) => t.includes(w))) {
      warns.push(`focusLeak:${area}`);
    }
  });
  return warns;
};

const validateSingle = (data) => {
  const required = ["title", "overall", "focusArea", "deepDive", "shadow", "nextStep", "journal"];
  if (!data || typeof data !== "object") return false;
  for (const key of required) {
    if (typeof data[key] !== "string" || !data[key].trim()) return false;
  }
  if (!data.journal.trim().endsWith("?")) return false;
  if (getQuestionMarkCount(data.journal.trim()) !== 1) return false;
  if (splitSentences(data.nextStep).length > 1) return false;
  return ["general", "love", "career", "spiritual"].includes(data.focusArea);
};

const validatePpf = (data, profile) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "throughline", "story", "beats", "choice", "keywords", "mood", "nextStep"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.throughline !== "string" || !data.throughline.trim()) return false;
  if (typeof data.story !== "string" || !data.story.trim()) return false;
  if (typeof data.mood !== "string" || !data.mood.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["past", "present", "future"].every((k) => typeof data.beats[k] === "string")) return false;
  if (!data.choice || typeof data.choice !== "object") return false;
  if (!["pathA", "pathB"].every((k) => typeof data.choice[k] === "string")) return false;
  if (!Array.isArray(data.keywords) || data.keywords.length !== 3) return false;
  if (!data.keywords.every((k) => typeof k === "string" && k.trim())) return false;
  if (/\s/.test(data.mood.trim())) return false;

  const sentenceCount = splitSentences(data.story).length;
  if (sentenceCount < 4) return false;
  return true;
};

const validateSoa = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "beats", "nextStep"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["situation", "obstacle", "advice"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  return true;
};

const validateDestinysEmbrace = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "beats", "nextStep", "keywords"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["destiny", "path", "union"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  if (!Array.isArray(data.keywords) || data.keywords.length !== 3) return false;
  if (!data.keywords.every((k) => typeof k === "string" && k.trim())) return false;

  return true;
};

const validateLoveChoice = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "beats", "decisionLens", "nextStep", "keywords"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.decisionLens !== "string" || !data.decisionLens.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  // 5 kart: optionA, optionA_outcome, optionB, optionB_outcome, advice
  if (!["optionA", "optionA_outcome", "optionB", "optionB_outcome", "advice"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  if (!Array.isArray(data.keywords) || data.keywords.length !== 3) return false;
  if (!data.keywords.every((k) => typeof k === "string" && k.trim())) return false;

  return true;
};

const validatePathToLove = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "beats", "strategy", "nextStep", "keywords"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.strategy !== "string" || !data.strategy.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  // 5 kart: self, block, need, action, potential
  if (!["self", "block", "need", "action", "potential"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  if (!Array.isArray(data.keywords) || data.keywords.length !== 3) return false;
  if (!data.keywords.every((k) => typeof k === "string" && k.trim())) return false;

  return true;
};

// ============================================
// SPIRITUAL SPREAD VALIDATORS
// ============================================

const validateNewMoon = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "ritualTheme", "beats", "affirmation", "nextStep", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.ritualTheme !== "string" || !data.ritualTheme.trim()) return false;
  if (typeof data.affirmation !== "string" || !data.affirmation.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["intention", "seed", "shadow", "support", "firstStep"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  return true;
};

const validateFullMoon = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "releaseTheme", "beats", "cleansingAdvice", "affirmation", "nextStep", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.releaseTheme !== "string" || !data.releaseTheme.trim()) return false;
  if (typeof data.cleansingAdvice !== "string" || !data.cleansingAdvice.trim()) return false;
  if (typeof data.affirmation !== "string" || !data.affirmation.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["illumination", "tension", "lesson", "release", "integration"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  return true;
};

const validateMbs = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "harmonyScore", "beats", "alignmentAdvice", "nextStep", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.harmonyScore !== "number" || data.harmonyScore < 0 || data.harmonyScore > 100) return false;
  if (typeof data.alignmentAdvice !== "string" || !data.alignmentAdvice.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["mind", "body", "spirit"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  return true;
};

const validateCelestial = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "celestialMessage", "beats", "omenKeywords", "nextStep", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.celestialMessage !== "string" || !data.celestialMessage.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["signal", "guidance", "integration"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  if (!Array.isArray(data.omenKeywords) || data.omenKeywords.length !== 3) return false;
  if (!data.omenKeywords.every((k) => typeof k === "string" && k.trim())) return false;

  return true;
};

// ============================================
// CAREER SPREAD VALIDATORS
// ============================================

const validateCareerClarity = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "throughline", "directionHint", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.throughline !== "string" || !data.throughline.trim()) return false;
  if (typeof data.directionHint !== "string" || !data.directionHint.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  return true;
};

const validateCareerPathGuide = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "beats", "directionHint", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.directionHint !== "string" || !data.directionHint.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["strength", "opportunity", "direction"].every((k) => typeof data.beats[k] === "string" && data.beats[k].trim())) return false;

  return true;
};

const validateNewBusiness = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "strategy", "riskNote", "directionHint", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.strategy !== "string" || !data.strategy.trim()) return false;
  if (typeof data.riskNote !== "string" || !data.riskNote.trim()) return false;
  if (typeof data.directionHint !== "string" || !data.directionHint.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  return true;
};

const validateWealthFlow = (data) => {
  if (!data || typeof data !== "object") return false;
  const required = ["title", "overall", "flowInsight", "optimization", "directionHint", "journal"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.flowInsight !== "string" || !data.flowInsight.trim()) return false;
  if (typeof data.optimization !== "string" || !data.optimization.trim()) return false;
  if (typeof data.directionHint !== "string" || !data.directionHint.trim()) return false;
  if (typeof data.journal !== "string" || !data.journal.trim()) return false;
  if (!data.journal.trim().endsWith("?")) return false;

  return true;
};

const parseJsonFromContent = (content) => {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? jsonMatch[0] : content;
  return JSON.parse(raw);
};

app.post("/api/reading", async (req, res) => {
  try {
    const { language, spread, card, cards } = req.body;
    
    // Debug log
    console.log("=== API REQUEST ===");
    console.log("Spread:", spread);
    console.log("Language:", language);
    console.log("Cards:", cards ? cards.length : "undefined");
    if (cards) {
      console.log("Card positions:", cards.map(c => c.position));
    }
    
    // Strict language validation
    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        error: "Invalid language",
        message: `Language must be one of: ${allowedLanguages.join(", ")}`,
        received: language,
      });
    }
    
    const profile = languageProfiles[language];
    const requestedFocusArea =
      (spread === "single_card" || spread === "yes_no") ? req.body.focusArea : null;
    const focusArea = allowedFocusAreas.includes(requestedFocusArea)
      ? requestedFocusArea
      : "general";
    const isPremium = req.body.isPremium === true;
    
    // YES/NO SPREAD HANDLER
    if (spread === "yes_no" && card) {
      const answer = getYesNoAnswer(language, card.name, card.orientation);
      const confidence = calculateConfidence(language, card.name, card.orientation);
      const orientationLabel = card.orientation === "upright" 
        ? profile.orientation.upright 
        : profile.orientation.reversed;
      
      // FREE: Deterministic response
      if (!isPremium) {
        let explanation = "";
        let keywords = [];
        
        const clarityData = getYesNoClarityData(language, card.name);
        
        if (clarityData && clarityData.shortReason) {
          // Use language-specific shortReason + keywords
          explanation = clarityData.shortReason[card.orientation];
          keywords = clarityData.keywords[focusArea] || clarityData.keywords.general || [];
        } else {
          // Fallback: Use template system
          keywords = getYesNoKeywords(card.name, language, focusArea);
          const template = yesNoFreeTemplates[language] || yesNoFreeTemplates.en;
          explanation = template[card.orientation](keywords[0], keywords[1]);
        }
        
        const freeResponse = {
          title: `${card.name} — ${profile.yesNoLabel}`,
          focusArea,
          answer,
          confidence,
          explanation,
          keywords, // focusArea'ya göre keywords
        };
        
        appendLog({
          timestamp: new Date().toISOString(),
          type: "yes_no_free",
          language,
          focusArea,
          card: { name: card.name, orientation: card.orientation },
          response: freeResponse,
        });
        
        return res.json(freeResponse);
      }
      
      // PREMIUM: GPT call for explanation
      const yesNoPrompt = buildYesNoPrompt(language, {
        profile,
        cardName: card.name,
        orientationLabel,
        focusArea,
        answer,
        confidence,
      });
      
      // Get keywords from JSON (same as FREE)
      const clarityData = getYesNoClarityData(language, card.name);
      const keywords = clarityData?.keywords?.[focusArea] || clarityData?.keywords?.general || [];
      
      try {
        const systemMessage = getSystemMessage(language);
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: yesNoPrompt },
          ],
          temperature: 0.7,
          max_tokens: 200,
        });
        
        const content = completion.choices[0]?.message?.content || "";
        const parsed = parseJsonFromContent(content);
        
        const premiumResponse = {
          title: `${card.name} — ${profile.yesNoLabel}`,
          focusArea,
          answer,
          confidence, // Always deterministic (netlik derecesi)
          explanation: parsed.explanation || "No explanation available.",
          keywords, // focusArea'ya göre keywords (JSON'dan)
        };
        
        appendLog({
          timestamp: new Date().toISOString(),
          type: "yes_no_premium",
          language,
          focusArea,
          card: { name: card.name, orientation: card.orientation },
          prompt: yesNoPrompt,
          rawResponse: content,
          response: premiumResponse,
        });
        
        return res.json(premiumResponse);
      } catch (error) {
        console.error("Yes/No Premium error:", error);
        // Fallback to FREE response on error
        const keywords = getYesNoKeywords(card.name, language, focusArea);
        const template = yesNoFreeTemplates[language] || yesNoFreeTemplates.en;
        const explanation = template[card.orientation](keywords[0], keywords[1]);
        
        return res.json({
          title: `${card.name} — ${profile.yesNoLabel}`,
          focusArea,
          answer,
          confidence,
          explanation,
        });
      }
    }
    
    const structureId = spread === "single_card" ? "single_v15_minimal" : "ppf_v15_story";

    let prompt = "";

    if (spread === "single_card" && card) {
      const orientationLabel =
        card.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      prompt = buildSinglePrompt(language, {
        profile,
        cardName: card.name,
        orientationLabel,
        focusArea,
      });
    } else if (spread === "past_present_future" && cards) {
      const past = cards.find((c) => c.position === "past");
      const present = cards.find((c) => c.position === "present");
      const future = cards.find((c) => c.position === "future");

      const pastOrientation =
        past?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const presentOrientation =
        present?.orientation === "upright"
          ? profile.orientation.upright
          : profile.orientation.reversed;
      const futureOrientation =
        future?.orientation === "upright"
          ? profile.orientation.upright
          : profile.orientation.reversed;

      prompt = buildPpfPrompt(language, {
        profile,
        pastCard: past?.name || "?",
        presentCard: present?.name || "?",
        futureCard: future?.name || "?",
        pastOrientation,
        presentOrientation,
        futureOrientation,
      });
    } else if (spread === "situation_obstacle_advice" && cards) {
      // SOA SPREAD HANDLER
      const situation = cards.find((c) => c.position === "situation");
      const obstacle = cards.find((c) => c.position === "obstacle");
      const advice = cards.find((c) => c.position === "advice");

      const situationOrientation =
        situation?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const obstacleOrientation =
        obstacle?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const adviceOrientation =
        advice?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildSoaPrompt(language, {
        profile,
        situationCard: situation?.name || "?",
        obstacleCard: obstacle?.name || "?",
        adviceCard: advice?.name || "?",
        situationOrientation,
        obstacleOrientation,
        adviceOrientation,
      });
    } else if (spread === "destinys_embrace" && cards) {
      // DESTINY'S EMBRACE HANDLER
      const destiny = cards.find((c) => c.position === "destiny");
      const path = cards.find((c) => c.position === "path");
      const union = cards.find((c) => c.position === "union");

      const destinyOrientation =
        destiny?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const pathOrientation =
        path?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const unionOrientation =
        union?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildDestinysEmbracePrompt(language, {
        profile,
        destinyCard: destiny?.name || "?",
        pathCard: path?.name || "?",
        unionCard: union?.name || "?",
        destinyOrientation,
        pathOrientation,
        unionOrientation,
      });
    } else if (spread === "love_choice" && cards) {
      // LOVE CHOICE HANDLER - 5 cards
      const optionA = cards.find((c) => c.position === "optionA");
      const optionAOutcome = cards.find((c) => c.position === "optionA_outcome");
      const optionB = cards.find((c) => c.position === "optionB");
      const optionBOutcome = cards.find((c) => c.position === "optionB_outcome");
      const advice = cards.find((c) => c.position === "advice");

      const optionAOrientation =
        optionA?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const optionAOutcomeOrientation =
        optionAOutcome?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const optionBOrientation =
        optionB?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const optionBOutcomeOrientation =
        optionBOutcome?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const adviceOrientation =
        advice?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildLoveChoicePrompt(language, {
        profile,
        optionACard: optionA?.name || "?",
        optionAOutcomeCard: optionAOutcome?.name || "?",
        optionBCard: optionB?.name || "?",
        optionBOutcomeCard: optionBOutcome?.name || "?",
        adviceCard: advice?.name || "?",
        optionAOrientation,
        optionAOutcomeOrientation,
        optionBOrientation,
        optionBOutcomeOrientation,
        adviceOrientation,
      });
    } else if (spread === "path_to_love" && cards) {
      // PATH TO LOVE HANDLER - 5 cards
      const self = cards.find((c) => c.position === "self");
      const block = cards.find((c) => c.position === "block");
      const need = cards.find((c) => c.position === "need");
      const action = cards.find((c) => c.position === "action");
      const potential = cards.find((c) => c.position === "potential");

      const selfOrientation =
        self?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const blockOrientation =
        block?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const needOrientation =
        need?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const actionOrientation =
        action?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const potentialOrientation =
        potential?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildPathToLovePrompt(language, {
        profile,
        selfCard: self?.name || "?",
        blockCard: block?.name || "?",
        needCard: need?.name || "?",
        actionCard: action?.name || "?",
        potentialCard: potential?.name || "?",
        selfOrientation,
        blockOrientation,
        needOrientation,
        actionOrientation,
        potentialOrientation,
      });
    } else if (spread === "new_moon_ritual" && cards) {
      // NEW MOON RITUAL HANDLER - 5 cards
      const intention = cards.find((c) => c.position === "intention");
      const seed = cards.find((c) => c.position === "seed");
      const shadow = cards.find((c) => c.position === "shadow");
      const support = cards.find((c) => c.position === "support");
      const firstStep = cards.find((c) => c.position === "firstStep");

      const intentionOrientation =
        intention?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const seedOrientation =
        seed?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const shadowOrientation =
        shadow?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const supportOrientation =
        support?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const firstStepOrientation =
        firstStep?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildNewMoonPrompt(language, {
        profile,
        intentionCard: intention?.name || "?",
        seedCard: seed?.name || "?",
        shadowCard: shadow?.name || "?",
        supportCard: support?.name || "?",
        firstStepCard: firstStep?.name || "?",
        intentionOrientation,
        seedOrientation,
        shadowOrientation,
        supportOrientation,
        firstStepOrientation,
      });
    } else if (spread === "full_moon_release" && cards) {
      // FULL MOON RELEASE HANDLER - 5 cards
      const illumination = cards.find((c) => c.position === "illumination");
      const tension = cards.find((c) => c.position === "tension");
      const lesson = cards.find((c) => c.position === "lesson");
      const release = cards.find((c) => c.position === "release");
      const integration = cards.find((c) => c.position === "integration");

      const illuminationOrientation =
        illumination?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const tensionOrientation =
        tension?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const lessonOrientation =
        lesson?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const releaseOrientation =
        release?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const integrationOrientation =
        integration?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildFullMoonPrompt(language, {
        profile,
        illuminationCard: illumination?.name || "?",
        tensionCard: tension?.name || "?",
        lessonCard: lesson?.name || "?",
        releaseCard: release?.name || "?",
        integrationCard: integration?.name || "?",
        illuminationOrientation,
        tensionOrientation,
        lessonOrientation,
        releaseOrientation,
        integrationOrientation,
      });
    } else if (spread === "mind_body_spirit" && cards) {
      // MIND BODY SPIRIT HANDLER - 3 cards
      const mind = cards.find((c) => c.position === "mind");
      const body = cards.find((c) => c.position === "body");
      const spirit = cards.find((c) => c.position === "spirit");

      const mindOrientation =
        mind?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const bodyOrientation =
        body?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const spiritOrientation =
        spirit?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildMbsPrompt(language, {
        profile,
        mindCard: mind?.name || "?",
        bodyCard: body?.name || "?",
        spiritCard: spirit?.name || "?",
        mindOrientation,
        bodyOrientation,
        spiritOrientation,
      });
    } else if (spread === "celestial_illumination" && cards) {
      // CELESTIAL ILLUMINATION HANDLER - 3 cards
      const signal = cards.find((c) => c.position === "signal");
      const guidance = cards.find((c) => c.position === "guidance");
      const integration = cards.find((c) => c.position === "integration");

      const signalOrientation =
        signal?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const guidanceOrientation =
        guidance?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const integrationOrientation =
        integration?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildCelestialPrompt(language, {
        profile,
        signalCard: signal?.name || "?",
        guidanceCard: guidance?.name || "?",
        integrationCard: integration?.name || "?",
        signalOrientation,
        guidanceOrientation,
        integrationOrientation,
      });
    } else if (spread === "career_clarity" && cards) {
      // CAREER CLARITY HANDLER - 3 cards
      const current = cards.find((c) => c.position === "current");
      const challenge = cards.find((c) => c.position === "challenge");
      const clarity = cards.find((c) => c.position === "clarity");

      const currentOrientation =
        current?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const challengeOrientation =
        challenge?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const clarityOrientation =
        clarity?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildCareerClarityPrompt(language, {
        profile,
        currentCard: current?.name || "?",
        challengeCard: challenge?.name || "?",
        clarityCard: clarity?.name || "?",
        currentOrientation,
        challengeOrientation,
        clarityOrientation,
      });
    } else if (spread === "career_path_guide" && cards) {
      // CAREER PATH GUIDE HANDLER - 3 cards
      const strength = cards.find((c) => c.position === "strength");
      const opportunity = cards.find((c) => c.position === "opportunity");
      const direction = cards.find((c) => c.position === "direction");

      const strengthOrientation =
        strength?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const opportunityOrientation =
        opportunity?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const directionOrientation =
        direction?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildCareerPathGuidePrompt(language, {
        profile,
        strengthCard: strength?.name || "?",
        opportunityCard: opportunity?.name || "?",
        directionCard: direction?.name || "?",
        strengthOrientation,
        opportunityOrientation,
        directionOrientation,
      });
    } else if (spread === "new_business_exploration" && cards) {
      // NEW BUSINESS EXPLORATION HANDLER - 5 cards
      const idea = cards.find((c) => c.position === "idea");
      const foundation = cards.find((c) => c.position === "foundation");
      const challenge = cards.find((c) => c.position === "challenge");
      const opportunity = cards.find((c) => c.position === "opportunity");
      const shift = cards.find((c) => c.position === "shift");

      const ideaOrientation =
        idea?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const foundationOrientation =
        foundation?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const challengeOrientation =
        challenge?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const opportunityOrientation =
        opportunity?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const shiftOrientation =
        shift?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildNewBusinessPrompt(language, {
        profile,
        ideaCard: idea?.name || "?",
        foundationCard: foundation?.name || "?",
        challengeCard: challenge?.name || "?",
        opportunityCard: opportunity?.name || "?",
        shiftCard: shift?.name || "?",
        ideaOrientation,
        foundationOrientation,
        challengeOrientation,
        opportunityOrientation,
        shiftOrientation,
      });
    } else if (spread === "wealth_flow" && cards) {
      // WEALTH FLOW HANDLER - 5 cards
      const income = cards.find((c) => c.position === "income");
      const block = cards.find((c) => c.position === "block");
      const resource = cards.find((c) => c.position === "resource");
      const growth = cards.find((c) => c.position === "growth");
      const balance = cards.find((c) => c.position === "balance");

      const incomeOrientation =
        income?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const blockOrientation =
        block?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const resourceOrientation =
        resource?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const growthOrientation =
        growth?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      const balanceOrientation =
        balance?.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;

      prompt = buildWealthFlowPrompt(language, {
        profile,
        incomeCard: income?.name || "?",
        blockCard: block?.name || "?",
        resourceCard: resource?.name || "?",
        growthCard: growth?.name || "?",
        balanceCard: balance?.name || "?",
        incomeOrientation,
        blockOrientation,
        resourceOrientation,
        growthOrientation,
        balanceOrientation,
      });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }

    const callModel = async (systemMessage) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });
      return completion.choices[0]?.message?.content || "";
    };

    const runAttempt = async (systemMessage) => {
      const content = await callModel(systemMessage);
      const parsed = parseJsonFromContent(content);
      if (spread === "past_present_future") {
        parsed.story = clampStory(parsed.story || "");
      }
      return { parsed, content };
    };

    let jsonResponse;
    let rawContent = "";
    const systemMessage = getSystemMessage(language);
    const retrySystemMessage = getSystemMessage(language, true);
    
    // Validation function based on spread type
    const getValidator = (spreadType) => {
      if (spreadType === "single_card") return validateSingle;
      if (spreadType === "situation_obstacle_advice") return validateSoa;
      if (spreadType === "destinys_embrace") return validateDestinysEmbrace;
      if (spreadType === "love_choice") return validateLoveChoice;
      if (spreadType === "path_to_love") return validatePathToLove;
      if (spreadType === "new_moon_ritual") return validateNewMoon;
      if (spreadType === "full_moon_release") return validateFullMoon;
      if (spreadType === "mind_body_spirit") return validateMbs;
      if (spreadType === "celestial_illumination") return validateCelestial;
      if (spreadType === "career_clarity") return validateCareerClarity;
      if (spreadType === "career_path_guide") return validateCareerPathGuide;
      if (spreadType === "new_business_exploration") return validateNewBusiness;
      if (spreadType === "wealth_flow") return validateWealthFlow;
      return (data) => validatePpf(data, profile);
    };

    try {
      const firstAttempt = await runAttempt(systemMessage);
      jsonResponse = firstAttempt.parsed;
      rawContent = firstAttempt.content;
      const validator = getValidator(spread);
      const valid = validator(jsonResponse);
      if (!valid) {
        const retryAttempt = await runAttempt(retrySystemMessage);
        jsonResponse = retryAttempt.parsed;
        rawContent = retryAttempt.content;
        const validRetry = validator(jsonResponse);
        if (!validRetry) {
          return res.status(500).json({ error: "Schema validation failed" });
        }
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    const qualityWarns = [
      ...detectJsonWrapperWarns(rawContent),
    ];

    if (spread === "single_card") {
      qualityWarns.push(...journalWarns(jsonResponse.journal));
      qualityWarns.push(...nextStepWarns(jsonResponse.nextStep));
      const combinedText = [
        jsonResponse.overall,
        jsonResponse.deepDive,
        jsonResponse.shadow,
        jsonResponse.nextStep,
        jsonResponse.journal,
      ]
        .filter(Boolean)
        .join(" ");
      qualityWarns.push(...focusLeakWarns({ focusArea, text: combinedText }));
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      model: "gpt-4o",
      structureId,
      hasNextStep: spread === "single_card" ? Boolean(jsonResponse?.nextStep?.trim()) : null,
      hasJournal:
        spread === "single_card"
          ? Boolean(jsonResponse?.journal?.trim()) &&
            jsonResponse.journal.trim().endsWith("?")
          : null,
      qualityWarns: [...new Set(qualityWarns)],
      request: spread === "single_card"
        ? { language, spread, card, focusArea }
        : { language, spread, cards },
      response: jsonResponse,
    };

    if (spread === "single_card") {
      logEntry.focusArea = focusArea;
    }

    appendLog(logEntry);

    res.json(jsonResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/logs/reset", (req, res) => {
  try {
    ensureLogsFile();
    fs.writeFileSync(logsFilePath, JSON.stringify([], null, 2), "utf8");
    res.json({ ok: true });
  } catch (error) {
    console.error("Reset logs error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
