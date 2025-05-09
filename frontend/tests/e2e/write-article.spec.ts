import { UserCredentials } from './support/types';
import { test } from './support/fixtures';

test.describe('Write Article', () => {
  test('Logged-in user creates an article (title, body, tags) and Article appears in “My Articles” list', async ({
    page,
  }) => {
    /**
     * As a logged-in user, I want to be able to create an article with a title, body, and tags so that I can share my thoughts with the community.
     * And I want to see the article in my articles list after publishing it.     *
     */
    if (!process.env['USER_EMAIL_1'] || !process.env['USER_PASSWORD_1']) {
      throw new Error(
        'User credentials are not set in the environment variables, they must be set on the .env file'
      );
    }
    const userCredentials: UserCredentials = {
      username: process.env['USER_USERNAME_1'],
      email: process.env['USER_EMAIL_1'],
      password: process.env['USER_PASSWORD_1'],
    };

    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(userCredentials);
    await page.feedPage.validateSignIn();
    await page.articleEditor.navigateToNewArticlePage();
    await page.articleEditor.validateNewArticlePage();
    await page.articleEditor.createNewArticle();

    await page.myProfile.navigateToMyProfilePage(userCredentials);
    await page.myProfile.validateProfilePage(userCredentials);
    await page.myProfile.validatePublishedArticle();
  });
});
