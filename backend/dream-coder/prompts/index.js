/**
 * Dream Coder — Prompt dil router
 * Şimdilik sadece TR, diğer diller DeepL ile eklenecek
 */

const tr = require("./tr");

const promptsByLang = {
  tr,
  // en: require("./en"),  // TODO: DeepL ile çevrilecek
  // de: require("./de"),  // TODO: DeepL ile çevrilecek
  // es: require("./es"),  // TODO: DeepL ile çevrilecek
};

const getPrompts = (language = "tr") => {
  return promptsByLang[language] || promptsByLang.tr;
};

module.exports = { getPrompts };
