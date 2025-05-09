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

test.describe('Favourite Toggle', () => {
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

  test('Logged-in user favourites / unfavourites an article', async ({
    page,
  }) => {
    /**
     * As a user, I want to be able to favourite an article so I can read it later.
     * And I want to be able to unfavourite the article if I don't want it to be seen anymore.
     * Then Favourite counter updates accordingly.
     */
    await page.signIn.navigateToSignInPage();
    await page.signIn.performSignIn(USER_A);

    await page.feedPage.validateSignIn();
    await page.feedPage.favouriteArticle();
    await page.feedPage.validateArticleIsFavourited();
    await page.feedPage.unfavouriteArticle();
    await page.feedPage.validateArticleIsUnfavourited();
  });
});
