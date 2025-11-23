# Afternoon Reporting Automation

Automated tool untuk membuat laporan afternoon reporting ke Google Spreadsheet. Tool ini secara otomatis mengumpulkan informasi dari GitHub PRs dan Git repository lokal, serta memungkinkan penambahan task manual.

## 🚀 Features

- ✅ **Auto-detect GitHub PRs**: Otomatis mendeteksi PR baru yang dibuat hari ini
- ✅ **Smart PR Status**: Otomatis mendeteksi status PR (Need Review, Need Changes, Done/Merged, Closed)
- 💬 **Comment Detection**: Deteksi PR yang perlu changes berdasarkan comment/review dari reviewer
- 🔄 **Track PR Updates**: Mendeteksi PR yang di-update hari ini
- 🔨 **WIP Detection**: Mendeteksi work in progress dari branch lokal
- ✍️ **Manual Tasks**: Menambahkan task manual untuk pekerjaan server atau task lain
- 📊 **Google Sheets Integration**: Langsung menulis ke Google Spreadsheet
- 🎨 **Interactive CLI**: Mode interaktif dengan prompts yang user-friendly

## 📋 Prerequisites

1. **Node.js** (v18 atau lebih tinggi)
2. **GitHub Personal Access Token**
3. **Google Service Account** dengan akses ke Google Sheets API

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup GitHub Token

1. Buka [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Pilih scope: `repo` (Full control of private repositories)
4. Copy token yang dihasilkan

### 3. Setup Google Service Account

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Enable **Google Sheets API**:
   - Buka "APIs & Services" > "Library"
   - Cari "Google Sheets API"
   - Klik "Enable"
4. Buat Service Account:
   - Buka "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "Service Account"
   - Isi nama service account
   - Klik "Create and Continue"
   - Skip role assignment (klik "Continue")
   - Klik "Done"
5. Generate Key:
   - Klik service account yang baru dibuat
   - Tab "Keys" > "Add Key" > "Create new key"
   - Pilih JSON format
   - Download file JSON
6. Simpan file JSON ke folder `credentials/service-account.json`

### 4. Setup Google Spreadsheet

1. Buat Google Spreadsheet baru atau gunakan yang sudah ada
2. Copy Spreadsheet ID dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
3. **PENTING**: Share spreadsheet dengan email service account:
   - Buka spreadsheet
   - Klik "Share"
   - Paste email service account (ada di file JSON: `client_email`)
   - Berikan akses "Editor"

### 5. Configure Environment

1. Copy `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` dengan informasi Anda:
   ```env
   GITHUB_TOKEN=ghp_your_github_token_here
   GITHUB_USERNAME=your_github_username
   
   GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
   GOOGLE_SHEET_NAME=Sheet1
   
   GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/service-account.json
   
   LOCAL_REPO_PATH=
   ```

### 6. Create Credentials Folder

```bash
mkdir credentials
```

Lalu copy file service account JSON ke `credentials/service-account.json`

## 📖 Usage

### Quick Submit (Default)

Langsung submit report tanpa manual tasks:

```bash
npm start
```

atau

```bash
node src/index.js quick
```

### Submit with Manual Tasks

Submit report dengan opsi menambahkan manual tasks:

```bash
node src/index.js submit --manual
```

### Preview Report

Preview report tanpa submit ke spreadsheet:

```bash
node src/index.js submit --preview
```

### Interactive Mode

Mode interaktif dengan menu pilihan:

```bash
node src/index.js interactive
```

atau

```bash
node src/index.js i
```

## 📊 Output Format

Report akan ditulis ke Google Spreadsheet dengan format:

| Timestamp | Task Description | Status | URL | Notes |
|-----------|-----------------|--------|-----|-------|
| 23/11/2024 15:30 | [repo/name] Feature X | Need Review | https://github.com/... | PR #123 |
| 23/11/2024 15:30 | Working on branch: feature/new-api | WIP | | Uncommitted: Yes, Unpushed commits: 3 |
| 23/11/2024 15:30 | Server maintenance | Completed | | Manual entry |

## 🎯 Status Types

### GitHub PR Status
- **Need Review**: PR baru yang dibuat hari ini dan masih open (belum ada comment dari orang lain)
- **Need Changes**: PR yang ada comment/review dari orang lain dan belum di-respond atau di-update
- **Done**: PR yang sudah di-merge (merged)
- **Closed**: PR yang di-close tanpa merge
- **Updated**: PR yang di-update hari ini (bukan hari ini dibuat)

### Local Git Status
- **WIP**: Work in progress (uncommitted changes atau unpushed commits)

### Manual Task Status
- **Completed**: Task manual yang sudah selesai
- **In Progress**: Task manual yang sedang dikerjakan
- **Blocked**: Task manual yang terblokir

## 🔧 Troubleshooting

### Error: "GITHUB_TOKEN is required"

Pastikan file `.env` sudah dibuat dan berisi `GITHUB_TOKEN` yang valid.

### Error: "Failed to initialize Google Sheets"

1. Pastikan file service account JSON ada di path yang benar
2. Pastikan Google Sheets API sudah di-enable
3. Pastikan spreadsheet sudah di-share dengan service account email

### Error: "No tasks found for today"

Ini normal jika:
- Tidak ada PR baru atau update hari ini
- Tidak ada WIP di branch lokal
- Tidak menambahkan manual tasks

Anda bisa menambahkan manual tasks dengan flag `--manual`.

### WIP tidak terdeteksi

Pastikan:
1. Anda sedang berada di branch selain `main` atau `master`
2. Ada uncommitted changes atau unpushed commits
3. `LOCAL_REPO_PATH` di `.env` sudah benar (atau kosong untuk current directory)

## 🤝 Contributing

Feel free to submit issues or pull requests!

## 📝 License

MIT
