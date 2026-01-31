/**
 * Language-specific prompts for ChatGPT
 * Each language has its own file with system messages and prompt builders
 */

const tr = require('./tr');
const en = require('./en');
const de = require('./de');
const es = require('./es');

const prompts = { tr, en, de, es };

/**
 * Get prompts for a specific language
 * @param {string} language - Language code (tr, en, de, es)
 * @returns {object} Language-specific prompts
 */
const getPrompts = (language) => {
  return prompts[language] || prompts.en;
};

/**
 * Get system message for a language
 * @param {string} language - Language code
 * @param {boolean} isRetry - Whether this is a retry attempt
 * @returns {string} System message
 */
const getSystemMessage = (language, isRetry = false) => {
  const langPrompts = getPrompts(language);
  return isRetry ? langPrompts.retrySystemMessage : langPrompts.systemMessage;
};

/**
 * Build single card reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildSinglePrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildSinglePrompt(params).trim();
};

/**
 * Build three card (PPF) reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildPpfPrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildPpfPrompt(params).trim();
};

/**
 * Build yes/no reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildYesNoPrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildYesNoPrompt(params).trim();
};

/**
 * Build SOA (Situation/Obstacle/Advice) reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildSoaPrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildSoaPrompt(params).trim();
};

/**
 * Build Destiny's Embrace reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildDestinysEmbracePrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildDestinysEmbracePrompt(params).trim();
};

/**
 * Build Love Choice reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildLoveChoicePrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildLoveChoicePrompt(params).trim();
};

/**
 * Build Path to Love reading prompt
 * @param {string} language - Language code
 * @param {object} params - Prompt parameters
 * @returns {string} Formatted prompt
 */
const buildPathToLovePrompt = (language, params) => {
  const langPrompts = getPrompts(language);
  return langPrompts.buildPathToLovePrompt(params).trim();
};

module.exports = {
  getPrompts,
  getSystemMessage,
  buildSinglePrompt,
  buildPpfPrompt,
  buildYesNoPrompt,
  buildSoaPrompt,
  buildDestinysEmbracePrompt,
  buildLoveChoicePrompt,
  buildPathToLovePrompt
};
