import { Locator, Page, expect } from '@playwright/test';

import { ArticleData } from '../types';
import DataContext from '../../util/data-context';
import { faker } from '@faker-js/faker';

export class ArticleEditorPage {
  private readonly articleTitleInput: Locator;
  private readonly articleDescriptionInput: Locator;
  private readonly articleBodyInput: Locator;
  private readonly articleTagInput: Locator;
  private readonly newArticleLink: Locator;
  private readonly publishArticleButton: Locator;

  constructor(public readonly page: Page) {
    this.articleTitleInput = this.page.getByRole('textbox', {
      name: 'Article Title',
    });
    this.articleDescriptionInput = this.page.getByRole('textbox', {
      name: `What's this article about?`,
    });
    this.articleBodyInput = this.page.getByRole('textbox', {
      name: `Write your article (in markdown)`,
    });
    this.articleTagInput = this.page.getByRole('textbox', {
      name: 'Enter tags',
    });
    this.newArticleLink = this.page.getByRole('link', { name: 'New Article' });
    this.publishArticleButton = this.page.getByRole('button', {
      name: 'Publish Article',
    });
  }

  async navigateToNewArticlePage() {
    await this.newArticleLink.click();
  }

  async validateNewArticlePage() {
    await expect(this.page).toHaveURL(/.*editor/);
    await expect(
      this.page.getByRole('heading', { name: 'Article editor' })
    ).toBeVisible();
  }

  async fillNewArticleForm(articleData: ArticleData) {
    await this.articleTitleInput.fill(articleData.title);
    await this.articleDescriptionInput.fill(articleData.description);
    await this.articleBodyInput.fill(articleData.body);
    for (const tag of articleData.tagList) {
      await this.articleTagInput.fill(tag);
      await this.page.keyboard.press('Enter');
    }
  }

  async createNewArticle() {
    const articleData: ArticleData = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      body: faker.lorem.paragraph(20),
      tagList: [faker.lorem.word(3)],
    };
    await this.fillNewArticleForm(articleData);
    await this.publishArticleButton.click();
    await expect(this.page.getByText('Published successfully!')).toBeVisible();

    // Save the article data to context for later use
    DataContext.values.setValue('articleData', articleData, true);
  }
}
