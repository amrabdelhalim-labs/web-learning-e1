#!/usr/bin/env node
/**
 * format.mjs — Cross-platform code formatter for web-learning-e1 (علمني)
 *
 * Runs Prettier across app/ source files.
 * Works on Windows, macOS, and Linux without any extra tools.
 *
 * Usage:
 *   node format.mjs           # format all files (write mode)
 *   node format.mjs --check   # validate only, exit 1 if unformatted (CI)
 */

import { execSync } from 'child_process';

const isCheck = process.argv.includes('--check');
const mode = isCheck ? '--check' : '--write';
let failed = false;

console.log(`\n==> Prettier ${mode} : app/**/*.{ts,tsx,css}`);
try {
  execSync(`npx prettier ${mode} "app/**/*.{ts,tsx,css}"`, { stdio: 'inherit' });
} catch {
  failed = true;
}

if (failed) {
  console.error('\n[FAIL] Some files are not formatted. Run: node format.mjs');
  process.exit(1);
} else {
  console.log('\n[OK] All files are properly formatted.');
}
