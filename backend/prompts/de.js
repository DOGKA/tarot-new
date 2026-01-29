/**
 * German (DE) prompts for ChatGPT
 */

module.exports = {
  // System message
  systemMessage: "Du bist ein erfahrener Tarot-Experte. Gib immer gültiges JSON zurück, füge keine Erklärung oder Markdown hinzu.",
  retrySystemMessage: "Deine vorherige Antwort war ungültig. Gib nur die angeforderte JSON-Struktur zurück.",

  // Single Card Reading prompt
  buildSinglePrompt: ({ profile, cardName, orientationLabel, focusArea }) => `
${profile.tone}
${profile.address}
Sprache: ${profile.nativeName}. Der gesamte Text muss in dieser Sprache sein.

Karte: ${cardName} (${orientationLabel})
Fokusbereich: ${focusArea}

Regeln:
- overall: 3–4 Sätze (Hintergrund der Frage, Emotion und Richtung).
- deepDive: 4–6 Sätze; verwende den Kartennamen höchstens einmal.
- shadow: 2–3 Sätze, möglicher Schatten oder Warnung.
- nextStep: 1 Satz, Imperativ mit einer einzelnen Aktion.
- journal: 1 Frage, endet mit einem einzelnen Fragezeichen.

Gib nur JSON zurück:
{
  "title": "${cardName} — ${profile.singleLabel}",
  "overall": "3–4 Sätze",
  "focusArea": "${focusArea}",
  "deepDive": "4–6 Sätze",
  "shadow": "2–3 Sätze",
  "nextStep": "1 Satz",
  "journal": "1 Frage"
}`,

  // Three Card (PPF) Reading prompt
  buildPpfPrompt: ({ profile, pastCard, presentCard, futureCard, pastOrientation, presentOrientation, futureOrientation }) => `
${profile.tone}
${profile.address}
Sprache: ${profile.nativeName}. Titel und gesamter Text müssen in dieser Sprache sein.
Titelformat: "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}".
Karten:
- Vergangenheit: ${pastCard} (${pastOrientation})
- Gegenwart: ${presentCard} (${presentOrientation})
- Zukunft: ${futureCard} (${futureOrientation})

Regeln:
- story: 4–6 Sätze; Kartennamen erscheinen höchstens je einmal in der Geschichte.
- overall: 3–4 Sätze (Zusammenfassung + Spannung + Richtung).
- keywords genau 3, mood ein einzelnes Wort.

Gib nur JSON zurück. Ein einzelnes JSON-Objekt:
{
  "title": "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}",
  "overall": "3–4 Sätze",
  "throughline": "1 Satz",
  "story": "4–6 Sätze",
  "beats": {
    "past": "1–2 Sätze",
    "present": "1–2 Sätze",
    "future": "1–2 Sätze"
  },
  "choice": {
    "pathA": "1 Satz",
    "pathB": "1 Satz"
  },
  "keywords": ["...", "...", "..."],
  "mood": "ein Wort",
  "nextStep": "1 Satz"
}`,

  // Yes/No Reading prompt
  buildYesNoPrompt: ({ profile, cardName, orientationLabel, focusArea, answer, confidence }) => {
    const answerText = profile.yesNoAnswer[answer];
    return `
Du bist ein professioneller Tarot-Leser und machst eine Ja/Nein-Lesung.
${profile.tone}
${profile.address}

Karte: ${cardName} (${orientationLabel})
Antwort: ${answerText}
Vertrauen: ${confidence}%
Fokusbereich: ${focusArea}

Regeln:
- Schreibe eine Erklärung in 12-25 Wörtern
- Erkläre die Energie der Karte und warum diese Antwort
- Sei warm aber professionell

Gib nur JSON zurück:
{"explanation": "..."}`;
  }
};
