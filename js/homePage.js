function fetchAndCreateSlides() {
    fetch('slideFilm.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify({
            type: 'slide'
        }),
    })
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (Array.isArray(data)) {
                createSlides(data);
                console.log("ini adalah =" + data);
                initializeSwiper();
            } else {
                console.error('Data is not a n array:', data);
            }
        })
        .catch(error => console.error('Error fetching films:', error));
}

function createSlides(films) {
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    films.forEach((film, index) => {
        const slide = createSlide(film, index + 1);
        swiperWrapper.appendChild(slide);
    });
}

function createSlide(film, slideNumber) {
    const slide = document.createElement('div');
    slide.className = `swiper-slide slide${slideNumber}`;
    slide.style.backgroundImage = `url('src/slide/slide${film.movieslide_id}.webp')`;
    slide.style.backgroundSize = 'cover';
    slide.style.backgroundPosition = 'center';

    const main = document.createElement('main');
    const section = document.createElement('section');
    section.className = 'hero';

    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';

    // Title
    const title = document.createElement('h1');
    title.innerHTML = film.title.replace(': ', ': <br>');

    // Content info
    const contentInfo = document.createElement('div');
    contentInfo.className = 'content-info';
    const imdbLogo = document.createElement('img');
    imdbLogo.src = 'src/logo/imdb_logo.png';
    imdbLogo.alt = 'imdb';
    const infoText = document.createElement('p');
    infoText.textContent = `${film.rating}/10 • ${film.release_year} | ${film.genre}`;
    contentInfo.appendChild(imdbLogo);
    contentInfo.appendChild(infoText);

    // Description
    const description = document.createElement('p');
    if (film.description.length > 150) {
        const shortDesc = film.description.substring(0, 150) + '...';
        description.textContent = shortDesc;

        const toggleText = document.createElement('a');
        toggleText.href = 'javascript:void(0);';
        toggleText.id = 'toggle-text';
        toggleText.textContent = 'Selengkapnya';
        toggleText.addEventListener('click', () => {
            if (description.textContent === shortDesc + 'Selengkapnya') {
                description.textContent = film.description + ' ';
                toggleText.textContent = 'Sembunyikan';
            } else {
                description.textContent = shortDesc;
                toggleText.textContent = 'Selengkapnya';
            }
            description.appendChild(toggleText);
        });

        description.appendChild(toggleText);
    } else {
        description.textContent = film.description;
    }

    // Save button
    const saveButton = document.createElement('img');
    saveButton.className = 'slideSaveButton';
    saveButton.src = 'src/icon/btnSave.png';
    saveButton.alt= 'Simpan'
    saveButton.dataset.filmId = film.movie_id;
    saveButton.addEventListener('click', toggleSaveSlideFilm);

    // Navigation buttons
    const grupButton = document.createElement('div');
    grupButton.className = 'grup-button';
    const prevButton = document.createElement('div');
    prevButton.className = 'button-prev';
    prevButton.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
    const nextButton = document.createElement('div');
    nextButton.className = 'button-next';
    nextButton.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
    grupButton.appendChild(prevButton);
    grupButton.appendChild(nextButton);

    // Append all elements
    heroContent.appendChild(title);
    heroContent.appendChild(contentInfo);
    heroContent.appendChild(description);
    heroContent.appendChild(saveButton);
    heroContent.appendChild(grupButton);
    section.appendChild(heroContent);
    main.appendChild(section);
    slide.appendChild(main);

    checkSaveSlideStatus(film.movie_id, saveButton);
    return slide;
}

function initializeSwiper() {
    new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            loop:true,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".button-next",
                prevEl: ".button-prev",
            },
        });
}


// recommendation content
function fetchAndCreateRecommendation() {
    fetch('slideFilm.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify({
            type: 'recommendation'
        }),
    })
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // console.log('Data received:', data);
        if (Array.isArray(data)) {
            // console.log("Recommendation data:", data);
            allRecommendations = data;
            displayRecommendation();
        } else {
            console.error('Data is not an array:', data);
        }
    })
    .catch(error => console.error('Error fetching recommendations:', error));
}

function displayRecommendation() {
    const container = document.getElementById('recommendationContainer');
    if (!container) {
        console.error('Recommendation container not found');
        return;
    }
    container.innerHTML = '';
    
    allRecommendations.forEach((item, index) => {
        const recommendationElement = createRecommendationElement(item);
        container.appendChild(recommendationElement);

        // Ensuring smooth animation with timeout
        setTimeout(() => {
            recommendationElement.classList.add('show');
        }, index * 10); // Delay increases for each element (10ms)
    });
}

function createRecommendationElement(item) {
    // Creating film-col element (same class as films for consistent styling)
    const recommendationCol = document.createElement('div');
    recommendationCol.className = 'film-col';

    // Creating film-col-poster element
    const recommendationColPoster = document.createElement('div');
    recommendationColPoster.className = 'film-col-poster';

    // Creating save icon
    const saveImg = document.createElement('img');
    saveImg.className = 'film-col-poster-save';
    saveImg.src = 'src/icon/save.png?t=' + new Date().getTime();
    saveImg.alt = 'Save Icon';
    saveImg.dataset.filmId = item.movie_id;
    saveImg.addEventListener('click', toggleSaveFilm);

    // Creating poster image
    const posterImg = document.createElement('img');
    posterImg.className = 'film-col-poster-img';
    posterImg.src = 'src/poster/home-poster'+item.movie_id+'.jpg'; 
    posterImg.alt = 'Recommendation Poster';

    // Adding images to film-col-poster
    recommendationColPoster.appendChild(saveImg);
    recommendationColPoster.appendChild(posterImg);

    // Creating film-col-desc element
    const recommendationColDesc = document.createElement('div');
    recommendationColDesc.className = 'film-col-desc';

    // Creating title element
    const titleElement = document.createElement('h5');
    titleElement.className = 'film-col-title';
    titleElement.textContent = item.title;

    // Creating release year element
    const releaseElement = document.createElement('p');
    releaseElement.className = 'film-col-release';
    releaseElement.textContent = `Release Year: ${item.release_year}`;

    // Creating rating element
    const ratingElement = document.createElement('div');
    ratingElement.className = 'film-col-rating';

    const ratingImg = document.createElement('img');
    ratingImg.className = 'film-col-rating-img';
    ratingImg.src = 'src/logo/imdb_logo.png';
    ratingImg.alt = 'Rating Icon';

    const ratingNumber = document.createElement('p');
    ratingNumber.className = 'film-col-rating-number';
    ratingNumber.textContent = item.rating;

    ratingElement.appendChild(ratingImg);
    ratingElement.appendChild(ratingNumber);

    // Creating genre element
    const genreElement = document.createElement('p');
    genreElement.className = 'film-col-genre';
    genreElement.textContent = `Genre: ${item.genre}`;

    // Adding elements to film-col-desc
    recommendationColDesc.appendChild(releaseElement);
    recommendationColDesc.appendChild(titleElement);
    recommendationColDesc.appendChild(ratingElement);
    recommendationColDesc.appendChild(genreElement);

    // Adding film-col-poster and film-col-desc to film-col
    recommendationCol.appendChild(recommendationColPoster);
    recommendationCol.appendChild(recommendationColDesc);

    checkSaveStatus(item.movie_id, saveImg);
    return recommendationCol;
}