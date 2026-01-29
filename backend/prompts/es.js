/**
 * Spanish (ES) prompts for ChatGPT
 */

module.exports = {
  // System message
  systemMessage: "Eres un experto en tarot con experiencia. Siempre devuelve JSON válido, no añadas ninguna explicación ni markdown.",
  retrySystemMessage: "Tu respuesta anterior no era válida. Devuelve solo la estructura JSON solicitada.",

  // Single Card Reading prompt
  buildSinglePrompt: ({ profile, cardName, orientationLabel, focusArea }) => `
${profile.tone}
${profile.address}
Idioma: ${profile.nativeName}. Todo el texto debe estar en este idioma.

Carta: ${cardName} (${orientationLabel})
Área de enfoque: ${focusArea}

Reglas:
- overall: 3–4 frases (contexto de la pregunta, emoción y dirección).
- deepDive: 4–6 frases; usa el nombre de la carta como máximo una vez.
- shadow: 2–3 frases, posible sombra o advertencia.
- nextStep: 1 frase, imperativo con una sola acción.
- journal: 1 pregunta, terminando con un solo signo de interrogación.

Devuelve solo JSON:
{
  "title": "${cardName} — ${profile.singleLabel}",
  "overall": "3–4 frases",
  "focusArea": "${focusArea}",
  "deepDive": "4–6 frases",
  "shadow": "2–3 frases",
  "nextStep": "1 frase",
  "journal": "1 pregunta"
}`,

  // Three Card (PPF) Reading prompt
  buildPpfPrompt: ({ profile, pastCard, presentCard, futureCard, pastOrientation, presentOrientation, futureOrientation }) => `
${profile.tone}
${profile.address}
Idioma: ${profile.nativeName}. El título y todo el texto deben estar en este idioma.
Formato del título: "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}".
Cartas:
- Pasado: ${pastCard} (${pastOrientation})
- Presente: ${presentCard} (${presentOrientation})
- Futuro: ${futureCard} (${futureOrientation})

Reglas:
- story: 4–6 frases, los nombres de las cartas aparecen como máximo una vez en la historia.
- overall: 3–4 frases (resumen + tensión + dirección).
- keywords exactamente 3, mood una sola palabra.

Devuelve solo JSON. Un único objeto JSON:
{
  "title": "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}",
  "overall": "3–4 frases",
  "throughline": "1 frase",
  "story": "4–6 frases",
  "beats": {
    "past": "1–2 frases",
    "present": "1–2 frases",
    "future": "1–2 frases"
  },
  "choice": {
    "pathA": "1 frase",
    "pathB": "1 frase"
  },
  "keywords": ["...", "...", "..."],
  "mood": "una palabra",
  "nextStep": "1 frase"
}`,

  // Yes/No Reading prompt
  buildYesNoPrompt: ({ profile, cardName, orientationLabel, focusArea, answer, confidence }) => {
    const answerText = profile.yesNoAnswer[answer];
    return `
Eres un lector de tarot profesional haciendo una lectura de Sí/No.
${profile.tone}
${profile.address}

Carta: ${cardName} (${orientationLabel})
Respuesta: ${answerText}
Confianza: ${confidence}%
Área de enfoque: ${focusArea}

Reglas:
- Escribe una explicación en 12-25 palabras
- Explica la energía de la carta y por qué esta respuesta
- Sé cálido pero profesional

Devuelve solo JSON:
{"explanation": "..."}`;
  }
};
