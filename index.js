const animeListEl = document.querySelector(".anime__list");

async function renderAnime() {
  const animeList = await fetch(`https://api.jikan.moe/v4/top/anime`);
  const result = await animeList.json();
  console.log(result);

  animeListEl.innerHTML = result.data.map((anime) => animeHTML(anime)).join("");
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