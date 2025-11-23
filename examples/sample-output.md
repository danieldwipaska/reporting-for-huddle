# Sample Output

Contoh output dari afternoon reporting tool.

## 1. Quick Submit (Auto-detect)

```bash
$ npm start

🚀 Starting afternoon report generation...

📡 Fetching GitHub PRs...
🔍 Checking for WIP tasks...

📊 Report Summary:
──────────────────────────────────────────────────
1. [Need Review] [owner/repo-name] Add user authentication feature
   🔗 https://github.com/owner/repo-name/pull/123
   📌 PR #123

2. [Updated] [owner/another-repo] Fix bug in payment processing
   🔗 https://github.com/owner/another-repo/pull/45
   📌 PR #45 - Updated

3. [WIP] Working on branch: feature/new-api-endpoint
   📌 Uncommitted: Yes, Unpushed commits: 3

──────────────────────────────────────────────────

📤 Writing to Google Sheets...
✅ Report submitted successfully!
```

## 2. Submit with Manual Tasks

```bash
$ node src/index.js submit --manual

🚀 Starting afternoon report generation...

➕ Add Manual Tasks

? Task description: Deploy staging server
? Status: Completed
? Additional notes (optional): Updated nginx config and restarted services
? Add another task? Yes

? Task description: Database migration
? Status: Completed
? Additional notes (optional): Migrated user table schema
? Add another task? No

📡 Fetching GitHub PRs...
🔍 Checking for WIP tasks...

📊 Report Summary:
──────────────────────────────────────────────────
1. [Need Review] [owner/repo-name] Add user authentication feature
   🔗 https://github.com/owner/repo-name/pull/123
   📌 PR #123

2. [WIP] Working on branch: feature/new-api-endpoint
   📌 Uncommitted: Yes, Unpushed commits: 2

3. [Completed] Deploy staging server
   📌 Updated nginx config and restarted services

4. [Completed] Database migration
   📌 Migrated user table schema

──────────────────────────────────────────────────

📤 Writing to Google Sheets...
✅ Report submitted successfully!
```

## 3. Preview Mode

```bash
$ node src/index.js submit --preview

👀 Generating report preview...

📡 Fetching GitHub PRs...
🔍 Checking for WIP tasks...

📊 Preview:
──────────────────────────────────────────────────
1. [Need Review] [owner/repo-name] Add user authentication feature
   🔗 https://github.com/owner/repo-name/pull/123
   📌 PR #123

2. [Updated] [owner/another-repo] Fix bug in payment processing
   🔗 https://github.com/owner/another-repo/pull/45
   📌 PR #45 - Updated

──────────────────────────────────────────────────

Total tasks: 2
```

## 4. Interactive Mode

```bash
$ node src/index.js interactive

📋 Afternoon Report - Interactive Mode

? What would you like to do? (Use arrow keys)
❯ 📤 Submit report (auto-detect tasks)
  ➕ Submit with manual tasks
  👀 Preview report
  ❌ Cancel

[User selects: Submit with manual tasks]

➕ Add Manual Tasks

? Task description: Server maintenance
? Status: Completed
? Additional notes (optional): Updated SSL certificates
? Add another task? No

🚀 Starting afternoon report generation...

📡 Fetching GitHub PRs...
🔍 Checking for WIP tasks...

📊 Report Summary:
──────────────────────────────────────────────────
1. [Completed] Server maintenance
   📌 Updated SSL certificates

──────────────────────────────────────────────────

📤 Writing to Google Sheets...
✅ Report submitted successfully!
```

## 5. No Tasks Found

```bash
$ npm start

🚀 Starting afternoon report generation...

📡 Fetching GitHub PRs...
🔍 Checking for WIP tasks...

⚠️  No tasks found for today.
```

## 6. Google Spreadsheet Output

Setelah submit, data akan muncul di spreadsheet:

| Timestamp | Task Description | Status | URL | Notes |
|-----------|-----------------|--------|-----|-------|
| 23/11/2024, 15:30 | [owner/repo-name] Add user authentication feature | Need Review | https://github.com/owner/repo-name/pull/123 | PR #123 |
| 23/11/2024, 15:30 | [owner/another-repo] Fix bug in payment processing | Updated | https://github.com/owner/another-repo/pull/45 | PR #45 - Updated |
| 23/11/2024, 15:30 | Working on branch: feature/new-api-endpoint | WIP | | Uncommitted: Yes, Unpushed commits: 3 |
| 23/11/2024, 15:30 | Deploy staging server | Completed | | Updated nginx config and restarted services |
| 23/11/2024, 15:30 | Database migration | Completed | | Migrated user table schema |

## 7. Error Examples

### Missing Configuration
```bash
$ npm start

❌ Configuration errors:
   - GITHUB_TOKEN is required
   - GOOGLE_SPREADSHEET_ID is required

💡 Please check your .env file
```

### Google Sheets Permission Error
```bash
$ npm start

🚀 Starting afternoon report generation...

📡 Fetching GitHub PRs...
🔍 Checking for WIP tasks...

📊 Report Summary:
──────────────────────────────────────────────────
1. [Need Review] [owner/repo-name] Add user authentication feature
──────────────────────────────────────────────────

📤 Writing to Google Sheets...
❌ Error: Failed to append tasks: The caller does not have permission

💡 Make sure you've shared the spreadsheet with your service account email
```
