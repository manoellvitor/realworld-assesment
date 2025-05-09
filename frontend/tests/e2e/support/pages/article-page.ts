import { Locator, Page, expect } from '@playwright/test';

import { ArticleData } from '../types';
import DataContext from '../../util/data-context';
import { faker } from '@faker-js/faker';

export class ArticlePage {
  private readonly articleBodyInput: Locator;
  private readonly articleTagInput: Locator;
  private readonly publishArticleButton: Locator;
  private readonly editArticleButton: Locator;
  private readonly deleteArticleButton: Locator;
  private readonly postCommentButton: Locator;
  private readonly commentBoxInput: Locator;
  private readonly deleteCommentButton: (comment: string) => Locator;
  private readonly cardComment: (comment: string) => Locator;

  constructor(public readonly page: Page) {
    this.articleBodyInput = this.page.getByRole('textbox', {
      name: `Write your article (in markdown)`,
    });
    this.articleTagInput = this.page.getByRole('textbox', {
      name: 'Enter tags',
    });
    this.publishArticleButton = this.page.getByRole('button', {
      name: 'Publish Article',
    });
    this.editArticleButton = this.page.getByRole('button', {
      name: 'Edit Article',
    });
    this.deleteArticleButton = this.page.getByRole('button', {
      name: 'Delete Article',
    });
    this.commentBoxInput = this.page.getByRole('textbox', {
      name: 'Write a comment...',
    });
    this.postCommentButton = this.page.getByRole('button', {
      name: 'Post Comment',
    });
    this.deleteCommentButton = (comment: string) =>
      this.page
        .locator('.card')
        .filter({ hasText: comment })
        .locator('.ion-trash-a');
    this.cardComment = (comment: string) =>
      this.page
        .locator('.card')
        .getByRole('paragraph')
        .filter({ hasText: comment });
  }

  async gotoExistingArticle() {
    const { title } = DataContext.values.getValue('articleData');
    await expect(this.page.getByText('Loading articles...')).toBeHidden();
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
    await this.page.getByRole('heading', { name: title }).click();
  }

  async validateExistingArticlePage() {
    const { title } = DataContext.values.getValue('articleData');
    const dashedTitle = title.replace(/\s+/g, '-').toLowerCase();
    await expect(this.page).toHaveURL(
      `/#/article/${dashedTitle.replace('.', '')}`
    );
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
  }

  async fillArticleForm(articleData: ArticleData) {
    await this.articleBodyInput.clear();
    await this.page.waitForTimeout(250);
    await this.articleBodyInput.fill(articleData.body);
    for (const tag of articleData.tagList) {
      await this.articleTagInput.fill(tag);
      await this.page.keyboard.press('Enter');
    }
  }

  async editExistingArticle() {
    const editedArticleData: ArticleData = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      body: faker.lorem.sentence(5),
      tagList: [faker.lorem.word(3), faker.lorem.word(4)],
    };
    await this.editArticleButton.first().click();
    await this.fillArticleForm(editedArticleData);
    await this.publishArticleButton.click();
    await expect(this.page.getByText('Published successfully!')).toBeVisible();

    // Save the article data to context for later use
    DataContext.values.setValue('editedArticleData', editedArticleData, true);
  }

  async validateEditedArticle() {
    const articleBody = await this.page
      .locator('.article-content')
      .textContent();

    expect(articleBody).toContain(
      DataContext.values.getValue('editedArticleData').body
    );
  }

  async deleteExistingArticle() {
    const articleToBeDeleted = await this.page
      .getByRole('heading')
      .first()
      .textContent();
    DataContext.values.setValue('articleToBeDeleted', articleToBeDeleted);
    await this.deleteArticleButton.first().click();
  }

  async addComment() {
    const comment = 'Test Comment...';
    await this.commentBoxInput.fill(comment);
    DataContext.values.setValue('comment', comment);
    await this.postCommentButton.click();
  }

  async validateCommentIsPosted() {
    const comment = DataContext.values.getValue('comment');
    await expect(this.cardComment(comment)).toBeVisible();
  }

  async deleteComment() {
    const comment = DataContext.values.getValue('comment');
    await this.deleteCommentButton(comment).click();
  }
  async validateCommentIsDeleted() {
    const comment = DataContext.values.getValue('comment');
    await expect(this.cardComment(comment)).not.toBeVisible();
  }
}
