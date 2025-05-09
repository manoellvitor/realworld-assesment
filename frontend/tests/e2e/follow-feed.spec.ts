import { ArticleData, UserCredentials } from './support/types';

import { faker } from '@faker-js/faker';
import { test } from './support/fixtures';

if (
  !process.env['USER_EMAIL_2'] ||
  !process.env['USER_PASSWORD_2'] ||
  !process.env['USER_EMAIL_1'] ||
  !process.env['USER_PASSWORD_1']
) {
  throw new Error(
    'User credentials are not set in the environment variables, they must be set on the .env file'
  );
}

const USER_A: UserCredentials = {
  username: process.env['USER_USERNAME_1'],
  email: process.env['USER_EMAIL_1'],
  password: process.env['USER_PASSWORD_1'],
};
const USER_B: UserCredentials = {
  username: process.env['USER_USERNAME_2'],
  email: process.env['USER_EMAIL_2'],
  password: process.env['USER_PASSWORD_2'],
};

test.describe('Follow Feed', () => {
  test.beforeAll(async ({ request }) => {
    const articleData: ArticleData = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      body: faker.lorem.paragraph(20),
      tagList: [faker.lorem.word(3)],
    };

    await request.api.createNewArticle(USER_B, articleData);
  });
  test('User A follows User B', async ({ page }) => {
    /**
     * As a logged-in user, I want to be able to follow another user so that I can see their articles in my feed.
     */

    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(USER_A);

    await page.feedPage.validateSignIn();
    await page.feedPage.followUser(USER_B);
  });

  test('User B publishes a new article', async ({ page }) => {
    /**
     * As a logged-in user, I want to be able to publish an article so that my followers can see it in their feed.
     */

    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(USER_B);

    await page.feedPage.validateSignIn();

    await page.articleEditor.navigateToNewArticlePage();
    await page.articleEditor.validateNewArticlePage();
    await page.articleEditor.createNewArticle();

    await page.myProfile.navigateToMyProfilePage(USER_B);
    await page.myProfile.validateProfilePage(USER_B);
    await page.myProfile.validatePublishedArticle();
  });

  test(`Article shows up in User A's My Feed`, async ({ page }) => {
    /**
     * As a logged-in user, I want to be able to see articles from users I follow in my feed.
     */
    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(USER_A);

    await page.feedPage.validateSignIn();
    await page.feedPage.validateArticleInMyFeed(USER_B);
  });
});
