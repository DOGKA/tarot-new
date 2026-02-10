/**
 * Dream Coder — Prompt dil router
 * 4 dil: TR, EN, DE, ES
 */

const tr = require("./tr");
const en = require("./en");
const de = require("./de");
const es = require("./es");

const promptsByLang = { tr, en, de, es };

const getPrompts = (language = "tr") => {
  return promptsByLang[language] || promptsByLang.tr;
};

module.exports = { getPrompts };
