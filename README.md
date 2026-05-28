# SiHitamList — Platform Anime Premium 🎌

> **Web berbasis statis yang menampilkan info seputar anime** — didesain ulang sepenuhnya menjadi platform anime sinematik dan premium.

![Version](https://img.shields.io/badge/version-2.0.0-cyan)
![License](https://img.shields.io/badge/license-MIT-blue)
![API](https://img.shields.io/badge/API-Jikan%20v4-orange)
![Status](https://img.shields.io/badge/status-Production%20Ready-green)

---

## ✨ Overview

SiHitamList adalah platform anime berbasis web statis yang dibangun di atas **Jikan API v4** (unofficial MyAnimeList API). Versi 2.0 menghadirkan pengalaman sinematik dan premium yang setara dengan AniList, Crunchyroll, dan Netflix-inspired UI.

---

## 🎯 Features

| Fitur | Status |
|-------|--------|
| 🎬 **Hero sinematik** dengan rotasi otomatis | ✅ |
| 🔍 **Live search** dengan debounce | ✅ |
| 🏷️ **Genre filter** interaktif | ✅ |
| 📄 **Detail modal** — sinopsis, trailer, stats | ✅ |
| 🔖 **Bookmark / Favorites** — persistent localStorage | ✅ |
| 🕐 **Recently Viewed** — localStorage | ✅ |
| 🦴 **Skeleton loading** — shimmer animation | ✅ |
| 📑 **Pagination** modern | ✅ |
| 📱 **Responsive** — mobile-first | ✅ |
| 🎭 **Smooth animations** | ✅ |
| ♿ **Accessibility** — semantic HTML, keyboard nav | ✅ |

---

## 🖥️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES2020+)
- **Fonts:** Audiowide · Rajdhani · Barlow (Google Fonts)
- **API:** [Jikan API v4](https://docs.api.jikan.moe/) — free MyAnimeList API
- **Storage:** localStorage (bookmarks, recently viewed)
- **Build:** Zero — pure static, no bundler required

---

## 🏗️ Architecture

```
index.html
├── 📐 Design Tokens (CSS custom properties)
├── 🎨 Component Styles (BEM-inspired naming)
├── 🔧 Config (constants, limits, timings)
├── 🌐 ApiService (centralized, cached, rate-limited)
├── 💾 StorageService (localStorage abstraction)
├── 🗺️ State (single source of truth)
├── 🧩 Rendering Functions (pure, composable)
├── 🎭 Event Handlers (delegated, debounced)
└── 🚀 init()
```

### JavaScript Modules (logical separation dalam single file)

```javascript
ApiService    // Semua request ke Jikan API + in-memory cache
StorageService // localStorage read/write dengan JSON safety
state         // App state terpusat (view, page, query, filters)
renderCard()  // Komponen card anime yang reusable
renderPagination() // Komponen pagination dinamis
openModal()   // Detail view + trailer embed
switchToView() // View router (top/airing/upcoming/popular/search/bookmarks)
```

---

## 🚀 Setup & Installation

### Cara 1 — Buka langsung (zero setup)
```bash
# Clone repo
git clone https://github.com/Dsky4003/SiHitamList.git
cd SiHitamList

# Buka di browser langsung
open index.html
```

### Cara 2 — Dengan local server (recommended)
```bash
# Menggunakan Python
python3 -m http.server 8080

# Atau menggunakan Node.js
npx serve .

# Buka: http://localhost:8080
```

### Cara 3 — Deploy ke GitHub Pages
```bash
# Push ke branch main, lalu aktifkan GitHub Pages
# Settings → Pages → Source: main branch / root
```

---

## 🌐 API

SiHitamList menggunakan **Jikan API v4** — unofficial MyAnimeList REST API.

| Endpoint | Digunakan untuk |
|----------|----------------|
| `GET /top/anime` | Top anime, popular |
| `GET /seasons/now` | Airing saat ini + Hero |
| `GET /seasons/upcoming` | Upcoming anime |
| `GET /anime?q=...` | Pencarian live |
| `GET /anime/{id}/full` | Detail modal |
| `GET /genres/anime` | Genre filter |

> **Rate limit:** ~3 request/detik. ApiService sudah menangani ini secara otomatis.

---

## 🎨 Design System

### Palette
```css
--bg-base:     #07080f   /* Background utama */
--bg-elevated: #0c0d1c   /* Card/panel */
--cyan:        #00d4ff   /* Aksen utama */
--blue:        #2563eb   /* Aksen sekunder */
--gold:        #fbbf24   /* Rating/skor */
--red:         #ff3b6b   /* Favorite/delete */
--text-primary:#eef0f8   /* Teks utama */
```

### Typography
- **Brand/Logo:** Audiowide (Google Fonts)
- **Heading/UI:** Rajdhani — tegas, futuristik
- **Body:** Barlow — bersih, readable

---

## 📱 Responsiveness

| Breakpoint | Layout |
|------------|--------|
| `> 1024px` | Full desktop grid, 5-6 kolom |
| `768–1024px` | Tablet layout, 3-4 kolom |
| `< 768px` | Mobile, hamburger menu, 2 kolom |
| `< 480px` | Compact mobile, 2 kolom sempit |

---

## 🔧 Customization

### Ubah jumlah kartu per halaman
```javascript
const CONFIG = {
  CARDS_PER_PAGE: 24,  // ubah sesuai kebutuhan
};
```

### Ubah interval rotasi Hero
```javascript
const CONFIG = {
  HERO_ROTATE_INTERVAL: 8000,  // ms
};
```

### Tambah kategori baru
```javascript
// Tambah di switch(state.view) dalam loadCurrentView()
case 'movies':
  title.textContent = 'Anime Movies';
  res = await ApiService.getTopAnime('movie', state.page);
  break;
```

---

## 🚀 Roadmap v3

- [ ] User authentication (Google OAuth)
- [ ] Watchlist & progress tracking
- [ ] Character & voice actor pages
- [ ] Seasonal anime calendar
- [ ] Community reviews & ratings
- [ ] PWA support (offline-first)
- [ ] Dark/Light theme toggle
- [ ] Advanced multi-filter panel

---

## 📸 Screenshots

> *Tambahkan screenshot setelah deploy*

---

## 🤝 Contributing

1. Fork repo ini
2. Buat branch fitur: `git checkout -b feature/nama-fitur`
3. Commit: `git commit -m 'feat: tambah fitur X'`
4. Push: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## 📄 License

MIT License — lihat [LICENSE](LICENSE) untuk detail.

---

## 🙏 Credits

- Data anime: [MyAnimeList](https://myanimelist.net) via [Jikan API](https://jikan.moe)
- Font: [Google Fonts](https://fonts.google.com)
- Dibuat dengan ❤️ oleh **Dsky4003** untuk komunitas anime Indonesia

---

*SiHitamList v2.0 — Dari prototype ke platform premium.*
