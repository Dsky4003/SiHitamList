let currentPage = 1;
let currentQuery = "";

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('animeResults');
const pageNum = document.getElementById('pageNum');

async function fetchAnime(query, page = 1) {
  currentQuery = query;
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&page=${page}`);
  const data = await res.json();

  resultsContainer.innerHTML = "";
  data.data.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <p>${anime.title}</p>
    `;
    card.addEventListener('click', () => showAnimeDetails(anime.mal_id));
    resultsContainer.appendChild(card);
  });

  pageNum.textContent = page;
}

async function showAnimeDetails(id) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  const data = await res.json();
  const anime = data.data;

  const modal = document.getElementById('animeModal');
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <h2>${anime.title}</h2>
    <img src="${anime.images.jpg.image_url}" style="width:200px"/>
    <p><strong>Score:</strong> ${anime.score}</p>
    <p><strong>Episodes:</strong> ${anime.episodes}</p>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p><strong>Genres:</strong> ${anime.genres.map(g => g.name).join(', ')}</p>
    <p>${anime.synopsis}</p>
  `;
  modal.style.display = 'flex';
}

document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('animeModal').style.display = 'none';
});

searchInput.addEventListener('input', () => {
  if (searchInput.value.length >= 3) {
    currentPage = 1;
    fetchAnime(searchInput.value, currentPage);
  }
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAnime(currentQuery, currentPage);
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  currentPage++;
  fetchAnime(currentQuery, currentPage);
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".anime-card").forEach(card => {
        const title = card.querySelector("h3")?.innerText;
        const img = card.querySelector("img")?.src;
        const btn = document.createElement("button");
        btn.innerText = "Bookmark";
        btn.onclick = () => {
            const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
            const exists = bookmarks.find(a => a.title === title);
            if (!exists) {
                bookmarks.push({ title, image: img });
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                alert("Anime dibookmark!");
            } else {
                alert("Sudah dibookmark.");
            }
        };
        card.appendChild(btn);
    });
});
