/** `npm run docs`: regenerates docs/FUNCTIONS.md from the built-in definitions (src-v1/stdlib). */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { functionReference } from "../src-v1/stdlib/reference";

writeFileSync(join(__dirname, "..", "docs", "FUNCTIONS.md"), functionReference());
console.log("docs/FUNCTIONS.md written");
