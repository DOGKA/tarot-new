/**
 * Update clarity files with correct card names from tarot-template.json
 * Maps English card names to each language's native card names
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../tarot-app/data');
const languages = ['tr', 'en', 'de', 'es'];

// Load English template as canonical reference (by id)
const enTemplate = JSON.parse(fs.readFileSync(path.join(dataPath, 'en/tarot-template.json'), 'utf8'));

// Create id -> English name mapping
const idToEnglishName = {};
enTemplate.cards.forEach(card => {
  idToEnglishName[card.id] = card.name;
});

// Process each language
languages.forEach(lang => {
  console.log(`\nProcessing ${lang.toUpperCase()}...`);
  
  // Load language's tarot template
  const templatePath = path.join(dataPath, `${lang}/tarot-template.json`);
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  
  // Create English name -> Native name mapping
  const englishToNative = {};
  template.cards.forEach(card => {
    const englishName = idToEnglishName[card.id];
    if (englishName) {
      englishToNative[englishName] = card.name;
    }
  });
  
  // Load clarity file
  const clarityPath = path.join(dataPath, `${lang}/yesno-clarity.json`);
  const clarity = JSON.parse(fs.readFileSync(clarityPath, 'utf8'));
  
  // Create new clarity object with native names
  const newClarity = {};
  let mapped = 0;
  let notFound = [];
  
  Object.keys(clarity).forEach(englishName => {
    const nativeName = englishToNative[englishName];
    if (nativeName) {
      newClarity[nativeName] = clarity[englishName];
      mapped++;
    } else {
      notFound.push(englishName);
      // Keep original if no mapping found
      newClarity[englishName] = clarity[englishName];
    }
  });
  
  console.log(`  Mapped: ${mapped} cards`);
  if (notFound.length > 0) {
    console.log(`  Not found: ${notFound.join(', ')}`);
  }
  
  // Write updated clarity file
  fs.writeFileSync(clarityPath, JSON.stringify(newClarity, null, 2), 'utf8');
  console.log(`  Saved: ${clarityPath}`);
});

console.log('\nDone!');
