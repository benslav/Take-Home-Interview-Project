

async function renderAnime() {
  const animeList = await fetch(`https://api.jikan.moe/v4/anime`);
  const result = await animeList.json();
}

renderAnime();