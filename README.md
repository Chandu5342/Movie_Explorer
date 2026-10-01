
# Movie Explorer

Movie Explorer is a frontend movie discovery app built with React, Vite, MUI, React Router, and TMDb. It lets users log in, browse trending movies, search by title, filter movies by genre/year/rating, view cast and detail information, watch trailers, and save favorites locally.

## Features

- User login interface
- Trending movies section
- Movie search with last-search persistence
- Movie cards with poster, title, release year, and rating
- Movie details page with overview, genres, cast, and trailer link
- Favorites page with localStorage persistence
- Infinite scrolling and paginated results
- Genre, year, and rating filters
- Dark/light theme toggle
- Responsive UI
- API error handling

## Technologies

- React
- Vite
- JavaScript
- Axios
- Material UI
- React Router
- Context API
- TMDb API

## Project Structure

```text
Frontend/
├── public/                       # Static public assets
├── src/
│   ├── assets/                   # App images and bundled assets
│   ├── components/
│   │   ├── MovieCard.jsx         # Individual movie card
│   │   ├── MovieGrid.jsx         # Movie list grid
│   │   └── Navbar.jsx            # Main navigation
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── MovieContext.jsx      # Favorites state
│   ├── pages/
│   │   ├── Favorites.jsx         # Saved movies
│   │   ├── Home.jsx              # Trending, search, and filters
│   │   ├── Login.jsx             # Login page
│   │   └── MovieDetailsPage.jsx  # Movie details, cast, and trailer
│   ├── services/
│   │   └── tmdbApi.js            # TMDb API requests
│   ├── App.jsx                   # App routes and theme
│   ├── App.css                   # App-level styles
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Application entry point
├── .env.example                 # Environment variable template
├── .gitignore                   # Ignored files, including local .env
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation
```

## Setup

1. Open the project folder.
2. Install dependencies:
   npm install
3. Start the development server:
   npm run dev

## Environment Variables

Create a .env file in the root of the Frontend project with your TMDb API key:

VITE_TMDB_API_KEY=your_tmdb_api_key_here

The project includes a sample file at .env.example.

## API

This app uses the TMDb API for trending movies, searches, genre data, details, credits, and trailers.

## Deployment

Live Demo:
https://movie-explorer-nine-green.vercel.app/

## Repository

GitLab Repository:
https://github.com/Chandu5342/Movie_Explorer.git

