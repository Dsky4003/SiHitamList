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
