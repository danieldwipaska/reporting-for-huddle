import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { config } from '../config.js';

export class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = config.googleSheets.spreadsheetId;
    this.sheetName = config.googleSheets.sheetName;
    this.sheets = null;
  }

  /**
   * Initialize Google Sheets API
   */
  async initialize() {
    try {
      const credentials = JSON.parse(
        await readFile(config.googleSheets.serviceAccountPath, 'utf-8')
      );

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const authClient = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: authClient });
    } catch (error) {
      throw new Error(`Failed to initialize Google Sheets: ${error.message}`);
    }
  }

  /**
   * Get the next empty row in the sheet
   */
  async getNextEmptyRow() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:A`,
      });

      const values = response.data.values || [];
      return values.length + 1;
    } catch (error) {
      console.error('Error getting next empty row:', error.message);
      return 1;
    }
  }

  /**
   * Format date to readable string
   */
  formatDate(date = new Date()) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('id-ID', options);
  }

  /**
   * Append tasks to the spreadsheet
   */
  async appendTasks(tasks) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const timestamp = this.formatDate();
      const rows = tasks.map(task => [
        timestamp,
        task.description,
        task.status,
        task.url || '',
        task.notes || '',
      ]);

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:E`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: rows,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to append tasks: ${error.message}`);
    }
  }

  /**
   * Write tasks with headers if sheet is empty
   */
  async writeTasks(tasks) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      // Check if sheet has headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A1:E1`,
      });

      const hasHeaders = response.data.values && response.data.values.length > 0;

      if (!hasHeaders) {
        // Add headers first
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${this.sheetName}!A1:E1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Timestamp', 'Task Description', 'Status', 'URL', 'Notes']],
          },
        });
      }

      // Append tasks
      return await this.appendTasks(tasks);
    } catch (error) {
      throw new Error(`Failed to write tasks: ${error.message}`);
    }
  }

  /**
   * Get today's entries
   */
  async getTodayEntries() {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A:E`,
      });

      const values = response.data.values || [];
      const today = new Date().toLocaleDateString('id-ID');

      return values.filter(row => {
        if (!row[0]) return false;
        const rowDate = new Date(row[0]).toLocaleDateString('id-ID');
        return rowDate === today;
      });
    } catch (error) {
      console.error('Error getting today entries:', error.message);
      return [];
    }
  }
}
