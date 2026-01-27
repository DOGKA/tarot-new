require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const logsDir = path.join(__dirname, "data");
const logsFilePath = path.join(logsDir, "premium-readings.json");

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
    nativeName: "Türkçe",
    singleLabel: "Tek Kart",
    threeLabel: "Üç Kart",
    tone: "Modern, psikolojik ve yüzleştirici yaz. Kısa ve net cümleler kur.",
    address: "Tüm metin 'sen' diliyle yazılacak. 'siz' kullanma.",
    singleRules:
      "Her zaman hem nextStep (1 cümle) hem journal (1 soru) üret. focusArea dışındaki alanlardan bahsetme. nextStep emir kipinde tek aksiyon olsun. journal tek soru işareti ile bitsin.",
    orientation: { upright: "Düz", reversed: "Ters" },
    timingFormat: "X–Y hafta",
    timingExample: "2–4 hafta",
    timingRegex: /\d+\s*[–-]\s*\d+\s*hafta/i,
  },
  en: {
    nativeName: "English",
    singleLabel: "Single Card",
    threeLabel: "Three Cards",
    tone: "Write in a modern, direct, practical tone. Short, clear sentences.",
    address: "Use a direct 'you' voice throughout.",
    singleRules:
      "Always include nextStep (1 sentence) and journal (1 question). Do not mention areas outside focusArea. nextStep must be an imperative single action. journal must end with a single question mark.",
    orientation: { upright: "Upright", reversed: "Reversed" },
    timingFormat: "X–Y weeks",
    timingExample: "2–4 weeks",
    timingRegex: /\d+\s*[–-]\s*\d+\s*weeks/i,
  },
  de: {
    nativeName: "Deutsch",
    singleLabel: "Einzelkarte",
    threeLabel: "Drei Karten",
    tone: "Schreibe modern, klar und psychologisch präzise. Kurze Sätze.",
    address: "Direkte Anrede in der Du-Form.",
    singleRules:
      "Erzeuge immer nextStep (1 Satz) und journal (1 Frage). Sprich nur über focusArea. nextStep als klarer Imperativ mit einer Aktion. journal endet mit genau einem Fragezeichen.",
    orientation: { upright: "Aufrecht", reversed: "Umgekehrt" },
    timingFormat: "X–Y Wochen",
    timingExample: "2–4 Wochen",
    timingRegex: /\d+\s*[–-]\s*\d+\s*Wochen/i,
  },
  es: {
    nativeName: "Español",
    singleLabel: "Una carta",
    threeLabel: "Tres cartas",
    tone: "Escribe con un tono moderno, directo y psicológico. Frases cortas.",
    address: "Usa la segunda persona (tú) en todo el texto.",
    singleRules:
      "Incluye siempre nextStep (1 frase) y journal (1 pregunta). No menciones áreas fuera de focusArea. nextStep debe ser un imperativo con una sola acción. journal termina con un solo signo de interrogación.",
    orientation: { upright: "Derecha", reversed: "Invertida" },
    timingFormat: "X–Y semanas",
    timingExample: "2–4 semanas",
    timingRegex: /\d+\s*[–-]\s*\d+\s*semanas/i,
  },
};

const allowedFocusAreas = ["general", "love", "career", "finance"];

const buildSinglePrompt = ({ profile, cardName, orientationLabel, focusArea }) => {
  return `
${profile.tone}
${profile.address}
${profile.singleRules}
Dil: ${profile.nativeName}. Başlık ve tüm metin bu dilde olacak.
Başlık formatı: "${cardName} — ${profile.singleLabel}". Başlıkta kart adı mutlaka geçsin.
Odak alanı: ${focusArea}. Yalnızca bu alanın perspektifinden yaz.
Kart: ${cardName} (${orientationLabel})

JSON dışında hiçbir şey döndürme. Tek bir JSON object ver:
{
  "title": "${cardName} — ${profile.singleLabel}",
  "overall": "2–3 cümle",
  "focusArea": "${focusArea}",
  "deepDive": "2–4 cümle",
  "shadow": "1 cümle",
  "nextStep": "1 cümle (hemen uygulanabilir aksiyon)",
  "journal": "1 soru"
}
`.trim();
};

const buildPpfPrompt = ({
  profile,
  pastCard,
  presentCard,
  futureCard,
  pastOrientation,
  presentOrientation,
  futureOrientation,
}) => {
  return `
${profile.tone}
${profile.address}
Dil: ${profile.nativeName}. Başlık ve tüm metin bu dilde olacak.
Başlık formatı: "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}".
Kartlar:
- Geçmiş: ${pastCard} (${pastOrientation})
- Şimdi: ${presentCard} (${presentOrientation})
- Gelecek: ${futureCard} (${futureOrientation})

Kurallar:
- story: 4–6 cümle, kart isimleri story içinde en fazla 1 kez geçsin.
- overall: 3–4 cümle (özet + gerilim + yön).
- timing formatı: ${profile.timingFormat}
- keywords tam 3 adet, mood tek kelime.

JSON dışında hiçbir şey döndürme. Tek bir JSON object ver:
{
  "title": "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}",
  "overall": "3–4 cümle",
  "throughline": "1 cümle",
  "story": "4–6 cümle",
  "beats": {
    "past": "1–2 cümle",
    "present": "1–2 cümle",
    "future": "1–2 cümle"
  },
  "choice": {
    "pathA": "1 cümle",
    "pathB": "1 cümle"
  },
  "keywords": ["...", "...", "..."],
  "mood": "tek kelime",
  "timing": "${profile.timingExample}",
  "nextStep": "1 cümle"
}
`.trim();
};

const SYSTEM_MESSAGE =
  "You are a professional tarot reader. Return only a single JSON object. No markdown, no extra text.";
const RETRY_SYSTEM_MESSAGE =
  "Your previous response was invalid. Return only a single JSON object with all required fields. No extra text.";

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
  const required = ["title", "overall", "throughline", "story", "beats", "choice", "keywords", "mood", "timing", "nextStep"];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) return false;
  }
  if (typeof data.title !== "string" || !data.title.trim()) return false;
  if (typeof data.overall !== "string" || !data.overall.trim()) return false;
  if (typeof data.throughline !== "string" || !data.throughline.trim()) return false;
  if (typeof data.story !== "string" || !data.story.trim()) return false;
  if (typeof data.mood !== "string" || !data.mood.trim()) return false;
  if (typeof data.timing !== "string" || !data.timing.trim()) return false;
  if (typeof data.nextStep !== "string" || !data.nextStep.trim()) return false;

  if (!data.beats || typeof data.beats !== "object") return false;
  if (!["past", "present", "future"].every((k) => typeof data.beats[k] === "string")) return false;
  if (!data.choice || typeof data.choice !== "object") return false;
  if (!["pathA", "pathB"].every((k) => typeof data.choice[k] === "string")) return false;
  if (!Array.isArray(data.keywords) || data.keywords.length !== 3) return false;
  if (!data.keywords.every((k) => typeof k === "string" && k.trim())) return false;
  if (/\s/.test(data.mood.trim())) return false;
  if (!profile.timingRegex.test(data.timing.trim())) return false;

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
    const profile = languageProfiles[language] || languageProfiles.en;
    const requestedFocusArea =
      spread === "single_card" ? req.body.focusArea : null;
    const focusArea = allowedFocusAreas.includes(requestedFocusArea)
      ? requestedFocusArea
      : "general";
    const structureId = spread === "single_card" ? "single_v15_minimal" : "ppf_v15_story";

    let prompt = "";

    if (spread === "single_card" && card) {
      const orientationLabel =
        card.orientation === "upright" ? profile.orientation.upright : profile.orientation.reversed;
      prompt = buildSinglePrompt({
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

      prompt = buildPpfPrompt({
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
    try {
      const firstAttempt = await runAttempt(SYSTEM_MESSAGE);
      jsonResponse = firstAttempt.parsed;
      rawContent = firstAttempt.content;
      const valid =
        spread === "single_card"
          ? validateSingle(jsonResponse)
          : validatePpf(jsonResponse, profile);
      if (!valid) {
        const retryAttempt = await runAttempt(RETRY_SYSTEM_MESSAGE);
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
