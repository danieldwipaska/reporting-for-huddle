# Quick Start - Mulai Cepat

Panduan singkat untuk langsung mulai menggunakan tool ini.

## ⚡ 3 Langkah Cepat

### 1. Install
```bash
npm install
```

### 2. Setup `.env`
```bash
cp .env.example .env
nano .env  # Edit dengan credentials Anda
```

Isi minimal:
- `GITHUB_TOKEN` - dari GitHub Settings
- `GITHUB_USERNAME` - username GitHub Anda
- `GOOGLE_SPREADSHEET_ID` - dari URL spreadsheet
- `GOOGLE_SERVICE_ACCOUNT_PATH` - path ke file JSON

### 3. Run
```bash
npm start
```

## 📚 Butuh Setup Detail?

Lihat [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk panduan lengkap step-by-step.

## 🎯 Commands

| Command | Deskripsi |
|---------|-----------|
| `npm start` | Quick submit (auto-detect tasks) |
| `node src/index.js submit --manual` | Submit dengan manual tasks |
| `node src/index.js submit --preview` | Preview tanpa submit |
| `node src/index.js interactive` | Mode interaktif |

## 🔑 Yang Perlu Disiapkan

1. **GitHub Token** - [Cara buat](https://github.com/settings/tokens)
2. **Google Service Account** - [Cara buat](https://console.cloud.google.com/)
3. **Google Spreadsheet** - Buat di [Google Sheets](https://sheets.google.com/)

## ⚠️ Jangan Lupa!

- Share spreadsheet dengan service account email
- Enable Google Sheets API di Google Cloud
- File service account JSON di folder `credentials/`

## 💡 Tips

### Untuk daily use:
```bash
# Pagi: Check apa yang akan dilaporkan
node src/index.js submit --preview

# Sore: Submit report
npm start

# Jika ada task manual:
node src/index.js submit --manual
```

### Buat alias (optional):
Tambahkan ke `.bashrc` atau `.zshrc`:
```bash
alias report="cd ~/path/to/afternoon_reporting && npm start"
alias report-preview="cd ~/path/to/afternoon_reporting && node src/index.js submit --preview"
```

Lalu bisa langsung:
```bash
report
```

## 🆘 Troubleshooting Cepat

| Error | Solusi |
|-------|--------|
| "GITHUB_TOKEN is required" | Check `.env` file |
| "Failed to initialize Google Sheets" | Check service account JSON file |
| "The caller does not have permission" | Share spreadsheet dengan service account |
| "No tasks found" | Normal, gunakan `--manual` untuk add task |

## 📖 Dokumentasi Lengkap

- [README.md](./README.md) - Overview & features
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup lengkap step-by-step
