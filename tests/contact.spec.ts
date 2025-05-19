import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("Form behaviour", () => {
        test("should handle mandatory field errors", async ({ page }) => {
            const HEADER_MSG = "We welcome your feedback - tell it how it is.";
            const ERROR_HEADER_MSG =
                "We welcome your feedback - but we won't get it unless you complete the form correctly.";
            const FORENAME_REQ_ERROR_MSG = "Forename is required";
            const EMAIL_REQ_ERROR_MSG = "Email is required";
            const MESSAGE_REQ_ERROR_MSG = "Message is required";

            await test.step("Navigate to 'Contact' page", async () => {
                await page.getByRole("link", { name: "Contact" }).click();
                await page.waitForURL("**/contact");
                await expect(
                    page.getByRole("listitem").filter({ hasText: "Contact" })
                ).toHaveClass("active");
            });

            await test.step("Header message updated to indicate errors upon submitting an invalid form", async () => {
                await page.getByRole("link", { name: "Submit" }).click();
                await expect(page.getByText(HEADER_MSG)).toBeHidden();
                await expect(page.getByText(ERROR_HEADER_MSG)).toBeVisible();
            });

            await test.step("Error message for each unpopulated mandatory field displays upon submitting form", async () => {
                await expect(
                    page.getByText(FORENAME_REQ_ERROR_MSG),
                    `'${FORENAME_REQ_ERROR_MSG}' is present`
                ).toBeVisible();
                await expect(
                    page.getByText(EMAIL_REQ_ERROR_MSG),
                    `'${EMAIL_REQ_ERROR_MSG}' is present`
                ).toBeVisible();
                await expect(
                    page.getByText(MESSAGE_REQ_ERROR_MSG),
                    `'${MESSAGE_REQ_ERROR_MSG}' is present`
                ).toBeVisible();
            });

            await test.step("Correctly addressing error of a mandatory field removes its message", async () => {
                await page
                    .getByRole("textbox", { name: "Forename *" })
                    .fill("Jane");
                await expect(
                    page.getByText(FORENAME_REQ_ERROR_MSG),
                    `'${FORENAME_REQ_ERROR_MSG}' is absent after populating field with valid data`
                ).toBeHidden();

                await page
                    .getByRole("textbox", { name: "Email *" })
                    .fill("jane.doe@example.com");
                await expect(
                    page.getByText(EMAIL_REQ_ERROR_MSG),
                    `'${EMAIL_REQ_ERROR_MSG}' is absent after populating field with valid data`
                ).toBeHidden();

                await page
                    .getByRole("textbox", { name: "Message *" })
                    .fill("A toy I ordered has not arrived");
                await expect(
                    page.getByText(MESSAGE_REQ_ERROR_MSG),
                    `'${MESSAGE_REQ_ERROR_MSG}' is absent after populating field with valid data`
                ).toBeHidden();
            });

            await test.step("Header message returns to normal upon all errors having been correctly addressed", async () => {
                await expect(page.getByText(HEADER_MSG)).toBeVisible();
                await expect(page.getByText(ERROR_HEADER_MSG)).toBeHidden();
            });
        });
    });
});
