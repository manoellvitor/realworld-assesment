import { ArticleData, UserCredentials } from './support/types';

import DataContext from './util/data-context';
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

test.describe('Comments', () => {
  test.beforeAll(async ({ request }) => {
    const articleData: ArticleData = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      body: faker.lorem.paragraph(20),
      tagList: [faker.lorem.word(3)],
    };

    await request.api.createNewArticle(USER_A, articleData);
    DataContext.values.setValue('articleData', articleData, true);
  });

  test('Add a comment / Delete the comment', async ({ page }) => {
    /**
     * As a user, I want to be able to add a comment to an article so it can be seen by others.
     * And I want to be able to delete the comment if I don't want it to be seen anymore.
     */
    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(USER_A);

    await page.feedPage.validateSignIn();

    await page.myProfile.navigateToMyProfilePage(USER_A);
    await page.myProfile.validateProfilePage(USER_A);

    await page.article.gotoExistingArticle();

    await page.article.addComment();
    await page.article.validateCommentIsPosted();

    await page.article.deleteComment();
    await page.article.validateCommentIsDeleted();
  });
});
