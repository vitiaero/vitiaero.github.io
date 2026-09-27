// Tests navigateur (npm run test:e2e).
// - "pre-lancement" et "mobile" : le site compile, servi par le serveur Node en
//   mode production, tel qu'il est publie tant que la porte de lancement est
//   fermee (bandeau, formulaires fermes, aucune indexation).
// - "formulaires" : serveur de developpement de Vite (formulaires ouverts pour
//   les essais) et API sur une base temporaire ; aucun e-mail ne part
//   (transport "memory").
// Chromium : celui de Playwright, ou CHROMIUM_PATH (navigateur deja installe).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const launchOptions = exe ? { executablePath: exe } : {};
const TMP = path.join(os.tmpdir(), 'vitiaero-e2e');
const PROD = 4310;
const API = 3310;
const DEV = 5310;

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: [['list']],
  use: { launchOptions, trace: 'retain-on-failure' },
  projects: [
    { name: 'pre-lancement', testMatch: /prelaunch\.spec\.js/, use: { ...devices['Desktop Chrome'], launchOptions, baseURL: `http://127.0.0.1:${PROD}` } },
    { name: 'mobile', testMatch: /mobile\.spec\.js/, use: { ...devices['Pixel 7'], launchOptions, baseURL: `http://127.0.0.1:${PROD}` } },
    { name: 'formulaires', testMatch: /forms\.spec\.js/, use: { ...devices['Desktop Chrome'], launchOptions, baseURL: `http://127.0.0.1:${DEV}` } },
  ],
  webServer: [
    {
      command: `npm run build && node e2e/serve.mjs --port=${PROD}`,
      url: `http://127.0.0.1:${PROD}/api/health`,
      env: { NODE_ENV: 'production', DATA_DIR: path.join(TMP, 'prod'), ADMIN_PASSWORD: 'e2e-motdepasse-equipe', TRUST_PROXY: 'false' },
      timeout: 180_000,
      reuseExistingServer: false,
    },
    {
      command: `node e2e/serve.mjs --port=${API}`,
      url: `http://127.0.0.1:${API}/api/health`,
      env: { NODE_ENV: 'test', DATA_DIR: path.join(TMP, 'api'), DEMO_DATA: '0', MAIL_TRANSPORT: 'memory', TRUST_PROXY: 'false' },
      reuseExistingServer: false,
    },
    {
      command: `npx vite --port ${DEV} --strictPort --host 127.0.0.1`,
      url: `http://127.0.0.1:${DEV}`,
      env: { VITE_API_PROXY: `http://127.0.0.1:${API}`, VITE_OPEN: '0' },
      reuseExistingServer: false,
    },
  ],
});
