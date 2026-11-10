import { expect, test, type Page } from "@playwright/test";

function row(page: Page, name: string) {
  return page.getByTestId("campaign-row").filter({ has: page.getByRole("link", { name, exact: true }) });
}

test("create, edit and publish a campaign, then find it in the live list", async ({ page }) => {
  const name = `Back in stock ${Date.now()}`;

  await page.goto("/");
  await page.getByRole("link", { name: "New campaign" }).click();
  await expect(page.getByRole("heading", { name: "New campaign" })).toBeVisible();

  // Client-side validation runs before anything is sent.
  await page.getByRole("button", { name: "Create campaign" }).click();
  await expect(page.getByText("Required.").first()).toBeVisible();

  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Headline").fill("Your size is back");
  const preview = page.getByTestId("popup-preview");
  await expect(preview.getByRole("heading", { name: "Your size is back" })).toBeVisible();

  await page.getByLabel("Trigger").selectOption("SCROLL");
  await page.getByLabel("Scroll %").fill("40");
  await page.getByLabel("URL path").fill("/products");
  await expect(preview).toContainText("After 40% scroll");
  await expect(preview).toContainText("https://example.com/products/example");

  await page.getByRole("button", { name: "Create campaign" }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
  await expect(page).toHaveURL(/\/campaigns\/cmp_/);

  // Edit the saved campaign.
  await page.getByLabel("Headline").fill("Your size is back in stock");
  await page.getByLabel("Delay (seconds)").fill("2");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Changes saved.")).toBeVisible();

  // Publish from the edit page.
  await page.getByRole("button", { name: `Publish ${name}` }).click();
  await expect(page.getByRole("heading", { name }).getByTestId("status-badge")).toHaveText("Live");
  await expect(page.getByLabel("Status")).toHaveValue("LIVE");

  // It shows up under the Live filter with the edited headline.
  await page.getByRole("link", { name: "← Campaigns" }).click();
  await page.getByRole("button", { name: "Live", exact: true }).click();
  const created = row(page, name);
  await expect(created).toContainText("Your size is back in stock");
  await expect(created.getByTestId("status-badge")).toHaveText("Live");

  // And not under Draft.
  await page.getByRole("button", { name: "Draft", exact: true }).click();
  await expect(row(page, name)).toHaveCount(0);
});

test("search narrows the list", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search name or headline").fill("checkout");
  await expect(page.getByTestId("campaign-row")).toHaveCount(1);
  await expect(page.getByTestId("campaign-row")).toContainText("Post-checkout survey");
});

test("publish rolls back when the server fails", async ({ page }) => {
  // Force a server error for the publish mutation only. The delay leaves time
  // to check the optimistic state before the response arrives.
  await page.route("**/api/graphql", async (route) => {
    const body = route.request().postDataJSON() as { query: string };
    if (!body.query.includes("mutation PublishCampaign")) return route.continue();
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: null, errors: [{ message: "Unexpected error." }] }),
    });
  });

  await page.goto("/");
  const shipping = row(page, "Free shipping notice");
  await expect(shipping.getByTestId("status-badge")).toHaveText("Paused");

  await shipping.getByRole("button", { name: "Publish Free shipping notice" }).click();
  await expect(shipping.getByTestId("status-badge")).toHaveText("Live");

  await expect(page.getByText("Couldn't publish the campaign. Unexpected error.")).toBeVisible();
  await expect(shipping.getByTestId("status-badge")).toHaveText("Paused");

  // The server still has it paused after a reload.
  await page.unroute("**/api/graphql");
  await page.reload();
  await expect(row(page, "Free shipping notice").getByTestId("status-badge")).toHaveText("Paused");
});

test("pause rolls back on an HTTP 500", async ({ page }) => {
  await page.route("**/api/graphql", async (route) => {
    const body = route.request().postDataJSON() as { query: string };
    if (!body.query.includes("mutation PauseCampaign")) return route.continue();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ status: 500, body: "Internal Server Error" });
  });

  await page.goto("/");
  const pricing = row(page, "Pricing page exit offer");
  await pricing.getByRole("button", { name: "Pause Pricing page exit offer" }).click();
  await expect(pricing.getByTestId("status-badge")).toHaveText("Paused");
  await expect(page.getByText("Couldn't pause the campaign. Server responded with 500.")).toBeVisible();
  await expect(pricing.getByTestId("status-badge")).toHaveText("Live");
});
