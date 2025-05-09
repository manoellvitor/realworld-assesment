import { Locator, Page, expect } from '@playwright/test';

import { UserCredentials } from '../types';

export class FeedPage {
  private readonly heroHeader: (heading: string) => Locator;
  private readonly itemList: (itemName: string) => Locator;
  private readonly articlePreview: (text: string) => Locator;

  constructor(public readonly page: Page) {
    this.heroHeader = (heading: string) =>
      this.page.getByRole('heading', { name: heading });

    this.itemList = (itemName: string) =>
      this.page
        .getByRole('list')
        .getByRole('listitem')
        .filter({ hasText: itemName });

    this.articlePreview = (text: string) =>
      this.page.locator('.article-preview').filter({ hasText: text });
  }

  async validateSignIn() {
    await this.page.waitForURL(/.*#/);
    await expect(this.page).toHaveURL(/.*#/);
    await expect(this.heroHeader('conduit')).toBeVisible();
    await expect(this.itemList('My Feed')).toBeVisible();
  }

  async followUser(userData: UserCredentials) {
    await this.articlePreview(userData.username || '')
      .first()
      .click();

    await this.page
      .getByRole('button', { name: `Follow ${userData.username}` })
      .first()
      .click();
  }
}
