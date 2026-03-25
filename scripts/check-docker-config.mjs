import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = ['Dockerfile', 'docker-compose.yml', '.dockerignore', '.env.example'];

const requiredMarkers = [
  { file: 'Dockerfile', marker: 'FROM base AS builder' },
  { file: 'Dockerfile', marker: 'USER nextjs' },
  { file: 'Dockerfile', marker: 'HEALTHCHECK' },
  { file: 'Dockerfile', marker: '/api/health' },
  { file: 'docker-compose.yml', marker: 'healthcheck:' },
  { file: 'docker-compose.yml', marker: 'env_file:' },
  { file: 'docker-compose.yml', marker: '.env' },
  { file: '.dockerignore', marker: '.env' },
];

const requiredEnvVars = ['OPENAI_API_KEY'];

function fail(message) {
  process.stderr.write(`Docker config check failed: ${message}\n`);
  process.exit(1);
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.resolve(process.cwd(), file))) {
    fail(`missing required file "${file}"`);
  }
}

for (const { file, marker } of requiredMarkers) {
  const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
  if (!content.includes(marker)) {
    fail(`missing marker "${marker}" in "${file}"`);
  }
}

const envExample = fs.readFileSync(path.resolve(process.cwd(), '.env.example'), 'utf8');
for (const envVar of requiredEnvVars) {
  if (!new RegExp(`^${envVar}=`, 'm').test(envExample)) {
    fail(`missing env variable "${envVar}" in .env.example`);
  }
}

process.stdout.write('Docker config check passed.\n');
