#!/usr/bin/env python3
"""
Translate en-tarot-template.json to Spanish using DeepL API.
Creates es-tarot-template.json with Spanish translations.
"""

import json
import requests
import time

# DeepL API Key
DEEPL_API_KEY = "8b7d0be1-f398-49b8-a42c-159cf952ae9c"
DEEPL_URL = "https://api.deepl.com/v2/translate"

# Spanish card names by ID
SPANISH_NAMES = {
    # Major Arcana (0-21)
    0: "El Loco",
    1: "El Mago",
    2: "La Sacerdotisa",
    3: "La Emperatriz",
    4: "El Emperador",
    5: "El Sumo Sacerdote",
    6: "Los Enamorados",
    7: "El Carro",
    8: "La Fuerza",
    9: "El Ermitaño",
    10: "La Rueda de la Fortuna",
    11: "La Justicia",
    12: "El Colgado",
    13: "La Muerte",
    14: "La Templanza",
    15: "El Diablo",
    16: "La Torre",
    17: "La Estrella",
    18: "La Luna",
    19: "El Sol",
    20: "El Juicio",
    21: "El Mundo",
    # Wands (22-35)
    22: "As de Bastos",
    23: "Dos de Bastos",
    24: "Tres de Bastos",
    25: "Cuatro de Bastos",
    26: "Cinco de Bastos",
    27: "Seis de Bastos",
    28: "Siete de Bastos",
    29: "Ocho de Bastos",
    30: "Nueve de Bastos",
    31: "Diez de Bastos",
    32: "Sota de Bastos",
    33: "Caballo de Bastos",
    34: "Reina de Bastos",
    35: "Rey de Bastos",
    # Cups (36-49)
    36: "As de Copas",
    37: "Dos de Copas",
    38: "Tres de Copas",
    39: "Cuatro de Copas",
    40: "Cinco de Copas",
    41: "Seis de Copas",
    42: "Siete de Copas",
    43: "Ocho de Copas",
    44: "Nueve de Copas",
    45: "Diez de Copas",
    46: "Sota de Copas",
    47: "Caballo de Copas",
    48: "Reina de Copas",
    49: "Rey de Copas",
    # Swords (50-63)
    50: "As de Espadas",
    51: "Dos de Espadas",
    52: "Tres de Espadas",
    53: "Cuatro de Espadas",
    54: "Cinco de Espadas",
    55: "Seis de Espadas",
    56: "Siete de Espadas",
    57: "Ocho de Espadas",
    58: "Nueve de Espadas",
    59: "Diez de Espadas",
    60: "Sota de Espadas",
    61: "Caballo de Espadas",
    62: "Reina de Espadas",
    63: "Rey de Espadas",
    # Pentacles (64-77)
    64: "As de Oros",
    65: "Dos de Oros",
    66: "Tres de Oros",
    67: "Cuatro de Oros",
    68: "Cinco de Oros",
    69: "Seis de Oros",
    70: "Siete de Oros",
    71: "Ocho de Oros",
    72: "Nueve de Oros",
    73: "Diez de Oros",
    74: "Sota de Oros",
    75: "Caballo de Oros",
    76: "Reina de Oros",
    77: "Rey de Oros",
}

# Static translations
ELEMENT_MAP = {
    "earth": "Tierra",
    "fire": "Fuego",
    "water": "Agua",
    "air": "Aire"
}

SUIT_MAP = {
    "wands": "Bastos",
    "cups": "Copas",
    "swords": "Espadas",
    "pentacles": "Oros"
}

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def translate_text(text, target_lang="ES"):
    """Translate text using DeepL API"""
    if not text or text.strip() == "":
        return text
    
    try:
        response = requests.post(
            DEEPL_URL,
            data={
                "auth_key": DEEPL_API_KEY,
                "text": text,
                "target_lang": target_lang
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["translations"][0]["text"]
        else:
            print(f"  ⚠ DeepL error {response.status_code}: {response.text}")
            return text
    except Exception as e:
        print(f"  ⚠ Translation error: {e}")
        return text

def translate_card(card):
    """Translate a single card's content"""
    translated = card.copy()
    card_id = card["id"]
    
    # Set Spanish name (hardcoded)
    if card_id in SPANISH_NAMES:
        translated["name"] = SPANISH_NAMES[card_id]
    
    # Translate element (static map)
    if card.get("element") and card["element"] in ELEMENT_MAP:
        translated["element"] = ELEMENT_MAP[card["element"]]
    
    # Translate suit (static map)
    if card.get("suit") and card["suit"] in SUIT_MAP:
        translated["suit"] = SUIT_MAP[card["suit"]]
    
    # Translate meanings via DeepL
    if "meanings" in card:
        translated["meanings"] = {}
        for position in ["upright", "reversed"]:
            if position in card["meanings"]:
                translated["meanings"][position] = {}
                for category in ["general", "love", "career", "finance"]:
                    if category in card["meanings"][position]:
                        original = card["meanings"][position][category]
                        if original and original.strip():
                            translated["meanings"][position][category] = translate_text(original, "ES")
                            time.sleep(0.1)  # Rate limiting
                        else:
                            translated["meanings"][position][category] = ""
    
    return translated

def main():
    print("Loading en-tarot-template.json...")
    data = load_json("en-tarot-template.json")
    
    translated_data = {"cards": []}
    total_cards = len(data["cards"])
    
    print(f"Translating {total_cards} cards to Spanish...\n")
    
    for i, card in enumerate(data["cards"]):
        card_name = card.get("name", f"Card {i}")
        print(f"[{i+1}/{total_cards}] Translating: {card_name}")
        
        translated_card = translate_card(card)
        translated_data["cards"].append(translated_card)
        
        # Save progress after each card
        save_json("es-tarot-template.json", translated_data)
        print(f"  ✓ {card_name} → {translated_card.get('name', '?')}")
    
    print(f"\n✅ Done! Translated {total_cards} cards.")
    print("Output saved to: es-tarot-template.json")

if __name__ == "__main__":
    main()
