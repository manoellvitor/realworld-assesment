import { Locator, Page, expect } from '@playwright/test';

import { User } from '../types';
import { faker } from '@faker-js/faker';

export class SignUpPage {
  private readonly usernameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signUpLink: Locator;
  private readonly signUpButton: Locator;

  constructor(public readonly page: Page) {
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    this.emailInput = this.page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.signUpLink = this.page.getByRole('link', { name: 'Sign up' });
    this.signUpButton = this.page.getByRole('button', { name: 'Sign up' });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async navigateToSignUpPage() {
    await this.goto('/');
    await this.signUpLink.click();
    await expect(this.page).toHaveURL(/.*register/);
    await expect(
      this.page.getByRole('heading', { name: 'Sign up' })
    ).toBeVisible();
  }

  async performSignUp() {
    const userData: User = {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.signUpButton.click();
  }

  async validateSignUp() {
    const signUpConfirmationMessage = this.page.getByText(
      'Registration successful. Redirecting to login page...'
    );
    await expect(signUpConfirmationMessage).toBeVisible();

    await this.page.waitForURL(/.*login/);
    await expect(this.page).toHaveURL(/.*login/);
    await expect(
      this.page.getByRole('heading', { name: 'Sign in' })
    ).toBeVisible();
    await expect(
      this.page.getByRole('link', { name: 'Need an account?' })
    ).toBeVisible();
  }
}
