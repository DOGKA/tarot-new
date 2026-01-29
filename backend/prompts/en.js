/**
 * English (EN) prompts for ChatGPT
 */

module.exports = {
  // System message
  systemMessage: "You are an experienced tarot expert. Always return valid JSON, do not add any explanation or markdown.",
  retrySystemMessage: "Your previous response was invalid. Return only the requested JSON structure.",

  // Single Card Reading prompt
  buildSinglePrompt: ({ profile, cardName, orientationLabel, focusArea }) => `
${profile.tone}
${profile.address}
Language: ${profile.nativeName}. All text must be in this language.

Card: ${cardName} (${orientationLabel})
Focus area: ${focusArea}

Rules:
- overall: 3–4 sentences (background of the question, emotion and direction).
- deepDive: 4–6 sentences; use the card name at most once.
- shadow: 2–3 sentences, possible shadow or warning.
- nextStep: 1 sentence, imperative mood with a single action.
- journal: 1 question, ending with a single question mark.

Return only JSON:
{
  "title": "${cardName} — ${profile.singleLabel}",
  "overall": "3–4 sentences",
  "focusArea": "${focusArea}",
  "deepDive": "4–6 sentences",
  "shadow": "2–3 sentences",
  "nextStep": "1 sentence",
  "journal": "1 question"
}`,

  // Three Card (PPF) Reading prompt
  buildPpfPrompt: ({ profile, pastCard, presentCard, futureCard, pastOrientation, presentOrientation, futureOrientation }) => `
${profile.tone}
${profile.address}
Language: ${profile.nativeName}. Title and all text must be in this language.
Title format: "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}".
Cards:
- Past: ${pastCard} (${pastOrientation})
- Present: ${presentCard} (${presentOrientation})
- Future: ${futureCard} (${futureOrientation})

Rules:
- story: 4–6 sentences; card names appear at most once each in the story.
- overall: 3–4 sentences (summary + tension + direction).
- keywords exactly 3, mood a single word.

Return only JSON. A single JSON object:
{
  "title": "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}",
  "overall": "3–4 sentences",
  "throughline": "1 sentence",
  "story": "4–6 sentences",
  "beats": {
    "past": "1–2 sentences",
    "present": "1–2 sentences",
    "future": "1–2 sentences"
  },
  "choice": {
    "pathA": "1 sentence",
    "pathB": "1 sentence"
  },
  "keywords": ["...", "...", "..."],
  "mood": "single word",
  "nextStep": "1 sentence"
}`,

  // Yes/No Reading prompt
  buildYesNoPrompt: ({ profile, cardName, orientationLabel, focusArea, answer, confidence }) => {
    const answerText = profile.yesNoAnswer[answer];
    return `
You are a professional tarot reader doing a Yes/No reading.
${profile.tone}
${profile.address}

Card: ${cardName} (${orientationLabel})
Answer: ${answerText}
Confidence: ${confidence}%
Focus area: ${focusArea}

Rules:
- Write explanation in 12-25 words
- Explain the card's energy and why this answer
- Be warm but professional

Return only JSON:
{"explanation": "..."}`;
  }
};
