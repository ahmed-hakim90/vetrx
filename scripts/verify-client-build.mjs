#!/usr/bin/env node
// Verifies that a built client bundle carries no other client's brand names
// or another market's terminology.
//
// Usage:
//   node scripts/verify-client-build.mjs shams
//   node scripts/verify-client-build.mjs shams --dist dist
//
// Build the client first (npm run build:shams). Exits non-zero on a hit, so
// it can be wired into CI as a release gate.

import fs from 'node:fs';
import path from 'node:path';

// Terms that must never appear in a given client's build output. Keyed by
// client id; each entry lists other clients' brands plus the terminology of
// markets that client does not serve.
const FORBIDDEN_TERMS = {
  shams: [
    // other clients' brands
    'Voltix',
    'Apex',
    'Lumina',
    // markets Shams Stores does not serve
    'GCC',
    'AED',
    'SAR',
    'Mada',
    'Tabby',
    'Tamara',
    'Riyadh',
    'Dubai',
    'Abu Dhabi',
    'Jeddah',
  ],
  voltix: ['Shams', 'EGP', 'shams-stores'],
  apex: ['Shams', 'EGP', 'shams-stores'],
  lumina: ['Shams', 'EGP', 'shams-stores'],
};

const clientId = process.argv[2];
const distFlagIndex = process.argv.indexOf('--dist');
const distDir = distFlagIndex > -1 ? process.argv[distFlagIndex + 1] : 'dist';

if (!clientId || !FORBIDDEN_TERMS[clientId]) {
  console.error(`Usage: node scripts/verify-client-build.mjs <${Object.keys(FORBIDDEN_TERMS).join('|')}> [--dist <dir>]`);
  process.exit(2);
}

if (!fs.existsSync(distDir)) {
  console.error(`No build found at "${distDir}". Run: npm run build:${clientId}`);
  process.exit(2);
}

function collectFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(full);
    return /\.(js|css|html|json|webmanifest)$/.test(entry.name) ? [full] : [];
  });
}

const terms = FORBIDDEN_TERMS[clientId];
const hits = [];

for (const file of collectFiles(distDir)) {
  const content = fs.readFileSync(file, 'utf8');
  for (const term of terms) {
    // Case-sensitive on purpose: the Arabic word "الشمس" (the sun) or a
    // lowercase identifier is not the same as a competing brand name.
    let index = content.indexOf(term);
    while (index !== -1) {
      hits.push({ file, term, excerpt: content.slice(Math.max(0, index - 60), index + 60).replace(/\s+/g, ' ') });
      index = content.indexOf(term, index + term.length);
      if (hits.length > 200) break;
    }
  }
}

if (hits.length === 0) {
  console.log(`✓ ${clientId} build is clean — none of the forbidden terms appear in ${distDir}/`);
  console.log(`  checked: ${terms.join(', ')}`);
  process.exit(0);
}

console.error(`✗ ${clientId} build contains ${hits.length} forbidden-term occurrence(s):\n`);
for (const hit of hits.slice(0, 40)) {
  console.error(`  [${hit.term}] ${hit.file}`);
  console.error(`      …${hit.excerpt}…`);
}
if (hits.length > 40) console.error(`  … and ${hits.length - 40} more`);
process.exit(1);
