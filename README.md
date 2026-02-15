# Astrolic — Tarot & Dream Coder Platform

Psikolojik tarot okumalari ve ruya cozumlemesi sunan mobil uygulama. 4 dil destegi (TR/EN/DE/ES), ortak gemstone sistemi, premium abonelik. GPT-4o destekli davranis analizi + sembol cozumlemesi.

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React Native (Expo ~54.0), Expo Router ^6.0 |
| Backend | Express.js ^5.2 |
| AI | OpenAI GPT-4o (tek cagri, retry yok) |
| i18n | i18next + react-i18next (TR/EN/DE/ES) |
| UI | Glassmorphism (expo-blur, expo-linear-gradient) |
| Storage | JSON dosyalari + AsyncStorage (kalici deviceId) |

---

## Style DNA

### Tarot

```
Felsefe: "Kehanet degil, farkindalik araci."
Ton:     %40 kocluk + %40 psikolojik icgoru + %20 tarot sembolizmi
Dil:     "sen" dili, kisa yogun cumleler, yuzlestirici ama yargisiz
```

Kategori tonlari: Genel (profesyonel koc), Ask (iliski stratejisti), Kariyer (farkindalik dili, buyurgan yok), Ruhsal (mistik ama yere basan).

### Dream Coder

```
Felsefe: "Ruya yorumu degil, bilincalti farkindalik araci."
Ton:     %40 psikolojik icgoru + %40 sembol analizi + %20 arketipsel rehberlik
Dil:     "sen" dili, "sende neyi tetikliyor/sikistiriyor/buyutuyor" uzerinden yaz
```

Yasak fiiller: goster-/simgele-/isaret et-/yansit-/temsil et-/sembolize-/ifade et-/vurgula-/ortaya koy-.
Yasak kelimeler: olabilir, edebilir, muhtemelen, belki de, gerekiyor, yapmalisin.
Yasak icerik: "kendine inan", "guclen", "pozitif dusun", "ruyanda".
Dinamizm fiilleri: aciyor, netlestiriyor, sertlestiriyor, gevsetiyor, buyutuyor, daraltiyor, sikistiriyor, tetikliyor, bastiriyor, belirginlestiriyor, ustunu ortuyor, geri cagiriyor, askida birakiyor, kilitliyor, hizlandiriyor, yavasliatiyor.

### Ortak DNA

Kehanet YOK, guru tonu YOK, uydurma detay YOK. Ikisi de "sende neyi tetikliyor" sorusuna cevap verir, "anlami budur" demez.

---

## Erisim Matrisi

| Icerik | FREE | Gemstone | Premium Abo |
|--------|------|----------|-------------|
| Tekli Tarot (1 kart) | Hardcoded meaning | GPT yorum (6gs) | GPT yorum (6gs) |
| Yes/No | Hardcoded shortReason | GPT yorum (6gs) | GPT yorum (6gs) |
| 3'lu Tarot (PPF, SOA vs.) | KILITLI | GPT yorum (14gs) | GPT yorum (14gs) |
| 5'li Tarot (Love, Moon vs.) | KILITLI | GPT yorum (22gs) | GPT yorum (22gs) |
| Dream A (Hizli Cozumleme) | KILITLI | 11gs | 11gs |
| Dream B (Derin Cozumleme) | KILITLI | 22gs | 22gs |
| Dream C (Donusturme Plani) | KILITLI | KILITLI | 12gs (sadece abone) |
| Upsell Sembol | — | 3gs | 3gs |
| JournalPlus (Tavsiye) | — | 5gs | 5gs |

---

## Premium Abonelik

| Plan | Fiyat | Bonus | Sure |
|------|-------|-------|------|
| Aylik | $4.99/ay | +50 gemstone (her ay) | 30 gun |
| Yillik | ~~$59.88~~ **$45.00/yil** | +500 gemstone | 365 gun ($3.75/ay, %25 tasarruf) |

## Gemstone Paketleri

| Paket | Gercek | Bonus | Toplam | Fiyat | $/gem |
|-------|--------|-------|--------|-------|-------|
| 50 | 50 | 0 | **50** | $3.99 | $0.0798 |
| 100 | 75 | 25 | **100** | $5.99 | $0.0599 |
| 250 | 150 | 100 | **250** | $11.99 | $0.0480 |
| 500 | 250 | 250 | **500** | $19.99 | $0.0400 |

---

## Dream Coder Modlari

### A — Hizli Cozumleme (11gs)

| Alan | Aciklama |
|------|----------|
| overall | 2-3 cumle, cekirdek tema |
| beats | 2-3 oge, [somut ruya ogesi] + [dinamizm fiili] ile baslar |
| keywords | 3 kelime |
| Upsell | 1 aday otomatik, 3gs'e acilir |

A modunda journal ve JournalPlus YOK. Upsell sembolunun insight'i soru isaretiyle biter — o yeterli.

### B — Derin Cozumleme (22gs)

| Alan | Aciklama |
|------|----------|
| overall | 3-4 cumle, tema + psikolojik arka plan |
| beats | 4-6 oge, her beat yeni katman ekler |
| pattern | TAM 3 cumle: tetikleyici→tepki→bedel, her cumlede ruya ogesi adi |
| keywords | 3 kelime |
| journal | 1 icsel soru (Kendine Sor) |
| JournalPlus | Kullanici cevap yazarsa somut tavsiye alir (5gs) |
| Upsell | 3 aday, kullanici secer, 3gs'e acilir |

### C — Donusturme Plani (12gs, PREMIUM ONLY)

| Alan | Aciklama |
|------|----------|
| overall | 2-3 cumle, "burada takiliyorsun, soyle kirabilirsin" |
| beats | 2-4 oge |
| plan[0] | 24 saat: 5 dk'da yapilabilir somut aksiyon |
| plan[1] | 7 gun: gunluk kucuk aliskanlik |
| plan[2] | Sinir: "Ben artik..." formati |
| keywords | 3 kelime |
| journal | 1 icsel soru (Kendine Sor) |
| JournalPlus | Kullanici cevap yazarsa somut tavsiye alir (5gs) |
| Upsell | YOK |

---

## Upsell Sembol Sistemi

Decode sirasinda 2 GPT cagrisi: ana decode + upsell adaylari (onceden hazir).

Kurallar:
- Symbol SADECE dreamText'te gecen somut isim (ICAT YASAK)
- Soyut kavram sembol olamaz (duygu, belirsizlik, ses, zaman vb.)
- Hint = sahne betimi ("kim/nerede/ne oluyor"), yorum fiili yok
- Insight = mekanizma dili
- Secim aninda GPT cagrisi YOK

| Mod | Aday | Akis |
|-----|------|------|
| A | 1 | Otomatik sunulur |
| B | 3 | Kullanici secer |
| C | 0 | Upsell yok |

---

## JournalPlus Sistemi (5gs) — Tavsiye

B ve C modlarinda "Kendine Sor" sorusuna kullanici cevap yazinca GPT **somut tavsiye** uretir (analiz degil).

Kurallar:
- CEVAP ONCELIKLI: Kullanicinin cevabindaki ana tema, ruyadan onemli
- Cevap farkli konuya geciyorsa cevabi takip et, ruyaya donme
- "Bu hafta..." ile baslayan en az 1 somut aksiyon icersin
- Motivasyon koclugu YASAK

Akis:
1. "Kendime Sordum" butonu (5gs) → TextInput acilir
2. Kullanici cevap yazar → "Gonder"
3. GPT: journal sorusu + cevap + overall + keywords → 2-4 cumle tavsiye
4. Gosterim: "Senin Cevabin" + "Tavsiye"

A modunda JournalPlus YOK.

---

## Input Tagleri (max 3 secim)

### Uyaninca Kalan Duygu (16 secenek, max 3)

korku, ozlem, merak, rahatlik, utanc, ofke, huzun, saskinlik, mutluluk, hayal kirikligi, endise, sucluluk, guvensizlik, huzur, caresizlik, kiskanclik

### Su Anki Gundem (9 secenek, max 3)

is, ask, para, aile, saglik, arkadaslik, kayip, degisim, egitim

Her ikisi de opsiyonel. Secilmezse GPT genelleme yapar.

---

## Output Basliklari (4 Dil)

### Ortak

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| dreamOverall | Genel Cerceve | Overall Insight | Gesamtbild | Panorama General |
| dreamBeats | Sembol Cozumlemesi | Symbol Breakdown | Symbol-Analyse | Lectura de Simbolos |
| dreamKeywords | *(chip)* | *(chip)* | *(chip)* | *(chip)* |
| dreamJournal | Kendine Sor | Ask Yourself | Frage an dich | Preguntate |

### Mod ek

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| dreamPattern (B) | Davranis Izi | Behavior Pattern | Verhaltensmuster | Patron de Conducta |
| dreamPlan (C) | Donusturme Plani | Transformation Plan | Transformationsplan | Plan de Transformacion |

### JournalPlus

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| journalPlusCTA | Kendime Sordum | I Asked Myself | Ich habe mich gefragt | Me lo pregunte |
| journalPlusYourAnswer | Senin Cevabin | Your Answer | Deine Antwort | Tu Respuesta |
| journalPlusAdvice | Tavsiye | Advice | Empfehlung | Consejo |

---

## Proje Yapisi

```
TAROT-NEW/
├── backend/
│   ├── index.js                    # Express API + Tarot Engine + gemstone
│   ├── .env                        # OPENAI_API_KEY
│   ├── prompts/                    # Tarot GPT promptlari (4 dil)
│   │   └── tr.js / en.js / de.js / es.js
│   ├── data/
│   │   ├── premium-readings.json
│   │   └── {tr,en,de,es}/
│   │       ├── tarot-template.json    # 78 kart + meanings
│   │       ├── tendency.map.json      # Kart egilimleri
│   │       ├── tendencyGlossary.json
│   │       ├── yesno-clarity.json     # clarityWeight + keywords
│   │       └── cards_history.json     # 78 kart tarihcesi
│   └── dream-coder/
│       ├── index.js                # Express Router + user helpers
│       ├── prompts/
│       │   └── tr.js / en.js / de.js / es.js  # v3.2 promptlar
│       └── data/
│           ├── prices.json         # Fiyatlar + paketler + abonelik
│           ├── users.json          # Ortak kullanici DB
│           └── {tr,en,de,es}/readings.json
│
├── tarot-app/
│   ├── app/
│   │   ├── _layout.tsx             # AppProvider + DreamProvider
│   │   ├── index.tsx               # Welcome (dil + premium + market)
│   │   ├── tarot.tsx               # Spread secimi (gemstone + kilit)
│   │   ├── market.tsx              # Paketler + abonelik (bilgi)
│   │   ├── pick/[spread].tsx       # Kart secimi
│   │   ├── result.tsx              # Tarot FREE
│   │   ├── premium-result.tsx      # Tarot PREMIUM
│   │   ├── yesno-result.tsx        # Yes/No
│   │   └── dream/
│   │       ├── index.tsx           # Mod secimi (A/B/C)
│   │       ├── input.tsx           # Ruya girisi (300 char + tag'ler)
│   │       └── result.tsx          # Sonuc + upsell + JournalPlus
│   ├── components/ui/SpreadCard.tsx
│   ├── context/AppContext.tsx + DreamContext.tsx
│   ├── utils/deviceId.ts
│   ├── types/tarot.ts + dream.ts
│   └── i18n/translations.ts        # 4 dil, 1500+ satir
│
└── README.md
```

---

## API Endpoints

### Tarot

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/reading` | Tarot okuma (FREE/PREMIUM) |

### Dream Coder

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/dream/decode` | Ruya cozumle (A/B/C) + upsell adaylari |
| POST | `/api/dream/upsell-symbol` | Secilen sembolu ac (3gs, GPT yok) |
| POST | `/api/dream/journal-plus` | Journal cevabina tavsiye (5gs) |
| GET | `/api/dream/user/:deviceId` | Kullanici bakiye + premium |
| GET | `/api/dream/prices` | Fiyatlar + paketler + abonelik |

---

## API Maliyet Analizi

| Urun | GPT Cagrisi | Maliyet/istek | Gemstone | ROI (min-max) |
|------|-------------|---------------|----------|---------------|
| Tekli Tarot | 1 | ~$0.0015 | 6gs | 16,000% - 32,000% |
| 3'lu Tarot | 1 | ~$0.007 | 14gs | 8,000% - 16,000% |
| 5'li Tarot | 1 | ~$0.0085 | 22gs | 10,300% - 20,700% |
| Dream A | 2 (decode + upsell) | ~$0.0066 | 11gs | 6,600% - 13,300% |
| Dream B | 2 (decode + upsell) | ~$0.0079 | 22gs | 11,100% - 22,200% |
| Dream C | 1 (decode only) | ~$0.0073 | 12gs | 6,500% - 13,100% |
| Upsell Sembol | 0 (onceden hazir) | $0 | 3gs | sonsuz (saf kar) |
| JournalPlus | 1 | ~$0.002 | 5gs | 10,000% - 20,000% |

*ROI: min = 500'luk paket fiyatiyla, max = 50'lik paket fiyatiyla. Maliyetin kac kati gelir.*
*Ortalama ROI: %6,500 - %20,000+ (maliyetin 65-200 kati)*

### 1 USD Kapasite

| Urun | 1 USD = ~istek | Tahsil edilen tas |
|------|----------------|-------------------|
| Tekli Tarot | 684 | **4,104** |
| 3'lu Tarot | 143 | **2,002** |
| 5'li Tarot | 118 | **2,596** |
| Dream A | 153 | **1,683** |
| Dream B | 126 | **2,772** |
| Dream C | 138 | **1,656** |

---

## Yes/No v2 Engine

```
confidence = 55 + clarityWeight + orientationMod
orientationMod: upright +8, reversed: low -8, standard -12, high -18
Sinirlar: uncertain 40-75, diger 45-90
Clarity: >=75% Net | 55-74% Sartli | <55% Belirsiz
```

---

## Kullanici Akisi

```
Welcome (index.tsx)
  ├── Dil sec (TR/EN/DE/ES)
  ├── Premium toggle
  ├── Market → market.tsx
  ├── Tarot → tarot.tsx
  │     ├── FREE: Tekli + Yes/No
  │     └── PREMIUM: 3-5 kart (gemstone)
  └── Dream Coder → dream/index.tsx
        ├── A (11gs) → input → result (overall + beats + keywords + 1 sembol)
        ├── B (22gs) → input → result (+ pattern + journal + 3 sembol + tavsiye)
        └── C (12gs, premium) → input → result (+ plan + journal + tavsiye)
```

Result gosterim sirasi:
1. Genel Cerceve (overall)
2. Sembol Cozumlemesi (beats)
3. Davranis Izi (pattern — B)
4. Donusturme Plani (plan — C)
5. Keywords (chip)
6. Kendine Sor (journal — B/C)
7. Tavsiye (JournalPlus — B/C)
8. Upsell Sembol (A/B)
9. CTA: Sembol Ac → Kendime Sordum → Upgrade

---

## Prompt Mimarisi (v3.2)

4 dil: `dream-coder/prompts/{tr,en,de,es}.js`

Fonksiyonlar:
- `systemMessage` — Yasak fiiller, dinamizm fiilleri, ton, sema kilidi, 3. kisi yasagi
- `buildModeAPrompt` — overall + beats + keywords (journal yok)
- `buildModeBPrompt` — + pattern (3 cumle sablonu) + journal
- `buildModeCPrompt` — + plan (24h/7d/sinir) + journal
- `buildUpsellAllPrompt` — Icat yasak, soyut yasak, hint kilidi, somut isim zorunlu
- `buildJournalPlusPrompt` — Cevap oncelikli tavsiye ("Bu hafta..." aksiyonlu)

GPT: Her zaman tek cagri, retry yok. Token tasarrufu.

---

## Kurulum

```bash
cd backend && cp .env.example .env && npm install && node index.js
cd tarot-app && npm install && npx expo start
```

---

## Notlar

- **Ortak users.json**: Tarot + Dream Coder ayni DB (deviceId bazli)
- **Ortak deviceId**: AsyncStorage ile kalici
- **Schema Option B**: resultJson = model output (temiz). Meta alanlar ust seviyede
- **Premium suresi dolunca**: Backend otomatik `isPremiumSubscriber: false`
- **Idempotency**: `requestId` ile duplicate onlenir
- **Upsell token tasarrufu**: Adaylar decode sirasinda hazirlanir, secim aninda GPT yok
- **JournalPlus**: Cevap oncelikli tavsiye, ruyaya geri donmez
- **Multi-select**: Duygu + gundem max 3'er secim
- **16 duygu tagi**: korku, ozlem, merak, rahatlik, utanc, ofke, huzun, saskinlik, mutluluk, hayal kirikligi, endise, sucluluk, guvensizlik, huzur, caresizlik, kiskanclik
- **9 gundem tagi**: is, ask, para, aile, saglik, arkadaslik, kayip, degisim, egitim
- **Market**: Bilgi amacli, satin alma entegrasyonu henuz yok
- **Drift Checker**: Backend baslarken veri tutarliligi kontrol edilir
