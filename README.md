# Playwright Assignment

This project is an end-to-end testing suite using Playwright. It includes tests for various scenarios of the RealWorld Application (conduit).

## Project Structure

### Key Files and Directories

- **.env**: Environment variables file.
- **.env.SAMPLE**: Sample environment variables file.
- **.github/workflows/ci.yml**: GitHub Actions workflow for running Playwright tests.
- **docker-compose**: Docker configuration for setting up the Test environment.
- **package.json**: Project dependencies and scripts.
- **playwright.config.ts**: Playwright configuration file.
- **tests/**: Directory containing test specifications and support files.

## Setup 🛠️

### Prerequisites 📋

- Node.js (LTS version recommended).
- Docker (for containerized execution) ⚠️ Docker must be installed in order to run the frontend / backend Containers (apps).

## Setting Up the Test Environment

1. Clone the repository:

```sh
git clone https://github.com/manoellvitor/realworld-assesment.git
```

2. Go into the correct folder:

```sh
cd realworld-assesment
```

3. Run the docker command to bring the application into live (frontend / backend)

```sh
docker compose up -d
```

4. Go into the frontend folder to setup the tests:

```sh
cd realworld-assesment/frontend
```

5. Install dependencies:

```sh
npm install
```

6. Install Playwright Browser Dependencies:

```sh
npx playwright install
```

**The test suite can be configured using environment variables on a `.env` file:**

7. Copy the sample environment file and configure it:

```bash
cp .env.SAMPLE .env
```

```env
# .env File Example

// URLs for the frontend and API
BASE_URL =
API_URL =

// Users Data (add any unique values you like in here just make sure to use an email in the correct format email@test.com)
USER_USERNAME_1 =
USER_EMAIL_1 =
USER_PASSWORD_1 =

USER_USERNAME_2 =
USER_EMAIL_2 =
USER_PASSWORD_2 =
```

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

## Test Structure

The test suite is organized as follows:

```
tests/
└── e2e/
    ├── home-page.spec.ts        # Home page tests
    ├── write-article.spec.ts    # Article creation tests
    ├── edit-delete.spec.ts      # Article editing and deletion
    ├── comments.spec.ts         # Comment functionality
    ├── favourite-toggle.spec.ts # Article favoriting
    ├── follow-feed.spec.ts      # User following and feed
    ├── support/                 # Support files [fixtures, pages, types]
    └── util/                    # Test utilities
```

## Test Reports

After running the tests, you can find:

- HTML report: `playwright-report/`
- Test results: `test-results/`

To view the HTML report:

```bash
npx playwright show-report
```

## Common Issues and Solutions

1. If tests fail to connect:

   - Ensure the application is running at the configured BASE_URL
   - Check if the API_URL is accessible
   - Verify network connectivity
   - Make sure the .env file is at the frontend folder and have the correct values

2. If browser tests fail:

   - Run `npx playwright install` to ensure browsers are installed
   - Use `--debug` flag to see what's happening in the browser
   - Check browser console for errors

3. For timeout issues:
   - Increase timeouts in playwright.config.ts
   - Check if the application is responding slowly
   - Verify system resources
