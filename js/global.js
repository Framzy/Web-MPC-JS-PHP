
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

let allFilms = [];
let allSaveFilms = [];
let currentIndex = 0;
let filmsPerPage = 12;

// popup
const loginPopup = document.getElementById('loginPopup');
const logoutPopup = document.getElementById('logoutPopup');
const cancelLogout = document.getElementById('cancelLogout');
const popupLoginButton = document.getElementById('popupLoginButton');
const popupLogoutButton = document.getElementById('popupLogoutButton');
const popupChangeButton = document.getElementById('popupChangeButton');
const profileButton = document.getElementById('profileButton');

function updatePopupLoggedIn(data) {
    document.getElementById('popupLoginButton').style.display = 'none';
    document.getElementById('popupLogoutButton').style.display = 'block';

    const dataUsernameAkun = data.username;
    const usernameAkun = dataUsernameAkun.length > 6 ? dataUsernameAkun.substring(0,6) + '..' : dataUsernameAkun;
    document.getElementById("idUsernameAkun").innerHTML = usernameAkun;
}

function updatePopupLogout() {
    document.getElementById('profileButton').style.display = 'none';
    document.getElementById('popupLoginButton').style.display = 'block';
    logoutPopup.classList.remove('show');
}


loginPopup.querySelector('.popupLogin-close').addEventListener("click", function() {
    loginPopup.classList.remove('show');
});
loginPopup.querySelector('.popupRegist-close').addEventListener("click", function() {
    loginPopup.classList.remove('show');
});
loginPopup.querySelector('.popupChange-close').addEventListener("click", function() {
    loginPopup.classList.remove('show');
});

popupLoginButton.addEventListener("click", debounce(function() {
    loginPopup.classList.add('show');
}, 200));

popupLogoutButton.addEventListener("click", debounce(function() {
    logoutPopup.classList.add('show');
}, 200));


popupChangeButton.addEventListener("click", debounce(function() {
    document.getElementById('loginPopupContent').style.display = 'none';
    document.getElementById('registPopupContent').style.display = 'none';
    document.getElementById('changePopupContent').style.display = 'flex';
    loginPopup.classList.add('show');
    infoErrorChangeOldPassword.style.display = "none";
    infoErrorChangePassword.style.display = "none";
}, 200));

cancelLogout.addEventListener("click", debounce(function() {
    logoutPopup.classList.remove('show');
}, 200));

// popup login/register
const registFormButton = document.getElementById('registFormButton');
const loginFormButton = document.getElementById('loginFormButton');
const updateFormButton = document.getElementById('updateFormButton');

registFormButton.addEventListener("click", debounce(function() {
    document.getElementById('loginPopupContent').style.display = 'none';
    document.getElementById('registPopupContent').style.display = 'flex';
    errorLoginInfo.style.display ="none";
}, 200));

loginFormButton.addEventListener("click", debounce(function() {
    document.getElementById('registPopupContent').style.display = 'none';
    document.getElementById('loginPopupContent').style.display = 'flex';
    infoErrorNewUsername.style.display = "none";
    infoErrorNewPassword.style.display = "none";
}, 200));





// move page
const homePageButton = document.getElementById('homePageButton');
const searchPageButton = document.getElementById('searchPageButton');
const savePageButton = document.getElementById('savePageButton');
const homeContainer = document.getElementById('homeContainer');
const searchContainer = document.getElementById('searchContainer');
const saveContainer = document.getElementById('saveContainer');

function showContainer(containerToShow, containerToHide1, containerToHide2) {
    containerToHide1.classList.remove('active');
    containerToHide2.classList.remove('active');
    setTimeout(() => {
        containerToHide1.style.display = 'none';
        containerToHide2.style.display = 'none';
        containerToShow.style.display = 'block';
        setTimeout(() => {
        containerToShow.classList.add('active');
        }, 50);
    }, 200);
}

function findMovieButton(){
    showContainer(searchContainer, homeContainer, saveContainer);
}

homePageButton.addEventListener("click", debounce(function(){
    showContainer(homeContainer, searchContainer, saveContainer);
}, 200));

searchPageButton.addEventListener("click", debounce(function(){
    findMovieButton()
}, 200));


function checkSavePage(data){
    savePageButton.addEventListener("click", debounce(function(){
    data.isLoggedIn ? showContainer(saveContainer, homeContainer, searchContainer) & fetchDataListSaveFilm() : loginPopup.classList.add('show');
    }, 200));
}

// updateUI

function updateUIAfterLoggedIn(){
    fetch('')
}


// toggle save
function toggleSaveFilm(event) {
    const filmId = event.target.dataset.filmId;
    if (!filmId) {
        console.error('Film ID tidak ditemukan');
        return;
    }

    fetch('toggleSaveFilm.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({filmId}),
        })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Toggle save response:', data);
        if (data.success) {
        const newSrc = data.action === 'save'
                ? 'src/icon/saved.png?t=' + new Date().getTime()
                : 'src/icon/save.png?t=' + new Date().getTime();
            console.log('Mengubah gambar ke:', newSrc);
            event.target.src = newSrc;
        } else {
            // alert('harap login terlebih dahulu');
            loginPopup.classList.add('show')
            console.error('Gagal mengubah status simpan:', data.error);
        }
    })
    .catch(error => console.error('Error toggling save status:', error));
}

function toggleSaveSlideFilm(event) {
    const filmId = event.target.dataset.filmId;
    if (!filmId) {
        console.error('Film ID tidak ditemukan');
        return;
    }

    fetch('toggleSaveFilm.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({filmId}),
        })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Toggle save response:', data);
        if (data.success) {
        const newSrc = data.action === 'save'
                ? 'src/icon/btnSaved.png?t=' + new Date().getTime()
                : 'src/icon/btnSave.png?t=' + new Date().getTime();
            console.log('Mengubah gambar ke:', newSrc);
            event.target.src = newSrc;
        } else {
            // alert('harap login terlebih dahulu');
            loginPopup.classList.add('show');
            console.error('Gagal mengubah status simpan:', data.error);
        }
    })
    .catch(error => console.error('Error toggling save status:', error));
}

function checkSaveStatus(filmId, img) {
    fetch('checkSaveStatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({film_id: filmId}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })    
    .then(data => {
            if (data.isSaved) {
                img.src = 'src/icon/saved.png';
            } else {
                img.src = 'src/icon/save.png';
            }
    })
    .catch(error => {
        console.error('Error checking save status:', error);
        // Opsional: Atur gambar ke status default jika terjadi kesalahan
        img.src = 'src/icon/save.png';
    });
}

function checkSaveSlideStatus(filmId, img) {
    fetch('checkSaveStatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({film_id: filmId}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })    
    .then(data => {
            if (data.isSaved) {
                img.src = 'src/icon/btnSaved.png';
            } else {
                img.src = 'src/icon/btnSave.png';
            }
    })
    .catch(error => {
        console.error('Error checking save status:', error);
        // Opsional: Atur gambar ke status default jika terjadi kesalahan
        img.src = 'src/icon/btnSave.png';
    });
}

function updateSaveStatusForAllFilms() {
    const saveImages = document.querySelectorAll('.film-col-poster-save');
    console.log('Jumlah elemen gambar yang ditemukan:', saveImages.length);
    saveImages.forEach(img => {
        const filmId = img.dataset.filmId;
        if (filmId) {
            checkSaveStatus(filmId, img);
        } else {
            console.error('Image tanpa film ID:', img);
        }
    });
}



