import { SKILL_MAP } from "./skills.js";

export function extractSkills(text = "") {
  if (!text || typeof text !== "string") return [];

  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " "); // remove punctuation

  const tokens = normalized.split(/\s+/);
  const found = new Set();

  for (const [skill, variants] of Object.entries(SKILL_MAP)) {
    for (const variant of variants) {
      const v = variant.toLowerCase();

      // multi-word skill (e.g. "node js")
      if (v.includes(" ")) {
        if (normalized.includes(v)) {
          found.add(skill);
        }
      }
      // single-word skill (STRICT match)
      else {
        if (tokens.includes(v)) {
          found.add(skill);
        }
      }
    }
  }

  return [...found];
}
