import { UserCredentials } from './support/types';
import { test } from './support/fixtures/';

test.describe('Sign-up & Login', () => {
  test('Register a new user', async ({ page }) => {
    /**
     * As a new user, I want to be able to sign up for an account so that I can access the application.
     *
     */
    await page.signUp.navigateToSignUpPage();
    await page.signUp.performSignUp();
    await page.signUp.validateSignUp();
  });

  test('Log in successfully', async ({ page }) => {
    /**
     * As an existing user, I want to be able to log in to my account so that I can access my personalized content.
     *
     */
    if (!process.env['USER_EMAIL_1'] || !process.env['USER_PASSWORD_1']) {
      throw new Error(
        'User credentials are not set in the environment variables, they must be set on the .env file'
      );
    }
    const userCredentials: UserCredentials = {
      email: process.env['USER_EMAIL_1'],
      password: process.env['USER_PASSWORD_1'],
    };
    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(userCredentials);
    await page.feedPage.validateSignIn();
  });

  test('Attempt login with a wrong password', async ({ page }) => {
    /**
     * As a user, I want to get an HTTP 422 / error message when attempt to Sign in with invalid password.
     *
     */
    if (!process.env['USER_EMAIL_1']) {
      throw new Error(
        'User credentials are not set in the environment variables, they must be set on the .env file'
      );
    }
    const invalidUserCredentials: UserCredentials = {
      email: process.env['USER_EMAIL_1'],
      password: 'wrongpassword',
    };
    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignInWithWrongPassword(invalidUserCredentials);
    await page.signIn.validateSignInWithWrongPassword();
  });
});
