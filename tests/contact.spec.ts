import { test, expect } from "@playwright/test";
import CONTACT_FORM_DATA from "../data/contact-form.json";
import { ContactPage } from "../page-objects/contact-page.pom";
import { navigateTo } from "../utils/common";

test.describe(
    "Contact page",
    {
        tag: "@contact",
    },
    () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
        });

        test.describe(
            "Form behaviour",
            {
                tag: "@form",
            },
            () => {
                test(
                    "Test Case 1: should handle mandatory field errors",
                    {
                        tag: "@validation",
                    },
                    async ({ page }) => {
                    const CONTACT_PAGE = new ContactPage(page);

                    await test.step("Navigate to 'Contact' page", async () => {
                        navigateTo(page, CONTACT_PAGE);
                    });

                    await test.step("Header message updated to indicate errors upon submitting an invalid form", async () => {
                        await CONTACT_PAGE.submitForm();
                        await expect(CONTACT_PAGE.formInfo).toBeHidden();
                        await expect(CONTACT_PAGE.formInfoError).toBeVisible();
                    });

                    await test.step("Error message for each unpopulated mandatory field displays upon submitting form", async () => {
                        await expect(
                            CONTACT_PAGE.forenameRequired,
                            "'Forename is required' is present"
                        ).toBeVisible();
                        await expect(
                            CONTACT_PAGE.emailRequired,
                            "'Email is required' is present"
                        ).toBeVisible();
                        await expect(
                            CONTACT_PAGE.messageRequired,
                            "'Message is required' is present"
                        ).toBeVisible();
                    });

                    await test.step("Correctly addressing error of a mandatory field removes its message", async () => {
                        CONTACT_PAGE.enterForename("Jane");
                        await expect(
                            CONTACT_PAGE.forenameRequired,
                            "'Forename is required' is absent after populating field with valid data"
                        ).toBeHidden();

                        CONTACT_PAGE.enterEmail("jane.doe@example.com");
                        await expect(
                            CONTACT_PAGE.emailRequired,
                            "'Email is required' is absent after populating field with valid data"
                        ).toBeHidden();

                        CONTACT_PAGE.enterMessage("A toy I ordered has not arrived");
                        await expect(
                            CONTACT_PAGE.messageRequired,
                            "'Message is required' is absent after populating field with valid data"
                        ).toBeHidden();
                    });

                    await test.step("Header message returns to normal upon all errors having been correctly addressed", async () => {
                        await expect(CONTACT_PAGE.formInfo).toBeVisible();
                        await expect(CONTACT_PAGE.formInfoError).toBeHidden();
                    });
                });

                // Fulfilling Test Case condition: "Note: Run this test 5 times to ensure 100% pass rate"
                const REPEAT_TEST: number = 5;

                for (let i = 0; i < REPEAT_TEST; i++) {
                    let cfd = CONTACT_FORM_DATA[i];

                    test(
                        `Test Case 2: should successfully submit having populated mandatory fields with valid data: attempt #${
                            i + 1
                        }`,
                        {
                            tag: "@e2e",
                        },
                        async ({ page }) => {
                            const CONTACT_PAGE = new ContactPage(page);

                            await test.step("Navigate to 'Contact' page", async () => {
                                navigateTo(page, CONTACT_PAGE);
                            });

                            await test.step(`${cfd.forename} ${cfd.surname}'s contact form submits without error`, async () => {
                                await test.step("Form can be populated", async () => {
                                    await CONTACT_PAGE.enterForename(cfd.forename);
                                    await CONTACT_PAGE.enterSurname(cfd.surname);
                                    await CONTACT_PAGE.enterEmail(cfd.email);
                                    await CONTACT_PAGE.enterTelephone(cfd.telephone);
                                    await CONTACT_PAGE.enterMessage(cfd.message);
                                });

                                await test.step("Form can be submitted", async () => {
                                    await CONTACT_PAGE.submitForm();
                                });

                                await expect(
                                    await CONTACT_PAGE.sendingFeedbackHeading(),
                                    "'Sending Feedback' dialog is displayed while processing request"
                                ).toBeVisible();

                                // Time to complete form submission request varies, after which the form is no longer displayed.
                                // Requests consistently complete within 20 seconds, which is deemed acceptable
                                await expect(
                                    await CONTACT_PAGE.form(),
                                    "Contact form is absent upon completion of form submission"
                                ).toBeHidden({
                                    timeout: 20000,
                                });
                            });

                            await expect(
                                await CONTACT_PAGE.formInfoSuccessMessage(cfd.forename),
                                "Successful submission message is present upon completion of form submission"
                            ).toBeVisible();
                        }
                    );
                }
            }
        );
    }
);
