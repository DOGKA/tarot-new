#!/usr/bin/env python3
"""
Translate en-tarot-template.json to Turkish using DeepL API.
Creates tr-tarot-template.json with Turkish translations.
"""

import json
import requests
import time

# DeepL API Key
DEEPL_API_KEY = "8b7d0be1-f398-49b8-a42c-159cf952ae9c"
DEEPL_URL = "https://api.deepl.com/v2/translate"

# Static translations (no API needed)
ELEMENT_MAP = {
    "earth": "toprak",
    "fire": "ateş",
    "water": "su",
    "air": "hava"
}

SUIT_MAP = {
    "wands": "asalar",
    "cups": "kupalar",
    "swords": "kılıçlar",
    "pentacles": "tılsımlar"
}

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def translate_text(text, target_lang="TR"):
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
    
    # Translate name
    if card.get("name"):
        translated["name"] = translate_text(card["name"])
    
    # Translate element (static map)
    if card.get("element") and card["element"] in ELEMENT_MAP:
        translated["element"] = ELEMENT_MAP[card["element"]]
    
    # Translate suit (static map)
    if card.get("suit") and card["suit"] in SUIT_MAP:
        translated["suit"] = SUIT_MAP[card["suit"]]
    
    # Translate meanings
    if "meanings" in card:
        translated["meanings"] = {}
        for position in ["upright", "reversed"]:
            if position in card["meanings"]:
                translated["meanings"][position] = {}
                for category in ["general", "love", "career", "finance"]:
                    if category in card["meanings"][position]:
                        original = card["meanings"][position][category]
                        if original and original.strip():
                            translated["meanings"][position][category] = translate_text(original)
                            time.sleep(0.1)  # Rate limiting
                        else:
                            translated["meanings"][position][category] = ""
    
    return translated

def main():
    print("Loading en-tarot-template.json...")
    data = load_json("en-tarot-template.json")
    
    translated_data = {"cards": []}
    total_cards = len(data["cards"])
    
    print(f"Translating {total_cards} cards to Turkish...\n")
    
    for i, card in enumerate(data["cards"]):
        card_name = card.get("name", f"Card {i}")
        print(f"[{i+1}/{total_cards}] Translating: {card_name}")
        
        translated_card = translate_card(card)
        translated_data["cards"].append(translated_card)
        
        # Save progress after each card
        save_json("tr-tarot-template.json", translated_data)
        print(f"  ✓ {card_name} → {translated_card.get('name', '?')}")
    
    print(f"\n✅ Done! Translated {total_cards} cards.")
    print("Output saved to: tr-tarot-template.json")

if __name__ == "__main__":
    main()
