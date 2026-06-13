// Test de humo de UI con Playwright (playwright-core).
//
// En este entorno los navegadores que descarga Playwright no soportan el OS,
// así que se lanza apuntando al `chrome-headless-shell` ya instalado (el mismo
// que usa Puppeteer). Sobreescribible con CHROME_PATH=... y BASE_URL=...
//
// Qué hace: arranca sesión (login mock), recorre los 5 tabs, abre un sheet,
// togglea gamificación y se une a un clan. Falla si falta un elemento clave o
// si hay errores de consola. Guarda capturas en docs/screenshots/polish/.
//
// Requiere el server web corriendo:  npm run web   (http://localhost:8081)
// Uso:  node scripts/ui-smoke.mjs
import { existsSync, globSync } from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:8081';
const SHOTS = 'docs/screenshots/polish';

function resolveChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const home = process.env.HOME ?? '';
  const candidates = globSync(
    `${home}/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell`,
  ).sort();
  if (candidates.length) return candidates[candidates.length - 1];
  // Fallbacks habituales del sistema.
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (existsSync(p)) return p;
  }
  throw new Error('No se encontró un binario de Chrome. Define CHROME_PATH=...');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickText(page, text, { exact = false } = {}) {
  const el = page.getByText(text, { exact }).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await el.click({ timeout: 8000 });
}

// Los labels del tab bar se clican con match exacto (evita coincidir con copy
// que contenga la palabra, p.ej. "You" dentro de "your").
const clickTab = (page, label) => clickText(page, label, { exact: true });

async function expectText(page, text, label) {
  const found = await page
    .getByText(text, { exact: false })
    .first()
    .waitFor({ state: 'visible', timeout: 8000 })
    .then(() => true)
    .catch(() => false);
  if (!found) throw new Error(`ASSERT FAIL: no se vio "${text}" en ${label}`);
  console.log(`  ✓ ${label}: "${text}"`);
}

const run = async () => {
  const executablePath = resolveChrome();
  console.log('Chrome:', executablePath);
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 440, height: 900 } });

  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().split('\n')[0].slice(0, 200));
  });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR ' + e.message.split('\n')[0]));

  console.log('Cargando', BASE);
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(2500);
  await page.screenshot({ path: `${SHOTS}/00-auth.png` });

  // Login mock → Today
  await clickText(page, 'Continue with Apple').catch(async () => {
    await clickText(page, 'Log in');
  });
  await sleep(2500);
  await expectText(page, 'This week', 'Today');
  await page.screenshot({ path: `${SHOTS}/01-today.png` });

  // Tabs
  await clickTab(page, 'Train');
  await expectText(page, 'Trending', 'Train');
  await page.screenshot({ path: `${SHOTS}/02-train.png` });

  await clickTab(page, 'Squad');
  await expectText(page, 'Find your clan', 'Squad onboarding');
  await page.screenshot({ path: `${SHOTS}/03-squad.png` });

  await clickTab(page, 'Stats');
  await expectText(page, 'Progress', 'Stats');
  await page.screenshot({ path: `${SHOTS}/04-stats.png` });

  await clickTab(page, 'You');
  await expectText(page, 'Cooperative gamification', 'Profile');
  await page.screenshot({ path: `${SHOTS}/05-profile.png` });

  // Toggle gamificación → el tab Squad desaparece
  await clickText(page, 'Clans, streaks & raids');
  await sleep(600);
  const squadGone = (await page.getByText('Squad', { exact: true }).count()) === 0;
  console.log(`  ${squadGone ? '✓' : '✗'} kill-switch oculta el tab Squad`);
  if (!squadGone) throw new Error('ASSERT FAIL: el tab Squad sigue visible con gamificación off');
  await clickText(page, 'Clans, streaks & raids'); // re-activar

  // Unirse a un clan vía onboarding → clan home (sheet animado)
  await clickTab(page, 'Squad');
  await clickText(page, 'Iron Crows');
  await expectText(page, 'Request to join', 'Clan preview sheet');
  await page.screenshot({ path: `${SHOTS}/06-clan-preview.png` });
  await clickText(page, 'Request to join');
  await sleep(500);
  await clickText(page, 'Simulate approval');
  await sleep(1600); // count-up + ring draw
  await expectText(page, 'Active raid', 'Clan home');
  await page.screenshot({ path: `${SHOTS}/07-clan-home.png` });

  await browser.close();

  if (consoleErrors.length) {
    console.log(`\n✗ ${consoleErrors.length} errores de consola:`);
    consoleErrors.slice(0, 10).forEach((e) => console.log('   - ' + e));
    process.exit(1);
  }
  console.log('\n✓ UI smoke OK — sin errores de consola, todas las aserciones pasaron.');
};

run().catch((e) => {
  console.error('\n✗ FALLO:', e.message);
  process.exit(1);
});
