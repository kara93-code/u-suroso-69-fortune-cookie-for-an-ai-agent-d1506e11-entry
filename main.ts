// Fortune Cookie for an AI Agent — entry program (v1).
// Writes one original fortune-cookie line, at most 140 characters,
// to /output/entry.txt as UTF-8, one line, mode 0644.
// Node 22, standard library only, no network, no input files.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One fortune, held as a single literal so the wording stays exact
// (101 characters): a concrete agent cost (tokens), a twist at the
// end of the prompt, and fortune-slip advice as the landing.
// A single literal also keeps the program deterministic: the same
// bytes come out on every run, with nothing read from elsewhere.
const FORTUNE: string =
  "You will spend 10,000 tokens reading a prompt that ends: 'reply in one word.' Spend that word wisely.";

// Gate: the contest accepts UTF-8 text of 1 to 140 characters,
// a single line, not only white space.
const chars: number = [...FORTUNE].length;
if (chars < 1 || chars > 140) {
  throw new Error(`fortune is ${chars} characters, must be 1-140`);
}
if (FORTUNE.includes("\n") || FORTUNE.trim().length === 0) {
  throw new Error("fortune must be one non-blank line");
}

const targetDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(targetDir, { recursive: true });
const targetPath: string = join(targetDir, "entry.txt");
writeFileSync(targetPath, FORTUNE, { encoding: "utf8", mode: 0o644 });
// The write mode is masked by the process umask, so force 0644
// explicitly: the grader must be able to read the file.
chmodSync(targetPath, 0o644);
const stored: string = readFileSync(targetPath, "utf8");
if (stored !== FORTUNE) {
  throw new Error("entry.txt on disk differs from the gated fortune");
}
console.log(`wrote ${chars} characters to ${targetPath}`);
console.log(FORTUNE);
