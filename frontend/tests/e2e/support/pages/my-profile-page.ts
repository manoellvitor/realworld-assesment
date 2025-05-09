import { Locator, Page, expect } from '@playwright/test';

import DataContext from '../../util/data-context';
import { UserCredentials } from '../types';

export class MyProfilePage {
  private readonly myProfileLink: (linkName: string) => Locator;

  constructor(public readonly page: Page) {
    this.myProfileLink = (linkName: string) =>
      this.page.getByRole('link', { name: linkName });
  }

  async navigateToMyProfilePage(userData: UserCredentials) {
    if (!userData.username) {
      throw new Error('Username is not defined in userData');
    }
    await this.myProfileLink(userData.username).first().click();
  }

  async validateProfilePage(userData: UserCredentials) {
    await expect(this.page).toHaveURL(/.*my-profile/);
    await expect(
      this.page.getByRole('heading', { name: userData.username })
    ).toBeVisible();
  }

  async validatePublishedArticle() {
    await expect(this.page.getByText('Loading articles...')).toBeHidden();
    const { title } = DataContext.values.getValue('articleData');
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
  }

  async validateArticleDeletion() {
    await expect(this.page.getByText('Loading articles...')).toBeHidden();
    const title = DataContext.values.getValue('articleToBeDeleted');
    await expect(
      this.page.getByRole('heading', { name: title, exact: true })
    ).not.toBeVisible();
  }
}
