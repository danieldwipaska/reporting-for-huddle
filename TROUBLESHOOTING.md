# Troubleshooting Guide

Panduan mengatasi masalah umum yang mungkin terjadi.

## 🔍 Diagnosis Cepat

Jalankan checklist ini untuk memastikan setup sudah benar:

```bash
# 1. Check Node.js version
node --version  # Harus >= 18

# 2. Check dependencies installed
ls node_modules  # Harus ada banyak folder

# 3. Check .env file exists
cat .env  # Harus menampilkan isi file

# 4. Check credentials file exists
ls -la credentials/service-account.json  # Harus ada file

# 5. Test preview (tidak menulis ke spreadsheet)
node src/index.js submit --preview
```

## ❌ Error Messages & Solutions

### 1. "GITHUB_TOKEN is required"

**Penyebab:**
- File `.env` tidak ada atau kosong
- `GITHUB_TOKEN` tidak diisi di `.env`
- Ada typo di nama variable

**Solusi:**
```bash
# Check file .env ada
ls -la .env

# Check isi file
cat .env

# Pastikan ada baris:
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=your_username
```

**Cara fix:**
1. Copy `.env.example` jika belum ada `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` dan isi `GITHUB_TOKEN`
3. Pastikan tidak ada spasi sebelum/sesudah `=`

---

### 2. "GOOGLE_SPREADSHEET_ID is required"

**Penyebab:**
- `GOOGLE_SPREADSHEET_ID` tidak diisi di `.env`

**Solusi:**
1. Buka Google Spreadsheet Anda
2. Copy ID dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY_THIS_PART]/edit
   ```
3. Paste ke `.env`:
   ```env
   GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j
   ```

---

### 3. "Failed to initialize Google Sheets"

**Penyebab:**
- File service account JSON tidak ada
- Path salah di `.env`
- File JSON corrupt atau invalid

**Solusi:**

**A. Check file exists:**
```bash
ls -la credentials/service-account.json
```

**B. Check path di .env:**
```env
GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/service-account.json
```

**C. Validate JSON:**
```bash
cat credentials/service-account.json | python -m json.tool
```

Jika error, download ulang service account key dari Google Cloud Console.

**D. Check file permissions:**
```bash
chmod 600 credentials/service-account.json
```

---

### 4. "The caller does not have permission"

**Penyebab:**
- Spreadsheet belum di-share dengan service account email
- Service account tidak punya akses Editor

**Solusi:**

**A. Get service account email:**
```bash
cat credentials/service-account.json | grep client_email
```

Output:
```json
"client_email": "afternoon-reporting@project-id.iam.gserviceaccount.com"
```

**B. Share spreadsheet:**
1. Buka Google Spreadsheet
2. Klik **Share** (kanan atas)
3. Paste service account email
4. Pilih role: **Editor**
5. **UNCHECK** "Notify people"
6. Klik **Share**

**C. Verify:**
- Buka spreadsheet
- Klik Share
- Service account email harus muncul di list dengan role "Editor"

---

### 5. "API has not been used in project"

**Full error:**
```
Google Sheets API has not been used in project XXXXX before or it is disabled
```

**Penyebab:**
- Google Sheets API belum di-enable di project

**Solusi:**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project yang benar
3. Menu ☰ > **APIs & Services** > **Library**
4. Search: `Google Sheets API`
5. Klik **Google Sheets API**
6. Klik **ENABLE**
7. Tunggu beberapa detik
8. Try run script lagi

---

### 6. "No tasks found for today"

**Penyebab:**
- Tidak ada PR baru atau update hari ini
- Tidak ada WIP di branch lokal
- Tidak menambahkan manual tasks

**Solusi:**

Ini **BUKAN ERROR**, hanya informasi bahwa tidak ada task otomatis terdeteksi.

**Options:**
```bash
# A. Tambahkan manual tasks
node src/index.js submit --manual

# B. Preview untuk check apa yang terdeteksi
node src/index.js submit --preview

# C. Use interactive mode
node src/index.js interactive
```

---

### 7. "Request failed with status code 404" (GitHub)

**Penyebab:**
- GitHub token invalid atau expired
- Username salah
- Token tidak punya scope yang benar

**Solusi:**

**A. Validate token:**
```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" https://api.github.com/user
```

Jika error, token invalid.

**B. Generate new token:**
1. [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Select scope: `repo`
4. Update `.env` dengan token baru

**C. Check username:**
```bash
# Pastikan username benar (case-sensitive)
GITHUB_USERNAME=your_actual_username
```

---

### 8. "Cannot find module" atau "MODULE_NOT_FOUND"

**Penyebab:**
- Dependencies belum diinstall
- `node_modules` terhapus

**Solusi:**
```bash
# Install dependencies
npm install

# Jika masih error, hapus dan install ulang
rm -rf node_modules package-lock.json
npm install
```

---

### 9. WIP tidak terdeteksi

**Penyebab:**
- Sedang di branch `main` atau `master`
- Tidak ada uncommitted changes atau unpushed commits
- Path repository salah

**Solusi:**

**A. Check current branch:**
```bash
git branch
```

WIP hanya terdeteksi jika di branch selain `main`/`master`.

**B. Check status:**
```bash
git status
```

Harus ada changes atau unpushed commits.

**C. Check repository path:**

Di `.env`:
```env
# Kosongkan untuk current directory
LOCAL_REPO_PATH=

# Atau specify path
LOCAL_REPO_PATH=/path/to/your/repo
```

---

### 10. "ENOENT: no such file or directory"

**Penyebab:**
- File atau folder tidak ada
- Path salah

**Solusi:**

**Check what file is missing:**
```bash
# Common files to check:
ls -la .env
ls -la credentials/service-account.json
ls -la src/index.js
```

**Create missing directories:**
```bash
mkdir -p credentials
```

---

## 🔧 Advanced Troubleshooting

### Enable Debug Mode

Tambahkan di awal script untuk debug:

Edit `src/index.js`, tambahkan di atas:
```javascript
process.env.DEBUG = 'true';
```

### Check API Quotas

Google Sheets API memiliki quota:
- 100 requests per 100 seconds per user
- 500 requests per 100 seconds per project

Jika hit quota, tunggu beberapa menit.

### Test Components Individually

**Test GitHub API:**
```bash
node -e "
import { GitHubService } from './src/services/github.js';
const gh = new GitHubService();
gh.getTodayPRs().then(prs => console.log(prs));
"
```

**Test Google Sheets:**
```bash
node -e "
import { GoogleSheetsService } from './src/services/sheets.js';
const sheets = new GoogleSheetsService();
sheets.initialize().then(() => console.log('OK'));
"
```

### Check Network

```bash
# Test GitHub API
curl https://api.github.com

# Test Google API
curl https://sheets.googleapis.com
```

---

## 🆘 Still Having Issues?

### Collect Information

1. **Node version:**
   ```bash
   node --version
   ```

2. **OS:**
   ```bash
   uname -a
   ```

3. **Error message:**
   Copy full error message

4. **Config (without secrets):**
   ```bash
   cat .env | sed 's/=.*/=***/'
   ```

5. **File structure:**
   ```bash
   tree -L 2 -a
   ```

### Common Fixes

**Nuclear option (reset everything):**
```bash
# Backup .env
cp .env .env.backup

# Clean install
rm -rf node_modules package-lock.json
npm install

# Restore .env
cp .env.backup .env

# Test
npm start
```

---

## ✅ Verification Checklist

Sebelum run, pastikan:

- [ ] Node.js >= 18 installed
- [ ] `npm install` sudah dijalankan
- [ ] File `.env` ada dan terisi
- [ ] File `credentials/service-account.json` ada
- [ ] GitHub token valid (test di browser: https://github.com/settings/tokens)
- [ ] Google Sheets API enabled
- [ ] Spreadsheet di-share dengan service account
- [ ] Internet connection stable

---

## 📚 Resources

- [GitHub Token Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Google Service Account Guide](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
