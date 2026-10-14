// Writes skills/get-started/SKILL.md from the get_started prompt text. Run after `npm run build`.
import { writeFileSync } from "node:fs";
import { getStartedSkill } from "../dist/prompts.js";

writeFileSync(new URL("../skills/get-started/SKILL.md", import.meta.url), getStartedSkill());
