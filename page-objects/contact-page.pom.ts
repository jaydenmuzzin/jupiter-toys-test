import {type Locator, type Page } from "@playwright/test";

export class ContactPage {
    readonly page: Page;
    readonly name: string;
    readonly slug: string;

    readonly formInfo: Locator;
    readonly formInfoError: Locator;
    readonly forenameField: Locator;
    readonly surnameField: Locator;
    readonly emailField: Locator;
    readonly telephoneField: Locator;
    readonly messageField: Locator;
    readonly forenameRequired: Locator;
    readonly emailRequired: Locator;
    readonly messageRequired: Locator;
    readonly submitFormBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.name = "Contact";
        this.slug = "contact";
        this.formInfo = page.getByText(
            "We welcome your feedback - tell it how it is."
        );
        this.formInfoError = page.getByText(
            "We welcome your feedback - but we won't get it unless you complete the form correctly."
        );
        this.forenameField = page.getByRole("textbox", { name: "Forename *" });
        this.surnameField = page.getByRole("textbox", { name: "Surname" });
        this.emailField = page.getByRole("textbox", { name: "Email *" });
        this.telephoneField = page.getByRole("textbox", { name: "Telephone" });
        this.messageField = page.getByRole("textbox", { name: "Message *" });
        this.forenameRequired = page.getByText("Forename is required");
        this.emailRequired = page.getByText("Email is required");
        this.messageRequired = page.getByText("Message is required");
        this.submitFormBtn = page.getByRole("link", { name: "Submit" });
    }

    async enterForename(forename: string) {
        await this.forenameField.fill(forename);
    }

    async enterSurname(surname: string) {
        await this.surnameField.fill(surname);
    }

    async enterEmail(emailAddress: string) {
        await this.emailField.fill(emailAddress);
    }

    async enterTelephone(telephone: string) {
        await this.telephoneField.fill(telephone);
    }

    async enterMessage(message: string) {
        await this.messageField.fill(message);
    }

    async submitForm() {
        await this.submitFormBtn.click();
    }

    async form() {
        return this.page.locator('form[name="form"]');
    }

    async sendingFeedbackHeading() {
        return this.page.getByRole("heading", {
            name: "Sending Feedback",
        });
    }

    async formInfoSuccessMessage(forename: string) {
        return this.page.getByText(
            `Thanks ${forename}, we appreciate your feedback.`
        );
    }
}
