import { Page, test as base, expect } from '@playwright/test';

import { ArticleEditorPage } from '../pages/article-editor-page';
import { FeedPage } from '../pages/feed-page';
import { MyProfilePage } from '../pages/my-profile-page';
import { PageFixtures } from '../types';
import { SignInPage } from '../pages/signin-page';
import { SignUpPage } from '../pages/signup-page';

const test = base.extend<PageFixtures>({
  page: async ({ page }, use) => {
    const context = page as Page & PageFixtures;

    context.signUp = new SignUpPage(page);
    context.signIn = new SignInPage(page);
    context.feedPage = new FeedPage(page);
    context.articleEditor = new ArticleEditorPage(page);
    context.myProfile = new MyProfilePage(page);

    await use(context);
  },
});

export { test, expect };
