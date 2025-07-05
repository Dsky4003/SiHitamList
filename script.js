let currentPage = 1;
let currentQuery = "";

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('animeResults');
const pageNum = document.getElementById('pageNum');

async function fetchAnime(query, page = 1) {
  currentQuery = query;
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}`);
  const data = await res.json();

  resultsContainer.innerHTML = "";

  if (!data.data || data.data.length === 0) {
    resultsContainer.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
    return;
  }

  data.data.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h4>${anime.title}</h4>
    `;
    card.addEventListener('click', () => showAnimeDetail(anime.mal_id));
    resultsContainer.appendChild(card);
  });

  pageNum.textContent = page;
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    currentPage = 1;
    fetchAnime(query, currentPage);
  } else {
    resultsContainer.innerHTML = "";
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  currentPage++;
  fetchAnime(currentQuery, currentPage);
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAnime(currentQuery, currentPage);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetchRecommendedAnime();
});

function fetchRecommendedAnime() {
  fetch("https://api.jikan.moe/v4/top/anime?limit=16")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recommendedAnime");
      container.innerHTML = "";
      data.data.forEach(anime => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h4>${anime.title}</h4>
        `;
        card.addEventListener("click", () => showAnimeDetail(anime.mal_id));
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Gagal memuat rekomendasi anime:", err);
    });
}

function showAnimeDetail(id) {
  fetch(`https://api.jikan.moe/v4/anime/${id}`)
    .then(res => res.json())
    .then(data => {
      const anime = data.data;
      const modal = document.getElementById("animeModal");
      const modalBody = document.getElementById("modalBody");
      modalBody.innerHTML = `
        <h2>${anime.title}</h2>
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="max-width:200px;">
        <p><strong>Score:</strong> ${anime.score}</p>
        <p><strong>Episodes:</strong> ${anime.episodes}</p>
        <p><strong>Status:</strong> ${anime.status}</p>
        <p>${anime.synopsis}</p>
        ${anime.trailer?.youtube_id ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${anime.trailer.youtube_id}" frameborder="0" allowfullscreen></iframe>` : ""}
      `;
      modal.style.display = "flex";
    });

  document.querySelector(".close-btn").onclick = () => {
    document.getElementById("animeModal").style.display = "none";
  };
}

// Variabel untuk menyimpan bookmark
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// Fungsi untuk navigasi
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Hapus class active dari semua item
      navItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Tambahkan class active ke item yang diklik
      item.classList.add('active');
      
      const section = item.dataset.section;
      loadSection(section);
    });
  });
  
  // Set anime sebagai default active
  document.querySelector('.nav-item[data-section="anime"]').classList.add('active');
}

// Fungsi untuk memuat section yang dipilih
function loadSection(section) {
  const searchSection = document.querySelector('.search-bar');
  const animeResults = document.getElementById('animeResults');
  const recommendedAnime = document.getElementById('recommendedAnime');
  const pagination = document.querySelector('.pagination');
  
  switch(section) {
    case 'anime':
      searchSection.style.display = 'flex';
      animeResults.style.display = 'flex';
      recommendedAnime.style.display = 'flex';
      pagination.style.display = 'flex';
      fetchRecommendedAnime();
      break;
      
    case 'manga':
      searchSection.style.display = 'flex';
      animeResults.style.display = 'flex';
      recommendedAnime.style.display = 'none';
      pagination.style.display = 'flex';
      fetchManga();
      break;
      
    case 'community':
      searchSection.style.display = 'none';
      animeResults.innerHTML = '<p>Fitur komunitas akan datang segera!</p>';
      animeResults.style.display = 'block';
      recommendedAnime.style.display = 'none';
      pagination.style.display = 'none';
      break;
      
    case 'bookmarks':
      searchSection.style.display = 'none';
      displayBookmarks();
      recommendedAnime.style.display = 'none';
      pagination.style.display = 'none';
      break;
  }
}

// Fungsi untuk mengambil data manga
async function fetchManga(query = '', page = 1) {
  currentQuery = query;
  const url = query 
    ? `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&page=${page}`
    : `https://api.jikan.moe/v4/top/manga?page=${page}`;
  
  const res = await fetch(url);
  const data = await res.json();

  const resultsContainer = document.getElementById('animeResults');
  resultsContainer.innerHTML = "";

  if (!data.data || data.data.length === 0) {
    resultsContainer.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
    return;
  }

  data.data.forEach(manga => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${manga.images.jpg.image_url}" alt="${manga.title}">
      <h4>${manga.title}</h4>
      <button class="bookmark-btn" data-id="${manga.mal_id}" data-type="manga">Bookmark</button>
    `;
    card.addEventListener('click', (e) => {
      // Cegah event bubbling jika yang diklik adalah tombol bookmark
      if (!e.target.classList.contains('bookmark-btn')) {
        showMangaDetail(manga.mal_id);
      }
    });
    resultsContainer.appendChild(card);
  });

  // Set event listener untuk tombol bookmark
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      const title = btn.parentElement.querySelector('h4').textContent;
      const image = btn.parentElement.querySelector('img').src;
      
      addBookmark(id, type, title, image);
    });
  });

  pageNum.textContent = page;
}

// Fungsi untuk menampilkan detail manga
function showMangaDetail(id) {
  fetch(`https://api.jikan.moe/v4/manga/${id}`)
    .then(res => res.json())
    .then(data => {
      const manga = data.data;
      const modal = document.getElementById('animeModal');
      const modalBody = document.getElementById('modalBody');
      modalBody.innerHTML = `
        <h2>${manga.title}</h2>
        <img src="${manga.images.jpg.image_url}" alt="${manga.title}" style="max-width:200px;">
        <p><strong>Score:</strong> ${manga.score}</p>
        <p><strong>Chapters:</strong> ${manga.chapters}</p>
        <p><strong>Status:</strong> ${manga.status}</p>
        <p>${manga.synopsis}</p>
        <button class="bookmark-btn" data-id="${manga.mal_id}" data-type="manga">Bookmark</button>
      `;
      modal.style.display = "flex";
      
      // Tambahkan event listener untuk tombol bookmark di modal
      document.querySelector('.bookmark-btn').addEventListener('click', () => {
        addBookmark(manga.mal_id, 'manga', manga.title, manga.images.jpg.image_url);
      });
    });

  document.querySelector(".close-btn").onclick = () => {
    document.getElementById("animeModal").style.display = "none";
  };
}

// Fungsi untuk menambahkan bookmark
function addBookmark(id, type, title, image) {
  // Cek apakah sudah ada di bookmark
  const existing = bookmarks.find(b => b.id === id && b.type === type);
  
  if (!existing) {
    bookmarks.push({
      id,
      type,
      title,
      image,
      dateAdded: new Date().toISOString()
    });
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert(`${title} telah ditambahkan ke bookmark!`);
  } else {
    alert(`${title} sudah ada di bookmark!`);
  }
}

// Fungsi untuk menampilkan bookmark
function displayBookmarks() {
  const resultsContainer = document.getElementById('animeResults');
  resultsContainer.innerHTML = "";
  
  if (bookmarks.length === 0) {
    resultsContainer.innerHTML = "<p>Anda belum memiliki bookmark.</p>";
    return;
  }
  
  bookmarks.forEach(bookmark => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${bookmark.image}" alt="${bookmark.title}">
      <h4>${bookmark.title}</h4>
      <button class="remove-bookmark" data-id="${bookmark.id}" data-type="${bookmark.type}">Hapus</button>
    `;
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('remove-bookmark')) {
        if (bookmark.type === 'anime') {
          showAnimeDetail(bookmark.id);
        } else {
          showMangaDetail(bookmark.id);
        }
      }
    });
    resultsContainer.appendChild(card);
  });
  
  // Tambahkan event listener untuk tombol hapus
  document.querySelectorAll('.remove-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      
      removeBookmark(id, type);
    });
  });
}

// Fungsi untuk menghapus bookmark
function removeBookmark(id, type) {
  bookmarks = bookmarks.filter(b => !(b.id === id && b.type === type));
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  displayBookmarks();
}

// Modifikasi fungsi fetchAnime untuk menambahkan tombol bookmark
async function fetchAnime(query, page = 1) {
  currentQuery = query;
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}`);
  const data = await res.json();

  resultsContainer.innerHTML = "";

  if (!data.data || data.data.length === 0) {
    resultsContainer.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
    return;
  }

  data.data.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h4>${anime.title}</h4>
      <button class="bookmark-btn" data-id="${anime.mal_id}" data-type="anime">Bookmark</button>
    `;
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('bookmark-btn')) {
        showAnimeDetail(anime.mal_id);
      }
    });
    resultsContainer.appendChild(card);
  });

  // Set event listener untuk tombol bookmark
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      const title = btn.parentElement.querySelector('h4').textContent;
      const image = btn.parentElement.querySelector('img').src;
      
      addBookmark(id, type, title, image);
    });
  });

  pageNum.textContent = page;
}

// Modifikasi fungsi fetchRecommendedAnime untuk menambahkan tombol bookmark
function fetchRecommendedAnime() {
  fetch("https://api.jikan.moe/v4/top/anime?limit=16")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recommendedAnime");
      container.innerHTML = "";
      data.data.forEach(anime => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h4>${anime.title}</h4>
          <button class="bookmark-btn" data-id="${anime.mal_id}" data-type="anime">Bookmark</button>
        `;
        card.addEventListener("click", (e) => {
          if (!e.target.classList.contains('bookmark-btn')) {
            showAnimeDetail(anime.mal_id);
          }
        });
        container.appendChild(card);
      });

      // Set event listener untuk tombol bookmark
      document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const type = btn.dataset.type;
          const title = btn.parentElement.querySelector('h4').textContent;
          const image = btn.parentElement.querySelector('img').src;
          
          addBookmark(id, type, title, image);
        });
      });
    })
    .catch(err => {
      console.error("Gagal memuat rekomendasi anime:", err);
    });
}

// Modifikasi fungsi showAnimeDetail untuk menambahkan tombol bookmark
function showAnimeDetail(id) {
  fetch(`https://api.jikan.moe/v4/anime/${id}`)
    .then(res => res.json())
    .then(data => {
      const anime = data.data;
      const modal = document.getElementById("animeModal");
      const modalBody = document.getElementById("modalBody");
      modalBody.innerHTML = `
        <h2>${anime.title}</h2>
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="max-width:200px;">
        <p><strong>Score:</strong> ${anime.score}</p>
        <p><strong>Episodes:</strong> ${anime.episodes}</p>
        <p><strong>Status:</strong> ${anime.status}</p>
        <p>${anime.synopsis}</p>
        ${anime.trailer?.youtube_id ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${anime.trailer.youtube_id}" frameborder="0" allowfullscreen></iframe>` : ""}
        <button class="bookmark-btn" data-id="${anime.mal_id}" data-type="anime">Bookmark</button>
      `;
      modal.style.display = "flex";
      
      // Tambahkan event listener untuk tombol bookmark di modal
      document.querySelector('.bookmark-btn').addEventListener('click', () => {
        addBookmark(anime.mal_id, 'anime', anime.title, anime.images.jpg.image_url);
      });
    });

  document.querySelector(".close-btn").onclick = () => {
    document.getElementById("animeModal").style.display = "none";
  };
}

// Panggil setupNavigation saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
  setupNavigation();
  fetchRecommendedAnime();
});

// Modifikasi event listener searchInput untuk mendukung manga
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  const activeSection = document.querySelector('.nav-item.active').dataset.section;
  
  if (query.length > 2) {
    currentPage = 1;
    if (activeSection === 'manga') {
      fetchManga(query, currentPage);
    } else {
      fetchAnime(query, currentPage);
    }
  } else {
    document.getElementById('animeResults').innerHTML = "";
  }
});

// Modifikasi pagination untuk mendukung manga
document.getElementById('nextPage').addEventListener('click', () => {
  currentPage++;
  const activeSection = document.querySelector('.nav-item.active').dataset.section;
  
  if (activeSection === 'manga') {
    fetchManga(currentQuery, currentPage);
  } else {
    fetchAnime(currentQuery, currentPage);
  }
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    const activeSection = document.querySelector('.nav-item.active').dataset.section;
    
    if (activeSection === 'manga') {
      fetchManga(currentQuery, currentPage);
    } else {
      fetchAnime(currentQuery, currentPage);
    }
  }
});
