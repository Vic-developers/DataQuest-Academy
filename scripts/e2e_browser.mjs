// E2E en navegador: landing -> registro -> laboratorio SQL -> tutor.
// Ejecutar via: node "C:\Users\reyti\.claude\skills\browser-automation\browser.mjs" http://localhost:3000 --script scripts/e2e_browser.mjs
export default async function run(page, ui) {
  const email = `e2e${Date.now()}@test.com`;
  const pass = "password123";
  await page.goto("http://localhost:3000/register");
  let snap = await ui.snapshot();
  let emailBox = snap.match(/@(e\d+) textbox/)?.[1];
  if (!emailBox) return { error: "registro sin email", snapshot: snap };
  // rellena con locators de Playwright (más robusto que refs tras re-render)
  await page.locator("input").first().fill(email);
  await page.locator("input[type=password]").fill(pass);
  await page.getByRole("button", { name: "Registrarse" }).click();
  await page.waitForTimeout(2500);
  const dash = await ui.snapshot({ full: true });
  const sqlOk = dash.includes("Tu panel") || dash.includes("Inicia") === false;
  await page.goto("http://localhost:3000/labs/sql");
  await page.getByRole("button", { name: "Ejecutar" }).click();
  await page.waitForTimeout(1500);
  const sqlSnap = await ui.snapshot({ full: true });
  const sqlRendered = sqlSnap.includes("region") || sqlSnap.includes("Norte");
  return { registered: email, sqlRendered, url: page.url() };
}
