# Astrolic — Tarot & Dream Coder Platform

Psikolojik tarot okumalari ve ruya cozumlemesi sunan mobil uygulama. 4 dil destegi, ortak gemstone sistemi, premium abonelik. GPT-4o destekli davranis analizi + sembol cozumlemesi.

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React Native (Expo ~54.0), Expo Router ^6.0 |
| Backend | Express.js ^5.2 |
| AI | OpenAI GPT-4o |
| i18n | i18next + react-i18next (TR/EN/DE/ES) |
| UI | Glassmorphism (expo-blur, expo-linear-gradient) |
| Storage | JSON dosyalari + AsyncStorage (deviceId) |

---

## Style DNA

### Tarot Yorum Tarzi

```
Felsefe: "Kehanet degil, farkindalik araci."
Ton:     %40 kocluk + %40 psikolojik icgoru + %20 tarot sembolizmi
Dil:     "sen" dili, kisa yogun cumleler, yuzlestirici ama yargisiz
YASAK:   "evren mesaj gonderiyor", "kader", "titresim", "ruh esi", "su olacak"
KULLAN:  "su davranis seni yavasliyor", "burada kontrolu kaybediyorsun"
```

Kategori bazli ton kaymalari:
- Genel: Profesyonel koc (psikolojik, spirituel degil)
- Ask: Iliski stratejisti (kader romantizmi yok)
- Kariyer: Kariyer danismani (buyurgan aksiyon yok, farkindalik dili)
- Ruhsal: Sezgisel rehber (mistik ama ayaklari yere basan)

### Dream Coder Yorum Tarzi

```
Felsefe: "Ruya yorumu degil, bilincalti farkindalik araci."
Ton:     %40 psikolojik icgoru + %40 sembol analizi + %20 arketipsel rehberlik
Dil:     "sen" dili, "sende neyi tetikliyor/sikistiriyor/buyutuyor" uzerinden yaz
```

YASAK FIILLER: goster-, simgele-, isaret et-, yansit-, temsil et-, sembolize-, ifade et-, vurgula-, ortaya koy-.
YASAK KALIPLAR: "X demektir", "X anlamina gelir", "X isaret eder".
YASAK KELIMELER: olabilir, edebilir, muhtemelen, belki de, gerekiyor, yapmalisin.
YASAK ICERIK: "kendine inan", "guclen", "pozitif dusun".
"Ruyanda" kelimesi YASAK. Sadece "sen" dili.

DINAMIZM FIILLERI: aciyor, netlestiriyor, sertlestiriyor, gevsetiyor, buyutuyor, daraltiyor, sikistiriyor, tetikliyor, bastiriyor, belirginlestiriyor, ustunu ortuyor, geri cagiriyor, askida birakiyor, kilitliyor, hizlandiriyor, yavasliatiyor.

### Ortak DNA

- Kehanet YOK, guru/koc tonu YOK, uydurma detay YOK
- "Bu hafta..." somut nextStep, 1 icsel journal sorusu, 3 keyword
- Tarot kart sembolizminden, Dream Coder ruya sahnelerinden yola cikar
- Ikisi de "sende neyi tetikliyor" sorusuna cevap verir, "anlami budur" demez

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
| JournalPlus | — | 5gs | 5gs |

---

## Premium Abonelik

| Plan | Fiyat | Bonus | Sure |
|------|-------|-------|------|
| Aylik | $4.99/ay | +50 gemstone (her ay) | 30 gun |
| Yillik | ~~$59.88~~ **$45.00/yil** | +500 gemstone | 365 gun ($3.75/ay, %25 tasarruf) |

Avantajlar: Dream C erisimi + gemstone bonus.

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
| nextStep | "Bu hafta..." 5 dk'da yapilabilir |
| keywords | 3 kelime |
| journal | 1 icsel soru |
| Upsell | 1 aday otomatik, 3gs'e acilir |

### B — Derin Cozumleme (22gs)

A'nin tum alanlari + ek:

| Alan | Aciklama |
|------|----------|
| beats | 4-6 oge, her beat yeni katman ekler |
| pattern | TAM 3 cumle: tetikleyici→tepki→bedel, her cumlede ruya ogesi adi |
| Upsell | 3 aday, kullanici secer, 3gs'e acilir |

### C — Donusturme Plani (12gs, PREMIUM ONLY)

A'nin tum alanlari + ek:

| Alan | Aciklama |
|------|----------|
| plan[0] | 24 saat: 5 dk'da yapilabilir somut aksiyon |
| plan[1] | 7 gun: gunluk kucuk aliskanlik |
| plan[2] | Sinir: "Ben artik..." formati |
| Upsell | YOK |

---

## Upsell Sembol Sistemi

Decode istegi sirasinda 2 GPT cagrisi yapilir:
1. Ana decode → overall/beats/nextStep/keywords/journal (+pattern/plan moda gore)
2. Upsell pre-gen → 3 aday sembol (hint + insight onceden hazir)

Kurallar:
- Symbol SADECE dreamText'te gecen somut isim (ICAT YASAK)
- Soyut kavram sembol olamaz (duygu, belirsizlik, umut, ses, zaman vb.)
- Hint = sahne betimi ("kim/nerede/ne oluyor"), yorum yok
- Insight = mekanizma dili ("sende neyi tetikliyor/sikistiriyor")
- Secim aninda GPT cagrisi YOK, onceden hazir insight gosterilir

| Mod | Aday sayisi | Akis |
|-----|-------------|------|
| A | 1 | Otomatik sunulur |
| B | 3 | Kullanici secer |
| C | 0 | Upsell yok |

---

## JournalPlus Sistemi (5gs)

Journal sorusuna kullanici cevap yazinca GPT kisisel insight uretir.

Kurallar:
- CEVAP ONCELIKLI: Overall/keywords sadece baglam, kullanicinin cevabindaki ana tema oncelikli
- Cevap ruyadan farkli konuya geciyorsa, cevabi takip et — ruyaya geri donme
- Soru/cevabi tekrar etme, yeni cerceve kur
- Mekanizma dili: tetikleyici/ihtiyac/savunma/sinir
- Motivasyon koclugu YASAK

Akis:
1. "Kendime Sordum" butonu (5gs) → TextInput acilir
2. Kullanici cevap yazar → "Gonder" butonu
3. GPT: journal sorusu + cevap + overall + keywords → 2-4 cumle insight
4. Sonuc: "Senin Cevabin" + "Derinlemesine Icgoru" karti

---

## Output Basliklari (4 Dil)

### Ortak (A/B/C)

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| dreamOverall | Genel Cerceve | Overall Insight | Gesamtbild | Panorama General |
| dreamBeats | Sembol Cozumlemesi | Symbol Breakdown | Symbol-Analyse | Lectura de Simbolos |
| dreamNextStep | Bu Hafta | This Week | Diese Woche | Esta Semana |
| dreamKeywords | *(chip)* | *(chip)* | *(chip)* | *(chip)* |
| dreamJournal | Kendine Sor | Ask Yourself | Frage an dich | Preguntate |

### Mod ek alanlari

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| dreamPattern (B) | Davranis Izi | Behavior Pattern | Verhaltensmuster | Patron de Conducta |
| dreamPlan (C) | Donusturme Plani | Transformation Plan | Transformationsplan | Plan de Transformacion |

### JournalPlus

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| journalPlusCTA | Kendime Sordum | I Asked Myself | Ich habe mich gefragt | Me lo pregunte |
| journalPlusYourAnswer | Senin Cevabin | Your Answer | Deine Antwort | Tu Respuesta |
| journalPlusInsight | Derinlemesine Icgoru | Deeper Insight | Tiefere Einsicht | Percepcion Profunda |

---

## Proje Yapisi

```
TAROT-NEW/
├── backend/
│   ├── index.js                    # Express API + Tarot Engine + gemstone dusme
│   ├── .env                        # OPENAI_API_KEY
│   ├── prompts/                    # Tarot GPT promptlari (4 dil)
│   │   ├── index.js
│   │   └── tr.js / en.js / de.js / es.js
│   ├── data/
│   │   ├── premium-readings.json   # Tarot okuma loglari
│   │   └── {tr,en,de,es}/
│   │       ├── tarot-template.json    # 78 kart + meanings
│   │       ├── tendency.map.json      # Kart egilimleri
│   │       ├── tendencyGlossary.json  # Egilim sozlugu
│   │       ├── yesno-clarity.json     # clarityWeight + keywords + shortReason
│   │       └── cards_history.json     # 78 kart tarihcesi
│   └── dream-coder/
│       ├── index.js                # Express Router + shared user helpers
│       ├── prompts/
│       │   ├── index.js            # Dil router (4 dil)
│       │   └── tr.js / en.js / de.js / es.js  # v3.2 promptlar
│       └── data/
│           ├── prices.json         # Tum fiyatlar + paketler + abonelik
│           ├── users.json          # Ortak kullanici DB (gemstone + premium)
│           └── {tr,en,de,es}/
│               └── readings.json   # Dream okuma kayitlari
│
├── tarot-app/
│   ├── app/
│   │   ├── _layout.tsx             # Root layout (AppProvider + DreamProvider)
│   │   ├── index.tsx               # Welcome (dil + premium toggle + market)
│   │   ├── tarot.tsx               # Tarot spread secimi (gemstone + kilit)
│   │   ├── market.tsx              # Market (bilgi amacli)
│   │   ├── pick/[spread].tsx       # Kart secimi
│   │   ├── result.tsx              # Tarot FREE sonuc
│   │   ├── premium-result.tsx      # Tarot PREMIUM sonuc
│   │   ├── yesno-result.tsx        # Yes/No sonuc
│   │   └── dream/
│   │       ├── index.tsx           # Mod secimi (A/B/C + gemstone + C kilidi)
│   │       ├── input.tsx           # Ruya girisi (max 300 char + 16 duygu + 8 baglam)
│   │       └── result.tsx          # Sonuc + upsell + JournalPlus
│   ├── components/ui/
│   │   └── SpreadCard.tsx          # gemCost + locked prop
│   ├── context/
│   │   ├── AppContext.tsx           # Dil, gemstone, isPremium, deviceId
│   │   └── DreamContext.tsx         # Mod, text, tag, result, prices
│   ├── utils/
│   │   └── deviceId.ts             # AsyncStorage kalici deviceId
│   ├── types/
│   │   ├── tarot.ts                # Tarot type'lari
│   │   └── dream.ts                # Dream type'lari + JournalPlus + UpsellSymbol
│   └── i18n/
│       └── translations.ts         # 4 dil, 1500+ satir
│
└── README.md
```

---

## API Endpoints

### Tarot

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/reading` | Tarot okuma (FREE: hardcoded, PREMIUM: GPT + gemstone) |

### Dream Coder

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/dream/decode` | Ruya cozumle (A/B/C) + upsell adaylari onceden hazir |
| POST | `/api/dream/upsell-symbol` | Secilen sembolu ac (3gs, GPT yok) |
| POST | `/api/dream/journal-plus` | Journal cevabina kisisel insight (5gs) |
| GET | `/api/dream/user/:deviceId` | Kullanici bakiye + premium durumu |
| GET | `/api/dream/prices` | Tum fiyatlar + paketler + abonelik |

---

## API Maliyet Analizi

| Urun | GPT Cagrisi | Maliyet/istek | Gemstone |
|------|-------------|---------------|----------|
| Tekli Tarot | 1 | ~$0.0015 | 6gs |
| 3'lu Tarot | 1 | ~$0.007 | 14gs |
| 5'li Tarot | 1 | ~$0.0085 | 22gs |
| Dream A | 2 (decode + upsell) | ~$0.0066 | 11gs |
| Dream B | 2 (decode + upsell) | ~$0.0079 | 22gs |
| Dream C | 1 (decode only) | ~$0.0073 | 12gs |
| Upsell Sembol | 0 (onceden hazir) | $0 | 3gs |
| JournalPlus | 1 | ~$0.002 | 5gs |

### 1 USD API Maliyeti Icin Kapasite

| Urun | 1 USD = ~istek | Tahsil edilen tas |
|------|----------------|-------------------|
| Tekli Tarot | 684 | 684 x 6 = **4,104** |
| 3'lu Tarot | 143 | 143 x 14 = **2,002** |
| 5'li Tarot | 118 | 118 x 22 = **2,596** |
| Dream A | 153 | 153 x 11 = **1,683** |
| Dream B | 126 | 126 x 22 = **2,772** |
| Dream C | 138 | 138 x 12 = **1,656** |

---

## Yes/No v2 Engine

```
confidence = 55 + clarityWeight + orientationMod

orientationMod:
  upright: +8
  reversed: low=-8, standard=-12, high=-18

Sinirlar: uncertain=40-75, diger=45-90
Tendency: strong_yes/yes→"yes", strong_no/no→"no", uncertain→"uncertain"
Clarity: >=75% Net | 55-74% Sartli | <55% Belirsiz
```

---

## Kullanici Akisi

```
index.tsx (Welcome)
  ├── Dil sec (TR/EN/DE/ES)
  ├── Premium toggle (Free / Premium)
  ├── Market butonu → market.tsx
  │
  ├── Tarot → tarot.tsx
  │     ├── FREE: Tekli + Yes/No (gemstone dusmez)
  │     └── PREMIUM: 3-5 kart (gemstone duser)
  │
  └── Dream Coder → dream/index.tsx
        ├── A: Hizli (11gs) → input → result (+1 sembol + Kendime Sordum)
        ├── B: Derin (22gs) → input → result (+3 sembol sec + Kendime Sordum)
        └── C: Donusturme (12gs, premium) → input → result (Kendime Sordum)
```

Result ekrani gosterim sirasi:
1. Genel Cerceve (overall)
2. Sembol Cozumlemesi (beats)
3. Davranis Izi (pattern — B)
4. Donusturme Plani (plan — C)
5. Keywords (chip)
6. Bu Hafta (nextStep)
7. Kendine Sor (journal)
8. Kendime Sordum / Derinlemesine Icgoru (JournalPlus)
9. Upsell Sembol (A/B)
10. CTA: Sembol Ac → Kendime Sordum → Upgrade

---

## Prompt Mimarisi (v3.2)

Her dil icin ayri prompt dosyasi: `dream-coder/prompts/{tr,en,de,es}.js`

Her dosya icindeki fonksiyonlar:
- `systemMessage` — Ortak kurallar (yasak fiiller, dinamizm fiilleri, ton, sema kilidi)
- `buildModeAPrompt` — Hizli Cozumleme
- `buildModeBPrompt` — Derin Cozumleme (pattern 3 cumle sablonu)
- `buildModeCPrompt` — Donusturme Plani (24h/7d/sinir)
- `buildUpsellAllPrompt` — Sembol adaylari (icat yasak, soyut yasak, hint format kilidi)
- `buildJournalPlusPrompt` — Cevap oncelikli insight

GPT cagrisi: Her zaman tek cagri, retry yok. Token tasarrufu.

---

## Kurulum

```bash
# Backend
cd backend
cp .env.example .env   # OPENAI_API_KEY=sk-...
npm install
node index.js

# Frontend
cd tarot-app
npm install
npx expo start
```

---

## Notlar

- **Ortak users.json**: Tarot ve Dream Coder ayni kullanici DB'sini paylasir (deviceId bazli)
- **Ortak deviceId**: AsyncStorage ile kalici, her iki context ayni ID'yi kullanir
- **Schema Option B**: resultJson = model output (temiz). Upsell/JP meta'si ust seviyede ayri alanlar
- **Premium suresi dolunca**: Backend otomatik `isPremiumSubscriber: false` yapar
- **Idempotency**: `requestId` ile duplicate decode onlenir
- **Upsell token tasarrufu**: Adaylar decode sirasinda hazirlanir, secim aninda GPT yok
- **JournalPlus**: Cevap oncelikli, ruyaya geri donmez
- **Market**: Bilgi amacli ekran, satin alma entegrasyonu henuz yok
- **Drift Checker**: Backend baslarken veri tutarliligi kontrol edilir
- **Loglama**: Tarot → `premium-readings.json`, Dream → `{lang}/readings.json`
- **16 duygu tagi**: korku, ozlem, merak, rahatlik, utanc, ofke, huzun, saskinlik, mutluluk, hayal kirikligi, endise, sucluluk, guvensizlik, huzur, caresizlik, kiskanclik
- **8 baglam tagi**: is, ask, para, aile, saglik, arkadaslik, kayip, degisim
