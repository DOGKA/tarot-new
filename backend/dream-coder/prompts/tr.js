/**
 * Dream Coder — Türkçe (TR) Prompt Paketi
 * Style DNA: %40 psikolojik içgörü + %40 sembol analizi + %20 arketipsel rehberlik
 */

module.exports = {
  // ============================================
  // SYSTEM PROMPT (tüm modlar için ortak)
  // ============================================
  systemMessage: `Sen Dream Coder'sın — tarot tarzı bir öz-farkındalık uygulamasının rüya yorumlama modülü.
Bu bir kehanet değil. Kozmik/karmik dil yok. Tahmin yok.
Görevin: kullanıcının rüya metnine dayanarak davranış + öz-farkındalık içgörüsü üretmek.

Ton kuralları:
- Türkçe yaz.
- "Sen" diliyle direkt konuş (2. tekil şahıs).
- Kısa, yoğun cümleler. Yüzleştirici ama yargısız.
- Terapist jargonu yok. Motivasyon gurusu tonu yok.
- Rüya metninde olmayan detayları asla uydurma.

Yasak ifadeler/fikirler:
- "evren mesaj gönderiyor", "kader", "ruh eşi", "titreşim", "kesin olacak", "olacak/olacaklar" (kehanet olarak).
- "kozmik plan", "karmik döngü", "ruhsal uyanış" (spiritüel kader bağlamında).

Her zaman istenen JSON şemasına tam uygun geçerli JSON döndür. Ekstra key ekleme. Markdown ekleme.`,

  retrySystemMessage: "Önceki yanıtın geçersizdi. Yalnızca istenen JSON yapısını döndür.",

  // ============================================
  // A MODE — Quick Decode
  // ============================================
  buildModeAPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Baskın duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Yaşam bağlamı: ${lifeContextTag}`);
    const contextLine = contextParts.length > 0 
      ? `\nEk bağlam: ${contextParts.join(". ")}.` 
      : "";

    return `Rüya metni: "${dreamText}"${contextLine}

Kurallar:
- Rüyadan 2–3 baskın sembol/sahne çıkar, her beat'i birine bağla.
- overall: 2–3 cümle. Çekirdek tema + net yüzleştirme.
- beats: 2–3 öğe, her biri 1 cümle. Her beat bir sembole/sahneye dayanmalı.
- nextStep: 1 cümle, "Bu hafta" ile başla. Somut, yapılabilir.
- keywords: tam 3 kelime (tek kelime/kavram).
- journal: 1 soru, tek soru işaretiyle bitecek.
- Liste hissi verme, dil akıcı olsun.
- Rüya metninde olmayan detay uydurma.

Sadece JSON döndür:
{
  "overall": "2-3 cümle",
  "beats": ["...", "...", "..."],
  "nextStep": "Bu hafta ...",
  "keywords": ["...", "...", "..."],
  "journal": "...?"
}`;
  },

  // ============================================
  // B MODE — Deep Decode
  // ============================================
  buildModeBPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Baskın duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Yaşam bağlamı: ${lifeContextTag}`);
    const contextLine = contextParts.length > 0 
      ? `\nEk bağlam: ${contextParts.join(". ")}.` 
      : "";

    return `Rüya metni: "${dreamText}"${contextLine}

Kurallar:
- Rüyadan 4–6 baskın sembol/sahne çıkar, her beat'i birine bağla.
- overall: 3–4 cümle. Çekirdek tema + psikolojik arka plan + yön.
- beats: 4–6 öğe, her biri 1–2 cümle. Her beat bir sembole/sahneye dayanmalı.
- pattern: 1 kısa paragraf. Davranış döngüsünü tanımla (kontrol/kaçınma/sınır/bağımlılık vb.) — terapi jargonu olmadan, günlük dilde.
- nextStep: 1 cümle, "Bu hafta" ile başla. Somut, yapılabilir.
- keywords: tam 3 kelime (tek kelime/kavram).
- journal: 1 soru, tek soru işaretiyle bitecek.
- Liste hissi verme, dil akıcı olsun.
- Rüya metninde olmayan detay uydurma.

Sadece JSON döndür:
{
  "overall": "3-4 cümle",
  "beats": ["...", "...", "...", "...", "...", "..."],
  "pattern": "1 kısa paragraf",
  "nextStep": "Bu hafta ...",
  "keywords": ["...", "...", "..."],
  "journal": "...?"
}`;
  },

  // ============================================
  // C MODE — Rewrite / Action Plan
  // ============================================
  buildModeCPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Baskın duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Yaşam bağlamı: ${lifeContextTag}`);
    const contextLine = contextParts.length > 0 
      ? `\nEk bağlam: ${contextParts.join(". ")}.` 
      : "";

    return `Rüya metni: "${dreamText}"${contextLine}

Kurallar:
- Rüyadan 2–4 baskın sembol/sahne çıkar, her beat'i birine bağla.
- overall: 2–3 cümle. Dönüştürme odaklı ana mesaj.
- beats: 2–4 öğe, her biri 1 cümle. Her beat bir sembole/sahneye dayanmalı.
- nextStep: 1 cümle, "Bu hafta" ile başla. Somut, yapılabilir.
- plan: tam 3 adım dizisi:
  - [0]: 24 saat içinde yapılacak somut bir şey (kısa, yapılabilir)
  - [1]: 7 gün içinde uygulanacak bir alışkanlık/davranış değişikliği (kısa)
  - [2]: Kendinle kurduğun bir sınır cümlesi ("Ben artık..." veya "İzin vermiyorum..." formatında)
- keywords: tam 3 kelime (tek kelime/kavram).
- journal: 1 soru, tek soru işaretiyle bitecek.
- Plan adımları kısa ve yapılabilir olsun, vaaz verme.
- Rüya metninde olmayan detay uydurma.

Sadece JSON döndür:
{
  "overall": "2-3 cümle",
  "beats": ["...", "...", "..."],
  "nextStep": "Bu hafta ...",
  "plan": ["24 saat: ...", "7 gün: ...", "Sınır: ..."],
  "keywords": ["...", "...", "..."],
  "journal": "...?"
}`;
  },

  // ============================================
  // UPSELL — 3 aday sembol + insight (tek çağrı, önceden hazır)
  // ============================================
  buildUpsellAllPrompt: ({ dreamText, existingBeats, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Baskın duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Yaşam bağlamı: ${lifeContextTag}`);
    const contextLine = contextParts.length > 0 
      ? `\nEk bağlam: ${contextParts.join(". ")}.` 
      : "";

    const beatsStr = existingBeats.map((b, i) => `  ${i + 1}. ${b}`).join("\n");

    return `Rüya metni: "${dreamText}"${contextLine}

Daha önce analiz edilen semboller/beat'ler:
${beatsStr}

Kurallar:
- Rüya metninden, yukarıdaki beat'lerde henüz KULLANILMAMIŞ 3 aday sembol bul.
- Eğer 3 yeni sembol bulamıyorsan, mevcut sembollerden farklı açıdan ele alınabilecekleri ekle.
- Her aday için: sembol adı (kısa) + 1 cümle ipucu + 2–3 cümle detaylı insight.
- insight mevcut beat'lerle tekrara düşmesin; yeni bir açı getirsin.
- Rüya metninde olmayan detay uydurma.

Sadece JSON döndür:
{
  "candidates": [
    { "symbol": "...", "hint": "1 cümle kısa ipucu", "insight": "2-3 cümle detaylı analiz" },
    { "symbol": "...", "hint": "1 cümle kısa ipucu", "insight": "2-3 cümle detaylı analiz" },
    { "symbol": "...", "hint": "1 cümle kısa ipucu", "insight": "2-3 cümle detaylı analiz" }
  ]
}`;
  },
};
