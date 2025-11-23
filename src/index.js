#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ReportService } from './services/reporter.js';
import { validateConfig } from './config.js';

const program = new Command();

program
  .name('afternoon-report')
  .description('Automated afternoon reporting tool')
  .version('1.0.0');

/**
 * Main report command
 */
program
  .command('submit')
  .description('Generate and submit afternoon report')
  .option('-m, --manual', 'Add manual tasks interactively')
  .option('-p, --preview', 'Preview report without submitting')
  .action(async (options) => {
    try {
      // Validate configuration
      const errors = validateConfig();
      if (errors.length > 0) {
        console.error(chalk.red('❌ Configuration errors:'));
        errors.forEach(err => console.error(chalk.red(`   - ${err}`)));
        console.log(chalk.yellow('\n💡 Please check your .env file'));
        process.exit(1);
      }

      const reportService = new ReportService();
      let manualTasks = [];

      // Interactive manual task input
      if (options.manual) {
        manualTasks = await collectManualTasks();
      }

      // Generate report
      if (options.preview) {
        await reportService.previewReport(manualTasks);
      } else {
        await reportService.generateReport(manualTasks);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Quick submit command (default)
 */
program
  .command('quick', { isDefault: true })
  .description('Quick submit without manual tasks')
  .action(async () => {
    try {
      const errors = validateConfig();
      if (errors.length > 0) {
        console.error(chalk.red('❌ Configuration errors:'));
        errors.forEach(err => console.error(chalk.red(`   - ${err}`)));
        console.log(chalk.yellow('\n💡 Please check your .env file'));
        process.exit(1);
      }

      const reportService = new ReportService();
      await reportService.generateReport([]);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Interactive mode
 */
program
  .command('interactive')
  .alias('i')
  .description('Interactive mode with prompts')
  .action(async () => {
    try {
      const errors = validateConfig();
      if (errors.length > 0) {
        console.error(chalk.red('❌ Configuration errors:'));
        errors.forEach(err => console.error(chalk.red(`   - ${err}`)));
        console.log(chalk.yellow('\n💡 Please check your .env file'));
        process.exit(1);
      }

      console.log(chalk.blue.bold('\n📋 Afternoon Report - Interactive Mode\n'));

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '📤 Submit report (auto-detect tasks)', value: 'submit' },
            { name: '➕ Submit with manual tasks', value: 'submit-manual' },
            { name: '👀 Preview report', value: 'preview' },
            { name: '❌ Cancel', value: 'cancel' },
          ],
        },
      ]);

      if (action === 'cancel') {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }

      const reportService = new ReportService();
      let manualTasks = [];

      if (action === 'submit-manual') {
        manualTasks = await collectManualTasks();
      }

      if (action === 'preview') {
        await reportService.previewReport(manualTasks);
      } else {
        await reportService.generateReport(manualTasks);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Helper function to collect manual tasks
 */
async function collectManualTasks() {
  const tasks = [];
  let addMore = true;

  console.log(chalk.blue('\n➕ Add Manual Tasks\n'));

  while (addMore) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Task description:',
        validate: (input) => input.trim() !== '' || 'Description is required',
      },
      {
        type: 'list',
        name: 'status',
        message: 'Status:',
        choices: ['Completed', 'In Progress', 'Blocked', 'WIP'],
        default: 'Completed',
      },
      {
        type: 'input',
        name: 'notes',
        message: 'Additional notes (optional):',
      },
      {
        type: 'confirm',
        name: 'addAnother',
        message: 'Add another task?',
        default: false,
      },
    ]);

    tasks.push({
      description: answers.description,
      status: answers.status,
      notes: answers.notes || '',
      url: '',
    });

    addMore = answers.addAnother;
  }

  return tasks;
}

// Parse command line arguments
program.parse();
