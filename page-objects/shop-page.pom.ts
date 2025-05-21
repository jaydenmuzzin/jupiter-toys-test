import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class ShopPage implements BasePage {
    readonly page: Page;
    readonly name: string;
    readonly slug: string;

    constructor(page: Page) {
        this.page = page;
        this.name = "Shop";
        this.slug = "shop";
    }

    async product(name: string) {
        return this.page.getByRole("listitem").filter({ hasText: name });
    }

    async productPrice(product: Locator) {
        return product.locator(".product-price");
    }

    async productDecimalPrice(product: Locator) {
        return (
            await (await this.productPrice(product)).textContent()
        )?.replace("$", "");
    }

    async buy(product: Locator) {
        await product.getByRole("link", { name: "Buy" }).click();
    }
}
