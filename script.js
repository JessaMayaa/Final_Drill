// Function to search for movies based on user input
function searchMovies() {
  const searchInput = document.getElementById('searchInput').value;
  const apiKey = 'bd9c9c29'; // Replace with your OMDB API key
  const url = `https://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayMovies(data.Search);
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
}

// Function to display searched movies
function displayMovies(movies) {
  const upcomingMoviesContainer = document.getElementById('upcomingMovies');
  upcomingMoviesContainer.innerHTML = '';

  if (movies) {
    movies.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      movieItem.innerHTML = `
        <div class="movie-poster">
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title} poster">
        </div>
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p>Type: ${movie.Type}</p>
          <p>Year: ${movie.Year}</p>
          <button onclick="showMovieDetails('${movie.imdbID}')">Show Details</button>
        </div>
      `;
      upcomingMoviesContainer.appendChild(movieItem);
    });
  } else {
    upcomingMoviesContainer.innerHTML = '<p>No movies found</p>';
  }
}

// Function to show details of a selected movie
function showMovieDetails(movieId) {
  const apiKey = 'bd9c9c29'; // Replace with your OMDB API key
  const url = `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayMovieDetails(data);
      fetchSimilarMovies(data.Title);
    })
    .catch(error => {
      console.log('Error fetching movie details:', error);
    });
}

// Function to display details of a selected movie
function displayMovieDetails(movie) {
  const movieDetailsContainer = document.getElementById('movieDetails');
  movieDetailsContainer.innerHTML = `
    <div class="details">
      <h2>${movie.Title}</h2>
      <p>Type: ${movie.Type}</p>
      <p>Year: ${movie.Year}</p>
      <p>Plot: ${movie.Plot}</p>
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300'}" alt="${movie.Title} poster">
    </div>
  `;
}

// Function to fetch and display similar movies
function fetchSimilarMovies(movieTitle) {
  const apiKey = 'bd9c9c29'; // Replace with your OMDB API key
  const url = `https://www.omdbapi.com/?s=${movieTitle}&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displaySimilarMovies(data.Search);
    })
    .catch(error => {
      console.log('Error fetching similar movies:', error);
    });
}

// Function to display similar movies
function displaySimilarMovies(movies) {
  const similarMoviesContainer = document.getElementById('similarMovies');
  similarMoviesContainer.innerHTML = '';

  if (movies) {
    movies.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      movieItem.innerHTML = `
        <div class="movie-poster">
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title} poster">
        </div>
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p>Type: ${movie.Type}</p>
          <p>Year: ${movie.Year}</p>
          <button onclick="showMovieDetails('${movie.imdbID}')">Show Details</button>
        </div>
      `;
      similarMoviesContainer.appendChild(movieItem);
    });
  } else {
    similarMoviesContainer.innerHTML = '<p>No similar movies found</p>';
  }
}
