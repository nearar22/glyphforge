// Gate: fail if any tracked source file contains a U+2014 em dash.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = join(process.cwd(), '..');
const SKIP = new Set(['node_modules', '.git', '.next', 'out', 'dist', '.wrangler', '__pycache__']);
const EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.md', '.py', '.html']);

let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (EXT.has(extname(name))) check(full);
  }
}

function check(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('\u2014')) {
      console.log(`EMDASH ${file}:${i + 1} ${line.trim().slice(0, 80)}`);
      bad++;
    }
  });
}

walk(ROOT);
if (bad > 0) {
  console.error(`\nFAIL: ${bad} em dash occurrence(s).`);
  process.exit(1);
}
console.log('No em dash - clean.');
