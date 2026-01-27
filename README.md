# Tarot New (Expo + Backend)

Ücretsiz hardcoded tarot okumaları ve premium AI okumaları sunan mobil uygulama.

## Özellikler
- 4 dil: TR / EN / DE / ES
- Spread türleri: Tekli Kart ve Geçmiş–Şimdi–Gelecek
- Free: JSON’daki hardcoded anlamlar
- Premium: focusArea odaklı minimal GPT yorumları
- Premium istek/çıktı loglama

## Proje Yapısı
- `tarot-app/` Expo uygulaması (React Native)
- `backend/` Premium okumalar için Express API
- `backend/data/premium-readings.json` premium logları

## Gereksinimler
- Node.js 20+
- npm
- Expo Go (mobil test için)

## Kurulum

### 1) Backend

`backend/` içine `.env` oluştur:

```
OPENAI_API_KEY=YOUR_OPENAI_KEY
PORT=3001
```

Kur ve çalıştır:

```
cd backend
npm install
node index.js
```

API endpoint’leri:
- `POST /api/reading`
- `POST /api/logs/reset` ( `premium-readings.json` temizler)

### 2) Mobile App

Kur ve başlat:

```
cd tarot-app
npm install
nvm use 20
CI=0 npx expo start
```

Expo Go ile QR kodu okut.

## Okuma Modları (Güncel Şema)

### Free Tekli (hardcoded)
- `general`, `love`, `career`, `finance` alanları kart anlamlarından gelir

### Premium Tekli (focusArea)
- `title`
- `overall` (2–3 cümle)
- `focusArea` (general/love/career/finance)
- `deepDive` (2–4 cümle)
- `shadow` (1 cümle)
- `nextStep` (1 cümle, her zaman)
- `journal` (1 soru, her zaman)

### Free 3’lü (hardcoded)
- `beats.past` / `beats.present` / `beats.future`
- `meanings[orientation].general` (tam metin) kullanılır

### Premium 3’lü
- `title`
- `overall` (3–4 cümle)
- `throughline` (1 cümle)
- `story` (4–6 cümle)
- `beats.past/present/future`
- `choice.pathA/pathB`
- `keywords` (3 adet)
- `mood` (tek kelime)
- `timing` (örn. "2–4 hafta")
- `nextStep` (1 cümle)

## Notlar
- `.env` asla commitlenmemeli.
- QR görünmüyorsa CI kapalı başlat: `CI=0 npx expo start`.
