# System Architecture

Dokumentasi arsitektur sistem Afternoon Reporting Automation.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER                                  │
│                    (Developer)                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ CLI Commands
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLI INTERFACE                              │
│                   (index.js)                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Quick   │  │  Submit  │  │ Preview  │  │Interactive│   │
│  │  Submit  │  │  +Manual │  │   Mode   │  │   Mode    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Orchestration
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  REPORT SERVICE                              │
│                  (reporter.js)                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  collectTasks()                                     │    │
│  │  ├─ Fetch GitHub PRs                               │    │
│  │  ├─ Check Local Git WIP                            │    │
│  │  └─ Include Manual Tasks                           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  generateReport()                                   │    │
│  │  ├─ Format tasks                                    │    │
│  │  ├─ Display summary                                │    │
│  │  └─ Write to Google Sheets                         │    │
│  └────────────────────────────────────────────────────┘    │
└───┬──────────────────┬──────────────────┬──────────────────┘
    │                  │                  │
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐      ┌─────────┐      ┌─────────────┐
│ GitHub  │      │  Local  │      │   Google    │
│ Service │      │   Git   │      │   Sheets    │
│         │      │ Service │      │   Service   │
└────┬────┘      └────┬────┘      └──────┬──────┘
     │                │                   │
     │                │                   │
     ▼                ▼                   ▼
┌─────────┐      ┌─────────┐      ┌─────────────┐
│ GitHub  │      │  Local  │      │   Google    │
│   API   │      │   Git   │      │  Sheets API │
│         │      │  Repo   │      │             │
└─────────┘      └─────────┘      └─────────────┘
```

## 🔄 Data Flow Diagram

```
START
  │
  ├─ Load Configuration (.env)
  │   ├─ GitHub Token
  │   ├─ GitHub Username
  │   ├─ Spreadsheet ID
  │   └─ Service Account Path
  │
  ├─ Validate Configuration
  │   └─ [If invalid] → Exit with error
  │
  ├─ Initialize Services
  │   ├─ GitHub Service (Octokit)
  │   ├─ Git Service (simple-git)
  │   └─ Sheets Service (googleapis)
  │
  ├─ Collect Tasks
  │   │
  │   ├─ GitHub PRs (New)
  │   │   ├─ Query: created today
  │   │   ├─ Filter: by author
  │   │   └─ Status: "Need Review"
  │   │
  │   ├─ GitHub PRs (Updated)
  │   │   ├─ Query: updated today
  │   │   ├─ Filter: not created today
  │   │   └─ Status: "Updated"
  │   │
  │   ├─ Local Git WIP
  │   │   ├─ Check: current branch
  │   │   ├─ Check: uncommitted changes
  │   │   ├─ Check: unpushed commits
  │   │   └─ Status: "WIP"
  │   │
  │   └─ Manual Tasks
  │       ├─ User input (if --manual)
  │       └─ Status: user-defined
  │
  ├─ Format Tasks
  │   └─ [Timestamp, Description, Status, URL, Notes]
  │
  ├─ Display Summary
  │   └─ Console output with emojis
  │
  ├─ Write to Spreadsheet
  │   ├─ Check headers exist
  │   ├─ Add headers if needed
  │   └─ Append task rows
  │
  └─ Success Message
      └─ END
```

## 🧩 Component Details

### 1. CLI Layer

**File:** `src/index.js`

**Responsibilities:**
- Parse command-line arguments
- Handle user interaction
- Validate configuration
- Route to appropriate service

**Commands:**
```javascript
quick         // Default, auto-submit
submit        // Submit with options (--manual, --preview)
interactive   // Interactive menu mode
```

**Dependencies:**
- Commander.js (CLI framework)
- Inquirer.js (prompts)
- Chalk (colors)

---

### 2. Configuration Layer

**File:** `src/config.js`

**Responsibilities:**
- Load environment variables
- Validate required settings
- Provide config object to services

**Config Structure:**
```javascript
{
  github: {
    token: string,
    username: string
  },
  googleSheets: {
    spreadsheetId: string,
    sheetName: string,
    serviceAccountPath: string
  },
  localRepoPath: string
}
```

---

### 3. Service Layer

#### GitHub Service

**File:** `src/services/github.js`

**Responsibilities:**
- Fetch PRs from GitHub API
- Filter by date and author
- Format PR data

**Methods:**
```javascript
getTodayPRs()      // PRs created today
getUpdatedPRs()    // PRs updated today
getAllPRs()        // Combined results
```

**API Calls:**
```
GET /search/issues
  ?q=is:pr author:{username} created:>={date}
  ?q=is:pr author:{username} updated:>={date}
```

---

#### Git Service

**File:** `src/services/git.js`

**Responsibilities:**
- Analyze local repository
- Detect work in progress
- Check branch status

**Methods:**
```javascript
getCurrentBranch()        // Get active branch
getUncommittedChanges()   // Check git status
getUnpushedCommits()      // Check unpushed commits
getWIPStatus()            // Determine WIP state
```

**Git Commands:**
```bash
git rev-parse --abbrev-ref HEAD    # Current branch
git status                         # Uncommitted changes
git log origin/branch..HEAD        # Unpushed commits
```

---

#### Google Sheets Service

**File:** `src/services/sheets.js`

**Responsibilities:**
- Initialize Google Sheets API
- Write data to spreadsheet
- Manage headers

**Methods:**
```javascript
initialize()         // Setup API client
getNextEmptyRow()    // Find insertion point
appendTasks()        // Add task rows
writeTasks()         // Write with headers
getTodayEntries()    // Fetch today's data
```

**API Calls:**
```
GET  /spreadsheets/{id}/values/{range}
POST /spreadsheets/{id}/values/{range}:append
```

---

#### Reporter Service

**File:** `src/services/reporter.js`

**Responsibilities:**
- Orchestrate all services
- Collect and combine tasks
- Format output
- Generate reports

**Methods:**
```javascript
collectTasks(manualTasks)    // Gather from all sources
generateReport(manualTasks)  // Create and submit
previewReport(manualTasks)   // Preview only
```

**Task Flow:**
```
GitHub PRs → 
Local Git WIP → 
Manual Tasks → 
  Combine → 
    Format → 
      Display → 
        Write to Sheets
```

---

## 📊 Data Models

### Task Object

```javascript
{
  description: string,  // Task description
  status: string,       // "Need Review" | "Updated" | "WIP" | "Completed" | etc
  url: string,          // GitHub PR URL or empty
  notes: string         // Additional information
}
```

### GitHub PR Object

```javascript
{
  title: string,
  url: string,
  repo: string,         // "owner/repo"
  status: string,
  createdAt: string,    // ISO date
  number: number        // PR number
}
```

### WIP Status Object

```javascript
{
  branch: string,
  hasUncommittedChanges: boolean,
  unpushedCommits: number,
  status: "WIP"
}
```

### Spreadsheet Row

```javascript
[
  timestamp,        // "23/11/2024, 15:30"
  description,      // "[repo] Task title"
  status,           // "Need Review"
  url,              // "https://github.com/..."
  notes             // "PR #123"
]
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ Provides credentials
       ▼
┌──────────────┐
│  .env file   │
│  (gitignored)│
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   GitHub    │   │   Google    │   │   Config    │
│    Token    │   │  Service    │   │  Validator  │
│             │   │   Account   │   │             │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  GitHub API │   │ Google APIs │   │  Services   │
│   (Octokit) │   │(googleapis) │   │             │
└─────────────┘   └─────────────┘   └─────────────┘
```

### Security Layers

1. **Environment Variables**
   - Sensitive data in `.env`
   - Gitignored
   - Never committed

2. **Service Account**
   - JSON key file
   - Stored in `credentials/`
   - Gitignored
   - Minimal permissions

3. **API Tokens**
   - GitHub PAT with repo scope only
   - Can be revoked anytime
   - No hardcoded values

4. **Access Control**
   - Spreadsheet shared explicitly
   - Service account has Editor role only
   - No public access

---

## 🚀 Execution Flow

### Quick Submit Flow

```
User runs: npm start
  │
  ├─ Load .env
  ├─ Validate config
  ├─ Initialize services
  │
  ├─ Fetch GitHub PRs
  │   └─ [API Call] GitHub
  │
  ├─ Check Git WIP
  │   └─ [Git Commands] Local repo
  │
  ├─ Combine tasks
  ├─ Format data
  ├─ Display summary
  │
  ├─ Write to Sheets
  │   └─ [API Call] Google Sheets
  │
  └─ Success message
```

### Interactive Flow

```
User runs: node src/index.js interactive
  │
  ├─ Load config
  ├─ Show menu
  │   ├─ Submit report
  │   ├─ Submit with manual
  │   ├─ Preview
  │   └─ Cancel
  │
  ├─ User selects option
  │
  ├─ [If manual tasks]
  │   ├─ Prompt: description
  │   ├─ Prompt: status
  │   ├─ Prompt: notes
  │   └─ Prompt: add more?
  │
  ├─ Execute selected action
  │   └─ [Same as Quick Submit]
  │
  └─ Display results
```

---

## 📈 Scalability Considerations

### Current Limitations

1. **Single User**
   - Designed for one developer
   - One GitHub account
   - One spreadsheet

2. **Single Repository**
   - WIP detection from one repo
   - Can be configured via `LOCAL_REPO_PATH`

3. **API Quotas**
   - GitHub: 5000 requests/hour
   - Google Sheets: 100 requests/100s per user

### Potential Enhancements

1. **Multi-User Support**
   - Multiple `.env` profiles
   - Team spreadsheet
   - Aggregated reports

2. **Multi-Repository**
   - Array of repo paths
   - Aggregate WIP from all repos
   - Per-repo configuration

3. **Caching**
   - Cache GitHub API responses
   - Reduce API calls
   - Faster execution

4. **Database**
   - Store historical data
   - Analytics and trends
   - Offline mode

---

## 🧪 Testing Strategy

### Manual Testing

```bash
# 1. Preview (no writes)
node src/index.js submit --preview

# 2. Test GitHub integration
# (create a PR, run script, verify detection)

# 3. Test Git WIP
# (make changes, run script, verify detection)

# 4. Test manual tasks
node src/index.js submit --manual

# 5. Test spreadsheet write
npm start
# (verify data in spreadsheet)
```

### Component Testing

```javascript
// Test GitHub Service
import { GitHubService } from './src/services/github.js';
const gh = new GitHubService();
const prs = await gh.getTodayPRs();
console.log(prs);

// Test Git Service
import { GitService } from './src/services/git.js';
const git = new GitService();
const wip = await git.getWIPStatus();
console.log(wip);

// Test Sheets Service
import { GoogleSheetsService } from './src/services/sheets.js';
const sheets = new GoogleSheetsService();
await sheets.initialize();
console.log('Sheets initialized');
```

---

## 🔮 Future Architecture

### Proposed Enhancements

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB DASHBOARD                             │
│              (React + Express Backend)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER                                  │
│              (Express.js Server)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                              │
│              (MongoDB / PostgreSQL)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              EXISTING SERVICES                               │
│    (GitHub, Git, Sheets - as is)                            │
└─────────────────────────────────────────────────────────────┘
```

### Additional Features

- **Scheduled Execution**: Cron jobs for automatic reporting
- **Notifications**: Slack/Discord integration
- **Analytics**: Charts and trends
- **Templates**: Customizable report formats
- **Multi-Platform**: Mobile app support

---

## 📚 Technology Stack

### Runtime
- **Node.js** v18+ (ES Modules)

### Core Libraries
- **googleapis** - Google Sheets API
- **@octokit/rest** - GitHub API
- **simple-git** - Git operations

### CLI & UX
- **commander** - CLI framework
- **inquirer** - Interactive prompts
- **chalk** - Terminal styling

### Configuration
- **dotenv** - Environment variables

### APIs
- **GitHub REST API v3**
- **Google Sheets API v4**

---

## 🎯 Design Principles

1. **Simplicity**
   - Single purpose tool
   - Minimal configuration
   - Easy to use

2. **Modularity**
   - Separate services
   - Clear responsibilities
   - Easy to extend

3. **Security**
   - No hardcoded secrets
   - Gitignored credentials
   - Minimal permissions

4. **User Experience**
   - Clear error messages
   - Visual feedback (emojis)
   - Interactive mode

5. **Reliability**
   - Error handling
   - Validation
   - Graceful failures

---

This architecture supports the current requirements while being extensible for future enhancements.
