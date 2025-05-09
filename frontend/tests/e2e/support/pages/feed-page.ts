import { Locator, Page, expect } from '@playwright/test';

import DataContext from '../../util/data-context';
import { UserCredentials } from '../types';

const ANIMATION_DELAY = 500;

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

  async validateArticleInMyFeed(userData: UserCredentials) {
    await this.itemList('My Feed').filter({ hasText: 'My Feed' }).click();

    await expect(
      this.articlePreview(userData.username || '').first()
    ).toBeVisible();
  }

  async favouriteArticle() {
    const { title } = DataContext.values.getValue('articleData');
    await this.articlePreview(title).first().getByRole('button').click();
    await this.page.waitForTimeout(ANIMATION_DELAY);
  }

  async validateArticleIsFavourited() {
    const { title } = DataContext.values.getValue('articleData');
    const currentCount = await this.articlePreview(title)
      .first()
      .getByRole('button')
      .textContent();
    expect(Number(currentCount)).toBe(1);
  }

  async unfavouriteArticle() {
    const { title } = DataContext.values.getValue('articleData');
    await this.articlePreview(title).first().getByRole('button').click();
    await this.page.waitForTimeout(ANIMATION_DELAY);
  }

  async validateArticleIsUnfavourited() {
    const { title } = DataContext.values.getValue('articleData');
    const currentCount = await this.articlePreview(title)
      .first()
      .getByRole('button')
      .textContent();
    expect(Number(currentCount)).toBe(0);
  }
}
