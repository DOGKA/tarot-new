/**
 * Create language-specific yesno-answers.json files
 * Maps English card names to each language's native card names
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../tarot-app/data');
const languages = ['tr', 'en', 'de', 'es'];

// Load English template as canonical reference (by id)
const enTemplate = JSON.parse(fs.readFileSync(path.join(dataPath, 'en/tarot-template.json'), 'utf8'));

// Load original answers file (English names)
const answersPath = path.join(dataPath, 'yesno-answers.json');
const answers = JSON.parse(fs.readFileSync(answersPath, 'utf8'));

// Create id -> English name mapping
const idToEnglishName = {};
enTemplate.cards.forEach(card => {
  idToEnglishName[card.id] = card.name;
});

// Create English name -> id mapping
const englishNameToId = {};
enTemplate.cards.forEach(card => {
  englishNameToId[card.name] = card.id;
});

// Process each language
languages.forEach(lang => {
  console.log(`\nProcessing ${lang.toUpperCase()}...`);
  
  // Load language's tarot template
  const templatePath = path.join(dataPath, `${lang}/tarot-template.json`);
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  
  // Create id -> Native name mapping
  const idToNativeName = {};
  template.cards.forEach(card => {
    idToNativeName[card.id] = card.name;
  });
  
  // Create new answers object with native names
  const newAnswers = {};
  let mapped = 0;
  let notFound = [];
  
  Object.keys(answers).forEach(englishName => {
    const cardId = englishNameToId[englishName];
    if (cardId !== undefined) {
      const nativeName = idToNativeName[cardId];
      if (nativeName) {
        newAnswers[nativeName] = answers[englishName];
        mapped++;
      } else {
        notFound.push(englishName);
      }
    } else {
      notFound.push(englishName);
    }
  });
  
  console.log(`  Mapped: ${mapped} cards`);
  if (notFound.length > 0) {
    console.log(`  Not found: ${notFound.join(', ')}`);
  }
  
  // Write language-specific answers file
  const outputPath = path.join(dataPath, `${lang}/yesno-answers.json`);
  fs.writeFileSync(outputPath, JSON.stringify(newAnswers, null, 2), 'utf8');
  console.log(`  Saved: ${outputPath}`);
});

console.log('\nDone!');
