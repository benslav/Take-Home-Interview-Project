const animeListEl = document.querySelector(".anime__list");
let allAnime = [];
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector(".search__btn");
const searchData = document.querySelector(".search");
let currentSort = "none";
const sortSelect = document.querySelector("#sort-select");
let animeList;
const spinnerEl = document.querySelector(".loading");

async function renderAnime() {
  spinnerEl.classList.add("loading__wrapper");
  try {
    const [animeList] = await Promise.all([
      fetch(`https://api.jikan.moe/v4/top/anime`),
      delay(1000), // keep the spinner visible for at least 800ms
    ]);
    const result = await animeList.json();
    allAnime = result.data;
    displayAnime(allAnime);
  } catch (error) {
    console.error("Failed to fetch anime:", error);
    animeListEl.innerHTML = `<p>Something went wrong loading anime. Please try again.</p>`;
  } finally {
    spinnerEl.classList.remove("loading__wrapper");
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  updateDisplay();
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

searchBtn.addEventListener("click", handleSearch);

function updateSearch(search) {
  return `
  <div class="search">
    <h2>Search results for <span class="purple">"${search}"</span> </h2>
  </div>`;
}

function getAiredTime(anime) {
  // some anime have no known air date — push those to the end instead of crashing the sort
  return anime.aired?.from ? new Date(anime.aired.from).getTime() : 0;
}

function updateDisplay() {
  const query = searchInput.value.trim().toLowerCase();
  let list = allAnime.filter((anime) => anime.title.toLowerCase().includes(query));

  switch (currentSort) {
    case "az":
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "za":
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "newest":
      list = [...list].sort((a, b) => getAiredTime(b) - getAiredTime(a));
      break;
    case "oldest":
      list = [...list].sort((a, b) => getAiredTime(a) - getAiredTime(b));
      break;
  }

  displayAnime(list);
}

sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  updateDisplay();
});