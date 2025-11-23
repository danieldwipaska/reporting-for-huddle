# Setup Guide - Panduan Lengkap

Panduan step-by-step untuk setup afternoon reporting automation.

## 📝 Checklist Setup

- [ ] Install Node.js
- [ ] Clone/download project
- [ ] Install dependencies
- [ ] Buat GitHub Personal Access Token
- [ ] Setup Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Buat Service Account
- [ ] Download Service Account Key
- [ ] Buat/siapkan Google Spreadsheet
- [ ] Share spreadsheet dengan service account
- [ ] Configure `.env` file
- [ ] Test run

## 1️⃣ Install Node.js

Pastikan Node.js versi 18 atau lebih tinggi sudah terinstall:

```bash
node --version
```

Jika belum, download dari [nodejs.org](https://nodejs.org/)

## 2️⃣ Install Dependencies

```bash
cd afternoon_reporting
npm install
```

## 3️⃣ Setup GitHub Token

### Langkah-langkah:

1. Login ke GitHub
2. Klik foto profil (kanan atas) > **Settings**
3. Scroll ke bawah > **Developer settings** (paling bawah sidebar kiri)
4. **Personal access tokens** > **Tokens (classic)**
5. **Generate new token** > **Generate new token (classic)**
6. Isi form:
   - **Note**: `Afternoon Reporting Tool`
   - **Expiration**: Pilih sesuai kebutuhan (recommended: 90 days)
   - **Select scopes**: Centang `repo` (Full control of private repositories)
7. Klik **Generate token**
8. **PENTING**: Copy token sekarang! Token hanya ditampilkan sekali
9. Simpan token di tempat aman

### Format Token:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 4️⃣ Setup Google Cloud & Service Account

### A. Buat Project di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik dropdown project (atas, sebelah "Google Cloud")
3. Klik **NEW PROJECT**
4. Isi:
   - **Project name**: `Afternoon Reporting`
   - **Location**: Biarkan default atau pilih organization
5. Klik **CREATE**
6. Tunggu beberapa detik, lalu pilih project yang baru dibuat

### B. Enable Google Sheets API

1. Di Google Cloud Console, pastikan project yang benar sudah dipilih
2. Buka menu ☰ (hamburger) > **APIs & Services** > **Library**
3. Search: `Google Sheets API`
4. Klik **Google Sheets API**
5. Klik **ENABLE**
6. Tunggu hingga selesai

### C. Buat Service Account

1. Buka menu ☰ > **APIs & Services** > **Credentials**
2. Klik **+ CREATE CREDENTIALS** (atas)
3. Pilih **Service Account**
4. Isi form:
   - **Service account name**: `afternoon-reporting`
   - **Service account ID**: (auto-generated, biarkan)
   - **Description**: `Service account for afternoon reporting automation`
5. Klik **CREATE AND CONTINUE**
6. **Grant this service account access to project**: Skip (klik **CONTINUE**)
7. **Grant users access to this service account**: Skip (klik **DONE**)

### D. Download Service Account Key

1. Di halaman **Credentials**, scroll ke **Service Accounts**
2. Klik service account yang baru dibuat (`afternoon-reporting@...`)
3. Tab **KEYS**
4. **ADD KEY** > **Create new key**
5. Pilih **JSON**
6. Klik **CREATE**
7. File JSON akan otomatis terdownload
8. **Rename file** menjadi `service-account.json`

### E. Simpan Service Account Key

1. Buat folder `credentials` di project:
   ```bash
   mkdir credentials
   ```

2. Copy file `service-account.json` ke folder `credentials/`:
   ```bash
   mv ~/Downloads/service-account.json ./credentials/
   ```

3. Verify:
   ```bash
   ls -la credentials/
   ```
   
   Harus ada file `service-account.json`

### F. Catat Service Account Email

1. Buka file `credentials/service-account.json`
2. Cari field `client_email`, contoh:
   ```json
   {
     "client_email": "afternoon-reporting@project-id.iam.gserviceaccount.com"
   }
   ```
3. **Copy email ini**, akan digunakan untuk share spreadsheet

## 5️⃣ Setup Google Spreadsheet

### A. Buat Spreadsheet (atau gunakan yang sudah ada)

1. Buka [Google Sheets](https://sheets.google.com/)
2. Klik **Blank** untuk spreadsheet baru
3. Rename spreadsheet: `Afternoon Reporting`
4. (Optional) Rename sheet: `Daily Reports`

### B. Get Spreadsheet ID

Dari URL spreadsheet:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                      ^^^^^^^^^^^^^^^^^^^^
                                      Ini adalah Spreadsheet ID
```

Copy Spreadsheet ID (bagian antara `/d/` dan `/edit`)

### C. Share dengan Service Account

**INI LANGKAH PENTING!**

1. Di spreadsheet, klik **Share** (kanan atas)
2. Paste **service account email** (dari langkah 4F)
   ```
   afternoon-reporting@project-id.iam.gserviceaccount.com
   ```
3. Pilih role: **Editor**
4. **UNCHECK** "Notify people" (karena ini service account, bukan orang)
5. Klik **Share** atau **Done**

### D. (Optional) Setup Header

Jika ingin setup header manual:

| Timestamp | Task Description | Status | URL | Notes |
|-----------|-----------------|--------|-----|-------|

Script akan otomatis membuat header jika belum ada.

## 6️⃣ Configure Environment Variables

1. Copy template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env`:
   ```bash
   nano .env
   # atau
   code .env
   # atau editor favorit Anda
   ```

3. Isi dengan data Anda:

   ```env
   # GitHub Configuration
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   GITHUB_USERNAME=your_github_username
   
   # Google Sheets Configuration
   GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j
   GOOGLE_SHEET_NAME=Daily Reports
   
   # Google Service Account Credentials
   GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/service-account.json
   
   # Optional: Local Git Repository Path
   LOCAL_REPO_PATH=
   ```

4. Save file

## 7️⃣ Test Run

### Test Preview (tidak menulis ke spreadsheet):

```bash
node src/index.js submit --preview
```

Jika berhasil, Anda akan melihat:
- ✅ Fetching GitHub PRs...
- ✅ Checking for WIP tasks...
- ✅ Report Summary

### Test Submit (menulis ke spreadsheet):

```bash
npm start
```

Jika berhasil:
- ✅ Report submitted successfully!
- Check spreadsheet Anda, seharusnya ada data baru

## 🎉 Setup Complete!

Sekarang Anda bisa menggunakan tool ini setiap sore untuk reporting.

## 🔄 Daily Usage

### Quick submit (paling simple):
```bash
npm start
```

### Dengan manual tasks:
```bash
node src/index.js submit --manual
```

### Interactive mode:
```bash
node src/index.js i
```

## ❓ Troubleshooting

### "GITHUB_TOKEN is required"
- Check file `.env` ada dan benar
- Check `GITHUB_TOKEN` tidak ada spasi atau karakter aneh

### "Failed to initialize Google Sheets"
- Check file `credentials/service-account.json` ada
- Check path di `.env` benar: `./credentials/service-account.json`
- Check Google Sheets API sudah di-enable

### "The caller does not have permission"
- Spreadsheet belum di-share dengan service account email
- Ulangi langkah 5C

### "No tasks found for today"
- Normal jika tidak ada PR atau WIP hari ini
- Gunakan `--manual` untuk menambah task manual

## 📞 Need Help?

Jika masih ada masalah, check:
1. Semua file ada di tempat yang benar
2. Semua credentials valid
3. Internet connection stable
4. Node.js version >= 18
