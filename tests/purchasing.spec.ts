import { test, expect } from "@playwright/test";
import { ShopPage } from "../page-objects/shop-page.pom";

test.describe("Purchasing", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/#/shop");
    });

    test("should have correct prices and calculations in cart", async ({
        page,
    }) => {
        const SHOP_PAGE = new ShopPage(page);

        const STUFFED_FROG_PROD = await SHOP_PAGE.product("Stuffed Frog");
        const STUFFED_FROG_PROD_PRICE = await SHOP_PAGE.productDecimalPrice(STUFFED_FROG_PROD);

        await SHOP_PAGE.buy(STUFFED_FROG_PROD);
        await SHOP_PAGE.buy(STUFFED_FROG_PROD);

        const FLUFFY_BUNNY_PROD = await SHOP_PAGE.product("Fluffy Bunny");
        const FLUFFY_BUNNY_PROD_PRICE = await SHOP_PAGE.productDecimalPrice(FLUFFY_BUNNY_PROD);

        await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
        await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
        await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
        await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
        await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);

        const VALENTINE_BEAR_PROD = await SHOP_PAGE.product("Valentine Bear");
        const VALENTINE_BEAR_PROD_PRICE = await SHOP_PAGE.productDecimalPrice(VALENTINE_BEAR_PROD);

        await SHOP_PAGE.buy(VALENTINE_BEAR_PROD);
        await SHOP_PAGE.buy(VALENTINE_BEAR_PROD);
        await SHOP_PAGE.buy(VALENTINE_BEAR_PROD);

        await test.step("Navigate to 'Cart' page", async () => {
            await page.getByRole("link", { name: "Cart" }).click();
            await page.waitForURL("**/cart");
            await expect(
                page.getByRole("listitem").filter({ hasText: "Cart" })
            ).toHaveClass("active");
        });

        const STUFFED_FROG_PROD_IN_CART = page.getByRole("row").filter({
            has: page.getByRole("cell").filter({ hasText: "Stuffed Frog" }),
        });

        const STUFFED_FROG_PROD_CART_PRICE =
            (
                await STUFFED_FROG_PROD_IN_CART.evaluate(
                    (tr) => tr.children[1].textContent
                )
            )?.replace("$", "") || "0";

        const STUFFED_FROG_PROD_CART_QUANTITY =
            await STUFFED_FROG_PROD_IN_CART.getByRole(
                "spinbutton"
            ).inputValue();

        const STUFFED_FROG_PROD_CART_SUBTOTAL =
            (
                await STUFFED_FROG_PROD_IN_CART.evaluate(
                    (tr) => tr.children[3].textContent
                )
            )?.replace("$", "") || "0";

        const FLUFFY_BUNNY_PROD_IN_CART = page.getByRole("row").filter({
            has: page.getByRole("cell").filter({ hasText: "Fluffy Bunny" }),
        });

        const FLUFFY_BUNNY_PROD_CART_PRICE =
            (
                await FLUFFY_BUNNY_PROD_IN_CART.evaluate(
                    (tr) => tr.children[1].textContent
                )
            )?.replace("$", "") || "0";

        const FLUFFY_BUNNY_PROD_CART_QUANTITY =
            await FLUFFY_BUNNY_PROD_IN_CART.getByRole(
                "spinbutton"
            ).inputValue();

        const FLUFFY_BUNNY_PROD_CART_SUBTOTAL =
            (
                await FLUFFY_BUNNY_PROD_IN_CART.evaluate(
                    (tr) => tr.children[3].textContent
                )
            )?.replace("$", "") || "0";

        const VALENTINE_BEAR_PROD_IN_CART = page.getByRole("row").filter({
            has: page.getByRole("cell").filter({ hasText: "Valentine Bear" }),
        });

        const VALENTINE_BEAR_PROD_CART_PRICE =
            (
                await VALENTINE_BEAR_PROD_IN_CART.evaluate(
                    (tr) => tr.children[1].textContent
                )
            )?.replace("$", "") || "0";

        const VALENTINE_BEAR_PROD_CART_QUANTITY =
            await VALENTINE_BEAR_PROD_IN_CART.getByRole(
                "spinbutton"
            ).inputValue();

        const VALENTINE_BEAR_PROD_CART_SUBTOTAL =
            (
                await VALENTINE_BEAR_PROD_IN_CART.evaluate(
                    (tr) => tr.children[3].textContent
                )
            )?.replace("$", "") || "0";

        await test.step("The subtotal for each product is correct", async () => {
            expect.soft(
                    parseFloat(STUFFED_FROG_PROD_CART_SUBTOTAL),
                    "The Stuffed Frog's subtotal equals the product of its price and quantity"
                ).toEqual(
                    parseFloat(STUFFED_FROG_PROD_CART_PRICE) *
                        parseFloat(STUFFED_FROG_PROD_CART_QUANTITY)
                );

            expect(
                parseFloat(FLUFFY_BUNNY_PROD_CART_SUBTOTAL),
                "The Fluffy Bunny's subtotal equals the product of its price and quantity"
            ).toEqual(
                parseFloat(FLUFFY_BUNNY_PROD_CART_PRICE) *
                    parseFloat(FLUFFY_BUNNY_PROD_CART_QUANTITY)
            );

            expect(
                parseFloat(VALENTINE_BEAR_PROD_CART_SUBTOTAL),
                "The Valentine Bear's subtotal equals the product of its price and quantity"
            ).toEqual(
                parseFloat(VALENTINE_BEAR_PROD_CART_PRICE) *
                    parseFloat(VALENTINE_BEAR_PROD_CART_QUANTITY)
            );
        });

        await test.step("The price for each product is correct", async () => {
            expect(
                STUFFED_FROG_PROD_CART_PRICE,
                "The price of the Stuffed Frog in the cart equals that on the 'Shop' page"
            ).toEqual(STUFFED_FROG_PROD_PRICE);

            expect(
                FLUFFY_BUNNY_PROD_CART_PRICE,
                "The price of the Fluffy Bunny in the cart equals that on the 'Shop' page"
            ).toEqual(FLUFFY_BUNNY_PROD_PRICE);

            expect(
                VALENTINE_BEAR_PROD_CART_PRICE,
                "The price of the Valentine Bear in the cart equals that on the 'Shop' page"
            ).toEqual(VALENTINE_BEAR_PROD_PRICE);
        });

        await expect(
            page.locator(".total"),
            "The total equals the sum of all subtotals"
        ).toContainText(
            (
                parseFloat(STUFFED_FROG_PROD_CART_SUBTOTAL) +
                parseFloat(FLUFFY_BUNNY_PROD_CART_SUBTOTAL) +
                parseFloat(VALENTINE_BEAR_PROD_CART_SUBTOTAL)
            ).toString()
        );
    });
});
