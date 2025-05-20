import { test, expect } from "@playwright/test";
import CONTACT_FORM_DATA from "../data/contact-form.json";

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

        // Fulfilling Test Case condition: "Note: Run this test 5 times to ensure 100% pass rate"
        const REPEAT_TEST = 5;

        for (let i = 0; i < REPEAT_TEST; i++) {
            let cfd = CONTACT_FORM_DATA[i];

            test(`should successfully submit having populated mandatory fields with valid data: attempt #${
                i + 1
            }`, async ({ page }) => {
                await test.step("Navigate to 'Contact' page", async () => {
                    await page.getByRole("link", { name: "Contact" }).click();
                    await page.waitForURL("**/contact");
                    await expect(
                        page
                            .getByRole("listitem")
                            .filter({ hasText: "Contact" })
                    ).toHaveClass("active");
                });

                await test.step(`${cfd.forename} ${cfd.surname}'s contact form submits without error`, async () => {
                    await test.step("Form can be populated", async () => {
                        await page
                            .getByRole("textbox", { name: "Forename *" })
                            .fill(cfd.forename);
                        await page
                            .getByRole("textbox", { name: "Surname" })
                            .fill(cfd.surname);
                        await page
                            .getByRole("textbox", { name: "Email *" })
                            .fill(cfd.email);
                        await page
                            .getByRole("textbox", { name: "Telephone" })
                            .fill(cfd.telephone);
                        await page
                            .getByRole("textbox", { name: "Message *" })
                            .fill(cfd.message);
                    });

                    await test.step("Form can be submitted", async () => {
                        await page
                            .getByRole("link", { name: "Submit" })
                            .click();
                    });

                    await expect(
                        page.getByRole("heading", {
                            name: "Sending Feedback",
                        }),
                        "'Sending Feedback' dialog is displayed while processing request"
                    ).toBeVisible();

                    // Time to complete form submission request varies, after which the form is no longer displayed.
                    // Requests consistently complete within 20 seconds, which is deemed acceptable
                    await expect(
                        page.locator('form[name="form"]'),
                        "Contact form is absent upon completion of form submission"
                    ).toBeHidden({
                        timeout: 20000,
                    });
                });

                await expect(
                    page.getByText(
                        `Thanks ${cfd.forename}, we appreciate your feedback.`
                    ),
                    "Successful submission message is present upon completion of form submission"
                ).toBeVisible();
            });
        }
    });
});
