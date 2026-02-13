# Astrolic — Tarot & Dream Coder Platform

Psikolojik tarot okumalari ve ruya cozumlemesi sunan mobil uygulama. Ortak gemstone sistemi + premium abonelik. GPT-4o destekli davranis analizi + sembol cozumlemesi.

---

## Tech Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Frontend** | React Native (Expo) | ~54.0 |
| **Routing** | Expo Router | ^6.0 |
| **Backend** | Express.js | ^5.2 |
| **AI** | OpenAI GPT-4o | via SDK |
| **i18n** | i18next + react-i18next | ^25.x |
| **UI** | Glassmorphism (expo-blur, expo-linear-gradient) | — |
| **Storage** | JSON dosyalari (DB yok), AsyncStorage (deviceId) | — |

---

## Style DNA (Tum Platformda Gecerli)

```
Felsefe: "Kehanet degil, farkindalik araci."
Ton:     %40 psikolojik icgoru + %40 sembol analizi + %20 arketipsel rehberlik
Dil:     2. tekil sahis ("sen"), kisa yogun cumleler, yuzlestirici ama yargisiz

YASAK:   "evren mesaj gonderiyor", "kader", "titresim", "ruh esi", "su olacak"
KULLAN:  "su davranis seni yavasliyor", "burada kontrolu kaybediyorsun"
```

---

## Erisim Matrisi

| Icerik | FREE | Gemstone | Premium Abo |
|--------|------|----------|-------------|
| **Tekli Tarot** (1 kart) | Hardcoded meaning | GPT yorum (6gs) | GPT yorum (6gs) |
| **Yes/No** | Hardcoded shortReason | GPT yorum (6gs) | GPT yorum (6gs) |
| **3'lu Tarot** (PPF, SOA, vs.) | KILITLI | GPT yorum (14gs) | GPT yorum (14gs) |
| **5'li Tarot** (Love, Moon, vs.) | KILITLI | GPT yorum (22gs) | GPT yorum (22gs) |
| **Dream A** (Hizli Cozumleme) | KILITLI | 11gs | 11gs |
| **Dream B** (Derin Cozumleme) | KILITLI | 22gs | 22gs |
| **Dream C** (Donusturme Plani) | KILITLI | KILITLI | 12gs (sadece abone) |
| **Upsell Sembol** | — | 3gs | 3gs |

- FREE: Tekli tarot + Yes/No sinirsiz ucretsiz (hardcoded meaning)
- Gemstone: 3-5 kart tarot + Dream A/B acilir
- Premium Abo: Dream C erisimi + gemstone bonus (aylik 50gs, yillik 600gs)

---

## Premium Abonelik

| Plan | Fiyat | Bonus | Sure |
|------|-------|-------|------|
| Aylik | $4.99/ay | +50 gemstone (her ay yenilenir) | 30 gun |
| Yillik | ~~$59.88~~ **$45.00/yil** | +500 gemstone toplam | 365 gun ($3.75/ay, %25 tasarruf) |

Premium avantajlari:
- Dream C (Donusturme Plani) erisimi acilir
- Gemstone hediye (aylik: 50gs/ay, yillik: 500gs toplam)

---

## Gemstone Paketleri

| Paket | Gercek | Bonus | Toplam | Fiyat | $/gem |
|-------|--------|-------|--------|-------|-------|
| 50 | 50 | 0 | **50** | $3.99 | $0.0798 |
| 100 | 75 | 25 | **100** | $5.99 | $0.0599 |
| 250 | 150 | 100 | **250** | $11.99 | $0.0480 |
| 500 | 250 | 250 | **500** | $19.99 | $0.0400 |

Normal fiyat (50 baz): 50 gem = $3.99. Buyuk paketlerde ustu cizili normal fiyat gosterilir.

---

## Dream Coder Modlari

### A — Hizli Cozumleme (11gs)

| Alan | Aciklama |
|------|----------|
| overall | 2-3 cumle, cekirdek tema |
| beats | 2-3 oge, her biri 1 cumle |
| nextStep | "Bu hafta..." somut aksiyon |
| keywords | 3 kelime |
| journal | 1 icsel soru |
| **Upsell** | **1 aday sembol otomatik sunulur, 3gs'e acilir** |

### B — Derin Cozumleme (22gs)

A'nin tum alanlari + ek:

| Alan | Aciklama |
|------|----------|
| pattern | 1 paragraf, davranis dongusu (tetikleyici→tepki→bedel) |
| beats | 4-6 oge, her biri 1-2 cumle |
| **Upsell** | **3 aday sembol listelenir, kullanici secer, 3gs'e acilir** |

### C — Donusturme Plani (12gs, PREMIUM ONLY)

A'nin tum alanlari + ek:

| Alan | Aciklama |
|------|----------|
| plan[0] | 24 saat: somut aksiyon (5 dk'da yapilabilir) |
| plan[1] | 7 gun: aliskanlik degisikligi |
| plan[2] | Sinir cumlesi: "Ben artik..." |
| **Upsell** | **YOK** |

---

## Upsell Sembol Sistemi

```
Decode istegi (2 GPT cagrisi):
  1. Ana decode → overall/beats/nextStep/keywords/journal
  2. Upsell pre-gen → adaylar (hint + insight onceden hazir)

Mode A: 1 aday otomatik → sonuc ekraninda direkt gosterilir
Mode B: 3 aday → "+1 Sembol Ac" butonu → kullanici secer
Mode C: Upsell yok

Sembol secilince: GPT cagrisi YOK, onceden hazir insight gosterilir, 5gs duser
```

---

## Proje Yapisi

```
TAROT-NEW/
├── backend/
│   ├── index.js                    # Express API + Tarot Engine + gemstone dusme
│   ├── .env                        # OPENAI_API_KEY
│   │
│   ├── prompts/                    # Tarot GPT promptlari (4 dil)
│   │   ├── index.js
│   │   └── tr.js / en.js / de.js / es.js
│   │
│   ├── data/
│   │   ├── premium-readings.json   # Tarot okuma loglari
│   │   └── {tr,en,de,es}/
│   │       ├── tarot-template.json
│   │       ├── tendency.map.json
│   │       ├── tendencyGlossary.json
│   │       ├── yesno-clarity.json
│   │       └── cards_history.json
│   │
│   └── dream-coder/
│       ├── index.js                # Express Router + shared user helpers
│       ├── prompts/
│       │   ├── index.js
│       │   └── tr.js               # A/B/C + upsell promptlari
│       └── data/
│           ├── prices.json         # Tum fiyatlar (tarot + dream + abonelik + paketler)
│           ├── users.json          # Ortak kullanici DB (gemstone + premium)
│           └── tr/
│               └── readings.json   # Dream okuma kayitlari
│
├── tarot-app/
│   ├── app/
│   │   ├── _layout.tsx             # Root layout (AppProvider + DreamProvider)
│   │   ├── index.tsx               # Welcome (dil + premium toggle + market + Tarot/Dream)
│   │   ├── tarot.tsx               # Tarot spread secimi (gemstone fiyatlar + kilit)
│   │   ├── market.tsx              # Market (paketler + abonelik - bilgi amacli)
│   │   ├── pick/[spread].tsx
│   │   ├── result.tsx
│   │   ├── premium-result.tsx
│   │   ├── yesno-result.tsx
│   │   └── dream/
│   │       ├── index.tsx           # Mod secimi (A/B/C + gemstone badge + C kilidi)
│   │       ├── input.tsx           # Ruya girisi (max 300 char + tag'ler)
│   │       └── result.tsx          # Sonuc (mod bazli render + upsell)
│   │
│   ├── components/ui/
│   │   └── SpreadCard.tsx          # gemCost + locked prop'lu
│   ├── context/
│   │   ├── AppContext.tsx           # Ortak: dil, gemstone, isPremium, deviceId
│   │   └── DreamContext.tsx         # Dream: mod, text, tag, result, prices
│   ├── utils/
│   │   └── deviceId.ts             # AsyncStorage kalici deviceId
│   ├── types/
│   │   ├── tarot.ts
│   │   └── dream.ts
│   └── i18n/
│       └── translations.ts         # 4 dil, 1400+ satir
│
└── README.md
```

---

## Kullanici Akisi

```
index.tsx (Welcome)
  ├── Dil sec (TR/EN/DE/ES)
  ├── Premium toggle (Free ↔ Premium)
  ├── Market butonu → market.tsx
  │
  ├── Tarot → tarot.tsx
  │     ├── FREE: Tekli + Yes/No (gemstone dusmez)
  │     └── PREMIUM: 3-5 kart (gemstone duser) → pick → result/premium-result
  │
  └── Dream Coder → dream/index.tsx
        ├── A: Hizli (10gs) → input → result (+1 sembol otomatik)
        ├── B: Derin (22gs) → input → result (+1 sembol sec)
        └── C: Donusturme (12gs, premium-only) → input → result (upsell yok)
```

---

## API Endpoints

### Tarot

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/reading` | Tarot okuma (FREE: hardcoded, PREMIUM: GPT + gemstone) |

Request body'de `deviceId` + `isPremium: true` gonderilirse gemstone duser.
3-5 kart spread'ler `isPremium: true` zorunlu (yoksa 403).

### Dream Coder

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/api/dream/decode` | Ruya cozumle (A/B/C) + upsell adaylari |
| POST | `/api/dream/upsell-symbol` | Secilen sembolu ac (5gs, GPT yok) |
| GET | `/api/dream/user/:deviceId` | Kullanici bakiye + premium durumu |
| GET | `/api/dream/prices` | Tum fiyatlar + paketler + abonelik planlari |

---

## API Maliyet Analizi

| Urun | GPT Cagrisi | Maliyet/istek | Gemstone | Kar Marji |
|------|-------------|---------------|----------|-----------|
| Tekli Tarot | 1 | ~$0.001461 | 6gs | %97-99 |
| 3'lu Tarot | 1 | ~$0.007005 | 14gs | %98-99 |
| 5'li Tarot | 1 | ~$0.008468 | 22gs | %98-99 |
| Dream A | 2 (decode + upsell) | ~$0.006555 | 11gs | %97-99 |
| Dream B | 2 (decode + upsell) | ~$0.007939 | 22gs | %98-99 |
| Dream C | 1 (decode only) | ~$0.007264 | 12gs | %98-99 |
| Upsell Sembol | 0 (onceden hazir) | $0 | 3gs | %100 |

### 1 USD API Maliyeti Icin Kapasite

| Urun | 1 USD = ~istek | Tahsil edilen tas |
|------|----------------|-------------------|
| Tekli Tarot (Premium) | 684 | 684 x 6 = **4,104 tas** |
| 3'lu Tarot (Premium) | 143 | 143 x 14 = **2,002 tas** |
| 5'li Tarot (Premium) | 118 | 118 x 22 = **2,596 tas** |
| Dream A (Hizli) | 153 | 153 x 11 = **1,683 tas** |
| Dream B (Derin) | 126 | 126 x 22 = **2,772 tas** |
| Dream C (Plan) | 138 | 138 x 12 = **1,656 tas** |

*Not: Degerler yaklasik; yuvarlama yuzunden 1 USD'ye cok yakin cikar.*

---

## Tarot FREE Kullanici Akisi (GPT Cagrisi YOK)

```
┌─────────────────────────────────────────────────────────────┐
│  BACKEND ISLEMLERI - FREE                                   │
│                                                             │
│  1. cardKey cikar: "00_fool"                               │
│                                                             │
│  2. Tendency Map'den oku: tr/tendency.map.json             │
│     {                                                       │
│       "baseTendency": "evet",                              │
│       "orientationImpact": "standart",                     │
│       "reversalStyle": "icsel"                             │
│     }                                                       │
│                                                             │
│  3. Tarot Template'den meaning cek: tr/tarot-template.json │
│     meanings.upright.love = "Askta taze bir baslangic..."  │
│                                                             │
│  4. Clarity hesapla (impact bazli):                        │
│     baseClarity = upright ? 78 : 62                        │
│     modifier = impactModifiers["standart"]["upright"] = 0  │
│     clarity = 78 + 0 = 78                                  │
│                                                             │
│  5. Response dondur (GPT cagrisi YOK!)                     │
│  Gemstone dusmez.                                          │
└─────────────────────────────────────────────────────────────┘
```

## Tarot PREMIUM Kullanici Akisi (GPT-4o + Gemstone)

```
┌─────────────────────────────────────────────────────────────┐
│  BACKEND ISLEMLERI - PREMIUM                                │
│                                                             │
│  1-2. FREE ile ayni (cardKey + tendency oku)               │
│                                                             │
│  3. Gemstone kontrol: deviceId → users.json                │
│     Tekli: 6gs, 3'lu: 14gs, 5'li: 22gs                    │
│     Yetersizse → 402 INSUFFICIENT_GEMSTONES                │
│                                                             │
│  4. ReversalStyle normalize et (ters kart varsa):          │
│     "icsel" → "internal" (GPT icin canonical EN)           │
│                                                             │
│  5. Prompt olustur: prompts/tr.js → buildSinglePrompt()    │
│                                                             │
│  6. GPT-4o API cagrisi (temperature: 0.7)                  │
│                                                             │
│  7. Gemstone dus + JSON parse + response dondur            │
└─────────────────────────────────────────────────────────────┘
```

**PREMIUM Response ornegi:**

```json
{
  "title": "Deli — Tekli Kart Okumasi",
  "overall": "Kalbindeki merak ve acilma istegi seni yeni bir duygusal alana cagiriyor...",
  "focusArea": "love",
  "deepDive": "Askta spontanlik ve kesif enerjisi hakim...",
  "shadow": "Dikkat: Asiri cosku, karsindakini degerlendirmeden hizli baglanmaya itebilir.",
  "nextStep": "Bugun, ilgini ceken birine ilk adimi at.",
  "journal": "Askta en cok neyden kaciniyorsun?"
}
```

## Yes/No v2 Engine (Detay)

### Confidence Formulu

```
confidence = 55 + clarityWeight + orientationMod

orientationMod:
  upright: +8
  reversed: impact bazli → low: -8, standard: -12, high: -18

Sinirlar:
  uncertain egilim: 40-75
  diger: 45-90
```

### Ornek Hesaplamalar

| Kart | clarityWeight | Yon | Impact | Hesaplama | Sonuc |
|------|---------------|-----|--------|-----------|-------|
| Gunes (duz) | 25 | duz | - | 55+25+8 | **88%** |
| Gunes (ters) | 25 | ters | dusuk(-8) | 55+25-8 | **72%** |
| Bas Rahibe (duz) | 5 | duz | - | 55+5+8=68 | **68%** |
| Bas Rahibe (ters) | 5 | ters | yuksek(-18) | 55+5-18 | **42%** |

### Clarity Label

| Aralik | TR | EN | DE | ES |
|--------|----|----|----|----|
| >= 75% | Net | Clear | Klar | Claro |
| 55-74% | Sartli | Conditional | Bedingt | Condicional |
| < 55% | Belirsiz | Uncertain | Unsicher | Incierto |

### Tendency → Answer Donusumu

```
strong_yes / yes → "yes"
strong_no / no → "no"
uncertain → "uncertain"
```

### Yes/No FREE Response

```json
{
  "title": "Deli — Evet / Hayir",
  "answer": "yes",
  "confidence": 78,
  "clarityLabel": "Net",
  "explanation": "Evet; bilinmeyene adim atmak icin cesaretin seninle.",
  "keywords": ["macera", "spontanlik"],
  "baseTendency": "evet"
}
```

## Dream Decode Response Ornekleri

### Mode A Response

```json
{
  "readingId": "uuid",
  "mode": "A",
  "gemstoneCost": 10,
  "overall": "Kacis ve ozgurluk arasinda gidip geliyorsun...",
  "beats": [
    "Karanlik koridor, gormek istemedigin bir gercegi temsil ediyor.",
    "Kosma refleksi, yuzlesmek yerine erteleme aliskanligini gosteriyor.",
    "Isik, farkina varma aninin yaklastigini isaret ediyor."
  ],
  "nextStep": "Bu hafta kactigin tek bir konuyu isimlendir.",
  "keywords": ["kacis", "yuzlesme", "farkindalik"],
  "journal": "Neyi gormezden gelince rahatladigini hissediyorsun?",
  "upsellCandidates": [
    { "symbol": "Karanlik Koridor", "hint": "Gorulmek istemeyen gercekler.", "insight": "Bu koridor senin ertelediklerin..." }
  ]
}
```

### Mode B Response (ek alanlar)

```json
{
  "pattern": "Yuzlesmek yerine kacis refleksi tekrarliyor. Rahatsizlik hissettiginde geri cekilme egilimin var...",
  "upsellCandidates": [
    { "symbol": "...", "hint": "...", "insight": "..." },
    { "symbol": "...", "hint": "...", "insight": "..." },
    { "symbol": "...", "hint": "...", "insight": "..." }
  ]
}
```

### Mode C Response (ek alanlar)

```json
{
  "plan": [
    "24 saat: Bugün kaçtığın bir konuyu tek cümleyle yaz.",
    "7 gün: Her gün 5 dakika o konuyla ilgili not tut.",
    "Sınır: Ben artık rahatsızlıktan kaçmak yerine fark ediyorum."
  ]
}
```

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

- **Ortak users.json**: Tarot ve Dream Coder ayni kullanici veritabanini paylasir (deviceId bazli)
- **Ortak deviceId**: AsyncStorage ile kalici, her iki context ayni ID'yi kullanir
- **Premium suresi dolunca**: Backend otomatik olarak `isPremiumSubscriber: false` yapar
- **Idempotency**: `requestId` ile duplicate decode istekleri onlenir
- **Upsell token tasarrufu**: Adaylar decode sirasinda 1 ek GPT cagrisiyla hazirlanir, secim aninda GPT yok
- **Market**: Bilgi amacli ekran, satin alma entegrasyonu henuz yok
- **Drift Checker**: Backend baslarken veri tutarliligi kontrol edilir
- **Loglama**: Tarot → `premium-readings.json`, Dream → `tr/readings.json`
