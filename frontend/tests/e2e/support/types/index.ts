import { APIRequestContext, Page } from '@playwright/test';

import { Api } from '../../util/api';
import { ArticleEditorPage } from '../pages/article-editor-page';
import { FeedPage } from '../pages/feed-page';
import { MyProfilePage } from '../pages/my-profile-page';
import { SignInPage } from '../pages/signin-page';
import { SignUpPage } from '../pages/signup-page';

export type User = {
  username: string;
  email: string;
  password: string;
};

export type PageFixtures = {
  page: Page & PageFixtures;
  request: APIRequestContext & RequestFixtures;
  signUp: SignUpPage;
  signIn: SignInPage;
  feedPage: FeedPage;
  articleEditor: ArticleEditorPage;
  myProfile: MyProfilePage;
};

export type UserCredentials = {
  username?: string;
  email: string;
  password: string;
};

export type ArticleData = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export type RequestFixtures = {
  api: Api;
};
