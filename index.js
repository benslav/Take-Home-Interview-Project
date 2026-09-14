const animeListEl = document.querySelector(".anime__list");
let allAnime = [];
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector(".search__btn");

async function renderAnime() {
  const animeList = await fetch(`https://api.jikan.moe/v4/top/anime`);
  const result = await animeList.json();

  allAnime = result.data;
  displayAnime(allAnime);
}

function displayAnime(animeArray) {
  animeListEl.innerHTML = animeArray.map((anime) => animeHTML(anime)).join("");
}

function animeHTML(anime) {
  return `
  <div class="anime">
    <figure class="anime__img--wrapper">
      <img src="${anime.images.jpg.image_url}" alt="Anime cover" class="anime__img">
    </figure>
    <div class="anime__title">
      ${anime.title}
    </div>
    <div class="anime__release--date">
      ${anime.aired.string}
    </div>
    <div class="anime__ep--length">${anime.duration}</div>
  </div>`;
}

renderAnime();

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allAnime.filter((anime) =>
    anime.title.toLowerCase().includes(query)
  );
  displayAnime(filtered);
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

searchBtn.addEventListener("click", handleSearch);