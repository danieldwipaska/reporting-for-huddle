# Project Structure

```
afternoon_reporting/
├── src/
│   ├── index.js                 # Main CLI entry point
│   ├── config.js                # Configuration management
│   └── services/
│       ├── github.js            # GitHub API integration
│       ├── git.js               # Local Git repository operations
│       ├── sheets.js            # Google Sheets API integration
│       └── reporter.js          # Main reporting logic
│
├── credentials/
│   └── service-account.json     # Google Service Account credentials (gitignored)
│
├── examples/
│   └── sample-output.md         # Sample output examples
│
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # NPM dependencies and scripts
├── README.md                    # Main documentation
├── SETUP_GUIDE.md              # Detailed setup instructions
├── QUICK_START.md              # Quick start guide
├── TROUBLESHOOTING.md          # Troubleshooting guide
└── PROJECT_STRUCTURE.md        # This file
```

## 📁 Directory Details

### `/src`
Core application code.

**`index.js`**
- CLI interface using Commander.js
- Command definitions (submit, quick, interactive)
- Interactive prompts using Inquirer.js
- Entry point for the application

**`config.js`**
- Environment variable loading
- Configuration validation
- Centralized config object

**`/services`**
Service layer for different integrations.

### `/src/services`

**`github.js`** - GitHub Integration
- `getTodayPRs()` - Fetch PRs created today
- `getUpdatedPRs()` - Fetch PRs updated today
- `getAllPRs()` - Combine all PR data
- Uses Octokit REST API

**`git.js`** - Local Git Operations
- `getCurrentBranch()` - Get current branch name
- `getUncommittedChanges()` - Check for uncommitted files
- `getUnpushedCommits()` - Check for unpushed commits
- `getWIPStatus()` - Determine if work is in progress
- Uses simple-git library

**`sheets.js`** - Google Sheets Integration
- `initialize()` - Setup Google Sheets API client
- `getNextEmptyRow()` - Find next available row
- `appendTasks()` - Append tasks to spreadsheet
- `writeTasks()` - Write tasks with headers
- `getTodayEntries()` - Fetch today's entries
- Uses googleapis library

**`reporter.js`** - Main Reporting Logic
- `collectTasks()` - Gather tasks from all sources
- `generateReport()` - Generate and submit report
- `previewReport()` - Preview without submitting
- Orchestrates all services

### `/credentials`
Stores Google Service Account credentials.

**Important:** This directory is gitignored for security.

### `/examples`
Example outputs and usage demonstrations.

## 🔄 Data Flow

```
┌─────────────────┐
│   User Input    │
│   (CLI/Args)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   index.js      │
│   (CLI Layer)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  reporter.js    │
│ (Orchestrator)  │
└────────┬────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │ GitHub │    │  Git   │    │ Manual │    │ Sheets │
    │   API  │    │  Repo  │    │  Tasks │    │   API  │
    └────────┘    └────────┘    └────────┘    └────────┘
         │              │              │              │
         └──────────────┴──────────────┴──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Google Sheets │
                    │  (Output)     │
                    └───────────────┘
```

## 🎯 Key Components

### 1. CLI Layer (`index.js`)
- Handles user interaction
- Parses commands and options
- Validates configuration
- Provides interactive prompts

### 2. Service Layer (`/services`)
- **GitHub Service**: Fetches PR data from GitHub API
- **Git Service**: Analyzes local repository state
- **Sheets Service**: Writes to Google Spreadsheet
- **Reporter Service**: Coordinates all services

### 3. Configuration (`config.js`)
- Loads environment variables
- Validates required settings
- Provides config to all services

## 📊 Task Collection Flow

```
1. GitHub PRs (New)
   ├─ Search: created today
   ├─ Status: "Need Review"
   └─ Include: title, URL, PR number

2. GitHub PRs (Updated)
   ├─ Search: updated today (not created today)
   ├─ Status: "Updated"
   └─ Include: title, URL, PR number

3. Local Git (WIP)
   ├─ Check: current branch != main/master
   ├─ Check: uncommitted changes OR unpushed commits
   ├─ Status: "WIP"
   └─ Include: branch name, change counts

4. Manual Tasks
   ├─ Input: user provides via CLI
   ├─ Status: user-defined
   └─ Include: description, notes

5. Combine All
   └─ Format for Google Sheets
```

## 🔐 Security

### Gitignored Files
```
.env                          # Contains secrets
credentials/                  # Service account JSON
node_modules/                 # Dependencies
*.log                         # Log files
```

### Environment Variables
All sensitive data stored in `.env`:
- GitHub token
- Google credentials path
- Spreadsheet ID

### Best Practices
- Never commit `.env` or credentials
- Use `.env.example` as template
- Service account has minimal permissions
- Tokens can be revoked anytime

## 🚀 Execution Flow

### Quick Submit (`npm start`)
```
1. Load config from .env
2. Validate config
3. Initialize ReportService
4. Collect tasks (GitHub + Git + Manual)
5. Format tasks
6. Write to Google Sheets
7. Display success message
```

### Interactive Mode
```
1. Load config
2. Show menu
3. User selects action
4. If manual tasks: collect via prompts
5. Execute selected action
6. Display results
```

### Preview Mode
```
1. Load config
2. Collect tasks
3. Display formatted preview
4. Do NOT write to spreadsheet
```

## 📦 Dependencies

### Production
- **googleapis**: Google Sheets API client
- **@octokit/rest**: GitHub API client
- **simple-git**: Git operations
- **commander**: CLI framework
- **inquirer**: Interactive prompts
- **chalk**: Terminal colors
- **dotenv**: Environment variables

### Development
None (production-ready)

## 🔧 Configuration Files

### `package.json`
- Project metadata
- Dependencies
- NPM scripts
- ES modules configuration

### `.env`
- GitHub credentials
- Google Sheets config
- Service account path
- Optional settings

### `.gitignore`
- Ignored files and directories
- Security-sensitive files

## 📝 Documentation Files

### User Documentation
- **README.md**: Overview and features
- **QUICK_START.md**: Quick setup guide
- **SETUP_GUIDE.md**: Detailed step-by-step setup
- **TROUBLESHOOTING.md**: Common issues and solutions

### Developer Documentation
- **PROJECT_STRUCTURE.md**: This file
- **examples/sample-output.md**: Usage examples

## 🎨 Code Style

### ES Modules
```javascript
import { something } from './module.js';
export class MyClass { }
```

### Async/Await
```javascript
async function fetchData() {
  const data = await api.get();
  return data;
}
```

### Error Handling
```javascript
try {
  await operation();
} catch (error) {
  console.error('Error:', error.message);
  throw error;
}
```

### Logging
```javascript
console.log('✅ Success');
console.error('❌ Error');
console.log('📊 Info');
```

## 🧪 Testing

Currently no automated tests. To test manually:

```bash
# Test preview (safe, no writes)
node src/index.js submit --preview

# Test with manual tasks
node src/index.js submit --manual

# Test interactive mode
node src/index.js interactive
```

## 🔮 Future Enhancements

Potential improvements:
- [ ] Unit tests
- [ ] Multiple repository support
- [ ] Custom report templates
- [ ] Slack/Discord integration
- [ ] Scheduled automatic reporting
- [ ] Report history viewer
- [ ] Analytics dashboard
