let saveFilmsPerPage = 12;

document.querySelectorAll(".dropdown-item.sortSave").forEach(button => {
    button.addEventListener("click", function() {
        const sortValue = this.dataset.sortsave;
        fetchDataListSaveFilm(sortValue);
    });
});


function fetchDataListSaveFilm(sortValue = '') {
    // console.log("Fetching with sort value:", sortValue); // Log nilai sort
    currentIndex = 0; // Reset the index when fetching new data

    fetch('savePage.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            sortSave: sortValue
        }),
    })
    .then(response => {
        console.log('HTTP Response Status:', response.status); // Log status respons HTTP
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data); // Log data yang diterima
        if (data.error) {
            console.error('Error from server:', data.error); // Log error dari server
            document.getElementById("idSaveDisplayInfo").style.display = "flex";
        } else {
            allSaveFilms = data;
            displaySaveFilms();
            document.getElementById("idUrutanSimpan").style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

document.getElementById("findMovieButton").addEventListener("click", debounce(function(){
    findMovieButton();
}, 200));

function updateButtonLoadMoreSave() {
    const loadMoreSaveButton = document.getElementById('loadMoreSaveButton');
    loadMoreSaveButton.style.display = 'none';

    // Periksa apakah semua film sudah ditampilkan
    if (saveFilmsPerPage >= allSaveFilms.length) {
        loadMoreSaveButton.style.display = 'none';
    } else {
        loadMoreSaveButton.style.display = 'block';
    }
    console.log(allFilms.length);
    
}

function displaySaveFilms() {
    const container = document.getElementById('saveFilmContainer');
    if (!container) {
        console.error('Container not found');
        return;
    }
    try {
        container.innerHTML = '';
        const filmsToDisplay = allSaveFilms.slice(currentIndex, currentIndex + saveFilmsPerPage);
        
        filmsToDisplay.forEach((item, index) => {
            const filmElement = createSaveFilmsElement(item);
            container.appendChild(filmElement);
            
            setTimeout(() => {
                filmElement.classList.add('show');
            }, index * 10);
        });
        updateButtonLoadMoreSave();
    } catch (error) {
        console.error('Error displaying films:', error);
        document.getElementById('loadMoreSaveButton').style.display = 'none';
    }
}

function createSaveFilmsElement(item) {
    // Membuat elemen film-col
    const filmCol = document.createElement('div');
    filmCol.className = 'film-col';

    // Membuat elemen film-col-poster
    const filmColPoster = document.createElement('div');
    filmColPoster.className = 'film-col-poster';

    // Membuat elemen gambar untuk menyimpan
    const saveImg = document.createElement('img');
    saveImg.className = 'film-col-poster-save';
    saveImg.src = 'src/icon/save.png?t=' + new Date().getTime();
    saveImg.alt = 'Save Icon';
    saveImg.dataset.filmId = item.movie_id;
    saveImg.addEventListener('click', toggleSaveFilm);
    // Membuat elemen gambar poster film
    const posterImg = document.createElement('img');
    posterImg.className = 'film-col-poster-img';
    posterImg.src = item.poster; 
    posterImg.alt = 'Poster Film';

    // Menambahkan gambar ke elemen film-col-poster
    filmColPoster.appendChild(saveImg);
    filmColPoster.appendChild(posterImg);

    // Membuat elemen film-col-desc
    const filmColDesc = document.createElement('div');
    filmColDesc.className = 'film-col-desc';

    // Membuat elemen untuk judul film
    const titleElement = document.createElement('h5');
    titleElement.className = 'film-col-title';
    titleElement.textContent = item.title;

    // Membuat elemen untuk tahun rilis
    const releaseElement = document.createElement('p');
    releaseElement.className = 'film-col-release';
    releaseElement.textContent = `Release Year: ${item.release_year}`;

    // Membuat elemen untuk rating
    const ratingElement = document.createElement('div');
    ratingElement.className = 'film-col-rating';

    const ratingImg = document.createElement('img');
    ratingImg.className = 'film-col-rating-img';
    ratingImg.src = 'src/logo/imdb_logo.png'; // Ganti dengan gambar rating yang sesuai
    ratingImg.alt = 'Rating Icon';

    const ratingNumber = document.createElement('p');
    ratingNumber.className = 'film-col-rating-number';
    ratingNumber.textContent = item.rating;

    ratingElement.appendChild(ratingImg);
    ratingElement.appendChild(ratingNumber);

    // Membuat elemen untuk genre
    const genreElement = document.createElement('p');
    genreElement.className = 'film-col-genre';
    genreElement.textContent = `Genre: ${item.genre}`;

    // Menambahkan elemen-desc ke film-col-desc
    filmColDesc.appendChild(releaseElement);
    filmColDesc.appendChild(titleElement);
    filmColDesc.appendChild(ratingElement);
    filmColDesc.appendChild(genreElement);

    // Menambahkan elemen film-col-poster dan film-col-desc ke film-col
    filmCol.appendChild(filmColPoster);
    filmCol.appendChild(filmColDesc);

    checkSaveStatus(item.movie_id, saveImg);

    return filmCol;
}

document.getElementById('loadMoreSaveButton').addEventListener('click', function(){
    loadMoreSaveFilm();
    displaySaveFilms();
})

function loadMoreSaveFilm(){
    saveFilmsPerPage += 12;
    return saveFilmsPerPage;
}