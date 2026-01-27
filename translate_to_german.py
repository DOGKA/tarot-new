#!/usr/bin/env python3
"""
Translate en-tarot-template.json to German using DeepL API.
Creates de-tarot-template.json with German translations.
"""

import json
import requests
import time

# DeepL API Key
DEEPL_API_KEY = "8b7d0be1-f398-49b8-a42c-159cf952ae9c"
DEEPL_URL = "https://api.deepl.com/v2/translate"

# German card names by ID
GERMAN_NAMES = {
    # Major Arcana (0-21)
    0: "Narr",
    1: "Magier",
    2: "Hohepriesterin",
    3: "Herrscherin",
    4: "Herrscher",
    5: "Hierophant",
    6: "Liebenden",
    7: "Wagen",
    8: "Kraft",
    9: "Eremit",
    10: "Rad des Schicksals",
    11: "Gerechtigkeit",
    12: "Gehängte",
    13: "Tod",
    14: "Mäßigkeit",
    15: "Teufel",
    16: "Turm",
    17: "Stern",
    18: "Mond",
    19: "Sonne",
    20: "Gericht",
    21: "Welt",
    # Wands (22-35)
    22: "As der Stäbe",
    23: "Zwei Stäbe",
    24: "Drei Stäbe",
    25: "Vier Stäbe",
    26: "Fünf Stäbe",
    27: "Sechs Stäbe",
    28: "Sieben Stäbe",
    29: "Acht Stäbe",
    30: "Neun Stäbe",
    31: "Zehn Stäbe",
    32: "Bube der Stäbe",
    33: "Ritter der Stäbe",
    34: "Königin der Stäbe",
    35: "König der Stäbe",
    # Cups (36-49)
    36: "As der Kelche",
    37: "Zwei Kelche",
    38: "Drei Kelche",
    39: "Vier Kelche",
    40: "Fünf Kelche",
    41: "Sechs Kelche",
    42: "Sieben Kelche",
    43: "Acht Kelche",
    44: "Neun Kelche",
    45: "Zehn Kelche",
    46: "Bube der Kelche",
    47: "Ritter der Kelche",
    48: "Königin der Kelche",
    49: "König der Kelche",
    # Swords (50-63)
    50: "As der Schwerter",
    51: "Zwei Schwerter",
    52: "Drei Schwerter",
    53: "Vier Schwerter",
    54: "Fünf Schwerter",
    55: "Sechs Schwerter",
    56: "Sieben Schwerter",
    57: "Acht Schwerter",
    58: "Neun Schwerter",
    59: "Zehn Schwerter",
    60: "Bube der Schwerter",
    61: "Ritter der Schwerter",
    62: "Königin der Schwerter",
    63: "König der Schwerter",
    # Pentacles (64-77)
    64: "As der Münzen",
    65: "Zwei Münzen",
    66: "Drei Münzen",
    67: "Vier Münzen",
    68: "Fünf Münzen",
    69: "Sechs Münzen",
    70: "Sieben Münzen",
    71: "Acht Münzen",
    72: "Neun Münzen",
    73: "Zehn Münzen",
    74: "Bube der Münzen",
    75: "Ritter der Münzen",
    76: "Königin der Münzen",
    77: "König der Münzen",
}

# Static translations
ELEMENT_MAP = {
    "earth": "Erde",
    "fire": "Feuer",
    "water": "Wasser",
    "air": "Luft"
}

SUIT_MAP = {
    "wands": "Stäbe",
    "cups": "Kelche",
    "swords": "Schwerter",
    "pentacles": "Münzen"
}

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def translate_text(text, target_lang="DE"):
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
    
    # Set German name (hardcoded)
    if card_id in GERMAN_NAMES:
        translated["name"] = GERMAN_NAMES[card_id]
    
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
                            translated["meanings"][position][category] = translate_text(original, "DE")
                            time.sleep(0.1)  # Rate limiting
                        else:
                            translated["meanings"][position][category] = ""
    
    return translated

def main():
    print("Loading en-tarot-template.json...")
    data = load_json("en-tarot-template.json")
    
    translated_data = {"cards": []}
    total_cards = len(data["cards"])
    
    print(f"Translating {total_cards} cards to German...\n")
    
    for i, card in enumerate(data["cards"]):
        card_name = card.get("name", f"Card {i}")
        print(f"[{i+1}/{total_cards}] Translating: {card_name}")
        
        translated_card = translate_card(card)
        translated_data["cards"].append(translated_card)
        
        # Save progress after each card
        save_json("de-tarot-template.json", translated_data)
        print(f"  ✓ {card_name} → {translated_card.get('name', '?')}")
    
    print(f"\n✅ Done! Translated {total_cards} cards.")
    print("Output saved to: de-tarot-template.json")

if __name__ == "__main__":
    main()
