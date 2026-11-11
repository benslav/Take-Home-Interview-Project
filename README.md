# Movie Browser

A React movie browser powered by OMDb. It initially searches for `movie` and displays 10 results per page; search for another title to browse more movies. Select a movie to open its details page, including its poster, rating, release date, genre, cast, plot, language, and awards.

The React app is organized into `src/components`, `src/pages`, and `src/App.jsx`. Movie details use the route `/movie/:imdbID`.

## Run locally

1. Install dependencies with `npm install`.
2. Run the development server with `npm run dev`.
3. Set your OMDb API key in `src/omdb.js`.

Use `npm run build` to create a production build.

GitHub Pages is deployed from the `main` branch using the workflow in `.github/workflows/deploy.yml`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The production app uses hash-based routes so movie detail URLs work when hosted on GitHub Pages.

This client-side app exposes its API key in source and browser requests. Do not commit a real key to a public repository; use a server-side proxy if deploying publicly.
