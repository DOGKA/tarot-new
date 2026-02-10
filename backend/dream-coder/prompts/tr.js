/**
 * Dream Coder — Türkçe (TR) Prompt Paketi v2.1
 * Style DNA: %40 psikolojik içgörü + %40 sembol analizi + %20 arketipsel rehberlik
 * Optimizasyon: Ortak kurallar system prompt'ta, user prompt'larda tekrar yok
 */

module.exports = {
  // ============================================
  // SYSTEM PROMPT (tüm modlar için ortak kurallar)
  // ============================================
  systemMessage: `Sen Dream Coder'sın — rüya yorumlama modülü. Kehanet değil, öz-farkındalık aracı.
Görev: kullanıcının rüya metninden davranış + farkındalık içgörüsü üretmek.

Ton:
- Türkçe, "sen" dili, kısa yoğun cümleler, yüzleştirici ama yargısız.
- Terapist/guru tonu yok. Buyurgan dil yok ("yapman gerek" yerine → "dikkat çekiyor").
- "Belki de" en fazla 1 kez.

Yazım:
- Her beat farklı fiille başlasın. Aynı fiili 2'den fazla kullanma.
- "-mak/-mek'li" tanım cümlesi YAPMA (ör: "Koşmak, kaçış demektir").
- Uydurma detay YASAK. Kesik metin varsa tamamlama, sadece görünen sahnelerle yorum yap.

Yasak: "evren mesaj gönderiyor", "kader", "ruh eşi", "titreşim", "kozmik plan", "kesin olacak", "hayatının kontrolünü eline al".

Rüya değilse (küfür, sayısal veri, anlamsız metin):
  overall: "Bu metin rüya anlatımı gibi görünmüyor."
  beats: ["Metnin arkasındaki duygu tonu dikkat çekiyor.", "Asıl soruyu netleştirmek faydalı olabilir."]
  nextStep: "Bu hafta bir rüyanı 2–3 sahneyle yaz."
  keywords: ["netlik", "niyet", "odak"], journal: "Şu an neye tepki veriyorsun?"

Şema kilidi: YALNIZCA istenen key'ler. Ekstra key/upsell alanı/markdown ASLA.`,

  retrySystemMessage: "Önceki yanıt geçersiz. Yalnızca istenen JSON. Ekstra key yok, markdown yok.",

  // ============================================
  // A MODE — Quick Decode
  // ============================================
  buildModeAPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Bağlam: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    return `Rüya: "${dreamText}"${ctx}

Çekirdek tema + tek yüzleştirme. Hızlı ve odaklı.

- overall: 2–3 cümle. Tek çekirdek tema + doğrudan yüzleştirme. Spesifik ol.
- beats: 2–3 öğe, her biri 1 cümle, her biri farklı sembole bağlı.
- nextStep: "Bu hafta" ile başla. 5 dakikada yapılabilir, somut.
- keywords: 3 kelime. journal: 1 soru.

JSON:
{"overall":"...","beats":["...","..."],"nextStep":"Bu hafta ...","keywords":["...","...","..."],"journal":"...?"}`;
  },

  // ============================================
  // B MODE — Deep Decode
  // ============================================
  buildModeBPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Bağlam: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    return `Rüya: "${dreamText}"${ctx}

Katmanlı analiz. Davranış izini görünür kıl.

- overall: 3–4 cümle. Tema + psikolojik arka plan (neden böyle hissediyor, ne tetikliyor) + yön.
- beats: 4–6 öğe, 1–2 cümle. Her beat yeni katman eklemeli. Minimum 4 beat.
- pattern: EN ÖNEMLİ ALAN. 3–4 cümle paragraf. Yapı:
  1) Tetikleyici: ne tetikliyor?
  2) Otomatik tepki: refleks ne?
  3) Bedel: kısa vadeli rahatlama vs uzun vadeli maliyet
  En az 2/3 geçmeli. Genel laf yasak ("kaçış döngüsündesin" gibi), spesifik ol.
- nextStep: "Bu hafta" ile başla. Somut, ölçülebilir.
- keywords: 3 kelime. journal: 1 derinleştirici soru.

JSON:
{"overall":"...","beats":["...","...","...","..."],"pattern":"...","nextStep":"Bu hafta ...","keywords":["...","...","..."],"journal":"...?"}`;
  },

  // ============================================
  // C MODE — Rewrite / Action Plan
  // ============================================
  buildModeCPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Bağlam: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    return `Rüya: "${dreamText}"${ctx}

Dönüştürme planı. Somut, ölçülebilir.

- overall: 2–3 cümle. "Burada takılıyorsun, şöyle kırabilirsin" tonu.
- beats: 2–4 öğe, her biri 1 cümle, farklı sembole bağlı.
- nextStep: "Bu hafta" ile başla. Somut.
- plan: 3 adım, her biri farklı zaman ölçeğinde:
  [0] "24 saat:" → 5 dk'da yapılabilir (ör: "5 dk not tut", "1 mesaj at"). Genel yasak.
  [1] "7 gün:" → Günlük küçük alışkanlık (ör: "Her sabah 3 cümle yaz"). Vaaz değil.
  [2] "Sınır:" → "Ben artık..." formatında kişisel sınır cümlesi.
- keywords: 3 kelime. journal: 1 soru.

JSON:
{"overall":"...","beats":["...","..."],"nextStep":"Bu hafta ...","plan":["24 saat: ...","7 gün: ...","Sınır: Ben artık..."],"keywords":["...","...","..."],"journal":"...?"}`;
  },

  // ============================================
  // UPSELL — 3 aday sembol + insight (tek çağrı)
  // ============================================
  buildUpsellAllPrompt: ({ dreamText, existingBeats, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Duygu: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Bağlam: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    const beatsStr = existingBeats.map((b, i) => `${i + 1}. ${b}`).join("\n");

    return `Rüya: "${dreamText}"${ctx}

Mevcut beat'ler:
${beatsStr}

Beat'lerde KULLANILMAMIŞ 3 aday sembol bul. Her biri için: kısa ad + 1 cümle ipucu + 2–3 cümle insight (yeni açı, tekrar yok). Bulamıyorsan mevcut sembollere farklı açı getir. Uydurma yasak.

JSON:
{"candidates":[{"symbol":"...","hint":"...","insight":"..."},{"symbol":"...","hint":"...","insight":"..."},{"symbol":"...","hint":"...","insight":"..."}]}`;
  },
};
