import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  github: {
    token: process.env.GITHUB_TOKEN,
    username: process.env.GITHUB_USERNAME,
  },
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    sheetName: process.env.GOOGLE_SHEET_NAME || 'Sheet1',
    serviceAccountPath: process.env.GOOGLE_SERVICE_ACCOUNT_PATH,
  },
  localRepoPath: process.env.LOCAL_REPO_PATH || process.cwd(),
};

export function validateConfig() {
  const errors = [];

  if (!config.github.token) {
    errors.push('GITHUB_TOKEN is required');
  }
  if (!config.github.username) {
    errors.push('GITHUB_USERNAME is required');
  }
  if (!config.googleSheets.spreadsheetId) {
    errors.push('GOOGLE_SPREADSHEET_ID is required');
  }
  if (!config.googleSheets.serviceAccountPath) {
    errors.push('GOOGLE_SERVICE_ACCOUNT_PATH is required');
  }

  return errors;
}
