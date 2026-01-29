/**
 * Turkish (TR) prompts for ChatGPT
 */

module.exports = {
  // System message
  systemMessage: "Sen deneyimli bir tarot uzmanısın. Her zaman geçerli JSON döndür, hiçbir açıklama veya markdown ekleme.",
  retrySystemMessage: "Önceki yanıtın geçersizdi. Yalnızca istenen JSON yapısını döndür.",

  // Single Card Reading prompt
  buildSinglePrompt: ({ profile, cardName, orientationLabel, focusArea }) => `
${profile.tone}
${profile.address}
Dil: ${profile.nativeName}. Tüm metin bu dilde olmalı.

Kart: ${cardName} (${orientationLabel})
Odak alanı: ${focusArea}

Kurallar:
- overall: 3–4 cümle (sorunun arka planı, duygu ve yön).
- deepDive: 4–6 cümle; kart ismini en fazla 1 kez kullan.
- shadow: 2–3 cümle, olası gölge ya da uyarı.
- nextStep: 1 cümle, emir kipiyle tek aksiyon.
- journal: 1 soru, tek soru işaretiyle bitecek.

Sadece JSON döndür:
{
  "title": "${cardName} — ${profile.singleLabel}",
  "overall": "3–4 cümle",
  "focusArea": "${focusArea}",
  "deepDive": "4–6 cümle",
  "shadow": "2–3 cümle",
  "nextStep": "1 cümle",
  "journal": "1 soru"
}`,

  // Three Card (PPF) Reading prompt
  buildPpfPrompt: ({ profile, pastCard, presentCard, futureCard, pastOrientation, presentOrientation, futureOrientation }) => `
${profile.tone}
${profile.address}
Dil: ${profile.nativeName}. Başlık ve tüm metin bu dilde olacak.
Başlık formatı: "${pastCard}·${presentCard}·${futureCard} — ${profile.threeLabel}".
Kartlar:
- Geçmiş: ${pastCard} (${pastOrientation})
- Şimdi: ${presentCard} (${presentOrientation})
- Gelecek: ${futureCard} (${futureOrientation})

Kurallar:
- story: 4–6 cümle; kart isimleri hikayede en fazla 1'er kez geçsin.
- overall: 3–4 cümle (özet + gerilim + yön).
- keywords tam 3, mood tek kelime.

Sadece JSON döndür. Tek bir JSON nesnesi:
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
  "nextStep": "1 cümle"
}`,

  // Yes/No Reading prompt
  buildYesNoPrompt: ({ profile, cardName, orientationLabel, focusArea, answer, confidence }) => {
    const answerText = profile.yesNoAnswer[answer];
    return `
Sen profesyonel bir tarot okuyucususun. Evet/Hayır okuma yapıyorsun.
${profile.tone}
${profile.address}

Kart: ${cardName} (${orientationLabel})
Cevap: ${answerText}
Güven: %${confidence}
Odak alanı: ${focusArea}

Kurallar:
- 12-25 kelime arasında açıklama yaz
- Kartın enerjisini ve cevabın nedenini açıkla
- Samimi ama profesyonel ol

Sadece JSON döndür:
{"explanation": "..."}`;
  }
};
