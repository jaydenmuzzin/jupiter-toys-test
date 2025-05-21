import { type Locator, type Page } from "@playwright/test";

export class ShopPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
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
