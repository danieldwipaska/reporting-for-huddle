# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-11-23

### Added
- **"Need Changes" Status Detection**: Script sekarang mendeteksi PR yang membutuhkan perubahan
  - Mengecek semua **comments**, **review comments**, dan **reviews** di PR
  - Jika comment/review terakhir dari **orang lain** (bukan diri sendiri)
  - Dan PR **belum di-update** atau **belum di-respond** setelah comment tersebut
  - Maka PR akan ditandai sebagai **"Need Changes"** ⚠️
- **Proper Merged PR Detection**: Added `getPRDetails()` method untuk fetch full PR details dan check merged status dengan akurat

### Changed
- Updated `GitHubService.checkNeedChanges()` - New method untuk check unresponded comments
- Updated `GitHubService.getPRStatus()` - Sekarang async dan check comments, plus fetch full PR details
- Updated `GitHubService.getTodayPRs()` - Menggunakan Promise.all untuk async status check
- Updated `GitHubService.getUpdatedPRs()` - Menggunakan Promise.all untuk async status check

### Fixed
- **Critical Bug**: Fixed hardcoded status in `ReportService.collectTasks()` yang meng-override status dari GitHub service
  - Sebelumnya: Status selalu "Need Review" atau "Updated" (hardcoded)
  - Sekarang: Menggunakan status aktual dari GitHub service ("Done", "Need Changes", "Closed", dll)

### Technical Details
- Menggunakan 3 API endpoints:
  - `issues.listComments` - Regular PR comments
  - `pulls.listReviewComments` - Code review comments
  - `pulls.listReviews` - PR reviews (approve, request changes, etc)
- Menggabungkan semua interactions dan sort by date
- Compare timestamp comment terakhir dengan PR updated_at

### Example Output
```
📊 Report Summary:
──────────────────────────────────────────────────
1. [Need Changes] [owner/repo] Add authentication
   🔗 https://github.com/owner/repo/pull/123
   📌 PR #123

2. [Need Review] [owner/repo] Fix payment bug
   🔗 https://github.com/owner/repo/pull/124
   📌 PR #124

3. [Done] [owner/repo] Update documentation
   🔗 https://github.com/owner/repo/pull/125
   📌 PR #125
──────────────────────────────────────────────────
```

## [1.1.0] - 2024-11-23

### Added
- **Smart PR Status Detection**: Script sekarang otomatis mendeteksi status PR yang sebenarnya
  - PR yang sudah **merged** akan ditandai sebagai **"Done"**
  - PR yang **closed** tanpa merge akan ditandai sebagai **"Closed"**
  - PR yang masih **open** akan tetap sebagai **"Need Review"** atau **"Updated"**

### Changed
- Updated `GitHubService.getTodayPRs()` untuk mendeteksi merged status
- Updated `GitHubService.getUpdatedPRs()` untuk mendeteksi merged status
- Added new method `GitHubService.getPRStatus()` untuk menentukan status PR

### Technical Details
- Menggunakan `pr.pull_request.merged_at` dari GitHub API untuk deteksi merged
- Menggunakan `pr.state` untuk deteksi open/closed
- Status ditentukan berdasarkan kombinasi state dan merged status

### Example Output
```
📊 Report Summary:
──────────────────────────────────────────────────
1. [Done] [owner/repo] Add authentication feature
   🔗 https://github.com/owner/repo/pull/123
   📌 PR #123

2. [Need Review] [owner/repo] Fix bug in payment
   🔗 https://github.com/owner/repo/pull/124
   📌 PR #124

3. [Closed] [owner/repo] Experimental feature
   🔗 https://github.com/owner/repo/pull/125
   📌 PR #125
──────────────────────────────────────────────────
```

## [1.0.0] - 2024-11-23

### Initial Release
- Auto-detect GitHub PRs (new and updated)
- Local Git WIP detection
- Manual task entry
- Google Sheets integration
- Interactive CLI mode
- Preview mode
- Comprehensive documentation
