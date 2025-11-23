# 🚀 START HERE - Afternoon Reporting Automation

Selamat datang! Ini adalah tool automasi untuk afternoon reporting Anda.

## 📖 Apa yang Bisa Tool Ini Lakukan?

Tool ini akan **otomatis mengumpulkan** dan **melaporkan** aktivitas development Anda ke Google Spreadsheet, termasuk:

✅ **PR GitHub baru** yang Anda buat hari ini → Status: "Need Review"  
✅ **PR yang di-update** hari ini → Status: "Updated"  
✅ **Work in Progress (WIP)** dari branch lokal Anda  
✅ **Task manual** untuk pekerjaan server atau task lain  

## 🎯 Quick Navigation

Pilih sesuai kebutuhan Anda:

### 🏃 Saya Ingin Langsung Mulai!
→ Baca [QUICK_START.md](./QUICK_START.md) (3 langkah cepat)

### 📚 Saya Ingin Setup Lengkap Step-by-Step
→ Baca [SETUP_GUIDE.md](./SETUP_GUIDE.md) (panduan detail)

### ✅ Saya Ingin Checklist Setup
→ Baca [CHECKLIST.md](./CHECKLIST.md) (checklist lengkap)

### ❓ Saya Mengalami Masalah
→ Baca [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (solusi error)

### 🏗️ Saya Ingin Tahu Cara Kerjanya
→ Baca [ARCHITECTURE.md](./ARCHITECTURE.md) (arsitektur sistem)

### 📋 Saya Ingin Lihat Struktur Project
→ Baca [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) (struktur file)

### 📖 Saya Ingin Overview Lengkap
→ Baca [README.md](./README.md) (dokumentasi utama)

---

## ⚡ Super Quick Start (5 Menit)

Jika Anda sudah familiar dengan setup Node.js dan API:

```bash
# 1. Install dependencies
npm install

# 2. Setup credentials
cp .env.example .env
# Edit .env dengan credentials Anda

# 3. Jalankan
npm start
```

**Yang Anda Butuhkan:**
- GitHub Personal Access Token
- Google Service Account JSON
- Google Spreadsheet ID

Lihat [QUICK_START.md](./QUICK_START.md) untuk detail.

---

## 📋 Setup Requirements

Sebelum mulai, pastikan Anda punya:

- [ ] **Node.js v18+** installed
- [ ] **GitHub Account** dengan access token
- [ ] **Google Account** untuk Sheets & Cloud
- [ ] **Google Spreadsheet** (buat baru atau gunakan existing)

---

## 🎓 First Time Setup (Recommended Path)

Ikuti urutan ini untuk setup pertama kali:

### Step 1: Baca Overview
📖 [README.md](./README.md) - Pahami fitur dan cara kerja tool

### Step 2: Ikuti Setup Guide
📚 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup lengkap step-by-step

### Step 3: Gunakan Checklist
✅ [CHECKLIST.md](./CHECKLIST.md) - Pastikan semua sudah benar

### Step 4: Test Run
```bash
# Preview (tidak menulis ke spreadsheet)
node src/index.js submit --preview

# Actual submit
npm start
```

### Step 5: Bookmark Troubleshooting
🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Untuk jaga-jaga

---

## 🎯 Daily Usage

Setelah setup selesai, gunakan setiap hari:

### Cara Paling Simple
```bash
npm start
```

### Dengan Manual Tasks
```bash
node src/index.js submit --manual
```

### Mode Interaktif
```bash
node src/index.js interactive
```

### Preview Dulu (Tidak Submit)
```bash
node src/index.js submit --preview
```

---

## 📊 Contoh Output

Setelah run, tool akan:

1. ✅ Fetch PR dari GitHub
2. ✅ Check WIP di local repo
3. ✅ Tampilkan summary
4. ✅ Tulis ke Google Spreadsheet

**Contoh di spreadsheet:**

| Timestamp | Task Description | Status | URL | Notes |
|-----------|-----------------|--------|-----|-------|
| 23/11/24 15:30 | [repo] Add auth feature | Need Review | github.com/... | PR #123 |
| 23/11/24 15:30 | Working on: feature/api | WIP | | 3 unpushed commits |
| 23/11/24 15:30 | Deploy staging server | Completed | | Manual entry |

Lihat [examples/sample-output.md](./examples/sample-output.md) untuk lebih banyak contoh.

---

## 🔑 Credentials Yang Dibutuhkan

### 1. GitHub Personal Access Token
- Buat di: [github.com/settings/tokens](https://github.com/settings/tokens)
- Scope: `repo` (Full control of private repositories)
- Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Google Service Account
- Buat di: [console.cloud.google.com](https://console.cloud.google.com/)
- Enable: Google Sheets API
- Download: JSON key file
- Simpan di: `credentials/service-account.json`

### 3. Google Spreadsheet
- Buat di: [sheets.google.com](https://sheets.google.com/)
- Copy: Spreadsheet ID dari URL
- **PENTING**: Share dengan service account email

Detail lengkap di [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📁 File Structure

```
afternoon_reporting/
├── src/                    # Source code
│   ├── index.js           # Main CLI
│   ├── config.js          # Configuration
│   └── services/          # Service layer
│       ├── github.js      # GitHub API
│       ├── git.js         # Local Git
│       ├── sheets.js      # Google Sheets
│       └── reporter.js    # Main logic
│
├── credentials/           # Credentials (gitignored)
│   └── service-account.json
│
├── .env                   # Environment vars (gitignored)
├── .env.example          # Template
│
└── Documentation/
    ├── README.md          # Main docs
    ├── SETUP_GUIDE.md     # Setup guide
    ├── QUICK_START.md     # Quick start
    ├── CHECKLIST.md       # Setup checklist
    ├── TROUBLESHOOTING.md # Error solutions
    ├── ARCHITECTURE.md    # System architecture
    └── PROJECT_STRUCTURE.md # File structure
```

---

## 🎨 Commands Reference

| Command | Description |
|---------|-------------|
| `npm start` | Quick submit (default) |
| `node src/index.js quick` | Same as npm start |
| `node src/index.js submit` | Submit report |
| `node src/index.js submit --manual` | Submit with manual tasks |
| `node src/index.js submit --preview` | Preview without submit |
| `node src/index.js interactive` | Interactive mode |
| `node src/index.js i` | Interactive mode (short) |

---

## ⚠️ Common Issues

### "GITHUB_TOKEN is required"
→ Check `.env` file, pastikan `GITHUB_TOKEN` terisi

### "Failed to initialize Google Sheets"
→ Check `credentials/service-account.json` ada dan valid

### "The caller does not have permission"
→ Share spreadsheet dengan service account email

### "No tasks found for today"
→ Normal jika tidak ada PR/WIP, gunakan `--manual` untuk add task

Lihat [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) untuk solusi lengkap.

---

## 💡 Pro Tips

### 1. Buat Alias
Tambahkan ke `.bashrc` atau `.zshrc`:
```bash
alias report="cd ~/path/to/afternoon_reporting && npm start"
```

Lalu tinggal ketik:
```bash
report
```

### 2. Setup Reminder
Gunakan cron job atau calendar reminder untuk run setiap sore.

### 3. Preview Dulu
Sebelum submit, preview dulu untuk memastikan data benar:
```bash
node src/index.js submit --preview
```

### 4. Backup Credentials
Backup `.env` dan `credentials/` di tempat aman (encrypted).

---

## 🆘 Need Help?

1. **Check Documentation**
   - Baca file yang relevan di atas
   - Lihat [examples/sample-output.md](./examples/sample-output.md)

2. **Check Troubleshooting**
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) punya solusi untuk error umum

3. **Verify Setup**
   - Gunakan [CHECKLIST.md](./CHECKLIST.md) untuk verify setup

4. **Test Components**
   - Test preview mode dulu: `node src/index.js submit --preview`

---

## 🎉 Ready to Start?

Pilih path Anda:

### 🏃 Quick (5 menit)
→ [QUICK_START.md](./QUICK_START.md)

### 📚 Detailed (15 menit)
→ [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### ✅ Checklist
→ [CHECKLIST.md](./CHECKLIST.md)

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check dokumentasi di atas
2. Verify setup dengan checklist
3. Lihat troubleshooting guide

---

## 🚀 Let's Go!

Selamat menggunakan Afternoon Reporting Automation!

**Next Step:** Pilih salah satu guide di atas dan mulai setup! 🎯

---

**Happy Reporting! 😊**
