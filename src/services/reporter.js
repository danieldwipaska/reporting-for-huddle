import { GitHubService } from './github.js';
import { GitService } from './git.js';
import { GoogleSheetsService } from './sheets.js';

export class ReportService {
  constructor() {
    this.githubService = new GitHubService();
    this.gitService = new GitService();
    this.sheetsService = new GoogleSheetsService();
  }

  /**
   * Collect all tasks from various sources
   */
  async collectTasks(manualTasks = []) {
    const tasks = [];

    // 1. Get GitHub PRs
    console.log('📡 Fetching GitHub PRs...');
    const prs = await this.githubService.getAllPRs();

    // Add new PRs
    prs.new.forEach(pr => {
      tasks.push({
        description: `[${pr.repo}] ${pr.title}`,
        status: 'Need Review',
        url: pr.url,
        notes: `PR #${pr.number}`,
      });
    });

    // Add updated PRs
    prs.updated.forEach(pr => {
      tasks.push({
        description: `[${pr.repo}] ${pr.title}`,
        status: 'Updated',
        url: pr.url,
        notes: `PR #${pr.number} - Updated`,
      });
    });

    // 2. Check for WIP (Work In Progress)
    console.log('🔍 Checking for WIP tasks...');
    const wipStatus = await this.gitService.getWIPStatus();
    if (wipStatus) {
      tasks.push({
        description: `Working on branch: ${wipStatus.branch}`,
        status: 'WIP',
        url: '',
        notes: `Uncommitted: ${wipStatus.hasUncommittedChanges ? 'Yes' : 'No'}, Unpushed commits: ${wipStatus.unpushedCommits}`,
      });
    }

    // 3. Add manual tasks
    if (manualTasks.length > 0) {
      console.log('📝 Adding manual tasks...');
      manualTasks.forEach(task => {
        tasks.push({
          description: task.description,
          status: task.status || 'Completed',
          url: task.url || '',
          notes: task.notes || 'Manual entry',
        });
      });
    }

    return tasks;
  }

  /**
   * Generate and submit report
   */
  async generateReport(manualTasks = []) {
    try {
      console.log('🚀 Starting afternoon report generation...\n');

      // Collect all tasks
      const tasks = await this.collectTasks(manualTasks);

      if (tasks.length === 0) {
        console.log('⚠️  No tasks found for today.');
        return { success: false, message: 'No tasks to report' };
      }

      // Display summary
      console.log('\n📊 Report Summary:');
      console.log('─'.repeat(50));
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.status}] ${task.description}`);
        if (task.url) console.log(`   🔗 ${task.url}`);
        if (task.notes) console.log(`   📌 ${task.notes}`);
        console.log('');
      });
      console.log('─'.repeat(50));

      // Write to Google Sheets
      console.log('\n📤 Writing to Google Sheets...');
      await this.sheetsService.writeTasks(tasks);

      console.log('✅ Report submitted successfully!');
      return { success: true, tasks, count: tasks.length };
    } catch (error) {
      console.error('❌ Error generating report:', error.message);
      throw error;
    }
  }

  /**
   * Preview report without submitting
   */
  async previewReport(manualTasks = []) {
    try {
      console.log('👀 Generating report preview...\n');

      const tasks = await this.collectTasks(manualTasks);

      if (tasks.length === 0) {
        console.log('⚠️  No tasks found for today.');
        return { success: false, tasks: [] };
      }

      console.log('📊 Preview:');
      console.log('─'.repeat(50));
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.status}] ${task.description}`);
        if (task.url) console.log(`   🔗 ${task.url}`);
        if (task.notes) console.log(`   📌 ${task.notes}`);
        console.log('');
      });
      console.log('─'.repeat(50));
      console.log(`\nTotal tasks: ${tasks.length}`);

      return { success: true, tasks };
    } catch (error) {
      console.error('❌ Error generating preview:', error.message);
      throw error;
    }
  }
}
