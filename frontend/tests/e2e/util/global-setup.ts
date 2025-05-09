import { cleanDatabase, createUser } from './db';

import { UserCredentials } from '../support/types';
import { test as setup } from '@playwright/test';

setup('get database into a clean stage', async () => {
  console.log('Running global setup...');
  // Clean the database first
  await cleanDatabase();

  const user1: UserCredentials = {
    username: process.env['USER_USERNAME_1'] ?? '',
    email: process.env['USER_EMAIL_1'] ?? '',
    password: process.env['USER_PASSWORD_1'] ?? '',
  };

  const user2: UserCredentials = {
    username: process.env['USER_USERNAME_2'] ?? '',
    email: process.env['USER_EMAIL_2'] ?? '',
    password: process.env['USER_PASSWORD_2'] ?? '',
  };

  // Create users
  await createUser(user1);
  await createUser(user2);
});
