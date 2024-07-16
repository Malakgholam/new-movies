const API_KEY = '6864842b3eb0fb2548f096a60180a892';
const BASE_URL = 'https://api.themoviedb.org/3';
var sideBarButton = document.querySelector('.middle');
var menu =document.querySelector('#menu');
const menuList = document.querySelector('#menuList');



const options = ["Now Playing", "Popular", "Trending", "Upcoming", "Top Rated"];
const endpoints = {
    nowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
    popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
    trending: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`,
    upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`,
    topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
};

document.addEventListener('DOMContentLoaded', () => {
    const sideBarButton = document.querySelector('.middle');
    const menu = document.querySelector('#menu');
    const menuList = document.querySelector('#menuList');

    options.forEach((option, index) => {
        const optionEle = document.createElement('li');
        optionEle.classList.add('py-3', 'ps-3', 'fs-4', 'color-gray');
        optionEle.textContent = option;
        optionEle.addEventListener('click', () => {
            const endpointKey = Object.keys(endpoints)[index];
            getMovies(endpoints[endpointKey]);
            menu.classList.add('d-none');
            sideBarButton.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        });
        menuList.appendChild(optionEle);
    });

    sideBarButton.addEventListener('click', function(){
        if(menu.classList.contains('d-none')){
            menu.classList.remove('d-none');
            sideBarButton.innerHTML=`<i class="fa-solid fa-x"></i>`;
        } else {
            menu.classList.add('d-none');
            sideBarButton.innerHTML=`<i class="fa-solid fa-bars"></i>`;
        }
    });

    fetchLatestMovies();

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query.length >= 3) {
            searchMovies(query);
        }
    });

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (event) => {
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        validatePasswordMatch();
        form.classList.add('was-validated');
    });

    const backToHomeButton = document.getElementById('back-to-home');
    backToHomeButton.addEventListener('click', () => {
        fetchLatestMovies();
        document.getElementById('no-results-message').style.display = 'none';
    });
});

function getMovies(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.error('Error fetching movies:', error));
}
getMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`);

function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    if (movies.length === 0) {
        document.getElementById('no-results-message').style.display = 'block';
    } else {
        document.getElementById('no-results-message').style.display = 'none';
        movies.forEach(movie => {
            fetchMovieDetails(movie.id);
        });
    }
}

function fetchMovieDetails(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=images`)
        .then(response => response.json())
        .then(movie => {
            const container = document.getElementById('movies-container');
            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-4');
            const card = document.createElement('div');
            card.classList.add('movie-card');
            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.alt = movie.title;
            img.classList.add('card-img-top', 'movie-poster');
            card.appendChild(img);
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = movie.title;
            cardBody.appendChild(cardTitle);
            const cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.textContent = movie.overview;
            cardBody.appendChild(cardText);
            cardBody.style.display = 'none';
            card.appendChild(cardBody);
            col.appendChild(card);
            container.appendChild(col);

            card.addEventListener('mouseover', () => showMovieDetails(cardBody));
            card.addEventListener('mouseout', () => hideMovieDetails(cardBody));
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function showMovieDetails(cardBody) {
    cardBody.style.display = 'block';
}

function hideMovieDetails(cardBody) {
    cardBody.style.display = 'none';
}

function searchMovies(query) {
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.error('Error searching movies:', error));
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const validatePassword = document.getElementById('validate-password').value;
    const validatePasswordInput = document.getElementById('validate-password');
    if (password !== validatePassword) {
        validatePasswordInput.setCustomValidity('Passwords do not match');
        validatePasswordInput.classList.add('is-invalid');
    } else {
        validatePasswordInput.setCustomValidity('');
        validatePasswordInput.classList.remove('is-invalid');
    }
}