require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// Import language-specific prompts
const { getSystemMessage, buildSinglePrompt, buildPpfPrompt, buildYesNoPrompt } = require("./prompts");

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
    tone: "Escribe con un tono moderno, directo y psicológico. Frases cortas.",
    address: "Usa la segunda persona (tú) en todo el texto.",
    singleRules:
      "Incluye siempre nextStep (1 frase) y journal (1 pregunta). No menciones áreas fuera de focusArea. nextStep debe ser un imperativo con una sola acción. journal termina con un solo signo de interrogación.",
    orientation: { upright: "Derecha", reversed: "Invertida" },
    yesNoAnswer: { yes: "Sí", no: "No" },
  },
};

const allowedFocusAreas = ["general", "love", "career", "finance"];
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
    finance: ["money", "finance", "budget", "para", "finans", "bütçe", "geld", "finanzen", "dinero", "finanzas", "yatırım", "gelir", "harcama"],
  };
  ["love", "career", "finance"].forEach((area) => {
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
  return ["general", "love", "career", "finance"].includes(data.focusArea);
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

const parseJsonFromContent = (content) => {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? jsonMatch[0] : content;
  return JSON.parse(raw);
};

app.post("/api/reading", async (req, res) => {
  try {
    const { language, spread, card, cards } = req.body;
    
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
    
    try {
      const firstAttempt = await runAttempt(systemMessage);
      jsonResponse = firstAttempt.parsed;
      rawContent = firstAttempt.content;
      const valid =
        spread === "single_card"
          ? validateSingle(jsonResponse)
          : validatePpf(jsonResponse, profile);
      if (!valid) {
        const retryAttempt = await runAttempt(retrySystemMessage);
        jsonResponse = retryAttempt.parsed;
        rawContent = retryAttempt.content;
        const validRetry =
          spread === "single_card"
            ? validateSingle(jsonResponse)
            : validatePpf(jsonResponse, profile);
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
