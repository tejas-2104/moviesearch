const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieResults = document.getElementById('movieResults');
const backButton = document.getElementById('backButton');
const movieDetailsContainer = document.getElementById('movieDetailsContainer');
let previousSearchResults;

// Function to fetch movie data from API
const searchMovies = async () => {
    const apiKey = '9a7ea56c'; // Provided API key
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        movieResults.innerHTML = '';
        return;
    }
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch movie data.');
        }
        const data = await response.json();
        if (data.Search && data.Search.length > 0) {
            displayMovies(data.Search);
            previousSearchResults = data.Search;
            backButton.style.display = 'inline-block';
            movieDetailsContainer.style.display = 'none';
        } else {
            movieResults.innerHTML = '<p>No results found.</p>';
            backButton.style.display = 'none'; // Hide back button if no results
            movieDetailsContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        // Don't display error message if search input is empty
        if (searchTerm !== '') {
            movieResults.innerHTML = '<p>Failed to fetch movie data. Please try again later.</p>';
        }
        backButton.style.display = 'none'; // Hide back button on error
        movieDetailsContainer.style.display = 'none';
    }
};

// Function to display movie search results
const displayMovies = (movies) => {
    movieResults.innerHTML = movies.map(movie => `
        <div class="movie">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <div class="movie-details">
                <h2 class="movie-title">${movie.Title}</h2>
                <p class="movie-year">Year: ${movie.Year}</p>
                <p class="movie-type">Type: ${movie.Type}</p>
                <button class="movie-details-btn" data-id="${movie.imdbID}">View Details</button>
            </div>
        </div>
    `).join('');
};

// Function to fetch and display movie details
const displayMovieDetails = async (movieId) => {
    const apiKey = '9a7ea56c'; // Provided API key
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details.');
        }
        const data = await response.json();
        displayDetails(data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        // Display error message if unable to fetch movie details
        alert('Failed to fetch movie details. Please try again later.');
    }
};

// Function to display movie details
const displayDetails = (data) => {
    movieDetailsContainer.innerHTML = `
        <h2>${data.Title} (${data.Year})</h2>
        <p><strong>Rated:</strong> ${data.Rated}</p>
        <p><strong>Released:</strong> ${data.Released}</p>
        <p><strong>Runtime:</strong> ${data.Runtime}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Writer(s):</strong> ${data.Writer}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <img src="${data.Poster !== 'N/A' ? data.Poster : 'placeholder.jpg'}" alt="${data.Title} Poster">
        <h3>Ratings:</h3>
        <ul>
            ${data.Ratings.map(rating => `<li><strong>${rating.Source}:</strong> ${rating.Value}</li>`).join('')}
        </ul>
        <p><strong>Metascore:</strong> ${data.Metascore}</p>
        <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
        <p><strong>IMDb Votes:</strong> ${data.imdbVotes}</p>
        <p><strong>IMDb ID:</strong> ${data.imdbID}</p>
        <p><strong>DVD Release:</strong> ${data.DVD}</p>
        <p><strong>Box Office:</strong> ${data.BoxOffice}</p>
        <p><strong>Production:</strong> ${data.Production}</p>
        <p><strong>Website:</strong> <a href="${data.Website}" target="_blank">${data.Website}</a></p>
        `;
        };
        
        // Event listener for search button
        searchButton.addEventListener('click', searchMovies);
        
        // Event listener for back button
        backButton.addEventListener('click', () => {
        movieResults.style.display = 'block'; // Show search results
        backButton.style.display = 'none'; // Hide back button
        movieDetailsContainer.style.display = 'none'; // Hide movie details container
        });
        
        // Event delegation for movie details button
        movieResults.addEventListener('click', async (event) => {
        if (event.target.classList.contains('movie-details-btn')) {
        const movieId = event.target.dataset.id;
        displayMovieDetails(movieId);
        movieResults.style.display = 'none'; // Hide search results
        backButton.style.display = 'inline-block'; // Show back button
        movieDetailsContainer.style.display = 'block'; // Show movie details container
        }
        });
