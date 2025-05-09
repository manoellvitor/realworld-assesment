import { ArticleData, UserCredentials } from '../support/types';

import { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

export class Api {
  private request: APIRequestContext;
  private API_URL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.API_URL = process.env['API_URL'] || '';
  }

  async getToken(userCredentials: UserCredentials): Promise<string> {
    try {
      const response = await this.request.post(
        `${this.API_URL}/api/users/login`,
        {
          data: {
            user: userCredentials,
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const { user } = await response.json();
      return `Token ${user.token}`;
    } catch (error) {
      throw new Error(
        `Oops, something went wrong could not get token - ${error}`
      );
    }
  }

  async createNewArticle(
    userCredentials: UserCredentials,
    articleData: ArticleData
  ) {
    try {
      const response = await this.request.post(`${this.API_URL}/api/articles`, {
        headers: {
          Authorization: await this.getToken(userCredentials),
        },
        data: {
          article: articleData,
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);
    } catch (error) {
      throw new Error(
        `Oops, something went wrong could not create a new article - ${error}`
      );
    }
  }
}
