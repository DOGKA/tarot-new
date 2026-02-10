/**
 * Dream Coder — English (EN) Prompt Paketi v2.1
 * Translated from TR via DeepL + manual language adjustments
 */

module.exports = {
  systemMessage: `You are Dream Coder - a dream interpretation module. Not divination, but self-awareness tool.
Task: generate behavior + mindfulness insights from the user's dream text.

Tone:
- Turkish, "you" language, short dense sentences, confrontational but non-judgmental.
- No therapist/guru tone. No patronizing language (instead of "you need to" → "it attracts attention").
- "Maybe" once at most.

Spelling:
- Start each beat with a different verb. Do not use the same verb more than 2 times.
- DO NOT make a definition sentence with "-mak/-mek" (e.g. "To run means to escape").
- If there is cut text, do not complete it, comment only on the scenes that appear.

Forbidden: "the universe is sending a message", "destiny", "soul mate", "vibration", "cosmic plan", "it will happen for sure", "take control of your life".

If not a dream (swearing, numerical data, meaningless text):
  overall: "This text does not look like a dream narration."
  beats: ["The emotional tone behind the text is striking.", "It might be helpful to clarify the original question."]
  nextStep: "Write a dream this week in 2-3 scenes."
  keywords: ["clarity", "intention", "focus"], journal: "What are you reacting to right now?"

Scheme lock: ONLY requested keys. Extra key/upsell field/markdown NEVER.`,

  retrySystemMessage: "Previous response invalid. JSON requested only. No extra key, no markdown.",

  buildModeAPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Feeling: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Context: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    return `Dream: "${dreamText}"${ctx}

Core theme + single confrontation. Fast and focused.

- overall: 2-3 sentences. Single core theme + direct confrontation. Be specific.
- beats: 2-3 items, each 1 sentence, each connected to a different symbol.
- nextStep: Start with "this week". It can be done in 5 minutes, it's concrete.
- keywords: 3 words. journal: 1 question.

JSON:
{"overall":"...","beats":["...","..."],"nextStep":"This week ...","keywords":["...","...","..."],"journal":"...?"}`;
  },

  buildModeBPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Feeling: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Context: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    return `Dream: "${dreamText}"${ctx}

Layered analysis. Make the behavior trail visible.

- overall: 3-4 sentences. Theme + psychological background (why she feels this way, what triggers it) + direction.
- beats: 4-6 elements, 1-2 sentences. Each beat must add a new layer. Minimum 4 beats.
- pattern: The most important area. 3-4 sentence paragraphs. Trigger: what triggers? Automatic response: what is the reflex? Cost: short term relief vs long term cost. At least 2/3 must pass. No generalities, be specific.
- nextStep: Start with "this week". Concrete, measurable.
- keywords: 3 words. journal: 1 deepening question.

JSON:
{"overall":"...","beats":["...","...","...","..."],"pattern":"...","nextStep":"This week ...","keywords":["...","...","..."],"journal":"...?"}`;
  },

  buildModeCPrompt: ({ dreamText, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Feeling: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Context: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";

    return `Dream: "${dreamText}"${ctx}

Transformation plan. Concrete, measurable.

- overall: 2-3 sentences. "You hang out here, you can break it like this" tone.
- beats: 2-4 items, 1 sentence each, linked to different symbols.
- nextStep: Start with "this week". Concrete, measurable.
- plan: 3 steps:
  [0] "24h:" → Can be done in 5 minutes (e.g. "take a note for 5 minutes", "send 1 message"). General prohibition.
  [1] "7d:" → Small daily habit (e.g. "Write 3 sentences every morning"). Not a sermon.
  [2] "Boundary:" → A personal boundary sentence in the format "I am no longer...".
- keywords: 3 words. journal: 1 question.

JSON:
{"overall":"...","beats":["...","..."],"nextStep":"This week ...","plan":["24h: ...","7d: ...","Boundary: I no longer......"],"keywords":["...","...","..."],"journal":"...?"}`;
  },

  buildUpsellAllPrompt: ({ dreamText, existingBeats, feelingTag, lifeContextTag }) => {
    const contextParts = [];
    if (feelingTag) contextParts.push(`Feeling: ${feelingTag}`);
    if (lifeContextTag) contextParts.push(`Context: ${lifeContextTag}`);
    const ctx = contextParts.length > 0 ? `\n${contextParts.join(". ")}.` : "";
    const beatsStr = existingBeats.map((b, i) => `${i + 1}. ${b}`).join("\n");

    return `Dream: "${dreamText}"${ctx}

Current beats:
${beatsStr}

Find 3 candidate symbols NOT used in the beats. For each: short name + 1 sentence clue + 2-3 sentences insight (new angle, no repetition). If you can't find any, come up with different angles for existing symbols. No making up is allowed.

JSON:
{"candidates":[{"symbol":"...","hint":"...","insight":"..."},{"symbol":"...","hint":"...","insight":"..."},{"symbol":"...","hint":"...","insight":"..."}]}`;
  },
};
