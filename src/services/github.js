import { Octokit } from '@octokit/rest';
import { config } from '../config.js';

export class GitHubService {
  constructor() {
    this.octokit = new Octokit({
      auth: config.github.token,
    });
    this.username = config.github.username;
  }

  /**
   * Get all PRs created today by the user
   */
  async getTodayPRs() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Search for PRs created by the user
      const { data } = await this.octokit.search.issuesAndPullRequests({
        q: `is:pr author:${this.username} created:>=${today.toISOString().split('T')[0]}`,
        sort: 'created',
        order: 'desc',
        per_page: 100,
      });

      return data.items.map(pr => ({
        title: pr.title,
        url: pr.html_url,
        repo: pr.repository_url.split('/').slice(-2).join('/'),
        status: 'Need Review',
        createdAt: pr.created_at,
        number: pr.number,
      }));
    } catch (error) {
      console.error('Error fetching GitHub PRs:', error.message);
      return [];
    }
  }

  /**
   * Get PRs updated today (but not created today)
   */
  async getUpdatedPRs() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await this.octokit.search.issuesAndPullRequests({
        q: `is:pr author:${this.username} updated:>=${today.toISOString().split('T')[0]}`,
        sort: 'updated',
        order: 'desc',
        per_page: 100,
      });

      // Filter out PRs created today (we only want updated ones)
      const updatedPRs = data.items.filter(pr => {
        const createdDate = new Date(pr.created_at);
        createdDate.setHours(0, 0, 0, 0);
        return createdDate.getTime() < today.getTime();
      });

      return updatedPRs.map(pr => ({
        title: pr.title,
        url: pr.html_url,
        repo: pr.repository_url.split('/').slice(-2).join('/'),
        status: 'Updated',
        updatedAt: pr.updated_at,
        number: pr.number,
      }));
    } catch (error) {
      console.error('Error fetching updated PRs:', error.message);
      return [];
    }
  }

  /**
   * Get all relevant PRs for today's report
   */
  async getAllPRs() {
    const [newPRs, updatedPRs] = await Promise.all([
      this.getTodayPRs(),
      this.getUpdatedPRs(),
    ]);

    return {
      new: newPRs,
      updated: updatedPRs,
    };
  }
}
