# Tarot App — Psikolojik Tarot Okuma Platformu

Modern psikolojik tarot okumaları sunan mobil uygulama. FREE kullanıcılar hardcoded anlamlar görürken, PREMIUM kullanıcılar GPT-4o destekli derinlemesine analizler alır.

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

---

## Özellikler

- **4 Dil Desteği:** Türkçe (TR), İngilizce (EN), Almanca (DE), İspanyolca (ES)
- **4 Kategori, 15 Spread:** Genel, Aşk, Kariyer, Ruhsal
- **FREE:** JSON'dan hardcoded anlamlar + spread bazlı premium preview teaser'ları
- **PREMIUM:** GPT-4o ile psikolojik davranış analizi
- **Yes/No Sistemi v2:** clarityWeight + baseTendency + orientationImpact + shortReason
- **ReversalStyle:** Ters kartlar için 5 farklı yorum tarzı (delay, internal, shadow, imbalance, blocked)
- **Glassmorphism UI:** Modern, temiz, minimalist tasarım
- **Loglama:** Tüm premium okumalar `premium-readings.json`'a kaydedilir
- **Drift Checker:** Veri tutarlılığı kontrolü (startup'ta çalışır)

---

## Proje Yapısı

```
TAROT-NEW/
├── backend/
│   ├── index.js                    # Express API + Yes/No v2 Engine
│   ├── package.json
│   ├── .env                        # OPENAI_API_KEY (gitignore'da)
│   │
│   ├── prompts/                    # Dil bazlı GPT prompt dosyaları
│   │   ├── index.js                # Prompt router
│   │   ├── tr.js                   # Türkçe promptlar + reversalStyleMapTR
│   │   ├── en.js                   # İngilizce promptlar
│   │   ├── de.js                   # Almanca promptlar
│   │   └── es.js                   # İspanyolca promptlar
│   │
│   └── data/
│       ├── premium-readings.json   # Premium okuma logları
│       │
│       ├── tr/
│       │   ├── tarot-template.json    # 78 kart tanımları + meanings
│       │   ├── tendency.map.json      # ★ Kart eğilimleri (TR değerler)
│       │   ├── tendencyGlossary.json  # ★ Eğilim sözlüğü (TR açıklamalar)
│       │   └── yesno-clarity.json     # ★ clarityWeight + keywords + shortReason
│       │
│       ├── en/
│       │   ├── tarot-template.json
│       │   ├── tendency.map.json      # EN değerler (yes, delay, internal...)
│       │   ├── tendencyGlossary.json
│       │   └── yesno-clarity.json
│       │
│       ├── de/
│       │   ├── tarot-template.json
│       │   ├── tendency.map.json      # DE değerler (ja, verzögerung...)
│       │   ├── tendencyGlossary.json
│       │   └── yesno-clarity.json
│       │
│       └── es/
│           ├── tarot-template.json
│           ├── tendency.map.json      # ES değerler (sí, retraso...)
│           ├── tendencyGlossary.json
│           └── yesno-clarity.json
│
├── tarot-app/
│   ├── app/                        # Expo Router sayfaları
│   │   ├── _layout.tsx             # Root layout
│   │   ├── index.tsx               # Ana ekran (spread seçimi)
│   │   ├── pick/[spread].tsx       # Kart seçimi ekranı
│   │   ├── result.tsx              # FREE sonuç ekranı
│   │   ├── premium-result.tsx      # PREMIUM sonuç ekranı
│   │   └── yesno-result.tsx        # Yes/No sonuç ekranı
│   │
│   ├── components/ui/              # Reusable UI bileşenleri
│   │   ├── GradientBackground.tsx
│   │   ├── GlassCard.tsx
│   │   ├── SpreadCard.tsx
│   │   ├── FlipCard.tsx
│   │   ├── PremiumPreview.tsx
│   │   └── index.ts
│   │
│   ├── context/
│   │   └── AppContext.tsx          # Global state (language, isPremium, cards...)
│   │
│   ├── hooks/
│   │   ├── useReading.ts           # API çağrı fonksiyonları
│   │   ├── useLanguage.ts
│   │   └── useUser.ts
│   │
│   ├── utils/
│   │   ├── deck.ts                 # ★ Kart dağıtımı (getOrientation, shuffleArray)
│   │   ├── rng.ts                  # Merkezi RNG
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── tarot.ts                # TypeScript tipleri (410+ satır)
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   └── translations.ts         # UI çevirileri (1000+ satır, 4 dil)
│   │
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Kullanıcı Akışı: 1 Kart Seçimi (Tekli Kart Spread)

Kullanıcı ana ekrandan "Tekli Kart" spread'ini seçtiğinde arka planda neler oluyor?

### Adım 1: Frontend - Kart Seçimi

```
┌─────────────────────────────────────────────────────────────┐
│  KULLANICI AKSİYONU                                         │
│  ═══════════════════                                        │
│  1. Ana ekrandan spread seçer (örn: "Tekli Kart - Aşk")    │
│  2. pick/[spread].tsx ekranına yönlendirilir               │
│  3. 78 kart karıştırılır (Fisher-Yates shuffle)            │
│  4. Kullanıcı kartlardan birini seçer                      │
│  5. Orientation belirlenir (%30 ters olasılık)             │
└─────────────────────────────────────────────────────────────┘
```

**Frontend Hesaplamaları:**

```typescript
// utils/deck.ts
const getOrientation = () => {
  return rng01() < 0.3 ? "reversed" : "upright";  // %30 ters
};

// Seçilen kart örneği:
const selectedCard = {
  card: { id: 0, name: "Deli", image: "00_fool", ... },
  orientation: "upright"  // veya "reversed"
};
```

### Adım 2: API Request

```
┌─────────────────────────────────────────────────────────────┐
│  POST /api/reading                                          │
│  ═══════════════════                                        │
│  {                                                          │
│    "language": "tr",                                        │
│    "spread": "single_card",                                 │
│    "focusArea": "love",                                     │
│    "isPremium": false,          // veya true                │
│    "card": {                                                │
│      "name": "Deli",                                        │
│      "image": "00_fool",        // cardKey                  │
│      "orientation": "upright"                               │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## FREE Kullanıcı Akışı (GPT Çağrısı YOK)

```
┌─────────────────────────────────────────────────────────────┐
│  BACKEND İŞLEMLERİ - FREE                                   │
│  ═══════════════════════                                    │
│                                                             │
│  1. cardKey çıkar: "00_fool"                               │
│                                                             │
│  2. Tendency Map'den oku: tr/tendency.map.json             │
│     {                                                       │
│       "baseTendency": "evet",                              │
│       "orientationImpact": "standart",                     │
│       "reversalStyle": "içsel"                             │
│     }                                                       │
│                                                             │
│  3. Tarot Template'den meaning çek: tr/tarot-template.json │
│     meanings.upright.love = "Aşkta taze bir başlangıç..."  │
│                                                             │
│  4. Clarity hesapla (impact bazlı):                        │
│     baseClarity = upright ? 78 : 62                        │
│     modifier = impactModifiers["standart"]["upright"] = 0  │
│     clarity = 78 + 0 = 78                                  │
│                                                             │
│  5. Response döndür (GPT çağrısı YOK!)                     │
└─────────────────────────────────────────────────────────────┘
```

**FREE Response:**

```json
{
  "spread": "single_card",
  "focusArea": "love",
  "language": "tr",
  "cards": [{
    "cardKey": "00_fool",
    "name": "Deli",
    "orientation": "upright",
    "meaning": "Aşkta taze bir başlangıç isteği var: kalbini kapatmadan, ama körleşmeden ilerle...",
    "clarity": 78,
    "impact": "standard",
    "reversalStyle": null,
    "arcana": "major",
    "suit": null,
    "element": "hava"
  }],
  "meta": {
    "totalCards": 1,
    "reversedCount": 0,
    "majorCount": 1,
    "avgClarity": 78
  }
}
```

**Kullanılan Dosyalar (FREE):**

| Dosya | Kullanım |
|-------|----------|
| `tr/tarot-template.json` | `meanings.upright.love` → Anlam metni |
| `tr/tendency.map.json` | `orientationImpact` → Clarity hesaplama |

**GPT Çağrısı:** ❌ YOK

---

## PREMIUM Kullanıcı Akışı (GPT-4o Çağrısı VAR)

```
┌─────────────────────────────────────────────────────────────┐
│  BACKEND İŞLEMLERİ - PREMIUM                                │
│  ═══════════════════════════                                │
│                                                             │
│  1-2. FREE ile aynı (cardKey + tendency oku)               │
│                                                             │
│  3. ReversalStyle normalize et (ters kart varsa):          │
│     "içsel" → "internal" (GPT için canonical EN)           │
│                                                             │
│  4. Prompt oluştur: prompts/tr.js → buildSinglePrompt()    │
│     {                                                       │
│       profile: { tone, address, ... },                     │
│       cardName: "Deli",                                    │
│       orientationLabel: "Düz",                             │
│       focusArea: "love",                                   │
│       reversalStyle: null  // upright olduğu için          │
│     }                                                       │
│                                                             │
│  5. GPT-4o API çağrısı:                                    │
│     model: "gpt-4o"                                        │
│     temperature: 0.7                                       │
│     max_tokens: 600                                        │
│                                                             │
│  6. JSON parse + response döndür                           │
└─────────────────────────────────────────────────────────────┘
```

**PREMIUM Response:**

```json
{
  "title": "Deli — Tekli Kart Okuması",
  "overall": "Kalbindeki merak ve açılma isteği seni yeni bir duygusal alana çağırıyor...",
  "focusArea": "love",
  "deepDive": "Aşkta spontanlık ve keşif enerjisi hakim. Geçmişteki kalıpları bırakıp...",
  "shadow": "Dikkat: Aşırı coşku, karşındakini değerlendirmeden hızlı bağlanmaya itebilir.",
  "nextStep": "Bugün, ilgini çeken birine ilk adımı at.",
  "journal": "Aşkta en çok neyden kaçınıyorsun ve bu korku seni nasıl koruyor?"
}
```

**Kullanılan Dosyalar (PREMIUM):**

| Dosya | Kullanım |
|-------|----------|
| `tr/tendency.map.json` | `reversalStyle` → GPT prompt'a eklenir |
| `prompts/tr.js` | `buildSinglePrompt()` → Prompt template |
| OpenAI API | GPT-4o → Derinlemesine analiz |

**GPT Çağrısı:** ✅ VAR (gpt-4o, ~600 token)

---

## Yes/No Spread Akışı (Özel Hesaplamalar)

Yes/No spread'i farklı bir hesaplama motoru kullanır:

### FREE Yes/No

```
┌─────────────────────────────────────────────────────────────┐
│  YES/NO v2 ENGINE - FREE                                    │
│  ═══════════════════════                                    │
│                                                             │
│  1. Tendency Map'den oku: tr/tendency.map.json             │
│     baseTendency: "evet"                                   │
│     orientationImpact: "standart"                          │
│                                                             │
│  2. Answer hesapla (normalize + convert):                  │
│     "evet" → "yes" (canonical)                             │
│     tendencyToAnswer("yes") → "yes"                        │
│                                                             │
│  3. Clarity Data oku: tr/yesno-clarity.json                │
│     clarityWeight: 15                                      │
│     keywords.love: ["macera", "spontanlık"]                │
│     shortReason.upright: "Evet; bilinmeyene adım atmak..." │
│                                                             │
│  4. Confidence hesapla:                                    │
│     base = 55                                              │
│     + clarityWeight (15)                                   │
│     + orientationMod (upright: +8, reversed: -12)          │
│     = 55 + 15 + 8 = 78                                     │
│                                                             │
│  5. ClarityLabel belirle:                                  │
│     78 ≥ 75 → "Net"                                        │
└─────────────────────────────────────────────────────────────┘
```

**Confidence Formülü:**

```javascript
confidence = 55 + clarityWeight + orientationMod

// orientationMod:
// - Upright: +8
// - Reversed: impactModifiers[orientationImpact]
//   - low: -8
//   - standard: -12  
//   - high: -18

// Sonuç sınırları:
// - baseTendency = "uncertain": 40-75
// - diğerleri: 45-90
```

**FREE Yes/No Response:**

```json
{
  "title": "Deli — Evet / Hayır",
  "focusArea": "love",
  "answer": "yes",
  "confidence": 78,
  "clarityLabel": "Net",
  "explanation": "Evet; bilinmeyene adım atmak için cesaretin seninle.",
  "keywords": ["macera", "spontanlık"],
  "baseTendency": "evet",
  "answerMayChange": false,
  "conditionMessage": null
}
```

### PREMIUM Yes/No

PREMIUM Yes/No, FREE hesaplamalarına ek olarak GPT-4o'dan detaylı açıklama alır:

```
┌─────────────────────────────────────────────────────────────┐
│  YES/NO v2 ENGINE - PREMIUM                                 │
│  ═══════════════════════════                                │
│                                                             │
│  1-5. FREE ile aynı hesaplamalar                           │
│                                                             │
│  6. ReversalStyle (ters kart için):                        │
│     tendency.reversalStyle → "içsel" → normalize → "internal" │
│                                                             │
│  7. GPT Prompt oluştur:                                    │
│     - answer: "yes"                                        │
│     - confidence: 78                                       │
│     - clarityLabel: "Net"                                  │
│     - baseTendency: "evet"                                 │
│     - reversalStyle: null (upright)                        │
│                                                             │
│  8. GPT-4o çağrısı (max_tokens: 200)                       │
│                                                             │
│  9. Zenginleştirilmiş response döndür                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Spread Yapısı

### ✨ Genel Kategori

| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Hızlı içgörü |
| Zamanın Akışı | `past_present_future` | 3 | Geçmiş-Şimdi-Gelecek |
| Evet / Hayır | `yes_no` | 1 | Net cevap (v2 engine) |
| Yolun Haritası | `situation_obstacle_advice` | 3 | Durum-Engel-Tavsiye |

### 💖 Aşk Kategorisi

| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Aşk odaklı |
| Evet / Hayır | `yes_no` | 1 | Aşk soruları |
| Kaderin Dokunuşu | `destinys_embrace` | 3 | İlişki dinamiği |
| Aşk Kavşağı | `love_choice` | 5 | İki yol karşılaştırma |
| Kalbin Rotası | `path_to_love` | 5 | Aşka giden yol |

### 💼 Kariyer Kategorisi

| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Kariyer odaklı |
| Evet / Hayır | `yes_no` | 1 | Kariyer soruları |
| Kariyer Netliği | `career_clarity` | 3 | Durum analizi |
| Kariyer Rehberi | `career_path_guide` | 3 | Güçlü yönler & fırsatlar |
| Yeni İş Keşfi | `new_business_exploration` | 5 | İş fikri analizi |
| Para Akışı | `wealth_flow` | 5 | Finansal denge |

### 🔮 Ruhsal Kategori

| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Ruhsal odaklı |
| Evet / Hayır | `yes_no` | 1 | Ruhsal sorular |
| Yeni Ay Ritüeli | `new_moon_ritual` | 5 | Niyet belirleme |
| Dolunay Arınması | `full_moon_release` | 5 | Bırakma & arınma |
| Zihin-Beden-Ruh | `mind_body_spirit` | 3 | İçsel denge |
| Kozmik Aydınlanma | `celestial_illumination` | 3 | Evrensel rehberlik |

---

## Data Sistemleri

### 1. Tendency Map (Dil Bazlı)

Her kart için eğilim değerleri, **dil bazlı** olarak saklanır.

**Dosya:** `backend/data/{lang}/tendency.map.json`

```json
// TR örneği
{
  "00_fool": {
    "baseTendency": "evet",
    "orientationImpact": "standart",
    "reversalStyle": "içsel"
  }
}

// EN örneği
{
  "00_fool": {
    "baseTendency": "yes",
    "orientationImpact": "standard",
    "reversalStyle": "internal"
  }
}
```

**Değer Eşleştirmeleri:**

| EN | TR | DE | ES |
|----|----|----|-----|
| yes | evet | ja | sí |
| strong_yes | güçlü_evet | stark_ja | fuerte_sí |
| no | hayır | nein | no |
| strong_no | güçlü_hayır | stark_nein | fuerte_no |
| uncertain | belirsiz | unsicher | incierto |
| low | düşük | niedrig | bajo |
| standard | standart | standard | estándar |
| high | yüksek | hoch | alto |
| delay | gecikme | verzögerung | retraso |
| internal | içsel | innerlich | interno |
| shadow | gölge | schatten | sombra |
| imbalance | dengesizlik | ungleichgewicht | desequilibrio |
| blocked | tıkanık | blockiert | bloqueado |

### 2. Tendency Glossary (Açıklama Sözlüğü)

Her değerin anlamını açıklar.

**Dosya:** `backend/data/{lang}/tendencyGlossary.json`

```json
{
  "baseTendency": {
    "evet": "Evet — destekleyici, akışta ilerleyen olumlu eğilim",
    "güçlü_evet": "Kesin Evet — güçlü, açık ve net olumlama (örnek: Güneş, Dünya)"
  },
  "orientationImpact": {
    "düşük": "Arketip güçlüdür; kart ters gelse bile ana mesaj büyük ölçüde korunur"
  },
  "reversalStyle": {
    "içsel": "İçsel engel — korku, kararsızlık veya kendini sabote etme hali"
  }
}
```

### 3. Clarity Weight Sistemi (Yes/No v2)

**Dosya:** `backend/data/{lang}/yesno-clarity.json`

```json
{
  "00_fool": {
    "clarityWeight": 15,
    "keywords": {
      "general": ["başlangıç", "özgürlük"],
      "love": ["macera", "spontanlık"],
      "career": ["risk", "yenilik"],
      "spiritual": ["içsel yolculuk", "keşif"]
    },
    "shortReason": {
      "upright": "Evet; bilinmeyene adım atmak için cesaretin seninle.",
      "reversed": "Şartlı Evet; korkular yavaşlatıyor olabilir."
    }
  }
}
```

| Alan | Değer Aralığı | Açıklama |
|------|---------------|----------|
| `clarityWeight` | 5-25 | Yüksek = daha net cevap |
| `keywords` | 2 kelime/alan | FocusArea bazlı |
| `shortReason` | 1-2 cümle | Orientation bazlı açıklama |

---

## Özet Karşılaştırma: FREE vs PREMIUM

| Özellik | FREE | PREMIUM |
|---------|------|---------|
| **Veri Kaynağı** | JSON dosyaları | JSON + GPT-4o |
| **GPT Çağrısı** | ❌ | ✅ |
| **Maliyet** | $0 | ~$0.01-0.03/okuma |
| **Yanıt Süresi** | <100ms | 2-5 saniye |
| **Meaning** | `tarot-template.json` | GPT üretimi |
| **ReversalStyle** | Görünmez | GPT'ye gönderilir |
| **Kişiselleştirme** | Yok | Var (GPT analizi) |

---

## Kurulum

### 1. Backend

```bash
cd backend
npm install
```

`.env` dosyası oluştur:

```
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

Çalıştır:

```bash
node index.js
```

### 2. Mobile App

```bash
cd tarot-app
npm install
npx expo start
```

Expo Go ile QR kodu okut.

---

## API Endpoint'leri

### `POST /api/reading`

Tüm okumalar için tek endpoint (FREE + PREMIUM).

### `POST /api/reading/free`

Deterministic FREE okumalar için (GPT yok).

### `POST /api/logs/reset`

Premium log dosyasını temizler.

---

## Drift Checker

Backend başlatıldığında otomatik çalışır:

```
--- Drift Checker ---
✓ Loaded tr/tendency.map.json (78 cards)
✓ Loaded en/tendency.map.json (78 cards)
✓ Loaded de/tendency.map.json (78 cards)
✓ Loaded es/tendency.map.json (78 cards)
📊 Impact distribution: low=8 | standard=52 | high=18
📊 ReversalStyle: delay=12 | internal=25 | shadow=16 | imbalance=13 | blocked=12
✅ All cardKeys consistent across all data files!
```

---

## Versiyon Geçmişi

| Versiyon | Özellikler |
|----------|------------|
| **v3.3** | Dil bazlı tendency.map.json + tendencyGlossary.json. Backend normalize sistemi. |
| **v3.2** | Yes/No v2 Engine: clarityWeight, baseTendency (5 seviye), orientationImpact, shortReason. |
| **v3.1** | ReversalStyle sistemi: Ters kartlar için 5 yorum tarzı. 4 dilde prompt entegrasyonu. |
| **v3.0** | Kariyer & Ruhsal spread'leri, Glassmorphism UI, FREE/PREMIUM açıklama ayrımı |
| **v2.0** | 5 kartlık aşk spread'leri, psikolojik tarot motoru |

---

## Platform

- **Frontend:** React Native (Expo) ~54.0
- **Backend:** Express.js ^5.2
- **AI:** OpenAI GPT-4o
- **Desteklenen Platformlar:** iOS, Android (Expo Go veya build)
