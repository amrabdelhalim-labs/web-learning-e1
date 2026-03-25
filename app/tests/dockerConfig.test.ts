import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const root = process.cwd();

describe('Docker configuration', () => {
  it('يجب أن يحتوي المشروع على ملفات docker الأساسية', () => {
    const files = ['Dockerfile', 'docker-compose.yml', '.dockerignore', '.env.example'];
    for (const file of files) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
  });

  it('يجب أن يحتوي Dockerfile على hardening و healthcheck', () => {
    const dockerfile = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8');
    expect(dockerfile).toContain('USER nextjs');
    expect(dockerfile).toContain('HEALTHCHECK');
    expect(dockerfile).toContain('/api/health');
  });

  it('يجب أن يربط docker-compose متغيرات البيئة من .env', () => {
    const compose = fs.readFileSync(path.join(root, 'docker-compose.yml'), 'utf8');
    expect(compose).toContain('env_file:');
    expect(compose).toContain('.env');
    expect(compose).toContain('healthcheck:');
  });
});
