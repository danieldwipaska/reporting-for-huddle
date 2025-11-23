# Setup Checklist ✅

Gunakan checklist ini untuk memastikan setup sudah lengkap dan benar.

## 📋 Pre-Setup

- [ ] Node.js v18+ terinstall (`node --version`)
- [ ] NPM terinstall (`npm --version`)
- [ ] Git terinstall (`git --version`)
- [ ] Akses ke GitHub account
- [ ] Akses ke Google account

## 🔧 Installation

- [ ] Clone/download project
- [ ] Buka terminal di folder project
- [ ] Run `npm install`
- [ ] Tunggu hingga selesai (no errors)

## 🔑 GitHub Setup

- [ ] Login ke GitHub
- [ ] Buka Settings > Developer settings > Personal access tokens
- [ ] Generate new token (classic)
- [ ] Pilih scope: `repo` (Full control)
- [ ] Copy token (simpan di tempat aman)
- [ ] Token format: `ghp_xxxxxxxxxxxx...`

## ☁️ Google Cloud Setup

### Project & API
- [ ] Login ke Google Cloud Console
- [ ] Buat project baru (atau pilih existing)
- [ ] Project name: `Afternoon Reporting` (atau nama lain)
- [ ] Enable Google Sheets API
- [ ] Verify API enabled (check di APIs & Services > Enabled APIs)

### Service Account
- [ ] Buat Service Account
- [ ] Service account name: `afternoon-reporting`
- [ ] Skip role assignment
- [ ] Create & download JSON key
- [ ] Rename file ke `service-account.json`
- [ ] Copy service account email (dari JSON file)

## 📊 Google Spreadsheet Setup

- [ ] Buat Google Spreadsheet baru (atau gunakan existing)
- [ ] Copy Spreadsheet ID dari URL
- [ ] Share spreadsheet dengan service account email
- [ ] Role: Editor
- [ ] Uncheck "Notify people"
- [ ] Verify service account ada di shared list

## 📁 File Setup

### Credentials
- [ ] Buat folder `credentials/` (jika belum ada)
- [ ] Copy `service-account.json` ke `credentials/`
- [ ] Verify: `ls credentials/service-account.json`

### Environment Variables
- [ ] Copy `.env.example` ke `.env`
- [ ] Edit `.env` file
- [ ] Isi `GITHUB_TOKEN`
- [ ] Isi `GITHUB_USERNAME`
- [ ] Isi `GOOGLE_SPREADSHEET_ID`
- [ ] Isi `GOOGLE_SHEET_NAME` (default: Sheet1)
- [ ] Isi `GOOGLE_SERVICE_ACCOUNT_PATH` (default: ./credentials/service-account.json)
- [ ] Save file

## ✅ Verification

### Config Check
- [ ] Run: `cat .env` (pastikan semua terisi)
- [ ] No typos di variable names
- [ ] No extra spaces
- [ ] Tokens valid (no expired)

### File Check
```bash
# Run these commands:
- [ ] ls -la .env                                    # File exists
- [ ] ls -la credentials/service-account.json        # File exists
- [ ] cat credentials/service-account.json | head   # Valid JSON
- [ ] ls -la src/index.js                           # File exists
```

### Permission Check
- [ ] Service account email di shared list spreadsheet
- [ ] Role = Editor (bukan Viewer)
- [ ] Google Sheets API enabled

## 🧪 Testing

### Preview Test (Safe - No Write)
```bash
- [ ] Run: node src/index.js submit --preview
- [ ] No errors
- [ ] Shows "Fetching GitHub PRs..."
- [ ] Shows "Checking for WIP tasks..."
- [ ] Shows preview (or "No tasks found")
```

### Quick Submit Test
```bash
- [ ] Run: npm start
- [ ] No errors
- [ ] Shows "Report submitted successfully!"
- [ ] Check spreadsheet - new row(s) added
```

### Manual Task Test
```bash
- [ ] Run: node src/index.js submit --manual
- [ ] Prompt appears
- [ ] Add test task
- [ ] Submit
- [ ] Check spreadsheet - task appears
```

### Interactive Test
```bash
- [ ] Run: node src/index.js interactive
- [ ] Menu appears
- [ ] Can navigate with arrows
- [ ] Can select and execute
```

## 🎯 Final Checks

### Spreadsheet Format
- [ ] Headers ada (Timestamp, Task Description, Status, URL, Notes)
- [ ] Data terformat dengan benar
- [ ] Timestamp dalam format yang benar
- [ ] URLs clickable

### Functionality
- [ ] GitHub PRs terdeteksi
- [ ] WIP terdeteksi (jika ada)
- [ ] Manual tasks bisa ditambahkan
- [ ] Data masuk ke spreadsheet
- [ ] No duplicate entries

### Security
- [ ] `.env` di-gitignore
- [ ] `credentials/` di-gitignore
- [ ] No secrets di code
- [ ] Service account JSON aman

## 📝 Documentation Read

- [ ] Baca README.md
- [ ] Baca QUICK_START.md
- [ ] Bookmark TROUBLESHOOTING.md
- [ ] Understand commands available

## 🚀 Ready to Use!

Jika semua checklist di atas sudah ✅, Anda siap menggunakan tool ini!

### Daily Usage:
```bash
# Setiap sore:
npm start

# Atau dengan manual tasks:
node src/index.js submit --manual

# Atau interactive:
node src/index.js i
```

## ⚠️ If Something Fails

1. **Don't panic!** 😊
2. Check TROUBLESHOOTING.md
3. Verify checklist items above
4. Re-run verification tests
5. Check error message carefully

## 💡 Tips

### Create Alias (Optional)
Tambahkan ke `.bashrc` atau `.zshrc`:
```bash
alias afternoon-report="cd ~/path/to/afternoon_reporting && npm start"
alias ar="cd ~/path/to/afternoon_reporting && npm start"
```

Lalu bisa langsung:
```bash
ar
```

### Scheduled Reporting (Optional)
Setup cron job untuk reminder:
```bash
# Edit crontab
crontab -e

# Add line (run at 4 PM every weekday):
0 16 * * 1-5 /usr/bin/osascript -e 'display notification "Time for afternoon report!" with title "Reminder"'
```

### Backup
Backup `.env` dan `credentials/` di tempat aman (encrypted).

---

## 🎉 Congratulations!

Setup complete! Selamat menggunakan Afternoon Reporting Automation! 🚀

**Next Steps:**
1. Test run hari ini
2. Adjust sesuai kebutuhan
3. Gunakan setiap hari kerja
4. Enjoy automated reporting! 😎
