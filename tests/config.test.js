/**
 * Configuration validation tests for root package.json.
 *
 * Testing library/framework: Vitest (describe / it / expect).
 * - If your project uses Jest, replace the import line with:
 *     // import { describe, it, expect } from '@jest/globals';
 *   The rest of the test body should work as-is.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the root package.json (one level up from tests/)
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const semverRangeRe = /^(?:\^|~)?\d+\.\d+\.\d+(?:[-+].*)?$/;

describe('root package.json configuration', () => {
  it('has correct basic metadata', () => {
    expect(pkg).toBeTypeOf('object');
    expect(pkg).toHaveProperty('name', 'rest-express');
    expect(pkg).toHaveProperty('private', true);
    expect(pkg).toHaveProperty('license', 'MIT');
    expect(pkg).toHaveProperty('type', 'module');
    expect(pkg).toHaveProperty('version');
    expect(typeof pkg.version).toBe('string');
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(?:[-+].*)?$/);
  });

  it('defines expected workspaces exactly', () => {
    expect(Array.isArray(pkg.workspaces)).toBe(true);
    expect(pkg.workspaces).toEqual(['client', 'server', 'shared']);
  });

  it('exposes required scripts with correct commands', () => {
    const s = pkg.scripts ?? {};
    // Presence
    for (const key of ['dev', 'build', 'start', 'lint', 'preview', 'check', 'db:push']) {
      expect(s, `scripts should include "${key}"`).toHaveProperty(key);
      expect(typeof s[key]).toBe('string');
      expect(s[key].length).toBeGreaterThan(0);
    }
    // Details
    expect(s.dev).toContain('concurrently');
    expect(s.dev).toMatch(/npm run dev -w server/);
    expect(s.dev).toMatch(/npm run dev -w client/);

    expect(s.build).toMatch(/npm run build -w client/);
    expect(s.build).toMatch(/npm run build -w server/);

    expect(s.start).toBe('node dist/index.js');
    expect(s.lint).toBe('eslint .');
    expect(s.preview).toBe('vite preview');
    expect(s.check).toBe('tsc');
    expect(s['db:push']).toBe('drizzle-kit push');
  });

  it('declares required optionalDependencies with valid semver', () => {
    const o = pkg.optionalDependencies ?? {};
    expect(o).toHaveProperty('bufferutil');
    expect(o.bufferutil).toMatch(semverRangeRe);
  });

  it('declares core runtime dependencies with semver ranges', () => {
    const d = pkg.dependencies ?? {};
    for (const dep of ['dotenv', 'drizzle-orm', 'pg', 'react', 'react-dom']) {
      expect(d, `dependencies should include "${dep}"`).toHaveProperty(dep);
      expect(d[dep]).toMatch(semverRangeRe);
    }
  });

  it('declares expected devDependencies and pins Vite version', () => {
    const dd = pkg.devDependencies ?? {};
    for (const dep of [
      '@tailwindcss/vite',
      '@types/node',
      '@vitejs/plugin-react',
      'autoprefixer',
      'concurrently',
      'drizzle-kit',
      'postcss',
      'tailwindcss',
      'typescript',
      'vite',
    ]) {
      expect(dd, `devDependencies should include "${dep}"`).toHaveProperty(dep);
    }
    // Intentionally assert exact Vite pin based on PR diff
    expect(dd.vite).toBe('7.0.4');
  });

  it('has non-empty dependency objects where applicable', () => {
    for (const key of ['dependencies', 'devDependencies']) {
      const obj = pkg[key] ?? {};
      expect(Object.keys(obj).length, `${key} should not be empty`).toBeGreaterThan(0);
    }
  });

  it('scripts reference valid workspace names', () => {
    const s = pkg.scripts ?? {};
    const aggregate = `${s.dev ?? ''} ${s.build ?? ''}`;
    for (const ws of pkg.workspaces ?? []) {
      expect(aggregate).toMatch(new RegExp(`\\-w\\s+${ws}(\\s|$)`));
    }
  });

  it('does not include unexpected top-level fields commonly misconfigured', () => {
    // Guardrail checks: ensure no accidental fields often added by tooling
    const disallowed = ['dependenciesMeta', 'overrides', 'resolutions']; // adjust as needed
    for (const key of disallowed) {
      expect(pkg[key]).toBeUndefined();
    }
  });
});