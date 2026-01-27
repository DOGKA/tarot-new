#!/usr/bin/env python3
"""Fix Turkish card names in tr-tarot-template.json"""

import json

# Correct Turkish names by card ID
TURKISH_NAMES = {
    # Major Arcana (0-21)
    0: "Deli",
    1: "Büyücü",
    2: "Azize",
    3: "İmparatoriçe",
    4: "İmparator",
    5: "Aziz",
    6: "Aşıklar",
    7: "Savaş Arabası",
    8: "Güç",
    9: "Ermiş",
    10: "Kader Çarkı",
    11: "Adalet",
    12: "Asılan Adam",
    13: "Ölüm",
    14: "Denge",
    15: "Şeytan",
    16: "Yıkılan Kule",
    17: "Yıldız",
    18: "Ay",
    19: "Güneş",
    20: "Mahkeme",
    21: "Dünya",
    # Wands (22-35)
    22: "Değnek Ası",
    23: "Değnek İkilisi",
    24: "Değnek Üçlüsü",
    25: "Değnek Dörtlüsü",
    26: "Değnek Beşlisi",
    27: "Değnek Altılısı",
    28: "Değnek Yedilisi",
    29: "Değnek Sekizlisi",
    30: "Değnek Dokuzlusu",
    31: "Değnek Onlusu",
    32: "Değnek Prensi",
    33: "Değnek Şövalyesi",
    34: "Değnek Kraliçesi",
    35: "Değnek Kralı",
    # Cups (36-49)
    36: "Kupa Ası",
    37: "Kupa İkilisi",
    38: "Kupa Üçlüsü",
    39: "Kupa Dörtlüsü",
    40: "Kupa Beşlisi",
    41: "Kupa Altılısı",
    42: "Kupa Yedilisi",
    43: "Kupa Sekizlisi",
    44: "Kupa Dokuzlusu",
    45: "Kupa Onlusu",
    46: "Kupa Prensi",
    47: "Kupa Şövalyesi",
    48: "Kupa Kraliçesi",
    49: "Kupa Kralı",
    # Swords (50-63)
    50: "Kılıç Ası",
    51: "Kılıç İkilisi",
    52: "Kılıç Üçlüsü",
    53: "Kılıç Dörtlüsü",
    54: "Kılıç Beşlisi",
    55: "Kılıç Altılısı",
    56: "Kılıç Yedilisi",
    57: "Kılıç Sekizlisi",
    58: "Kılıç Dokuzlusu",
    59: "Kılıç Onlusu",
    60: "Kılıç Prensi",
    61: "Kılıç Şövalyesi",
    62: "Kılıç Kraliçesi",
    63: "Kılıç Kralı",
    # Pentacles (64-77)
    64: "Tılsım Ası",
    65: "Tılsım İkilisi",
    66: "Tılsım Üçlüsü",
    67: "Tılsım Dörtlüsü",
    68: "Tılsım Beşlisi",
    69: "Tılsım Altılısı",
    70: "Tılsım Yedilisi",
    71: "Tılsım Sekizlisi",
    72: "Tılsım Dokuzlusu",
    73: "Tılsım Onlusu",
    74: "Tılsım Prensi",
    75: "Tılsım Şövalyesi",
    76: "Tılsım Kraliçesi",
    77: "Tılsım Kralı",
}

# Also fix suit names
SUIT_MAP = {
    "asalar": "değnekler",
    "kupalar": "kupalar",
    "kılıçlar": "kılıçlar", 
    "tılsımlar": "tılsımlar"
}

def main():
    print("Loading tr-tarot-template.json...")
    with open("tr-tarot-template.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print("Fixing Turkish names...")
    for card in data["cards"]:
        card_id = card["id"]
        if card_id in TURKISH_NAMES:
            old_name = card["name"]
            card["name"] = TURKISH_NAMES[card_id]
            print(f"  {old_name} → {card['name']}")
        
        # Fix suit if present
        if card.get("suit") and card["suit"] in SUIT_MAP:
            card["suit"] = SUIT_MAP[card["suit"]]
    
    print("\nSaving...")
    with open("tr-tarot-template.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Done! Turkish names fixed.")

if __name__ == "__main__":
    main()
