document.getElementById("search-general").addEventListener("keyup", debounce(function() {
    const searchValue = this.value;
    if (searchValue.trim() === "") {
        fetchDataListFilm();
        return;
    }
    
    fetchDataListFilm(searchValue,'');
}, 300)); // Delay 300ms

document.getElementById("search-release").addEventListener("keyup", debounce(function() {
    const releaseValue = this.value;
    if (releaseValue.trim() === "") {
        fetchDataListFilm();
        return;
    }
    fetchDataListFilm('', releaseValue);
}, 300)); // Delay 300ms

document.querySelectorAll(".dropdown-item.genre").forEach(button => {
    button.addEventListener("click", debounce(function() {
        const genreValue = this.dataset.genre;        
        fetchDataListFilm('', '', genreValue);
    }, 200));
});

document.querySelectorAll(".dropdown-item.sort").forEach(button => {
    button.addEventListener("click", debounce(function() {
        const sortValue = this.dataset.sort;
        fetchDataListFilm('', '', '', sortValue);
    }, 200));
});

function fetchDataListFilm(searchValue = '', releaseValue = '', genreValue = '', sortValue = '') {
    const payload = {
        search: searchValue,
        release: releaseValue,
        genre: genreValue,
        sort: sortValue
    }
    fetch('search.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
    })
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })        .then(data => {
                    // Menyusun pesan informasi pencarian
            let infoMessage = "Hasil Pencaian: ";
            if (searchValue) {
                infoMessage += `Kata Kunci "${searchValue}" `;
            }
            if (releaseValue) {
                infoMessage += `Tahun Rilis "${releaseValue}" `;
            }
            if (genreValue) {
                infoMessage += `Genre "${genreValue}" `;
            }
            if (sortValue) {
                infoMessage += `Diurutkan berdasarkan "${sortValue}" `;
            }
            if (!searchValue && !releaseValue && !genreValue && !sortValue) {
                infoMessage = "Menampilkan Semua Hasil";
            }
        
        document.getElementById("infoSearch").textContent = infoMessage;

            allFilms = data;
            displayFilms();
        })
        .catch(error => {
            document.getElementById("infoSearch").textContent = "cant found the result";
            console.error('Error fetching data:', error);
        });
}



function updateButtonLoadMore() {
    const loadMoreButton = document.getElementById('loadMoreButton');

    // Periksa apakah semua film sudah ditampilkan
    if (filmsPerPage >= allFilms.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }

    // console.log(allFilms.length);
    
}

function displayFilms() {
    const container = document.getElementById('filmContainer');
    if (!container) {
        console.error('Container not found');
        return;
    }
    try{
        container.innerHTML = '';
        const filmsToDisplay = allFilms.slice(currentIndex, currentIndex + filmsPerPage);
        
        filmsToDisplay.forEach((item, index) => {
            const filmElement = createFilmsElement(item);
            container.appendChild(filmElement);
            
            // Memastikan animasi smooth dengan timeout
            setTimeout(() => {
                filmElement.classList.add('show');
            }, index * 15); // Delay bertambah untuk setiap elemen (100ms)
        });
        updateButtonLoadMore();
    }catch{
        console.error('Error displaying films')
        loadMoreButton.style.display = 'none';
    }
}


function createFilmsElement(item) {
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
    posterImg.alt = 'Poster asdasd';
    posterImg.src = item.poster || './src/error_info/internet_lostttt.png';
    
    // Tambahkan onerror untuk mengganti gambar yang gagal dimuat
    posterImg.onerror = function () {
        console.error(`Image load failed for: ${item.poster}. Applying default image.`);
        posterImg.src = './src/error_info/internet_lostttt.png?t=' + new Date().getTime();
    };
    
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

document.getElementById('loadMoreButton').addEventListener('click', function(){
    loadMoreFilm();
    displayFilms();
})

function loadMoreFilm(){
    filmsPerPage += 12;
    return filmsPerPage;
}

if (!navigator.onLine) {
    console.warn('No internet connection. Applying default image.');
    posterImg.src = './src/error_info/internet_lost.jpg';
}