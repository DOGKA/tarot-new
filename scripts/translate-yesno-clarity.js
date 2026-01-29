/**
 * Script to translate tr-yesno-clarity.json to EN, DE, ES using DeepL API
 * 
 * Usage: 
 * DEEPL_API_KEY=your_key node scripts/translate-yesno-clarity.js
 */

const fs = require('fs');
const path = require('path');

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

if (!DEEPL_API_KEY) {
  console.error('ERROR: DEEPL_API_KEY not set');
  console.log('Usage: DEEPL_API_KEY=your_key node scripts/translate-yesno-clarity.js');
  process.exit(1);
}

// Load source file
const trClarityPath = path.join(__dirname, '../tarot-app/data/tr-yesno-clarity.json');
const trClarity = JSON.parse(fs.readFileSync(trClarityPath, 'utf8'));

// Load original yesno-clarity.json for keywords in other languages
const originalClarityPath = path.join(__dirname, '../tarot-app/data/yesno-clarity.json');
const originalClarity = JSON.parse(fs.readFileSync(originalClarityPath, 'utf8'));

// Target languages
const targetLanguages = [
  { code: 'EN', filename: 'en-yesno-clarity.json' },
  { code: 'DE', filename: 'de-yesno-clarity.json' },
  { code: 'ES', filename: 'es-yesno-clarity.json' }
];

// DeepL translate function
async function translateText(text, targetLang) {
  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: [text],
      source_lang: 'TR',
      target_lang: targetLang,
      formality: 'less' // informal tone
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepL API error: ${error}`);
  }

  const data = await response.json();
  return data.translations[0].text;
}

// Batch translate with rate limiting
async function translateBatch(texts, targetLang) {
  const results = [];
  const batchSize = 50; // DeepL allows up to 50 texts per request
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: batch,
        source_lang: 'TR',
        target_lang: targetLang,
        formality: targetLang === 'DE' ? 'less' : 'default'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepL API error: ${error}`);
    }

    const data = await response.json();
    results.push(...data.translations.map(t => t.text));
    
    // Rate limiting - wait 100ms between batches
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`  Translated ${Math.min(i + batchSize, texts.length)}/${texts.length} texts`);
  }
  
  return results;
}

async function main() {
  console.log('Starting translation of tr-yesno-clarity.json...\n');
  
  const cardNames = Object.keys(trClarity);
  console.log(`Found ${cardNames.length} cards to translate.\n`);
  
  // Collect all texts to translate
  const textsToTranslate = [];
  cardNames.forEach(cardName => {
    textsToTranslate.push(trClarity[cardName].shortReason.upright);
    textsToTranslate.push(trClarity[cardName].shortReason.reversed);
  });
  
  console.log(`Total texts to translate: ${textsToTranslate.length}\n`);
  
  for (const lang of targetLanguages) {
    console.log(`\nTranslating to ${lang.code}...`);
    
    try {
      const translations = await translateBatch(textsToTranslate, lang.code);
      
      // Build the output object
      const output = {};
      let translationIndex = 0;
      
      cardNames.forEach(cardName => {
        const langCodeLower = lang.code.toLowerCase();
        
        output[cardName] = {
          clarityWeight: trClarity[cardName].clarityWeight,
          keywords: originalClarity[cardName].keywords[langCodeLower] || originalClarity[cardName].keywords.en,
          shortReason: {
            upright: translations[translationIndex++],
            reversed: translations[translationIndex++]
          }
        };
      });
      
      // Write output file
      const outputPath = path.join(__dirname, '../tarot-app/data', lang.filename);
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
      
      console.log(`✓ Created ${lang.filename}`);
      
    } catch (error) {
      console.error(`✗ Error translating to ${lang.code}:`, error.message);
    }
  }
  
  console.log('\n✓ Translation complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated files in tarot-app/data/');
  console.log('2. Backend will automatically use the correct file based on language');
}

main().catch(console.error);
