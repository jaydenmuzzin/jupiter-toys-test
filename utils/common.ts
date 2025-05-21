import { expect, Page } from "@playwright/test";
import { BasePage } from "../page-objects/base-page";

export async function navigateTo(page: Page, webpage: BasePage) {
    await page.getByRole("link", { name: webpage.name }).click();
    await page.waitForURL(`**/${webpage.slug}`);
    await expect(
        page.getByRole("listitem").filter({ hasText: webpage.name })
    ).toHaveClass("active");
}
