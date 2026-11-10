// Captures the README screenshots from the running app (`npm run screenshots`).
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });

test("campaign list", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("campaign-row")).toHaveCount(7);
  await page.screenshot({ path: "docs/screenshots/campaign-list.png", fullPage: true });
});

test("edit form with live preview", async ({ page }) => {
  await page.goto("/campaigns/cmp_seed_newsletter");
  await expect(page.getByTestId("popup-preview")).toContainText("Get new posts by email");
  await page.screenshot({ path: "docs/screenshots/edit-form.png", fullPage: true });
});
