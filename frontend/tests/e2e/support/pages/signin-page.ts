import { Locator, Page, expect } from '@playwright/test';

import { UserCredentials } from '../types';

export class SignInPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInLink: Locator;
  private readonly signInButton: Locator;

  constructor(public readonly page: Page) {
    this.emailInput = this.page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.signInLink = this.page.getByRole('link', { name: 'Sign in' });
    this.signInButton = this.page.getByRole('button', { name: 'Sign in' });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async navigateToSignInPage() {
    await this.page.goto('/');
    await this.signInLink.click();
    await expect(this.page).toHaveURL(/.*login/);
    await expect(
      this.page.getByRole('heading', { name: 'Sign in' })
    ).toBeVisible();
  }

  async performSignIn(userCredentials: UserCredentials) {
    if (!userCredentials) {
      throw new Error(
        'User credentials must be provided for sign in. Please check your test setup.'
      );
    }

    await this.emailInput.fill(userCredentials.email);
    await this.passwordInput.fill(userCredentials.password);
    await this.signInButton.click();
  }

  async performSignInWithWrongPassword(
    invalidUserCredentials: UserCredentials
  ) {
    if (!invalidUserCredentials) {
      throw new Error(
        'User credentials must be provided for sign in. Please check your test setup.'
      );
    }

    await this.emailInput.fill(invalidUserCredentials.email);
    await this.passwordInput.fill(invalidUserCredentials.password);
    await this.signInButton.click();
  }

  async validateSignInWithWrongPassword() {
    await expect(
      this.page.getByText('Invalid email or password')
    ).toBeVisible();

    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/users/login') && resp.status() === 422
      ),

      await this.page.getByRole('button', { name: 'Sign in' }).click(),
    ]);

    expect(response.status()).toBe(422);
    await expect(
      this.page.getByText(/Invalid email or password/i)
    ).toBeVisible();
  }
}
