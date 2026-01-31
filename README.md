# Tarot App — Psikolojik Tarot Okuma Platformu

Modern psikolojik tarot okumaları sunan mobil uygulama. FREE kullanıcılar hardcoded anlamlar görürken, PREMIUM kullanıcılar GPT-4o destekli derinlemesine analizler alır.

---

## Özellikler

- **4 Dil Desteği:** Türkçe (TR), İngilizce (EN), Almanca (DE), İspanyolca (ES)
- **7 Farklı Spread:** Tekli Kart, Üçlü Kart (PPF), Evet/Hayır, Durum/Engel/Tavsiye (SOA), Kaderin Kucağı, Aşk Seçimi, Aşka Giden Yol
- **FREE:** JSON'dan hardcoded anlamlar (backend yok)
- **PREMIUM:** GPT-4o ile psikolojik davranış analizi
- **Loglama:** Tüm premium okumalar `premium-readings.json`'a kaydedilir

---

## Spread Yapısı Özeti

| Spread | Kod | Kart Sayısı | Kategori |
|--------|-----|-------------|----------|
| Tekli Kart | `single_card` | 1 | Genel / Aşk / Kariyer / Finans |
| Zamanın Akışı (PPF) | `past_present_future` | 3 | Genel |
| Evet / Hayır | `yes_no` | 1 | Genel |
| Yolun Haritası (SOA) | `situation_obstacle_advice` | 3 | Genel |
| Kaderin Dokunuşu | `destinys_embrace` | 3 | Aşk |
| Aşk Kavşağı | `love_choice` | 5 | Aşk |
| Kalbin Rotası | `path_to_love` | 5 | Aşk |

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
│       └── translations.ts   # UI çevirileri
│
└── README.md
```

---

## Detaylı Spread Tabloları

### 1. Tekli Kart (`single_card`)

**Kart Pozisyonları:** Yok (tek kart)

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `card.name`, `card.orientation`, `focusArea` | `card.name`, `card.orientation`, `focusArea`, `language` |
| **Backend** | ❌ Yok | ✅ GPT-4o |
| **Output** | `meanings[orientation][focusArea]` (1 paragraf) | `title`, `overall`, `focusArea`, `deepDive`, `shadow`, `nextStep`, `journal` |

**Örnek FREE Output (Türkçe, Aşk):**
```
"Derin duygusal bağ, karşılıklı çekim, önemli seçimler, ruh eşi potansiyeli"
```

**Örnek PREMIUM Output:**
```json
{
  "title": "The Lovers — Aşk Okuması",
  "overall": "Karşında bir seçim var ve bu seçim sadece kişilerle değil, değerlerinle de ilgili.",
  "focusArea": "love",
  "deepDive": "Bu kart, yüzeydeki çekimin ötesine geçmeni istiyor...",
  "shadow": "Karar vermekten kaçınmak da bir karar.",
  "nextStep": "Bu hafta içsel değerlerini yazıya dök.",
  "journal": "Aşkta beni gerçekten ne tatmin eder?"
}
```

---

### 2. Zamanın Akışı (`past_present_future`)

**Kart Pozisyonları:**
- `past` → Geçmiş Dinamiği
- `present` → Şu Anki Durum
- `future` → Gelişen Yön

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `cards[3]` (position, name, orientation) | `cards[3]` (position, name, orientation), `language` |
| **Backend** | ❌ Yok | ✅ GPT-4o |
| **Output** | Her kart için `meanings[orientation].general` | `title`, `overall`, `throughline`, `story`, `beats`, `choice`, `keywords`, `mood`, `nextStep` |

**Örnek FREE Output:**
```
Past: "Geçmişte yaşanan kayıplar ve hayal kırıklıkları..."
Present: "Şu an bir dönüm noktasındasın..."
Future: "Önünde yeni başlangıçlar var..."
```

**Örnek PREMIUM Output:**
```json
{
  "title": "Five of Cups·Wheel of Fortune·The Star — Zaman Akışı",
  "overall": "Geçmişteki kayıplar seni buraya getirdi, şimdi değişim kapıda...",
  "throughline": "Kayıptan umuda uzanan bir yolculuk.",
  "story": "Geçmişte bazı şeyler planladığın gibi gitmedi...",
  "beats": {
    "past": "Kaybettiklerin seni şekillendirdi.",
    "present": "Şimdi tekerlek dönüyor, kontrol senin elinde değil.",
    "future": "Umut var, ama aktif adım gerekiyor."
  },
  "choice": {
    "pathA": "Akışa bırakırsan...",
    "pathB": "Aktif adım atarsan..."
  },
  "keywords": ["dönüşüm", "kabul", "yenilenme"],
  "mood": "umutlu",
  "nextStep": "Bu hafta bir şeyi bilinçli olarak bırak."
}
```

---

### 3. Evet / Hayır (`yes_no`)

**Kart Pozisyonları:** Yok (tek kart)

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `card.name`, `card.orientation`, `focusArea` | `card.name`, `card.orientation`, `focusArea`, `language` |
| **Backend** | ✅ Deterministik hesaplama | ✅ GPT-4o |
| **Output** | `answer`, `confidence`, `explanation`, `keywords` | `title`, `focusArea`, `answer`, `confidence`, `explanation`, `keywords` |

**Confidence Hesaplama (FREE):**
```
confidence = 55 + (clarityWeight × 35)
clarityWeight: 0.0 - 1.0 (kart bazlı)
```

**Örnek Output:**
```json
{
  "answer": "yes",
  "confidence": 78,
  "explanation": "Bu kart açık bir evet sinyali veriyor...",
  "keywords": ["netlik", "ilerleme"]
}
```

---

### 4. Yolun Haritası (`situation_obstacle_advice`)

**Kart Pozisyonları:**
- `situation` → Şu Anki Tablo
- `obstacle` → Önündeki Engel
- `advice` → Yol Gösterici

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `cards[3]` (position, name, orientation) | `cards[3]`, `language` |
| **Backend** | ❌ Yok | ✅ GPT-4o |
| **Output** | Her kart için `meanings[orientation].general` | `title`, `overall`, `beats`, `nextStep` |

**Örnek PREMIUM Output:**
```json
{
  "title": "The Tower·Eight of Swords·The Star — Durum Analizi",
  "overall": "Ani bir değişim yaşıyorsun ve zihinsel engeller seni tutuyor.",
  "beats": {
    "situation": "Beklenmedik bir yıkım veya değişim yaşandı.",
    "obstacle": "Zihinsel kısıtlamalar seni hapsetmiş durumda.",
    "advice": "Umudunu koru, küçük adımlarla ilerle."
  },
  "nextStep": "Bu hafta bir korkunla yüzleş."
}
```

---

### 5. Kaderin Dokunuşu (`destinys_embrace`)

**Kart Pozisyonları:** 
- `destiny` → Bağın Özü
- `path` → Kaderin Akışı
- `union` → Birleşmenin Anahtarı

**Rol:** İlişki yön pusulası — "Bu bağın yönü ne?"

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `cards[3]` (position, name, orientation) | `cards[3]`, `language` |
| **Backend** | ❌ Yok | ✅ GPT-4o |
| **Output** | Her kart için `meanings[orientation].love` | `title`, `overall`, `beats`, `nextStep`, `keywords` |

**Örnek PREMIUM Output:**
```json
{
  "title": "The Star·Two of Cups·The Lovers — Kaderin Kucağı",
  "overall": "Bu bağ umut taşıyor ama bilinçli seçimler gerektiriyor.",
  "beats": {
    "destiny": "İyileşme ve açıklık bu ilişkinin temel teması.",
    "path": "Karşılıklı iletişim bağı güçlendirir.",
    "union": "Birleşme için her ikisinin de aktif adım atması gerekiyor."
  },
  "nextStep": "Bu hafta duygularını açıkça ifade et.",
  "keywords": ["umut", "iletişim", "seçim"]
}
```

---

### 6. Aşk Kavşağı (`love_choice`)

**Kart Pozisyonları (5 kart):**
- `optionA` → Birinci Yol
- `optionA_outcome` → Birinci Yolun Kaderi
- `optionB` → İkinci Yol
- `optionB_outcome` → İkinci Yolun Kaderi
- `advice` → Kalbin Rehberi

**Rol:** Karar filtresi — "Bu iki yolun psikolojik farkı ne?"

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `cards[5]` (position, name, orientation) | `cards[5]`, `language` |
| **Backend** | ❌ Yok | ✅ GPT-4o |
| **Output** | Her kart için `meanings[orientation].love` | `title`, `overall`, `beats` (5), `decisionLens`, `nextStep`, `keywords` |

**Örnek FREE Output:**
```
Option A: "Derin duygusal bağ, karşılıklı çekim..."
Option A Outcome: "Başarı, tanınma, liderlik..."
Option B: "Kayıp hissi, pişmanlık, ileriye bakma..."
Option B Outcome: "Denge, adalet, önemli kararlar..."
Advice: "İç bilgelik, yalnızlık, arayış..."
```

**Örnek PREMIUM Output:**
```json
{
  "title": "The Lovers·The Sun·Five of Cups·Justice·The Hermit — Aşk Seçimi",
  "overall": "İki yol arasında net bir fark var: biri tutkulu ama yoğun, diğeri sakin ama mesafeli.",
  "beats": {
    "optionA": "A yolu tutkulu bir bağlanma sunuyor.",
    "optionA_outcome": "Bu yolda başarı ve tanınma var ama yoğunluk yorucu olabilir.",
    "optionB": "B yolu daha mesafeli ama dengeli.",
    "optionB_outcome": "Bu yolda adalet ve denge var ama duygusal derinlik eksik kalabilir.",
    "advice": "Kararını vermeden önce kendi içine dön."
  },
  "decisionLens": "Hangi yol seni daha çok sen yapıyor?",
  "nextStep": "Bu hafta her iki seçeneği de yazıya dök ve hislerini karşılaştır.",
  "keywords": ["tutku", "denge", "içgörü"]
}
```

---

### 7. Kalbin Rotası (`path_to_love`)

**Kart Pozisyonları (5 kart):**
- `self` → Kalbin Bugünü
- `block` → Kalpteki Engel
- `need` → Kalbin İhtiyacı
- `action` → Atılacak Adım
- `potential` → Açılan Yol

**Rol:** Gelişim stratejisi — "Aşka giden yolda beni ne geliştirir?"

| | FREE | PREMIUM |
|---|------|---------|
| **Input** | `cards[5]` (position, name, orientation) | `cards[5]`, `language` |
| **Backend** | ❌ Yok | ✅ GPT-4o |
| **Output** | Her kart için `meanings[orientation].love` | `title`, `overall`, `beats` (5), `strategy`, `nextStep`, `keywords` |

**Örnek PREMIUM Output:**
```json
{
  "title": "The Hermit·Eight of Swords·Queen of Cups·Knight of Wands·The Sun — Aşka Giden Yol",
  "overall": "Şu an içe dönük bir dönemdesin, zihinsel engeller seni tutuyor ama potansiyel parlak.",
  "beats": {
    "self": "Şu an kendi içine dönmüş, izole hissediyorsun.",
    "block": "Zihinsel kısıtlamalar ve korkular seni engelliyor.",
    "need": "Duygusal derinlik ve empati geliştirmen gerekiyor.",
    "action": "Cesur adımlar at, risk al, harekete geç.",
    "potential": "Bu yolda mutluluk ve canlılık seni bekliyor."
  },
  "strategy": "Korkulara rağmen küçük ama cesur adımlar at.",
  "nextStep": "Bu hafta bir sosyal etkinliğe katıl.",
  "keywords": ["cesaret", "empati", "açılma"]
}
```

---

## UI Output Başlıkları (4 Dil)

Aşağıdaki tablolar, her spread için UI'da görünen label'ların tüm dillerdeki çevirilerini gösterir.

### Tekli Kart (Single Card) — PREMIUM

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| deepDive | Derinlemesine | Deep Dive | Tiefgang | Inmersión |
| shadow | Gölge | Shadow | Schatten | Sombra |
| nextStep | Sonraki Adım | Next Step | Nächster Schritt | Próximo paso |
| journal | Günlük | Journal | Journal | Diario |

---

### Zamanın Akışı (PPF) — FREE & PREMIUM

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| past | Geçmiş Dinamiği | Past Influence | Vergangene Dynamik | Influencia Pasada |
| present | Şu Anki Durum | Current State | Aktueller Zustand | Estado Actual |
| future | Gelişen Yön | Emerging Direction | Entstehende Richtung | Dirección Emergente |
| throughline | Ana Tema | Core Theme | Kernthema | Tema Central |
| story | Hikaye | Story | Geschichte | Historia |
| timeline | Zaman Akışı | Timeline | Zeitverlauf | Línea de Tiempo |
| decisionFrame | Seçim Noktası | Decision Point | Entscheidungspunkt | Punto de Decisión |
| pathA | Seçenek A | Option A | Option A | Opción A |
| pathB | Seçenek B | Option B | Option B | Opción B |
| emotionalTone | Duygusal Ton | Emotional Tone | Emotionaler Ton | Tono Emocional |
| actionStep | Somut Adım | Action Step | Konkreter Schritt | Paso Concreto |

---

### Evet / Hayır (Yes/No)

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| yes | Evet | Yes | Ja | Sí |
| no | Hayır | No | Nein | No |
| confidence | Netlik | Confidence | Klarheit | Claridad |
| veryClean | Çok Net | Very Clear | Sehr Klar | Muy Claro |
| good | İyi | Good | Gut | Bueno |
| moderate | Orta | Moderate | Mittel | Moderado |
| uncertain | Belirsiz | Uncertain | Unsicher | Incierto |

---

### Yolun Haritası (SOA)

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| situation | Şu Anki Tablo | Current Picture | Aktuelles Bild | Imagen Actual |
| obstacle | Önündeki Engel | The Obstacle Ahead | Das Hindernis Voraus | El Obstáculo Adelante |
| advice | Yol Gösterici | The Guide | Der Wegweiser | El Guía |
| nextStep | Sonraki Adım | Next Step | Nächster Schritt | Próximo paso |

---

### Kaderin Dokunuşu (Destiny's Embrace)

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| destiny | Bağın Özü | Essence of the Bond | Essenz der Bindung | Esencia del Vínculo |
| path | Kaderin Akışı | Flow of Destiny | Fluss des Schicksals | Flujo del Destino |
| union | Birleşmenin Anahtarı | Key to Union | Schlüssel zur Vereinigung | Clave de Unión |

---

### Aşk Kavşağı (Love Choice)

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| optionA | Birinci Yol | First Path | Erster Weg | Primer Camino |
| optionA_outcome | Birinci Yolun Kaderi | Fate of the First Path | Schicksal des Ersten Weges | Destino del Primer Camino |
| optionB | İkinci Yol | Second Path | Zweiter Weg | Segundo Camino |
| optionB_outcome | İkinci Yolun Kaderi | Fate of the Second Path | Schicksal des Zweiten Weges | Destino del Segundo Camino |
| heartGuidance | Kalbin Rehberi | Heart's Guidance | Führung des Herzens | Guía del Corazón |
| decisionLens | Karar Pusulası | Decision Compass | Entscheidungskompass | Brújula de Decisión |

---

### Kalbin Rotası (Path to Love)

| Key | TR | EN | DE | ES |
|-----|----|----|----|----|
| self | Kalbin Bugünü | Heart's Current State | Aktueller Zustand des Herzens | Estado Actual del Corazón |
| block | Kalpteki Engel | Heart Block | Blockade des Herzens | Bloqueo del Corazón |
| need | Kalbin İhtiyacı | Heart's Need | Bedürfnis des Herzens | Necesidad del Corazón |
| action | Atılacak Adım | Next Heart Step | Nächster Herzschritt | Próximo Paso del Corazón |
| potential | Açılan Yol | The Opening Path | Sich Öffnender Weg | Camino que se Abre |
| strategy | Kalbin Stratejisi | Heart's Strategy | Herzensstrategie | Estrategia del Corazón |

---

## Stil, Ton ve Dil Kuralları

> **Tek Satır Özet:** "Tarot temalı, psikoloji/koçluk tonunda, yargısız-yönlendirici, 'netleştir–sadeleştir–küçük adım' odaklı modern Türkçe."

---

### Temel Tarz: "Modern Farkındalık ve Rehberlik"

Bu uygulama bir "fal uygulaması" değil, kartları araç olarak kullanan bir **"dijital rehberlik / kişisel farkındalık"** platformudur.

- **Psikolojik Derinlik:** Kartların anlamları, dışsal olaylardan (zengin olacaksın, evleneceksin) ziyade içsel durumlara (korku, cesaret, zihinsel bariyerler, bakış açısı) odaklanıyor.
- **Falcılık Değil, Strateji:** Geleceği kesin bir dille bildirmek yerine, olasılıkları ve bu olasılıkları nasıl yöneteceğini anlatıyor.
- **Hedef Etki:** Okuyucuda "kader" hissinden çok **kontrol geri geliyor** hissi yaratmayı amaçlıyor. "Kehanet" yerine "yön bulma" ve "öz-düzenleme" çalışıyor.

---

### Ton (Voice)

**Modern, şehirli, "terapi dili"ne yakın:**
- "iç ses", "tetiklenmek", "yüzleşme", "ihtiyaç", "sınır", "duyguyu yönetmek" gibi kavramlar kullanılıyor.

**Yargısız ama direkt:**
- Kehanet gibi "kesin olacak" demiyor; daha çok **olasılık + farkındalık + yönlendirme** var.

**Destekleyici / koçvari:**
- Okuyucuya sürekli eylem çağrısı yapıyor: "isimlendir", "sadeleştir", "netleştir", "yazılı hale getir", "kural koy".

**Güçlendirici (Empowering):**
- Kullanıcıyı kurban psikolojisinden çıkarıp, kontrolü ona veriyor: "Kendi yolunu seçerken...", "İpler elinde..." gibi ifadeler.

**Gerçekçi ve Dengeli:**
- "Yıkılan Kule" veya "Ölüm" gibi kartlarda bile felaket senaryosu yazmıyor; bunları "gerekli temizlik" veya "yeni başlangıç" olarak rasyonel bir çerçeveye oturtuyor.

**Yapıcı (Constructive):**
- Ters (reversed) anlamlarda bile suçlayıcı değil, uyarıcı ve çözüm odaklı. "Hata yaptın" demek yerine "Dersi al ve yönünü düzelt" diyor.

---

### İçerik Yaklaşımı

Tarot dilini mistik kehanetten çok **psikolojik içgörü formatına** çekiyor.

**Her paragraf şu şablonda:**
1. Durumu tarif et
2. İç dinamik (korku/alışkanlık/inanç) koy
3. Somut bir küçük aksiyon öner

**Upright vs Reversed ayrımı:**
- "İyi–kötü" gibi değil; **"akışta" vs "blokajda"** gibi kurgulanmış.
- Reversed bölümler özellikle **uyarı + düzeltme planı** gibi yazılmış.

---

### Dil ve Üslup (Mikro Özellikler)

| Özellik | Açıklama |
|---------|----------|
| **Şahıs** | 2. tekil şahıs ("-sin/-sın") ile yakın konuşma |
| **Ritim** | Kısa–orta cümleler + noktalı virgül (;) ile ritim |
| **Metaforlar** | Eşik, kapı, çark, sis, zincir, bahçe vb. (soyut kavramı somutlaştırıyor) |
| **Denge** | "iyimsersin ama bütçe sınırını netleştir", "sezgi + veri" gibi ikili denge cümleleri |

**Yüksek Tekrar Eden Anahtar Kelimeler:**
```
netlik, disiplin, sınır, plan, küçük adım, yüzleşme, sadeleştirme
```

---

### Yasak Kelimeler (Spiritüel-Kader Bağlamında)

```
❌ evren, enerji akışı, kozmik, titreşim, ruhsal, ruh eşi, kader yazısı
❌ "evren sana mesaj gönderiyor"
❌ "kaderin bu yönde"
❌ kehanet dili, kesinlik ifadeleri
```

### Kullanılması Gereken Dil

```
✅ "bu davranış şu sonucu doğurur"
✅ "bu yol seni şuna götürür"
✅ "şu blok seni kapatıyor"
✅ "ilişkinin doğal eğilimi"
✅ davranış analizi, psikolojik içgörü
✅ "Risk alacaksan, küçük ama net adımlarla başla."
```

---

### Kritik Yazım Kuralları

1. **Her beat kart temasına referans içermeli** (kart adı değil, imge/tema)
2. **Metin akıcı olmalı, liste hissi vermemeli**
3. **Uydurma detay (isim, tarih, olay) ekleme**
4. **Kehanet yazma, davranış analizi yaz**

---

### Hedef Kitle

| Segment | Açıklama |
|---------|----------|
| **Gen Z ve Y Kuşağı** | Klasik fal uygulamalarındaki basmakalıp sözlerden sıkılmış, kişisel gelişim, mindfulness ve psikolojiye ilgi duyan kitle |
| **Çözüm Arayanlar** | Sadece "Ne olacak?" diye merak edenler değil, "Ne yapmalıyım?" diye soranlar |

---

### UX/UI Tasarım Önerileri

- **Görsel Dil:** Ağır, kadife perdeli, küreleri olan "eski tip falcı" temasından kaçın. Bunun yerine **minimalist, ferah, modern tipografi** kullanan, hafif kozmik ama temiz (clean) bir arayüz.
- **Öne Çıkarılacak Özellik:** Metinler çok net tavsiyeler içeriyor. **"Günün Aksiyonu"** veya **"Odaklanman Gereken Şey"** gibi tek maddelik özet (takeaway) eklenebilir.
- **Kategori Simgeleri:** "Aşk", "Kariyer", "Finans" ayrımları çok net. Kullanıcının sadece ilgilendiği alana odaklanmasını sağlayan filtreler kullanılabilir.

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

**Request Body (Örnek - Love Choice):**
```json
{
  "language": "tr",
  "spread": "love_choice",
  "isPremium": true,
  "cards": [
    { "position": "optionA", "name": "The Lovers", "orientation": "upright" },
    { "position": "optionA_outcome", "name": "The Sun", "orientation": "upright" },
    { "position": "optionB", "name": "Five of Cups", "orientation": "reversed" },
    { "position": "optionB_outcome", "name": "Justice", "orientation": "upright" },
    { "position": "advice", "name": "The Hermit", "orientation": "upright" }
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

---

## Versiyon

- **v2.0** — 5 kartlık aşk spread'leri, psikolojik tarot motoru
- **Platform:** React Native (Expo) + Express.js + GPT-4o
