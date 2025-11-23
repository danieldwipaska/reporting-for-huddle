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
   * Check if PR has unresponded comments from others
   */
  async checkNeedChanges(owner, repo, prNumber, prUpdatedAt) {
    try {
      // Get PR comments (issue comments)
      const { data: comments } = await this.octokit.issues.listComments({
        owner,
        repo,
        issue_number: prNumber,
        per_page: 100,
        sort: 'created',
        direction: 'desc',
      });

      // Get PR review comments (code review comments)
      const { data: reviewComments } = await this.octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
        sort: 'created',
        direction: 'desc',
      });

      // Get PR reviews
      const { data: reviews } = await this.octokit.pulls.listReviews({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      });

      // Combine all interactions and sort by date
      const allInteractions = [
        ...comments.map(c => ({ type: 'comment', user: c.user.login, created_at: c.created_at })),
        ...reviewComments.map(c => ({ type: 'review_comment', user: c.user.login, created_at: c.created_at })),
        ...reviews.map(r => ({ type: 'review', user: r.user.login, created_at: r.submitted_at, state: r.state })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (allInteractions.length === 0) {
        return false;
      }

      // Get the last interaction
      const lastInteraction = allInteractions[0];

      // If last interaction is from someone else (not the PR author)
      if (lastInteraction.user !== this.username) {
        // Check if PR was updated after the last comment
        const lastInteractionDate = new Date(lastInteraction.created_at);
        const prUpdatedDate = new Date(prUpdatedAt);

        // If PR hasn't been updated after the last comment, it needs changes
        if (prUpdatedDate <= lastInteractionDate) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error checking comments for PR #${prNumber}:`, error.message);
      return false;
    }
  }

  /**
   * Get full PR details to check if merged
   */
  async getPRDetails(owner, repo, prNumber) {
    try {
      const { data } = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });
      return data;
    } catch (error) {
      console.error(`Error fetching PR #${prNumber} details:`, error.message);
      return null;
    }
  }

  /**
   * Determine PR status based on state, merged status, and comments
   */
  async getPRStatus(pr, isNew = true) {
    // Extract owner and repo from repository_url
    const repoPath = pr.repository_url.split('/').slice(-2);
    const [owner, repo] = repoPath;

    // Get full PR details to check merged status
    const prDetails = await this.getPRDetails(owner, repo, pr.number);

    // IMPORTANT: Check merged first, because merged PRs have state='closed'
    if (prDetails && prDetails.merged) {
      return 'Done';
    }

    // If closed but not merged, it's just closed
    if (pr.state === 'closed') {
      return 'Closed';
    }

    // If PR is open, check for unresponded comments
    if (pr.state === 'open') {
      // Check if there are unresponded comments
      const needsChanges = await this.checkNeedChanges(owner, repo, pr.number, pr.updated_at);
      
      if (needsChanges) {
        return 'Need Changes';
      }

      return isNew ? 'Need Review' : 'Updated';
    }

    return isNew ? 'Need Review' : 'Updated';
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

      // Map PRs with async status check
      const prs = await Promise.all(
        data.items.map(async (pr) => {
          const status = await this.getPRStatus(pr, true);
          return {
            title: pr.title,
            url: pr.html_url,
            repo: pr.repository_url.split('/').slice(-2).join('/'),
            status,
            createdAt: pr.created_at,
            number: pr.number,
            state: pr.state,
            merged: pr.pull_request?.merged_at ? true : false,
          };
        })
      );

      return prs;
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

      // Map PRs with async status check
      const prs = await Promise.all(
        updatedPRs.map(async (pr) => ({
          title: pr.title,
          url: pr.html_url,
          repo: pr.repository_url.split('/').slice(-2).join('/'),
          status: await this.getPRStatus(pr, false),
          updatedAt: pr.updated_at,
          number: pr.number,
          state: pr.state,
          merged: pr.pull_request?.merged_at ? true : false,
        }))
      );

      return prs;
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
