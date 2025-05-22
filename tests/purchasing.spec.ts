import { test, expect, type Locator } from "@playwright/test";
import { ShopPage } from "../page-objects/shop-page.pom";
import { CartPage } from "../page-objects/cart-page.pom";
import { navigateTo } from "../utils/common";

test.describe(
    "Purchasing",
    {
        tag: "@shop",
    },
    () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/#/shop");
        });

        test(
            "Test Case 3: should have correct prices and calculations in cart",
            {
                tag: "@cart",
            }, 
            async ({ page }) => {
                const SHOP_PAGE = new ShopPage(page);
                const CART_PAGE = new CartPage(page);

                const STUFFED_FROG_PROD: Locator = await SHOP_PAGE.product("Stuffed Frog");
                const STUFFED_FROG_PROD_PRICE: string = await SHOP_PAGE.productDecimalPrice(STUFFED_FROG_PROD);

                await SHOP_PAGE.buy(STUFFED_FROG_PROD);
                await SHOP_PAGE.buy(STUFFED_FROG_PROD);

                const FLUFFY_BUNNY_PROD: Locator = await SHOP_PAGE.product("Fluffy Bunny");
                const FLUFFY_BUNNY_PROD_PRICE: string = await SHOP_PAGE.productDecimalPrice(FLUFFY_BUNNY_PROD);

                await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
                await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
                await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
                await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);
                await SHOP_PAGE.buy(FLUFFY_BUNNY_PROD);

                const VALENTINE_BEAR_PROD: Locator = await SHOP_PAGE.product("Valentine Bear");
                const VALENTINE_BEAR_PROD_PRICE: string = await SHOP_PAGE.productDecimalPrice(VALENTINE_BEAR_PROD);

                await SHOP_PAGE.buy(VALENTINE_BEAR_PROD);
                await SHOP_PAGE.buy(VALENTINE_BEAR_PROD);
                await SHOP_PAGE.buy(VALENTINE_BEAR_PROD);

                await test.step("Navigate to 'Cart' page", async () => {
                    await navigateTo(page, CART_PAGE);
                });

                const STUFFED_FROG_PROD_IN_CART: Locator = await CART_PAGE.product("Stuffed Frog");
                const STUFFED_FROG_PROD_CART_PRICE: string = await CART_PAGE.productDecimalPrice(STUFFED_FROG_PROD_IN_CART);
                const STUFFED_FROG_PROD_CART_QUANTITY: string = await CART_PAGE.productQuantity(STUFFED_FROG_PROD_IN_CART);
                const STUFFED_FROG_PROD_CART_SUBTOTAL: string = await CART_PAGE.productDecimalSubtotal(STUFFED_FROG_PROD_IN_CART);

                const FLUFFY_BUNNY_PROD_IN_CART: Locator = await CART_PAGE.product("Fluffy Bunny");
                const FLUFFY_BUNNY_PROD_CART_PRICE: string = await CART_PAGE.productDecimalPrice(FLUFFY_BUNNY_PROD_IN_CART);
                const FLUFFY_BUNNY_PROD_CART_QUANTITY: string = await CART_PAGE.productQuantity(FLUFFY_BUNNY_PROD_IN_CART);
                const FLUFFY_BUNNY_PROD_CART_SUBTOTAL: string = await CART_PAGE.productDecimalSubtotal(FLUFFY_BUNNY_PROD_IN_CART);

                const VALENTINE_BEAR_PROD_IN_CART: Locator = await CART_PAGE.product("Valentine Bear");
                const VALENTINE_BEAR_PROD_CART_PRICE: string = await CART_PAGE.productDecimalPrice(VALENTINE_BEAR_PROD_IN_CART);
                const VALENTINE_BEAR_PROD_CART_QUANTITY: string = await CART_PAGE.productQuantity(VALENTINE_BEAR_PROD_IN_CART);
                const VALENTINE_BEAR_PROD_CART_SUBTOTAL: string = await CART_PAGE.productDecimalSubtotal(VALENTINE_BEAR_PROD_IN_CART);

                await test.step("The subtotal for each product is correct", async () => {
                    expect.soft(
                            parseFloat(STUFFED_FROG_PROD_CART_SUBTOTAL),
                            "The Stuffed Frog's subtotal equals the product of its price and quantity"
                        ).toEqual(
                            parseFloat(STUFFED_FROG_PROD_CART_PRICE) *
                                parseFloat(STUFFED_FROG_PROD_CART_QUANTITY)
                        );

                    expect.soft(
                        parseFloat(FLUFFY_BUNNY_PROD_CART_SUBTOTAL),
                        "The Fluffy Bunny's subtotal equals the product of its price and quantity"
                    ).toEqual(
                        parseFloat(FLUFFY_BUNNY_PROD_CART_PRICE) *
                            parseFloat(FLUFFY_BUNNY_PROD_CART_QUANTITY)
                    );

                    expect.soft(
                        parseFloat(VALENTINE_BEAR_PROD_CART_SUBTOTAL),
                        "The Valentine Bear's subtotal equals the product of its price and quantity"
                    ).toEqual(
                        parseFloat(VALENTINE_BEAR_PROD_CART_PRICE) *
                            parseFloat(VALENTINE_BEAR_PROD_CART_QUANTITY)
                    );
                });

                await test.step("The price for each product is correct", async () => {
                    expect.soft(
                        STUFFED_FROG_PROD_CART_PRICE,
                        "The price of the Stuffed Frog in the cart equals that on the 'Shop' page"
                    ).toEqual(STUFFED_FROG_PROD_PRICE);

                    expect.soft(
                        FLUFFY_BUNNY_PROD_CART_PRICE,
                        "The price of the Fluffy Bunny in the cart equals that on the 'Shop' page"
                    ).toEqual(FLUFFY_BUNNY_PROD_PRICE);

                    expect.soft(
                        VALENTINE_BEAR_PROD_CART_PRICE,
                        "The price of the Valentine Bear in the cart equals that on the 'Shop' page"
                    ).toEqual(VALENTINE_BEAR_PROD_PRICE);
                });

                await expect.soft(
                    await CART_PAGE.totalPrice(),
                    "The total equals the sum of all subtotals"
                ).toContainText(
                    (
                        parseFloat(STUFFED_FROG_PROD_CART_SUBTOTAL) +
                        parseFloat(FLUFFY_BUNNY_PROD_CART_SUBTOTAL) +
                        parseFloat(VALENTINE_BEAR_PROD_CART_SUBTOTAL)
                    ).toString()
                );
            }
        );
    }
);
