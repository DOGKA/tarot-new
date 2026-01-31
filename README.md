# Tarot App — Psikolojik Tarot Okuma Platformu

Modern psikolojik tarot okumaları sunan mobil uygulama. FREE kullanıcılar hardcoded anlamlar görürken, PREMIUM kullanıcılar GPT-4o destekli derinlemesine analizler alır.

---

## Özellikler

- **4 Dil Desteği:** Türkçe (TR), İngilizce (EN), Almanca (DE), İspanyolca (ES)
- **4 Kategori, 15+ Spread:** Genel, Aşk, Kariyer, Ruhsal
- **FREE:** JSON'dan hardcoded anlamlar + spread bazlı premium preview teaser'ları
- **PREMIUM:** GPT-4o ile psikolojik davranış analizi
- **Glassmorphism UI:** Modern, temiz, minimalist tasarım
- **Loglama:** Tüm premium okumalar `premium-readings.json`'a kaydedilir

---

## Spread Yapısı Özeti

### 🌟 Genel Kategori
| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Hızlı içgörü |
| Zamanın Akışı | `past_present_future` | 3 | Geçmiş-Şimdi-Gelecek |
| Evet / Hayır | `yes_no` | 1 | Net cevap |
| Yolun Haritası | `situation_obstacle_advice` | 3 | Durum-Engel-Tavsiye |

### 💖 Aşk Kategorisi
| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Aşk odaklı |
| Kaderin Dokunuşu | `destinys_embrace` | 3 | İlişki dinamiği |
| Aşk Kavşağı | `love_choice` | 5 | İki yol karşılaştırma |
| Kalbin Rotası | `path_to_love` | 5 | Aşka giden yol |

### 💼 Kariyer Kategorisi
| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Kariyer odaklı |
| Kariyer Netliği | `career_clarity` | 3 | Durum analizi |
| Kariyer Rehberi | `career_path_guide` | 3 | Güçlü yönler & fırsatlar |
| Yeni İş Keşfi | `new_business_exploration` | 5 | İş fikri analizi |
| Para Akışı | `wealth_flow` | 5 | Finansal denge |

### 🔮 Ruhsal Kategori
| Spread | Kod | Kart | Açıklama |
|--------|-----|------|----------|
| Tekli Kart | `single_card` | 1 | Ruhsal odaklı |
| Yeni Ay Ritüeli | `new_moon_ritual` | 5 | Niyet belirleme |
| Dolunay Arınması | `full_moon_release` | 5 | Bırakma & arınma |
| Zihin-Beden-Ruh | `mind_body_spirit` | 3 | İçsel denge |
| Kozmik Aydınlanma | `celestial_illumination` | 3 | Evrensel rehberlik |

---

## Proje Yapısı

```
TAROT-NEW/
├── backend/
│   ├── index.js              # Express API
│   ├── prompts/              # Dil bazlı prompt dosyaları
│   │   ├── index.js          # Prompt router
│   │   ├── tr.js             # Türkçe promptlar
│   │   ├── en.js             # İngilizce promptlar
│   │   ├── de.js             # Almanca promptlar
│   │   └── es.js             # İspanyolca promptlar
│   ├── data/
│   │   └── premium-readings.json  # Premium log dosyası
│   └── .env                  # OPENAI_API_KEY (gitignore'da)
│
├── tarot-app/
│   ├── app/                  # Expo Router sayfaları
│   │   ├── index.tsx         # Ana ekran (spread seçimi)
│   │   ├── pick/[spread].tsx # Kart seçimi ekranı
│   │   ├── result.tsx        # FREE sonuç ekranı
│   │   ├── premium-result.tsx# PREMIUM sonuç ekranı
│   │   └── yesno-result.tsx  # Evet/Hayır sonuç ekranı
│   │
│   ├── components/ui/        # Yeniden kullanılabilir UI bileşenleri
│   │   ├── GradientBackground.tsx
│   │   ├── GlassCard.tsx
│   │   ├── SpreadCard.tsx
│   │   ├── FlipCard.tsx
│   │   ├── PremiumPreview.tsx
│   │   └── index.ts
│   │
│   ├── data/                 # Dil bazlı JSON veriler
│   │   ├── tr/
│   │   │   ├── tarot-template.json
│   │   │   ├── yesno-clarity.json
│   │   │   └── yesno-answers.json
│   │   ├── en/
│   │   ├── de/
│   │   └── es/
│   │
│   ├── hooks/
│   │   └── useReading.ts     # API çağrı fonksiyonları
│   │
│   ├── types/
│   │   └── tarot.ts          # TypeScript tipleri
│   │
│   └── i18n/
│       └── translations.ts   # UI çevirileri (1000+ satır)
│
└── README.md
```

---

## FREE vs PREMIUM Sistem

### Ana Ekran Açıklamaları
- **FREE kullanıcı** → Kısa, açıklayıcı açıklamalar görür
- **PREMIUM kullanıcı** → Detaylı, sentez içeren açıklamalar görür

Örnek (Kariyer Netliği):
| | Açıklama |
|---|----------|
| **FREE** | "Kariyerde bugünkü tabloyu ve netleşen yönü gösterir." |
| **PREMIUM** | "Kariyer tablosunu sakin bir akışla çözümler; ana mesajı ve odaklanılması faydalı alanı gösterir." |

### Premium Preview Teaser Sistemi
FREE kullanıcılar sonuç ekranında "🔒 Premium'da Neler Açılıyor?" bölümünü görür:

```
┌─────────────────────────────┐
│  FREE SONUÇ EKRANI          │
│  ─────────────────────────  │
│  [Kart yorumları - FREE]    │
│                             │
│  🔒 Premium'da Neler Var?   │
│  ├─ Hikâyenin Özeti        │
│  │  └─ Büyük resim         │
│  ├─ Ana Mesaj              │
│  │  └─ Asıl mesaj          │
│  └─ Kendine Sor            │
│     └─ Derin soru          │
│                             │
│  [✨ Premium ile Aç]        │
└─────────────────────────────┘
```

Her spread'in kendi premium output'larına göre teaser'lar gösterilir.

---

## UI Başlıkları (Revize - 4 Dil)

### Genel Pozisyon Başlıkları

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| past | Seni Buraya Getiren | What Brought You Here | Was dich hierher brachte | Lo que te trajo aquí |
| present | Şu An Nerdesin | Where You Are Now | Wo du jetzt bist | Dónde estás ahora |
| future | Olası Yön | Possible Direction | Mögliche Richtung | Posible dirección |
| situation | Şu Anki Tablo | Current Picture | Aktuelles Bild | Imagen Actual |
| obstacle | Seni Durduran | What's Holding You Back | Was dich zurückhält | Lo que te detiene |
| advice | Yol Gösterici Mesaj | Guiding Message | Leitende Botschaft | Mensaje guía |

### Aşk Pozisyon Başlıkları

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| destiny | İlişkinin Temel Enerjisi | Core Energy of the Bond | Kernenergie der Bindung | Energía central del vínculo |
| path | Aranızdaki Akış | The Flow Between You | Der Fluss zwischen euch | El flujo entre ustedes |
| union | Nereye Gidebilir | Where It Could Lead | Wohin es führen könnte | A dónde podría llevar |
| self | Aşkta Bugün | Love Today | Liebe heute | El amor hoy |
| block | Aşkı Tutan | What's Holding Love Back | Was die Liebe zurückhält | Lo que retiene al amor |
| need | Kalbinin İhtiyacı | What Your Heart Needs | Was dein Herz braucht | Lo que tu corazón necesita |

### Kariyer Pozisyon Başlıkları

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| current | Kariyerde Bugün | Career Today | Karriere heute | Carrera hoy |
| clarity | Beliren Yön | Emerging Direction | Aufkommende Richtung | Dirección emergente |
| strength | Avantajın | Your Advantage | Dein Vorteil | Tu ventaja |
| opportunity | Açılan Kapı | Opening Door | Sich öffnende Tür | Puerta que se abre |
| income | Paranın Gelişi | How Money Comes | Wie Geld kommt | Cómo llega el dinero |
| growth | Büyüme Alanı | Growth Area | Wachstumsbereich | Área de crecimiento |

### Ruhsal Pozisyon Başlıkları

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| intention | Niyet | Intention | Absicht | Intención |
| seed | Atılan Tohum | Seed Planted | Gepflanzter Samen | Semilla Plantada |
| hiddenResistance | Gizli Direnç | Hidden Resistance | Verborgener Widerstand | Resistencia Oculta |
| illumination | Açığa Çıkan Gerçek | Revealed Truth | Offenbarte Wahrheit | Verdad Revelada |
| release | Bırakılması Gereken | To Be Released | Freizugeben | Para Liberar |
| mind | Zihinsel Alan | Mental Realm | Mentaler Bereich | Ámbito Mental |
| body | Bedensel Sinyal | Body Signal | Körpersignal | Señal Corporal |
| spirit | Ruhsal Mesaj | Spiritual Message | Spirituelle Botschaft | Mensaje Espiritual |

### Premium Output Başlıkları

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| overall | Hikâyenin Özeti | Story Summary | Zusammenfassung | Resumen |
| throughline | Ana Mesaj | Main Message | Hauptbotschaft | Mensaje principal |
| deepDive | Hayatına Yansıması | How It Reflects in Life | Wie es sich widerspiegelt | Cómo se refleja |
| shadow | Gizli Mesaj | Hidden Message | Verborgene Botschaft | Mensaje oculto |
| emotionalTone | Hakim Duygu | Dominant Emotion | Vorherrschendes Gefühl | Emoción dominante |
| nextStep | Yönelim Önerisi | Direction Hint | Richtungshinweis | Indicación de dirección |
| journal | Kendine Sor | Ask Yourself | Frag dich selbst | Pregúntate |
| directionHint | Odaklanılması Faydalı Alan | Area Worth Focusing On | Fokussierenswerter Bereich | Área que vale enfocar |

---

## UI Bileşenleri

### GradientBackground
Tüm ekranlarda kullanılan gradient arka plan.

### GlassCard
Glassmorphism efektli kart bileşeni. iOS'ta BlurView, Android'de yarı saydam arka plan.

### SpreadCard
Ana ekrandaki spread seçim kartları. Kategori rengi, kart sayısı ikonu ve açıklama gösterir.

### FlipCard
Kart seçim ekranındaki dönen kart animasyonu. React Native Animated API kullanır.

### PremiumPreview
FREE kullanıcılara spread bazlı premium teaser'ları gösteren bileşen.

---

## Kariyer Spread'leri (Yeni)

### Kariyer Netliği (`career_clarity`)
**Pozisyonlar:** current, challenge, clarity

**FREE:** Her kart için `meanings[orientation].career`

**PREMIUM Output:**
```json
{
  "title": "Kariyer Netliği Okuması",
  "overall": "Genel kariyer tablosu",
  "throughline": "Ana mesaj",
  "directionHint": "Odaklanılması faydalı alan",
  "journal": "Kariyer üzerine düşünme sorusu"
}
```

### Para Akışı (`wealth_flow`)
**Pozisyonlar:** income, block, resource, growth, balance

**FREE:** Her kart için `meanings[orientation].career`

**PREMIUM Output:**
```json
{
  "title": "Para Akışı Okuması",
  "overall": "Finansal tablo",
  "flowInsight": "Paranın davranışı",
  "optimization": "İyileştirme alanı",
  "directionHint": "Finansal farkındalık",
  "journal": "Para üzerine düşünme sorusu"
}
```

---

## Ruhsal Spread'leri (Yeni)

### Yeni Ay Ritüeli (`new_moon_ritual`)
**Pozisyonlar:** intention, seed, shadow, support, firstStep

**FREE:** Her kart için `meanings[orientation].spiritual`

**PREMIUM Output:**
```json
{
  "title": "Yeni Ay Ritüeli",
  "overall": "Genel enerji",
  "ritualTheme": "Niyet kapısı",
  "affirmation": "İçsel cümle",
  "nextStep": "Sonraki adım",
  "journal": "İçsel farkındalık sorusu"
}
```

### Dolunay Arınması (`full_moon_release`)
**Pozisyonlar:** illumination, tension, lesson, release, integration

**PREMIUM Output:**
```json
{
  "title": "Dolunay Arınması",
  "overall": "Genel enerji",
  "releaseTheme": "Bırakma eşiği",
  "cleansingAdvice": "Arınma rehberi",
  "affirmation": "İçsel cümle",
  "nextStep": "Sonraki adım",
  "journal": "Düşünme sorusu"
}
```

### Zihin-Beden-Ruh (`mind_body_spirit`)
**Pozisyonlar:** mind, body, spirit

**PREMIUM Output:**
```json
{
  "title": "Zihin-Beden-Ruh Dengesi",
  "overall": "Genel denge",
  "harmonyScore": "İçsel denge",
  "alignmentAdvice": "Ruhsal hizalanma",
  "nextStep": "Sonraki adım",
  "journal": "Düşünme sorusu"
}
```

### Kozmik Aydınlanma (`celestial_illumination`)
**Pozisyonlar:** signal, guidance, integration

**PREMIUM Output:**
```json
{
  "title": "Kozmik Aydınlanma",
  "overall": "Genel mesaj",
  "celestialMessage": "Kozmik fısıltı",
  "omenKeywords": "Evrensel semboller",
  "nextStep": "Sonraki adım",
  "journal": "Ruhsal düşünme sorusu"
}
```

---

## Stil, Ton ve Dil Kuralları

> **Tek Satır Özet:** "Tarot temalı, psikoloji/koçluk tonunda, yargısız-yönlendirici, 'netleştir–sadeleştir–küçük adım' odaklı modern Türkçe."

### Temel Tarz: "Modern Farkındalık ve Rehberlik"

- **Psikolojik Derinlik:** Kartların anlamları içsel durumlara odaklanır
- **Falcılık Değil, Strateji:** Olasılıkları ve yönetim önerileri sunar
- **Güçlendirici:** Kullanıcıya kontrol hissi verir

### Kariyer için Özel Kurallar (Yeni)
- ❌ Sert aksiyon yok ("Şunu yap" gibi)
- ✅ Doğal akış ve hafif yön
- ✅ Karar kullanıcıda
- ✅ Hukuken güvenli dil

### Ruhsal için Özel Kurallar (Yeni)
- `focusArea = spiritual` kullanılır
- Kartlardan `meanings.spiritual` çekilir
- İçgörü ve farkındalık odaklı dil

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

Tüm premium okumalar için tek endpoint.

**Request Body (Örnek - Career Clarity):**
```json
{
  "language": "tr",
  "spread": "career_clarity",
  "isPremium": true,
  "cards": [
    { "position": "current", "name": "The Tower", "orientation": "reversed" },
    { "position": "challenge", "name": "Eight of Swords", "orientation": "upright" },
    { "position": "clarity", "name": "The Star", "orientation": "upright" }
  ]
}
```

### `POST /api/logs/reset`

Premium log dosyasını temizler.

---

## Notlar

- `.env` asla commit edilmemeli (`.gitignore`'da)
- Premium okumalar `backend/data/premium-readings.json`'a loglanır
- FREE okumalar tamamen client-side çalışır, backend gerektirmez
- Tüm promptlar 4 dilde optimize edilmiştir
- Kariyer spread'lerinde aksiyon dili yerine farkındalık dili kullanılır

---

## Versiyon

- **v3.0** — Kariyer & Ruhsal spread'leri, Glassmorphism UI, FREE/PREMIUM açıklama ayrımı
- **v2.0** — 5 kartlık aşk spread'leri, psikolojik tarot motoru
- **Platform:** React Native (Expo) + Express.js + GPT-4o
