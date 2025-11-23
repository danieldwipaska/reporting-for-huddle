import simpleGit from 'simple-git';
import { config } from '../config.js';

export class GitService {
  constructor(repoPath = config.localRepoPath) {
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch() {
    try {
      const branch = await this.git.revparse(['--abbrev-ref', 'HEAD']);
      return branch.trim();
    } catch (error) {
      console.error('Error getting current branch:', error.message);
      return null;
    }
  }

  /**
   * Get uncommitted changes
   */
  async getUncommittedChanges() {
    try {
      const status = await this.git.status();
      return {
        modified: status.modified,
        created: status.created,
        deleted: status.deleted,
        hasChanges: !status.isClean(),
      };
    } catch (error) {
      console.error('Error getting git status:', error.message);
      return { hasChanges: false };
    }
  }

  /**
   * Get commits on current branch that are not pushed
   */
  async getUnpushedCommits() {
    try {
      const currentBranch = await this.getCurrentBranch();
      if (!currentBranch) return [];

      // Get commits that are not on remote
      const log = await this.git.log([`origin/${currentBranch}..HEAD`]);
      return log.all.map(commit => ({
        hash: commit.hash.substring(0, 7),
        message: commit.message,
        date: commit.date,
      }));
    } catch (error) {
      // Branch might not have remote tracking
      return [];
    }
  }

  /**
   * Check if current work is WIP (Work In Progress)
   */
  async getWIPStatus() {
    try {
      const currentBranch = await this.getCurrentBranch();
      const changes = await this.getUncommittedChanges();
      const unpushedCommits = await this.getUnpushedCommits();

      if (currentBranch === 'main' || currentBranch === 'master') {
        return null; // Not working on a feature branch
      }

      if (changes.hasChanges || unpushedCommits.length > 0) {
        return {
          branch: currentBranch,
          hasUncommittedChanges: changes.hasChanges,
          unpushedCommits: unpushedCommits.length,
          status: 'WIP',
        };
      }

      return null;
    } catch (error) {
      console.error('Error checking WIP status:', error.message);
      return null;
    }
  }
}
