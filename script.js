const apiKey = 'bd9c9c29'; // Replace with your OMDB API key

// Load recommended movies and watchlist when the page loads
window.onload = function () {
  displayNewAndPopularMovies();  // Call the new function
  displayWatchlist();  // Include any other functions you want to load initially
};


// Show loading spinner
function showLoading() {
  document.getElementById('loadingSpinner').classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
  document.getElementById('loadingSpinner').classList.add('hidden');
}

// Fetch and display new and popular movies
function displayNewAndPopularMovies() {
  const url = `https://www.omdbapi.com/?s=popular&apikey=${apiKey}`; // Use "popular" as a keyword to get trending titles

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const newAndPopularMoviesContainer = document.getElementById('newAndPopularMovies');
      newAndPopularMoviesContainer.innerHTML = '';

      if (data.Response === "True") {
        data.Search.forEach(movie => {
          const movieItem = document.createElement('div');
          movieItem.classList.add('movie-item');
          movieItem.innerHTML = `
            <div class="movie-poster">
              <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" 
                   alt="${movie.Title} poster" 
                   onerror="this.src='https://via.placeholder.com/150';">
            </div>
            <div class="movie-info">
              <h3>${movie.Title}</h3>
              <p>Type: ${movie.Type}</p>
              <p>Year: ${movie.Year}</p>
              <button onclick="showMovieDetails('${movie.imdbID}')">Show Details</button>
              <button onclick="addToWatchlist('${movie.imdbID}', '${movie.Title}')">Add to Watchlist</button>
            </div>
          `;
          newAndPopularMoviesContainer.appendChild(movieItem);
        });
      } else {
        newAndPopularMoviesContainer.innerHTML = '<p>No new and popular movies found</p>';
      }
    })
    .catch(error => {
      console.log('Error fetching new and popular movies:', error);
      document.getElementById('newAndPopularMovies').innerHTML = '<p>Error loading new and popular movies</p>';
    });
}



// Search for movies based on user input
function searchMovies() {
  const searchInput = document.getElementById('searchInput').value;
  const url = `https://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovies(data.Search, 'movieList');
      } else {
        document.getElementById('movieList').innerHTML = '<p>No movies found</p>';
      }
    })
    .catch(error => {
      console.log('Error fetching movies:', error);
      document.getElementById('movieList').innerHTML = '<p>Error loading movies</p>';
    });
}

let debounceTimer; // Declare a debounce timer

// Display live search suggestions with debounce and error handling
function liveSearchMovies() {
  clearTimeout(debounceTimer); // Clear previous debounce timer

  debounceTimer = setTimeout(() => {
    const searchInput = document.getElementById('searchInput').value;
    const url = `https://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`;

    // Only search if input length is greater than 2 characters
    if (searchInput.length > 2) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.Response === "True") {
            displaySuggestions(data.Search);
          } else {
            document.getElementById('suggestions').innerHTML = '<p>No suggestions found</p>';
          }
        })
        .catch(error => {
          console.log('Error fetching suggestions:', error);
          document.getElementById('suggestions').innerHTML = '<p>Error loading suggestions</p>';
        });
    } else {
      document.getElementById('suggestions').innerHTML = '';
    }
  }, 300); // Set debounce delay to 300 ms
}


function displaySuggestions(movies) {
  const suggestionsContainer = document.getElementById('suggestions');
  suggestionsContainer.innerHTML = '';
  if (movies) {
    movies.forEach(movie => {
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.innerText = movie.Title;
      suggestionItem.onclick = () => {
        document.getElementById('searchInput').value = movie.Title;
        searchMovies();
        suggestionsContainer.innerHTML = '';
      };
      suggestionsContainer.appendChild(suggestionItem);
    });
  }
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (movies) {
    movies.forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      movieItem.innerHTML = `
        <div class="movie-poster">
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" 
               alt="${movie.Title} poster" 
               onerror="this.src='https://via.placeholder.com/150';">
        </div>
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p>Type: ${movie.Type}</p>
          <p>Year: ${movie.Year}</p>
          <button onclick="showMovieDetails('${movie.imdbID}')">Show Details</button>
          <button onclick="addToWatchlist('${movie.imdbID}', '${movie.Title}')">Add to Watchlist</button>
        </div>
      `;
      container.appendChild(movieItem);
    });
  } else {
    container.innerHTML = '<p>No movies found</p>';
  }
}


// Show movie details
function showMovieDetails(movieId) {
  const url = `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayMovieDetails(data);
      displaySimilarMovies(data.Genre);
    })
    .catch(error => {
      console.log('Error fetching movie details:', error);
    });

  document.getElementById('movieDetailsSection').style.display = 'block';
  document.getElementById('backButton').style.display = 'inline-block';
}

function displayMovieDetails(movie) {
  const movieDetailsContainer = document.getElementById('movieDetails');
  movieDetailsContainer.innerHTML = `
    <div class="details">
      <h2>${movie.Title}</h2>
      <p>Type: ${movie.Type}</p>
      <p>Year: ${movie.Year}</p>
      <p>Plot: ${movie.Plot}</p>
      <p>Genre: ${movie.Genre}</p>
      <p>IMDb Rating: ${movie.imdbRating ? movie.imdbRating : 'N/A'}</p>
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300'}" 
           alt="${movie.Title} poster" 
           onerror="this.src='https://via.placeholder.com/300';">
    </div>
  `;
}


// Go back to movie list
function goBack() {
  document.getElementById('movieDetailsSection').style.display = 'none';
}

// Function to display similar movies based on genre
function displaySimilarMovies(genre) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(genre.split(',')[0])}&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const similarMoviesContainer = document.getElementById('similarMovies');
      similarMoviesContainer.innerHTML = '<h3>Similar Movies</h3>';

      if (data.Response === "True") {
        data.Search.forEach(movie => {
          const movieItem = document.createElement('div');
          movieItem.classList.add('movie-item');
          movieItem.innerHTML = `
            <div class="movie-poster">
              <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title} poster" 
                   onerror="this.src='https://via.placeholder.com/150';">
            </div>
            <div class="movie-info">
              <h3>${movie.Title}</h3>
              <p>Year: ${movie.Year}</p>
              <button onclick="showMovieDetails('${movie.imdbID}')">Show Details</button>
            </div>
          `;
          similarMoviesContainer.appendChild(movieItem);
        });
      } else {
        similarMoviesContainer.innerHTML += '<p>No similar movies found</p>';
      }
    })
    .catch(error => {
      console.log('Error fetching similar movies:', error);
      document.getElementById('similarMovies').innerHTML = '<p>Error loading similar movies</p>';
    });
}

// Manage watchlist
function addToWatchlist(movieId, movieTitle) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.find(movie => movie.id === movieId)) {
    watchlist.push({ id: movieId, title: movieTitle });
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
  }
}

function displayWatchlist() {
  const watchlistContainer = document.getElementById('watchlistMovies');
  watchlistContainer.innerHTML = '';
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  if (watchlist.length > 0) {
    watchlist.forEach(movie => {
      const url = `https://www.omdbapi.com/?i=${movie.id}&apikey=${apiKey}`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const watchlistItem = document.createElement('div');
          watchlistItem.classList.add('movie-item');
          watchlistItem.innerHTML = `
            <div class="movie-poster">
              <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/150'}" 
                   alt="${data.Title} poster" 
                   onerror="this.src='https://via.placeholder.com/150';">
            </div>
            <div class="movie-info">
              <h3>${data.Title}</h3>
              <p>Year: ${data.Year}</p>
              <button onclick="removeFromWatchlist('${data.imdbID}')">Remove from Watchlist</button>
            </div>
          `;
          watchlistContainer.appendChild(watchlistItem);
        })
        .catch(error => {
          console.log('Error fetching watchlist movie details:', error);
          watchlistContainer.innerHTML += '<p>Error loading watchlist movies</p>';
        });
    });
  } else {
    watchlistContainer.innerHTML = '<p>Your watchlist is empty.</p>';
  }
}


function removeFromWatchlist(movieId) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  displayWatchlist();
}
