import { type Locator, type Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async product(name: string) {
        return this.page.getByRole("row").filter({
            has: this.page.getByRole("cell").filter({ hasText: name }),
        });
    }

    async productPrice(product: Locator) {
        return await product.evaluate((tr) => tr.children[1].textContent);
    }

    async productDecimalPrice(product: Locator) {
        const priceElementText = await this.productPrice(product);
        return priceElementText ? priceElementText.replace("$", "") : "0";
    }

    async productQuantity(product: Locator) {
        return await product.getByRole("spinbutton").inputValue();
    }

    async productSubtotal(product: Locator) {
        return await product.evaluate((tr) => tr.children[3].textContent);
    }

    async productDecimalSubtotal(product: Locator) {
        const subtotalElementText = await this.productSubtotal(product);
        return subtotalElementText ? subtotalElementText.replace("$", "") : "0";
    }

    async totalPrice() {
        return this.page.locator(".total");
    }
}
